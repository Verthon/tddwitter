import { createTestSql, truncateAllTables } from "@/common/test-utils/testDb.js";
import { createSQLAccountRepository } from "../accountRepository.js";
import { createSQLRefreshTokenRepository } from "../refreshTokenRepository.js";

const FAMILY_A = "00000000-0000-4000-8000-00000000000a";
const FAMILY_B = "00000000-0000-4000-8000-00000000000b";

const sql = createTestSql();
const repository = createSQLRefreshTokenRepository(sql);

const createAccountId = async (): Promise<number> => {
  const saved = await createSQLAccountRepository(sql).save({
    email: "ada@example.com",
    passwordHash: "hash",
  });
  if (saved._tag !== "Success") throw new Error("expected account save to succeed");
  return saved.value.id;
};

const buildToken = (accountId: number, tokenHash: string, familyId = FAMILY_A) => ({
  accountId,
  familyId,
  tokenHash,
  expiresAt: new Date("2030-01-01T00:00:00.000Z"),
});

beforeEach(() => truncateAllTables(sql));
afterAll(() => sql.end());

describe("createSQLRefreshTokenRepository", () => {
  it("saves a token and finds it by hash", async () => {
    const accountId = await createAccountId();
    const token = buildToken(accountId, "hash-1");

    await repository.save(token);

    await expect(repository.findByHash("hash-1")).resolves.toEqual({
      ...token,
      rotatedAt: null,
    });
  });

  it("returns undefined for an unknown hash", async () => {
    await expect(repository.findByHash("missing")).resolves.toBeUndefined();
  });

  it("rejects a token for an account that does not exist", async () => {
    await expect(repository.save(buildToken(999, "hash-1"))).rejects.toThrow();
  });

  it("marks a token rotated only once", async () => {
    const accountId = await createAccountId();
    await repository.save(buildToken(accountId, "hash-1"));
    const rotatedAt = new Date("2026-01-01T00:00:00.000Z");

    await expect(repository.markRotated("hash-1", rotatedAt)).resolves.toBe(true);
    await expect(repository.markRotated("hash-1", new Date())).resolves.toBe(false);

    await expect(repository.findByHash("hash-1")).resolves.toMatchObject({ rotatedAt });
  });

  it("lets only one of several concurrent rotations win", async () => {
    const accountId = await createAccountId();
    await repository.save(buildToken(accountId, "hash-1"));

    const results = await Promise.all(
      Array.from({ length: 4 }, () => repository.markRotated("hash-1", new Date())),
    );

    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("deletes one family and keeps the others", async () => {
    const accountId = await createAccountId();
    await repository.save(buildToken(accountId, "hash-a1", FAMILY_A));
    await repository.save(buildToken(accountId, "hash-a2", FAMILY_A));
    await repository.save(buildToken(accountId, "hash-b1", FAMILY_B));

    await repository.deleteFamily(FAMILY_A);

    await expect(repository.findByHash("hash-a1")).resolves.toBeUndefined();
    await expect(repository.findByHash("hash-a2")).resolves.toBeUndefined();
    await expect(repository.findByHash("hash-b1")).resolves.toBeDefined();
  });
});
