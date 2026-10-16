import { describe, expect, it, vi } from "vitest";

import { rejectWith } from "@/common/test-utils/http.js";
import { expectFailureOfType, expectSuccess } from "@/common/test-utils/result.js";
import type { Account } from "../../repository/accountRepository.js";
import { createInMemoryAccountRepository } from "../../repository/inMemoryAccountRepository.js";
import { createInMemoryRefreshTokenRepository } from "../../repository/inMemoryRefreshTokenRepository.js";
import type { RefreshTokenRepository } from "../../repository/refreshTokenRepository.js";
import { hashRefreshToken } from "../refreshToken.js";
import { DUMMY_PASSWORD_HASH, createSessionService } from "../sessionService.js";

const JWT_SECRET = "unit-test-secret-of-at-least-32-chars";
const ACCOUNT: Account = {
  id: 1,
  email: "user@example.com",
  passwordHash: "stored-hash",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

const setup = ({
  refreshTokenRepository = createInMemoryRefreshTokenRepository(),
  verifyPassword = vi.fn(async (password: string) => password === "right"),
}: {
  refreshTokenRepository?: RefreshTokenRepository;
  verifyPassword?: (password: string, passwordHash: string) => Promise<boolean>;
} = {}) => ({
  verifyPassword,
  refreshTokenRepository,
  service: createSessionService({
    accountRepository: createInMemoryAccountRepository([ACCOUNT]),
    refreshTokenRepository,
    verifyPassword,
    jwtSecret: JWT_SECRET,
  }),
});

const emailOfLength = (length: number) => `${"a".repeat(length - "@example.com".length)}@example.com`;

describe("sessionService.login", () => {
  it("verifies against the dummy hash when the email is unknown", async () => {
    const { service, verifyPassword } = setup();

    const result = await service.login({ email: "nobody@example.com", password: "right" });

    expectFailureOfType(result, "INVALID_CREDENTIALS");
    expect(verifyPassword).toHaveBeenCalledExactlyOnceWith("right", DUMMY_PASSWORD_HASH);
  });

  it("accepts a one-character password as input and checks it against the stored hash", async () => {
    const { service, verifyPassword } = setup();

    const result = await service.login({ email: ACCOUNT.email, password: "x" });

    expectFailureOfType(result, "INVALID_CREDENTIALS");
    expect(verifyPassword).toHaveBeenCalledExactlyOnceWith("x", ACCOUNT.passwordHash);
  });

  it("accepts an email of 254 characters", async () => {
    const { service } = setup();

    const result = await service.login({ email: emailOfLength(254), password: "right" });

    expectFailureOfType(result, "INVALID_CREDENTIALS");
  });

  it("rejects an email of 255 characters", async () => {
    const { service } = setup();

    const result = await service.login({ email: emailOfLength(255), password: "right" });

    expectFailureOfType(result, "VALIDATION_ERROR");
  });

  it.each([
    ["a non-object body", "user@example.com"],
    ["null", null],
    ["a non-string email", { email: 42, password: "right" }],
  ])("rejects %s", async (_case, input) => {
    const { service } = setup();

    expectFailureOfType(await service.login(input), "VALIDATION_ERROR");
  });

  it("rejects when the refresh token cannot be stored", async () => {
    const failingRepository = {
      ...createInMemoryRefreshTokenRepository(),
      save: rejectWith(new Error("connection refused")),
    };
    const { service } = setup({ refreshTokenRepository: failingRepository });

    await expect(service.login({ email: ACCOUNT.email, password: "right" })).rejects.toThrow(
      "connection refused",
    );
  });
});

describe("sessionService.refresh", () => {
  it("revokes the family when another request rotated the token first", async () => {
    const inner = createInMemoryRefreshTokenRepository();
    const racingRepository: RefreshTokenRepository = {
      ...inner,
      markRotated: async () => false,
    };
    const { service } = setup({ refreshTokenRepository: racingRepository });
    const { refreshToken } = expectSuccess(
      await service.login({ email: ACCOUNT.email, password: "right" }),
    );
    const tokenHash = hashRefreshToken(refreshToken);

    const result = await service.refresh(refreshToken);

    expectFailureOfType(result, "INVALID_TOKEN");
    expect(await inner.findByHash(tokenHash)).toBeUndefined();
  });

  it("rejects when the token lookup throws", async () => {
    const failingRepository = {
      ...createInMemoryRefreshTokenRepository(),
      findByHash: rejectWith(new Error("connection refused")),
    };
    const { service } = setup({ refreshTokenRepository: failingRepository });

    await expect(service.refresh("some-token")).rejects.toThrow("connection refused");
  });
});

describe("sessionService.currentAccount", () => {
  it("fails with INVALID_TOKEN when the account no longer exists", async () => {
    const { service } = setup();

    expectFailureOfType(await service.currentAccount(999), "INVALID_TOKEN");
  });
});
