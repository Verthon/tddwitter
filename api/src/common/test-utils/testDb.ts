import postgres, { type Sql } from "postgres";

export const TEST_DB = {
  host: "localhost",
  port: 5434,
  database: "tddwitter_test",
  username: "tddwitter_test",
  password: "tddwitter_test",
} as const;

export const createTestSql = (): Sql =>
  postgres({ ...TEST_DB, max: 4, onnotice: () => {} });

export const truncateAllTables = async (sql: Sql): Promise<void> => {
  await sql`TRUNCATE accounts, refresh_tokens, posts RESTART IDENTITY CASCADE`;
};
