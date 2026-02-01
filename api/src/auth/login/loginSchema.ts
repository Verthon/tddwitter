import { z } from "zod";
import { localizedMessage } from "../../i18n/localizedResponse.js";
import { emailValidationConfig } from "../config/emailPassValidation.js";
import { passwordValidationConfig } from "../config/passwordValidationConfig.js";

export const loginMessages = {
  invalidEmail: localizedMessage({ en: "Invalid email format" }),
  emailMax: localizedMessage({ en: `Email must be at most ${emailValidationConfig.max} characters` }),
  passwordMin: localizedMessage({ en: `Password must be at least ${passwordValidationConfig.min} characters` }),
  passwordMax: localizedMessage({ en: `Password must be at most ${passwordValidationConfig.max} characters` }),
};

export const loginSchema = z.object({
  email: z
    .email(loginMessages.invalidEmail.en)
    .max(emailValidationConfig.max, loginMessages.emailMax.en),
  password: z
    .string()
    .min(passwordValidationConfig.min, loginMessages.passwordMin.en)
    .max(passwordValidationConfig.max, loginMessages.passwordMax.en),
});

export type LoginInput = z.infer<typeof loginSchema>;
