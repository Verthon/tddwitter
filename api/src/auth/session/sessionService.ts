import { randomUUID } from "node:crypto";

import { failure, success } from "@/common/result/Result.js";
import { authConfig } from "../config/jwt.js";
import { loginSchema } from "../login/loginSchema.js";
import type { AccountRepository } from "../repository/accountRepository.js";
import type { RefreshTokenRepository } from "../repository/refreshTokenRepository.js";
import { signAccessToken } from "./accessToken.js";
import { createRefreshToken, hashRefreshToken } from "./refreshToken.js";

type SessionDeps = {
  accountRepository: AccountRepository;
  refreshTokenRepository: RefreshTokenRepository;
  verifyPassword: (password: string, passwordHash: string) => Promise<boolean>;
  jwtSecret: string;
};

export const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$+C8+z0BEQRyr6WEmfBbwug$omn3KovoysOMEVwl10sTfqqkws4AtAsgs8drqHxjX/0";

const invalidToken = () => failure({ type: "INVALID_TOKEN" as const });
const invalidCredentials = () => failure({ type: "INVALID_CREDENTIALS" as const });

export const createSessionService = (deps: SessionDeps) => {
  const { accountRepository, refreshTokenRepository, verifyPassword, jwtSecret } = deps;

  const issueTokens = async (accountId: number, familyId: string) => {
    const refreshToken = createRefreshToken();
    await refreshTokenRepository.save({
      accountId,
      familyId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + authConfig.refreshTokenTtlSeconds * 1000),
    });
    const accessToken = await signAccessToken(accountId, jwtSecret);
    return { accessToken, refreshToken };
  };

  const findLiveToken = async (token: string | undefined) => {
    if (!token) {
      return undefined;
    }
    const stored = await refreshTokenRepository.findByHash(hashRefreshToken(token));
    if (!stored || stored.expiresAt.getTime() <= Date.now()) {
      return undefined;
    }
    return stored;
  };

  return {
    async login(input: unknown) {
      const parsed = loginSchema.safeParse(input);
      if (!parsed.success) {
        return failure({
          type: "VALIDATION_ERROR" as const,
          message: parsed.error.issues[0]?.message ?? parsed.error.message,
        });
      }

      const { email, password } = parsed.data;
      const account = await accountRepository.findByEmail(email);
      if (!account) {
        await verifyPassword(password, DUMMY_PASSWORD_HASH);
        return invalidCredentials();
      }
      if (!(await verifyPassword(password, account.passwordHash))) {
        return invalidCredentials();
      }

      const tokens = await issueTokens(account.id, randomUUID());
      return success({ account: { id: account.id, email: account.email }, ...tokens });
    },

    async refresh(token: string | undefined) {
      const stored = await findLiveToken(token);
      if (!stored) {
        return invalidToken();
      }
      if (stored.rotatedAt !== null) {
        await refreshTokenRepository.deleteFamily(stored.familyId);
        return invalidToken();
      }
      const rotated = await refreshTokenRepository.markRotated(stored.tokenHash, new Date());
      if (!rotated) {
        await refreshTokenRepository.deleteFamily(stored.familyId);
        return invalidToken();
      }
      return success(await issueTokens(stored.accountId, stored.familyId));
    },

    async logout(token: string | undefined) {
      if (!token) {
        return;
      }
      const stored = await refreshTokenRepository.findByHash(hashRefreshToken(token));
      if (stored) {
        await refreshTokenRepository.deleteFamily(stored.familyId);
      }
    },

    async currentAccount(accountId: number) {
      const account = await accountRepository.findById(accountId);
      if (!account) {
        return invalidToken();
      }
      return success({ id: account.id, email: account.email });
    },
  };
};

export type SessionService = ReturnType<typeof createSessionService>;
