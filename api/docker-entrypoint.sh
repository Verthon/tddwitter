#!/bin/sh
set -eu

PGUSER=$(tr -d '\n\r' < "$DB_USER_FILE")
PGPASSWORD=$(tr -d '\n\r' < "$DB_PASSWORD_FILE")
PGHOST=$DB_HOST
PGPORT=${DB_PORT:-5432}
PGDATABASE=$DB_NAME
export PGUSER PGPASSWORD PGHOST PGPORT PGDATABASE

node-pg-migrate up --migrations-dir db/migrations
tsx db/seed.ts

unset PGUSER PGPASSWORD
exec "$@"
