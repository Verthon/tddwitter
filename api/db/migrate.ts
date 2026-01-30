import migrate from "node-pg-migrate";

import { getEnv } from "../src/infra/env.js";

const env = getEnv();

await migrate({
  databaseUrl: `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:5432/${env.DB_NAME}`,
  direction: "up",
  dir: "db/migrations",
  migrationsTable: "pgmigrations",
  singleTransaction: true,
});
