import { z } from "zod";
import { localizedMessage } from "../../i18n/localizedResponse.js";
import { emailValidationConfig } from "../config/emailPassValidation.js";
import { passwordValidationConfig } from "../config/passwordValidationConfig.js";

export const registerMessages = {
  invalidEmail: localizedMessage({ en: "Invalid email format" }),
  emailMax: localizedMessage({ en: `Email must be at most ${emailValidationConfig.max} characters` }),
  passwordMin: localizedMessage({ en: `Password must be at least ${passwordValidationConfig.min} characters` }),
  passwordMax: localizedMessage({ en: `Password must be at most ${passwordValidationConfig.max} characters` }),
};

export const registerSchema = z.object({
  email: z
    .email(registerMessages.invalidEmail.en)
    .max(emailValidationConfig.max, registerMessages.emailMax.en),
  password: z
    .string()
    .min(passwordValidationConfig.min, registerMessages.passwordMin.en)
    .max(passwordValidationConfig.max, registerMessages.passwordMax.en),
});

export type RegisterInput = z.infer<typeof registerSchema>;
