"""
Drop-in BriteStack access check for other BriteCo apps.

Copy this file into the app, set two env vars, call check_access() right after
the app's Google login succeeds. No other dependency than `requests`.

    BRITESTACK_URL         https://brite-stack-k55slnsccq-uc.a.run.app   (default)
    BRITESTACK_ACCESS_KEY  the _ACCESS_CHECK_KEY value from the brite-stack Cloud Build trigger

Rules (decided in BriteStack's Admin tab, never here):
  - person switched off in the BriteStack column  -> denied
  - tool set Private and person not switched on   -> denied
  - tool Public and person switched off for it    -> denied
  - otherwise                                     -> allowed

Fail-open by default: if BriteStack is unreachable or misconfigured the app
lets the person in and logs a warning, so a BriteStack blip never takes a tool
down. Pass fail_open=False to lock out instead.
"""

import logging
import os

import requests

log = logging.getLogger('britestack_access')

BRITESTACK_URL = os.environ.get('BRITESTACK_URL', 'https://brite-stack-k55slnsccq-uc.a.run.app').rstrip('/')
BRITESTACK_ACCESS_KEY = os.environ.get('BRITESTACK_ACCESS_KEY', '')


def check_access(email: str, tool_id: str, *, fail_open: bool = True, timeout: float = 3.0) -> bool:
    """True if BriteStack says this person may use this tool.

    tool_id is the app's id in brite-stack/src/data/tools.ts (e.g. 'ad-generator').
    """
    if not BRITESTACK_ACCESS_KEY:
        log.warning('BRITESTACK_ACCESS_KEY not set; access check skipped (fail_open=%s)', fail_open)
        return fail_open
    try:
        r = requests.get(
            f'{BRITESTACK_URL}/api/access/check',
            params={'email': email, 'tool': tool_id},
            headers={'X-BriteStack-Key': BRITESTACK_ACCESS_KEY},
            timeout=timeout,
        )
        if r.status_code != 200:
            log.warning('BriteStack access check returned %s: %s', r.status_code, r.text[:200])
            return fail_open
        data = r.json()
        allowed = bool(data.get('allowed'))
        if not allowed:
            log.info('BriteStack denied %s for %s (%s)', email, tool_id, data.get('reason'))
        return allowed
    except Exception as e:  # network, DNS, JSON...
        log.warning('BriteStack access check failed: %s', e)
        return fail_open
