const SECOND = 1;
const MINUTE = 60 * SECOND;
const DAY = 24 * 60 * MINUTE;

export const authConfig = {
  accessTokenTtlSeconds: 15 * MINUTE,
  refreshTokenTtlSeconds: 30 * DAY,
  accessTokenCookie: "access_token",
  refreshTokenCookie: "refresh_token",
  accessTokenCookiePath: "/",
  refreshTokenCookiePath: "/api/auth",
} as const;
