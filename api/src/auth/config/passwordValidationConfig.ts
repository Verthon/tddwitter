/**
 * Password validation configuration
 *
 * @property {number} min - Minimum password length
 *   - OWASP Auth Cheat Sheet recommends 10-16 characters
 *   - See: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
 *
 * @property {number} max - Maximum password length (JS string length)
 *   - NIST SP 800-63B and the OWASP Auth Cheat Sheet ask verifiers to allow at least 64 characters; 128 leaves room for passphrases
 *   - Argon2id's cost is set by memory and passes, not input length (RFC 9106 §3.2), so the cap bounds request size, not hashing time
 *   - 128 UTF-16 units are at most 384 bytes of UTF-8
 */
export const passwordValidationConfig = {
  min: 12,
  max: 128,
} as const;
