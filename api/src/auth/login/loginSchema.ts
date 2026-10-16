import { z } from "zod";
import { localizedMessage } from "../../i18n/localizedResponse.js";
import { emailValidationConfig } from "../config/emailPassValidation.js";
import { passwordValidationConfig } from "../config/passwordValidationConfig.js";

export const loginMessages = {
  invalidEmail: localizedMessage({ en: "Invalid email format" }),
  emailMax: localizedMessage({ en: `Email must be at most ${emailValidationConfig.max} characters` }),
  passwordRequired: localizedMessage({ en: "Password is required" }),
  passwordMax: localizedMessage({ en: `Password must be at most ${passwordValidationConfig.max} characters` }),
};

export const loginSchema = z.object({
  email: z
    .email(loginMessages.invalidEmail.en)
    .max(emailValidationConfig.max, loginMessages.emailMax.en),
  password: z
    .string(loginMessages.passwordRequired.en)
    .min(1, loginMessages.passwordRequired.en)
    .max(passwordValidationConfig.max, loginMessages.passwordMax.en),
});

export type LoginInput = z.infer<typeof loginSchema>;
