import type { AccountRepository } from "../repository/accountRepository.js";

type SessionDeps = {
  accountRepository: AccountRepository;
  refreshTokenRepository: unknown;
  verifyPassword: (password: string, passwordHash: string) => Promise<boolean>;
  jwtSecret: string;
};

export const createSessionService = (_deps: SessionDeps): never => {
  throw new Error("Not implemented: docs/specs/login.md");
};

export type SessionService = ReturnType<typeof createSessionService>;
