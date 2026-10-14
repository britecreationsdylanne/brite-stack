"""
Sync users from BigQuery user_master into BriteStack (Postgres).

Same source and filters as rewards/backend/app/services/user_sync.py:
  britecreations.Security_Collection.user_master  (+ terminated)

Non-destructive:
- New people are inserted (status active, role user unless seeded admin).
- Existing people are updated only where BigQuery has a non-null value.
- Role, overrides and login picture are never touched by sync.
- Terminated / ineligible / dropped-from-user_master -> status inactive.
- Nothing is ever deleted.
"""

import logging
import os

from db import SyncRun, User, session_scope, utcnow

log = logging.getLogger(__name__)

BQ_SOURCE_PROJECT = 'britecreations'
BQ_DATASET = 'Security_Collection'
BQ_USER_TABLE = 'user_master'
BQ_TERMINATED_TABLE = 'terminated'

# Jobs run in the project BriteStack is deployed to (ai-tools-484419); only
# dataViewer on the Security_Collection dataset is needed in britecreations.
BQ_JOB_PROJECT = os.environ.get('BQ_JOB_PROJECT') or os.environ.get('GOOGLE_CLOUD_PROJECT') or 'ai-tools-484419'

SEED_ADMINS = {
    'dylanne.crugnale@brite.co',
    'dustin.sitar@brite.co',
    'kevin.walters@brite.co',
    'brenno.cardoso@brite.co',
}


def _client():
    from google.cloud import bigquery
    return bigquery.Client(project=BQ_JOB_PROJECT)


def fetch_user_master() -> list[dict]:
    query = f"""
        SELECT email, name, title, department, thumbnail, eligible
        FROM `{BQ_SOURCE_PROJECT}.{BQ_DATASET}.{BQ_USER_TABLE}`
        WHERE email IS NOT NULL
          AND LOWER(email) LIKE '%@brite.co'
          AND LOWER(name) NOT LIKE '%util acct%'
          AND (title IS NULL OR LOWER(title) NOT LIKE '%util acct%')
          AND building_id IS NOT NULL AND TRIM(building_id) != ''
    """
    return [dict(row) for row in _client().query(query).result()]


def fetch_terminated_emails() -> set[str]:
    query = f"""
        SELECT DISTINCT email
        FROM `{BQ_SOURCE_PROJECT}.{BQ_DATASET}.{BQ_TERMINATED_TABLE}`
        WHERE email IS NOT NULL
    """
    return {row['email'].lower() for row in _client().query(query).result()}


def run(ran_by: str) -> dict:
    """Run a full sync. Returns counts. Always writes a sync_runs row."""
    created = updated = deactivated = 0
    try:
        bq_users = fetch_user_master()
        terminated = fetch_terminated_emails()
    except Exception as e:
        log.exception('BigQuery fetch failed')
        with session_scope() as s:
            s.add(SyncRun(ran_by=ran_by, status='error', error=str(e)[:2000]))
        raise

    seen: set[str] = set()
    with session_scope() as s:
        existing = {u.email: u for u in s.query(User).all()}

        for row in bq_users:
            email = (row.get('email') or '').strip().lower()
            if not email:
                continue
            seen.add(email)
            is_gone = email in terminated or row.get('eligible') is False
            status = 'inactive' if is_gone else 'active'

            u = existing.get(email)
            if u is None:
                u = User(
                    email=email,
                    name=row.get('name'),
                    title=row.get('title'),
                    department=row.get('department'),
                    picture=row.get('thumbnail'),
                    status=status,
                    role='admin' if email in SEED_ADMINS else 'user',
                    source='bq',
                )
                s.add(u)
                existing[email] = u
                created += 1
                continue

            changed = False
            for field in ('name', 'title', 'department'):
                val = row.get(field)
                if val and getattr(u, field) != val:
                    setattr(u, field, val)
                    changed = True
            if not u.picture and row.get('thumbnail'):
                u.picture = row['thumbnail']
                changed = True
            if u.status != status:
                u.status = status
                changed = True
                if status == 'inactive':
                    deactivated += 1
            if u.source != 'bq':
                u.source = 'bq'
                changed = True
            if changed:
                u.updated_at = utcnow()
                updated += 1

        # People who vanished from user_master entirely
        for email, u in existing.items():
            if email not in seen and u.source == 'bq' and u.status == 'active':
                u.status = 'inactive'
                u.updated_at = utcnow()
                deactivated += 1

        # Seeded admins are always admins
        for email in SEED_ADMINS:
            u = existing.get(email)
            if u is not None and u.role != 'admin':
                u.role = 'admin'

        s.add(SyncRun(ran_by=ran_by, status='ok', created=created, updated=updated, deactivated=deactivated))

    log.info('User sync by %s: %d created, %d updated, %d deactivated', ran_by, created, updated, deactivated)
    return {'created': created, 'updated': updated, 'deactivated': deactivated, 'total': len(bq_users)}
