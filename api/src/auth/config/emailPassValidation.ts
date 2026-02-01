/**
 * Email validation configuration
 * 
 * @property {number} max - Maximum email length
 *   - RFC 5321 limits: local-part (64) + domain (255) = 319 octets
 *   - Path limit: 256 octets (includes <> brackets in SMTP)
 *   - Practical: 254 characters for email address without brackets
 *   - See: https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1
 */
export const emailValidationConfig = {
  max: 254,
} as const;