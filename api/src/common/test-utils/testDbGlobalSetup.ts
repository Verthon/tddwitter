import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { createTestSql, TEST_DB } from "./testDb.js";

const API_ROOT = fileURLToPath(new URL("../../../", import.meta.url));

export const setup = async (): Promise<void> => {
  const sql = createTestSql();
  try {
    await sql`DROP SCHEMA public CASCADE`;
    await sql`CREATE SCHEMA public`;
  } finally {
    await sql.end();
  }

  execFileSync(
    "node_modules/.bin/node-pg-migrate",
    ["up", "--migrations-dir", "db/migrations"],
    {
      cwd: API_ROOT,
      stdio: "pipe",
      env: {
        ...process.env,
        PGHOST: TEST_DB.host,
        PGPORT: String(TEST_DB.port),
        PGDATABASE: TEST_DB.database,
        PGUSER: TEST_DB.username,
        PGPASSWORD: TEST_DB.password,
      },
    },
  );
};
