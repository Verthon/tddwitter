# TDDwitter

## Install

```bash
pnpm install
```

## Secrets

Docker reads every secret from a file in `secrets/` (git-ignored). Create all three before running compose. Each file holds one value on one line.

| File | Contents | Used by |
| --- | --- | --- |
| `secrets/postgres_user.txt` | Postgres username | db (`POSTGRES_USER_FILE`), api (`DB_USER_FILE`) |
| `secrets/postgres_password.txt` | Postgres password | db (`POSTGRES_PASSWORD_FILE`), api (`DB_PASSWORD_FILE`) |
| `secrets/jwt_secret.txt` | Random string, at least 32 characters, used to sign JWTs | api (`JWT_SECRET_FILE`) |

```bash
mkdir -p secrets
printf '%s' 'your_db_user' > secrets/postgres_user.txt
printf '%s' 'your_db_password' > secrets/postgres_password.txt
openssl rand -base64 48 | tr -d '\n' > secrets/jwt_secret.txt
```

## Run with Docker

```bash
docker compose up --build
```

- App: http://localhost:8080. nginx serves the web build and proxies `/api` to the api, so web and api share one origin.
- Health: http://localhost:8080/api/health
- Postgres: `localhost:5433`, database `tddwitter_db`.

The api container runs migrations and seeds on start. To reset the database: `docker compose down -v`.

## Run locally

The usual loop is the db in Docker, the api and web on the host:

```bash
docker compose up -d db
pnpm dev
```

The api reads these environment variables (for example from `api/.env`):

| Variable | Value for the host loop |
| --- | --- |
| `PORT` | `4000` |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5433` |
| `DB_NAME` | `tddwitter_db` |
| `DB_USER_FILE` | path to `secrets/postgres_user.txt` |
| `DB_PASSWORD_FILE` | path to `secrets/postgres_password.txt` |
| `JWT_SECRET_FILE` | path to `secrets/jwt_secret.txt` |

The web dev server (http://localhost:3000) proxies `/api` to `http://localhost:4000` (override with `API_PROXY_TARGET`). `pnpm --filter web dev:mock` runs web against MSW instead.

## Check

```bash
pnpm check
```
