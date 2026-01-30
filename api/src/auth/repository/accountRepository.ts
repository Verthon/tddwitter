import type { Sql } from "postgres";

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

export type AccountRepository = {
  findByEmail(email: string): Promise<Account | null>;
  save(account: NewAccount): Promise<Account>;
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
  async findByEmail(email: string) {
    const rows = await sql<AccountRow[]>`
      SELECT id, email, password_hash, created_at
      FROM accounts
      WHERE email = ${email}
    `;
    return rows.length > 0 ? toAccount(rows[0]) : null;
  },

  async save(account: NewAccount) {
    const rows = await sql<AccountRow[]>`
      INSERT INTO accounts (email, password_hash)
      VALUES (${account.email}, ${account.passwordHash})
      RETURNING id, email, password_hash, created_at
    `;
    return toAccount(rows[0]);
  },
});
