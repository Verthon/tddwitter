import { describe, expect, it } from "vitest";

import { passwordHasher } from "../passwordHasher.js";

describe("passwordHasher.verify", () => {
  it.each([
    ["an empty string", ""],
    ["a bcrypt hash", "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234"],
    ["an argon2i hash", "$argon2i$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0c2FsdA$aGFzaGhhc2hoYXNoaGFzaGhhc2hoYXNoaGFzaGhhc2g"],
    ["a too-short salt", "$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaGhhc2hoYXNoaGFzaGhhc2hoYXNoaGFzaGhhc2g"],
  ])("returns false for %s", async (_case, passwordHash) => {
    expect(await passwordHasher.verify("correct-horse-battery", passwordHash)).toBe(false);
  });
});
