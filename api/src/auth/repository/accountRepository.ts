import type { Sql } from "postgres";

import { failure, success } from "@/common/result/Result.js";
import { isUniqueViolation } from "@/infra/errors.js";


export type Account = {
  readonly id: number;
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
};

export type NewAccount = {
  readonly email: string;
  readonly passwordHash: string;
};

type AccountRow = {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
};

const toAccount = (row: AccountRow): Account => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password_hash,
  createdAt: row.created_at,
});

export const createSQLAccountRepository = (sql: Sql) => ({
  async save(account: NewAccount) {
    try {
      const [row] = await sql<AccountRow[]>`
        INSERT INTO accounts (email, password_hash)
        VALUES (${account.email}, ${account.passwordHash})
        RETURNING id, email, password_hash, created_at
      `;

      //@ts-expect-error guaranteed by the library
      return success(toAccount(row));
    } catch (error) {
      if (isUniqueViolation(error)) {
        return failure({ type: "DUPLICATE_EMAIL" as const });
      }
      return failure({
        type: "DATABASE_ERROR" as const,
        details: error instanceof Error ? error.message : String(error),
      });
    }
  },
});

export type AccountRepository = ReturnType<typeof createSQLAccountRepository>;
