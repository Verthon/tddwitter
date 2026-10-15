import { describe, it, expect } from "vitest";
import { createRegisterService } from "../registerService.js";
import { createInMemoryAccountRepository } from "../../repository/inMemoryAccountRepository.js";
import { expectSuccess, expectFailure } from "@/common/test-utils/result.js";

const fakeHash = async (password: string) => `hashed_${password}`;

const setup = () => {
  const repository = createInMemoryAccountRepository();
  const service = createRegisterService({ repository, hashPassword: fakeHash });
  return { repository, service };
};

describe("registerService", () => {
  it("creates an account with hashed password", async () => {
    const { service } = setup();

    const result = await service.register({
      email: "user@example.com",
      password: "correct-horse-1",
    });

    const account = expectSuccess(result);
    expect(account.email).toBe("user@example.com");
    expect(account.passwordHash).toBe("hashed_correct-horse-1");
    expect(account.id).toBe(1);
  });

  it("returns DUPLICATE_EMAIL when email is taken", async () => {
    const { service } = setup();

    await service.register({
      email: "user@example.com",
      password: "correct-horse-1",
    });

    const result = await service.register({
      email: "user@example.com",
      password: "correct-horse-2",
    });

    const error = expectFailure(result);
    expect(error.type).toBe("DUPLICATE_EMAIL");
  });

  it("returns VALIDATION_ERROR for invalid email", async () => {
    const { service } = setup();

    const result = await service.register({
      email: "bad",
      password: "correct-horse-1",
    });

    const error = expectFailure(result);
    expect(error.type).toBe("VALIDATION_ERROR");
  });

  it("returns VALIDATION_ERROR for short password", async () => {
    const { service } = setup();

    const result = await service.register({
      email: "user@example.com",
      password: "short",
    });

    const error = expectFailure(result);
    expect(error.type).toBe("VALIDATION_ERROR");
  });
});
