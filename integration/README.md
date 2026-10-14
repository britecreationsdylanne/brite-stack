# Making an app honor BriteStack access

By default the Admin tab only hides tiles. To make an app actually refuse people
BriteStack says no to, the app asks BriteStack once at login. Takes about 20 lines.

## 1. Copy the helper

Copy `britestack_access.py` into the app's backend. It needs `requests` only.

## 2. Give the app the key

Add two Cloud Build substitutions to the app's trigger and pass them as env vars:

| Env var | Value |
|---|---|
| `BRITESTACK_ACCESS_KEY` | the `_ACCESS_CHECK_KEY` substitution on the **Brite-stack-deploy** trigger (ai-tools-484419) |
| `BRITESTACK_URL` | optional, defaults to the live BriteStack URL |

## 3. Call it after Google login

Use the tool's id from `brite-stack/src/data/tools.ts`.

**Flask** (most of our tools):

```python
from britestack_access import check_access

@app.route('/auth/callback')
def auth_callback():
    ...existing OAuth code that produces `email`...
    if not check_access(email, 'ad-generator'):
        return render_template('no_access.html', email=email), 403
    session['user'] = {...}
    return redirect('/')
```

**FastAPI**:

```python
from britestack_access import check_access

@router.get('/auth/callback')
async def auth_callback(...):
    ...existing OAuth code that produces `email`...
    if not check_access(email, 'brite-shadow'):
        raise HTTPException(status_code=403, detail='Ask a BriteStack admin for access to this tool.')
```

## 4. Flip the tool to Private in BriteStack

In the Admin tab set the tool's pill to **Private**, then switch on the people who
should have it. New hires stay off until an admin switches them on.

## Behaviour

- Checked once at login, so a revoke takes effect next time the person signs in.
  Add the same call to a per-request guard if you need instant lockout.
- **Fail-open**: if BriteStack is down or the key is missing, the app lets people
  in and logs a warning. Pass `fail_open=False` to lock out instead.
- Denied reasons returned by BriteStack: `britestack_access_off`, `tool_off`,
  `not_brite_email`.

## Endpoint reference

```
GET {BRITESTACK_URL}/api/access/check?email=someone@brite.co&tool=ad-generator
X-BriteStack-Key: <key>

200 {"allowed": true,  "reason": "ok", ...}
200 {"allowed": false, "reason": "tool_off", ...}
401 bad key · 400 missing params · 503 BriteStack has no key configured
```

Static sites on Firebase hosting (BriteAcademy, Optic Outreach) have no server to
run this in, so for those the tile hiding is all BriteStack can do.
