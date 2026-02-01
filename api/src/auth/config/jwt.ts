import { getEnv } from "@/infra/env.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const DAY = 24 * MINUTE;

export const authConfig = {
  accessToken: {
    expiresInMs: 15 * MINUTE,
    expiresInSeconds: () =>
      Math.floor(authConfig.accessToken.expiresInMs / 1000),
  },
  refreshToken: {
    expiresInMs: 30 * DAY,
    expiresInSeconds: () =>
      Math.floor(authConfig.refreshToken.expiresInMs / 1000),
  },
  jwtSecret: getEnv().JWT_SECRET,
} as const;
