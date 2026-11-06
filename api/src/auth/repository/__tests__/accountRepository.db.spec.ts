import { createTestSql, truncateAllTables } from "@/common/test-utils/testDb.js";
import { createSQLAccountRepository } from "../accountRepository.js";

const sql = createTestSql();
const repository = createSQLAccountRepository(sql);
const newAccount = { email: "ada@example.com", passwordHash: "hash" };

beforeEach(() => truncateAllTables(sql));
afterAll(() => sql.end());

describe("createSQLAccountRepository", () => {
  it("saves an account and finds it by email and by id", async () => {
    const saved = await repository.save(newAccount);

    if (saved._tag !== "Success") throw new Error("expected save to succeed");
    expect(saved.value).toMatchObject(newAccount);
    expect(saved.value.createdAt).toBeInstanceOf(Date);
    await expect(repository.findByEmail(newAccount.email)).resolves.toEqual(saved.value);
    await expect(repository.findById(saved.value.id)).resolves.toEqual(saved.value);
  });

  it("returns DUPLICATE_EMAIL when the email is taken", async () => {
    await repository.save(newAccount);

    const second = await repository.save({ ...newAccount, passwordHash: "other" });

    expect(second).toEqual({
      _tag: "Failure",
      error: { type: "DUPLICATE_EMAIL" },
    });
  });

  it("rethrows database errors that are not a unique violation", async () => {
    const invalid = { email: "a\u0000b@example.com", passwordHash: "hash" };

    await expect(repository.save(invalid)).rejects.toThrow();
  });

  it("returns undefined for an unknown email or id", async () => {
    await expect(repository.findByEmail("nobody@example.com")).resolves.toBeUndefined();
    await expect(repository.findById(999)).resolves.toBeUndefined();
  });
});
