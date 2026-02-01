import { success, failure } from "@/common/result/Result.js";
import { loginSchema } from "./loginSchema.js";

type LoginDeps = {};

export const createLoginService = (deps: LoginDeps) => ({
  login(input: unknown) {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      return failure({
        type: "VALIDATION_ERROR" as const,
        message: parsed.error.message,
      });
    }

    return success({ email: parsed.data.email });
  },
});
