"""
BriteStack access control: who is an admin, which tools a user sees, and the
admin API that manages both.

Effective access for (user, tool):
  explicit tool_access row  -> row.enabled
  otherwise                 -> tool_settings.visibility != 'private'   (no row == public)
"""

import logging
from functools import wraps

from flask import Blueprint, jsonify, request, session
from sqlalchemy import desc

from db import SyncRun, ToolAccess, ToolSetting, User, session_scope, utcnow
from user_sync import SEED_ADMINS
import user_sync

log = logging.getLogger(__name__)

api = Blueprint('api', __name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def current_email() -> str | None:
    user = session.get('user')
    return user['email'].lower() if user and user.get('email') else None


def ensure_user_on_login(email: str, name: str, picture: str) -> None:
    """Make sure whoever just signed in has a users row. Never downgrades anything."""
    email = email.lower()
    with session_scope() as s:
        u = s.get(User, email)
        if u is None:
            s.add(User(
                email=email, name=name or None, picture=picture or None,
                status='active', role='admin' if email in SEED_ADMINS else 'user', source='login',
            ))
            return
        changed = False
        if name and u.name != name and u.source == 'login':
            u.name, changed = name, True
        if picture and u.picture != picture:
            u.picture, changed = picture, True   # Google photo beats the BQ thumbnail
        if email in SEED_ADMINS and u.role != 'admin':
            u.role, changed = 'admin', True
        if changed:
            u.updated_at = utcnow()


def role_for(email: str) -> str:
    if email in SEED_ADMINS:
        return 'admin'
    with session_scope() as s:
        u = s.get(User, email)
        return u.role if u else 'user'


def hidden_tools_for(email: str) -> list[str]:
    """Tool ids this user must NOT see."""
    with session_scope() as s:
        private = {t.tool_id for t in s.query(ToolSetting).filter(ToolSetting.visibility == 'private')}
        overrides = {a.tool_id: a.enabled for a in s.query(ToolAccess).filter(ToolAccess.user_email == email)}
    hidden = {t for t in private if overrides.get(t) is not True}
    hidden |= {t for t, on in overrides.items() if on is False}
    return sorted(hidden)


def require_login(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not current_email():
            return jsonify({'error': 'Not signed in'}), 401
        return fn(*args, **kwargs)
    return wrapper


def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        email = current_email()
        if not email:
            return jsonify({'error': 'Not signed in'}), 401
        if role_for(email) != 'admin':
            return jsonify({'error': 'Admins only'}), 403
        return fn(*args, **kwargs)
    return wrapper


def _user_dict(u: User, overrides: dict[str, bool]) -> dict:
    return {
        'email': u.email,
        'name': u.name or '',
        'title': u.title or '',
        'department': u.department or '',
        'picture': u.picture or '',
        'status': u.status,
        'role': u.role,
        'seeded_admin': u.email in SEED_ADMINS,
        'overrides': overrides,  # {tool_id: bool} explicit only
    }


# ---------------------------------------------------------------------------
# Current user
# ---------------------------------------------------------------------------

@api.get('/api/me')
def me():
    user = session.get('user')
    if not user:
        return jsonify({'authenticated': False}), 401
    email = user['email'].lower()
    return jsonify({
        'authenticated': True,
        'user': {**user, 'email': email, 'role': role_for(email)},
        'hidden_tools': hidden_tools_for(email),
    })


# ---------------------------------------------------------------------------
# Admin: users + access matrix
# ---------------------------------------------------------------------------

@api.get('/api/admin/users')
@require_admin
def admin_users():
    include_inactive = request.args.get('include_inactive') in ('1', 'true')
    with session_scope() as s:
        q = s.query(User)
        if not include_inactive:
            q = q.filter(User.status == 'active')
        users = q.order_by(User.name.nulls_last(), User.email).all()
        emails = [u.email for u in users]
        ov: dict[str, dict[str, bool]] = {}
        if emails:
            for a in s.query(ToolAccess).filter(ToolAccess.user_email.in_(emails)):
                ov.setdefault(a.user_email, {})[a.tool_id] = a.enabled
        tool_settings = {t.tool_id: t.visibility for t in s.query(ToolSetting)}
        last = s.query(SyncRun).order_by(desc(SyncRun.ran_at)).first()
        inactive_count = s.query(User).filter(User.status == 'inactive').count()

    return jsonify({
        'users': [_user_dict(u, ov.get(u.email, {})) for u in users],
        'tool_settings': tool_settings,   # {tool_id: 'public'|'private'}; missing == public
        'inactive_count': inactive_count,
        'last_sync': None if last is None else {
            'ran_at': last.ran_at.isoformat(),
            'ran_by': last.ran_by,
            'status': last.status,
            'created': last.created,
            'updated': last.updated,
            'deactivated': last.deactivated,
            'error': last.error,
        },
    })


@api.put('/api/admin/users/<email>/access/<tool_id>')
@require_admin
def admin_set_access(email: str, tool_id: str):
    """Body {"enabled": true|false|null}. null clears the override (back to tool default)."""
    body = request.get_json(silent=True) or {}
    enabled = body.get('enabled', None)
    if enabled is not None and not isinstance(enabled, bool):
        return jsonify({'error': 'enabled must be true, false or null'}), 400
    email = email.lower()
    with session_scope() as s:
        if s.get(User, email) is None:
            return jsonify({'error': 'Unknown user'}), 404
        row = s.get(ToolAccess, (email, tool_id))
        if enabled is None:
            if row is not None:
                s.delete(row)
        elif row is None:
            s.add(ToolAccess(user_email=email, tool_id=tool_id, enabled=enabled, updated_by=current_email()))
        else:
            row.enabled = enabled
            row.updated_by = current_email()
            row.updated_at = utcnow()
    return jsonify({'ok': True, 'email': email, 'tool_id': tool_id, 'enabled': enabled})


@api.put('/api/admin/users/<email>/role')
@require_admin
def admin_set_role(email: str):
    body = request.get_json(silent=True) or {}
    role = body.get('role')
    if role not in ('user', 'admin'):
        return jsonify({'error': 'role must be user or admin'}), 400
    email = email.lower()
    if email in SEED_ADMINS and role != 'admin':
        return jsonify({'error': 'Seeded admins cannot be demoted'}), 400
    if email == current_email() and role != 'admin':
        return jsonify({'error': 'You cannot remove your own admin access'}), 400
    with session_scope() as s:
        u = s.get(User, email)
        if u is None:
            return jsonify({'error': 'Unknown user'}), 404
        u.role = role
        u.updated_at = utcnow()
    return jsonify({'ok': True, 'email': email, 'role': role})


@api.put('/api/admin/tools/<tool_id>/visibility')
@require_admin
def admin_set_visibility(tool_id: str):
    body = request.get_json(silent=True) or {}
    visibility = body.get('visibility')
    if visibility not in ('public', 'private'):
        return jsonify({'error': 'visibility must be public or private'}), 400
    with session_scope() as s:
        t = s.get(ToolSetting, tool_id)
        if t is None:
            s.add(ToolSetting(tool_id=tool_id, visibility=visibility, updated_by=current_email()))
        else:
            t.visibility = visibility
            t.updated_by = current_email()
            t.updated_at = utcnow()
    return jsonify({'ok': True, 'tool_id': tool_id, 'visibility': visibility})


@api.post('/api/admin/sync')
@require_admin
def admin_sync():
    try:
        result = user_sync.run(ran_by=current_email())
    except Exception as e:
        log.exception('User sync failed')
        return jsonify({'ok': False, 'error': str(e)}), 500
    return jsonify({'ok': True, **result})
