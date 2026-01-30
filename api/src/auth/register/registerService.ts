import { type Result, success, failure } from "@/common/result/Result.js";
import type { Account, AccountRepository } from "../repository/accountRepository.js";
import { registerSchema } from "./registerValidation.js";

type RegisterError =
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "EMAIL_ALREADY_EXISTS" };

type RegisterDeps = {
  repository: AccountRepository;
  hashPassword: (password: string) => Promise<string>;
};

export const createRegisterService = (deps: RegisterDeps) => ({
  async register(input: unknown): Promise<Result<Account, RegisterError>> {
    const parsed = registerSchema.safeParse(input);

    if (!parsed.success) {
      return failure({
        type: "VALIDATION_ERROR" as const,
        message: parsed.error.message
      });
    }

    const { email, password } = parsed.data;

    const existing = await deps.repository.findByEmail(email);
    if (existing) {
      return failure({ type: "EMAIL_ALREADY_EXISTS" as const });
    }

    const passwordHash = await deps.hashPassword(password);
    const account = await deps.repository.save({ email, passwordHash });

    return success(account);
  },
});
