import { success, failure } from "@/common/result/Result.js";
import type { AccountRepository } from "../repository/accountRepository.js";
import { registerSchema } from "./registerValidation.js";

type RegisterDeps = {
  repository: AccountRepository;
  hashPassword: (password: string) => Promise<string>;
};

export const createRegisterService = (deps: RegisterDeps) => ({
  async register(input: unknown) {
    const parsed = registerSchema.safeParse(input);

    if (!parsed.success) {
      return failure({
        type: "VALIDATION_ERROR" as const,
        message: parsed.error.message,
      });
    }

    const { email, password } = parsed.data;

    const passwordHash = await deps.hashPassword(password);
    const result = await deps.repository.save({ email, passwordHash });

    if (result._tag === "Failure") {
      return failure(result.error);
    }

    return success(result.value);
  },
});
