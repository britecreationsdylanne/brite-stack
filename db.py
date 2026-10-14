"""
Database layer for BriteStack (Postgres via SQLAlchemy).

Local:  DATABASE_URL=postgresql+psycopg://britestack:britestack_local@localhost:5439/britestack
Prod:   DATABASE_URL=postgresql+psycopg://britestack:PASS@/britestack?host=/cloudsql/britecreations:us-central1:brite-shadow-db
"""

import os
from contextlib import contextmanager
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey, Integer, String, Text, create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.environ.get('DATABASE_URL')

Base = declarative_base()


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = 'users'

    email = Column(String(255), primary_key=True)  # always lower-case
    name = Column(String(255))
    title = Column(String(255))
    department = Column(String(255))
    picture = Column(Text)
    status = Column(String(16), nullable=False, default='active')   # active | inactive (from BigQuery)
    role = Column(String(16), nullable=False, default='user')       # user | admin
    access_enabled = Column(Boolean, nullable=False, default=True)  # admin master switch: False = cannot use BriteStack
    source = Column(String(16), nullable=False, default='login')    # bq | login
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)


class ToolSetting(Base):
    """Per-tool default. No row == public."""
    __tablename__ = 'tool_settings'

    tool_id = Column(String(64), primary_key=True)
    visibility = Column(String(16), nullable=False, default='public')  # public | private
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)
    updated_by = Column(String(255))


class ToolAccess(Base):
    """Explicit per-user override. No row == follow the tool default."""
    __tablename__ = 'tool_access'

    user_email = Column(String(255), ForeignKey('users.email', ondelete='CASCADE'), primary_key=True)
    tool_id = Column(String(64), primary_key=True)
    enabled = Column(Boolean, nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)
    updated_by = Column(String(255))


class SyncRun(Base):
    __tablename__ = 'sync_runs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ran_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    ran_by = Column(String(255))
    status = Column(String(16), nullable=False, default='ok')  # ok | error
    created = Column(Integer, nullable=False, default=0)
    updated = Column(Integer, nullable=False, default=0)
    deactivated = Column(Integer, nullable=False, default=0)
    error = Column(Text)


_engine = None
_Session = None


def init_db():
    """Create the engine and make sure tables exist. Safe to call repeatedly."""
    global _engine, _Session
    if not DATABASE_URL:
        raise RuntimeError('DATABASE_URL is not set')
    if _engine is None:
        _engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=3, max_overflow=2)
        _Session = sessionmaker(bind=_engine, expire_on_commit=False)
    Base.metadata.create_all(_engine)
    _ensure_columns(_engine)
    return _engine


# Columns added after the first deploy. create_all never alters existing
# tables, so each one gets an idempotent ADD COLUMN IF NOT EXISTS here.
_ADDED_COLUMNS = [
    ('users', 'access_enabled', 'BOOLEAN NOT NULL DEFAULT TRUE'),
]


def _ensure_columns(engine):
    from sqlalchemy import text
    with engine.begin() as conn:
        for table, col, ddl in _ADDED_COLUMNS:
            conn.execute(text(f'ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {col} {ddl}'))


def db_ready() -> bool:
    return bool(DATABASE_URL) and _Session is not None


@contextmanager
def session_scope():
    """Commit on success, roll back on error."""
    if _Session is None:
        init_db()
    s = _Session()
    try:
        yield s
        s.commit()
    except Exception:
        s.rollback()
        raise
    finally:
        s.close()
