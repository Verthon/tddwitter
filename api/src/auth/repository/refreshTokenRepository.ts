import type { Sql } from "postgres";

export type RefreshToken = {
  readonly accountId: number;
  readonly familyId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly rotatedAt: Date | null;
};

export type NewRefreshToken = Omit<RefreshToken, "rotatedAt">;

export type RefreshTokenRepository = {
  save(token: NewRefreshToken): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshToken | undefined>;
  markRotated(tokenHash: string, rotatedAt: Date): Promise<boolean>;
  deleteFamily(familyId: string): Promise<void>;
};

type RefreshTokenRow = {
  account_id: number;
  family_id: string;
  token_hash: string;
  expires_at: Date;
  rotated_at: Date | null;
};

const toRefreshToken = (row: RefreshTokenRow): RefreshToken => ({
  accountId: row.account_id,
  familyId: row.family_id,
  tokenHash: row.token_hash,
  expiresAt: row.expires_at,
  rotatedAt: row.rotated_at,
});

export const createSQLRefreshTokenRepository = (sql: Sql): RefreshTokenRepository => ({
  async save(token) {
    await sql`
      INSERT INTO refresh_tokens (account_id, family_id, token_hash, expires_at)
      VALUES (${token.accountId}, ${token.familyId}, ${token.tokenHash}, ${token.expiresAt})
    `;
  },

  async findByHash(tokenHash) {
    const [row] = await sql<RefreshTokenRow[]>`
      SELECT account_id, family_id, token_hash, expires_at, rotated_at
      FROM refresh_tokens
      WHERE token_hash = ${tokenHash}
    `;
    return row ? toRefreshToken(row) : undefined;
  },

  async markRotated(tokenHash, rotatedAt) {
    const rows = await sql`
      UPDATE refresh_tokens
      SET rotated_at = ${rotatedAt}
      WHERE token_hash = ${tokenHash} AND rotated_at IS NULL
      RETURNING token_hash
    `;
    return rows.length > 0;
  },

  async deleteFamily(familyId) {
    await sql`
      DELETE FROM refresh_tokens
      WHERE family_id = ${familyId}
    `;
  },
});
