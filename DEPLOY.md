# BriteStack deploy notes

Push to `main` → Cloud Build trigger `Brite-stack-deploy` (ai-tools-484419, us-central1) → Cloud Run `brite-stack`.
Live URL: https://brite-stack-k55slnsccq-uc.a.run.app

## One-time setup for the Admin tab / Postgres (Oct 2026)

The app stores users + tool access in Postgres on the shared Cloud SQL instance
`britecreations:us-central1:brite-shadow-db` and syncs people from BigQuery
`britecreations.Security_Collection.user_master`. Cloud Run lives in **ai-tools-484419**,
so its service account needs two cross-project grants in **britecreations**.

Status 2026-10-14: steps 1, 3 and 4 are DONE (user+db `britestack` exist, dataset READER granted,
trigger has `_DATABASE_URL` + `_CLOUDSQL_INSTANCE`). Step 2 must be run by hand. The DB password
lives only in the trigger substitution; rotate with `gcloud sql users set-password` + trigger export/import.

Run once (needs `gcloud auth login` first):

```bash
SA=279545860595-compute@developer.gserviceaccount.com
PW=$(python -c "import secrets; print(secrets.token_urlsafe(24))")

# 1. Database + user on the shared instance
gcloud sql users create britestack --instance=brite-shadow-db --project=britecreations --password="$PW"
gcloud sql databases create britestack --instance=brite-shadow-db --project=britecreations

# 2. Let the brite-stack service account reach the instance
gcloud projects add-iam-policy-binding britecreations --member="serviceAccount:$SA" --role=roles/cloudsql.client

# 3. Let it read the user_master / terminated tables (dataset-level READER)
bq show --format=prettyjson britecreations:Security_Collection > /tmp/ds.json
python - <<EOF
import json; d=json.load(open('/tmp/ds.json'))
d['access'].append({'role':'READER','userByEmail':'$SA'})
json.dump({'access':d['access']}, open('/tmp/ds-access.json','w'))
EOF
bq update --source /tmp/ds-access.json britecreations:Security_Collection

# 4. Trigger substitutions (regional trigger: export → edit → import)
gcloud builds triggers export Brite-stack-deploy --region=us-central1 --project=ai-tools-484419 --destination=/tmp/trigger.yaml
#   add under substitutions:
#     _DATABASE_URL: postgresql+psycopg://britestack:$PW@/britestack?host=/cloudsql/britecreations:us-central1:brite-shadow-db
#     _CLOUDSQL_INSTANCE: britecreations:us-central1:brite-shadow-db
gcloud builds triggers import --region=us-central1 --project=ai-tools-484419 --source=/tmp/trigger.yaml
```

Then push. Tables are created automatically on first start. Sign in as an admin,
open the Admin tab and hit **Sync from BigQuery**.

## Local dev

```bash
docker compose up -d            # Postgres on 5439
cp .env.example .env            # DEV_LOGIN_EMAIL skips Google OAuth
python server.py                # Flask on 8080 (serves dist/ + API)
npm run dev                     # Vite on 5173, proxies /api + /auth to 8080
```

Admins are seeded in `user_sync.py` (`SEED_ADMINS`). `/#admin` deep-links to the Admin tab.
