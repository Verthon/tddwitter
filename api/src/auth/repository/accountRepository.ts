import type { Sql } from "postgres";

import { failure, success, type Result } from "@/common/result/Result.js";
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

export type DuplicateEmail = { type: "DUPLICATE_EMAIL" };

export type AccountRepository = {
  save(account: NewAccount): Promise<Result<Account, DuplicateEmail>>;
  findByEmail(email: string): Promise<Account | undefined>;
  findById(id: number): Promise<Account | undefined>;
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

export const createSQLAccountRepository = (sql: Sql): AccountRepository => ({
  async save(account) {
    try {
      const [row] = await sql<AccountRow[]>`
        INSERT INTO accounts (email, password_hash)
        VALUES (${account.email}, ${account.passwordHash})
        RETURNING id, email, password_hash, created_at
      `;
      if (!row) {
        throw new Error("INSERT INTO accounts returned no row");
      }
      return success(toAccount(row));
    } catch (error) {
      if (isUniqueViolation(error)) {
        return failure({ type: "DUPLICATE_EMAIL" as const });
      }
      throw error;
    }
  },

  async findByEmail(email) {
    const [row] = await sql<AccountRow[]>`
      SELECT id, email, password_hash, created_at
      FROM accounts
      WHERE email = ${email}
    `;
    return row ? toAccount(row) : undefined;
  },

  async findById(id) {
    const [row] = await sql<AccountRow[]>`
      SELECT id, email, password_hash, created_at
      FROM accounts
      WHERE id = ${id}
    `;
    return row ? toAccount(row) : undefined;
  },
});
