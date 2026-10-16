import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { localizedMessage } from "@/i18n/localizedResponse.js";
import { authConfig } from "../config/jwt.js";
import { verifyAccessToken } from "../session/accessToken.js";

export type AuthEnv = { Variables: { accountId: number } };

export const unauthorizedBody = { error: localizedMessage({ en: "Unauthorized" }) };

export const createRequireAuth = (jwtSecret: string) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const token = getCookie(c, authConfig.accessTokenCookie);
    const result = token ? await verifyAccessToken(token, jwtSecret) : undefined;
    if (!result || result._tag === "Failure") {
      return c.json(unauthorizedBody, 401);
    }
    c.set("accountId", result.value.accountId);
    await next();
  });
