# TDDwitter

## Install

```bash
pnpm install
```

## Database Setup

Create secrets directory and files:

```bash
mkdir -p secrets
echo "your_db_user" > secrets/postgres_user.txt
echo "your_db_password" > secrets/postgres_password.txt
```

## Run

**Local:**
```bash
pnpm dev
```

**Docker:**
```bash
docker compose up
```
