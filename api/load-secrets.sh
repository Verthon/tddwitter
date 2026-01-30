#!/bin/sh
export DB_USER=$(cat /run/secrets/postgres_user | tr -d '\n\r ')
export DB_PASSWORD=$(cat /run/secrets/postgres_password | tr -d '\n\r ')
export DATABASE_URL="postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME"