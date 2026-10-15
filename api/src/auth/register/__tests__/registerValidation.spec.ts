import { describe, it, expect } from "vitest";
import { registerSchema } from "../registerValidation.js";
import { passwordValidationConfig } from "../../config/passwordValidationConfig.js";

describe("registerSchema", () => {
  it("accepts valid email and password", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "correct-horse-1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "correct-horse-1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = registerSchema.safeParse({ password: "correct-horse-1" });
    expect(result.success).toBe(false);
  });

  it("rejects password one character below the minimum", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "a".repeat(passwordValidationConfig.min - 1),
    });
    expect(result.success).toBe(false);
  });

  it("accepts password of exactly the minimum length", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "a".repeat(passwordValidationConfig.min),
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body", () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
