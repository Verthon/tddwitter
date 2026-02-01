/**
 * Password validation configuration
 * 
 * @property {number} min - Minimum password length
 *   - OWASP Auth Cheat Sheet recommends 10-16 characters
 *   - See: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
 * 
 * @property {number} max - bcrypt truncation limit (72 bytes)
 *   - See: https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns
 */
export const passwordValidationConfig = {
  min: 12,
  max: 72,
} as const;
