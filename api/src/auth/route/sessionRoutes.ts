import { type Context, Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { readJsonBody } from "@/common/http/readJsonBody.js";
import { assertNever } from "@/common/result/Result.js";
import { localizedMessage } from "@/i18n/localizedResponse.js";
import { authConfig } from "../config/jwt.js";
import type { SessionService } from "../session/sessionService.js";
import { createRequireAuth, unauthorizedBody } from "./requireAuth.js";

type SessionRoutesDeps = {
  sessionService: SessionService;
  jwtSecret: string;
};

const baseCookieOptions = { httpOnly: true, secure: true, sameSite: "Strict" } as const;

const setSessionCookies = (
  c: Context,
  tokens: { accessToken: string; refreshToken: string },
) => {
  setCookie(c, authConfig.accessTokenCookie, tokens.accessToken, {
    ...baseCookieOptions,
    path: authConfig.accessTokenCookiePath,
    maxAge: authConfig.accessTokenTtlSeconds,
  });
  setCookie(c, authConfig.refreshTokenCookie, tokens.refreshToken, {
    ...baseCookieOptions,
    path: authConfig.refreshTokenCookiePath,
    maxAge: authConfig.refreshTokenTtlSeconds,
  });
};

const clearSessionCookies = (c: Context) => {
  deleteCookie(c, authConfig.accessTokenCookie, {
    path: authConfig.accessTokenCookiePath,
    secure: true,
  });
  deleteCookie(c, authConfig.refreshTokenCookie, {
    path: authConfig.refreshTokenCookiePath,
    secure: true,
  });
};

export const createSessionRoutes = ({ sessionService, jwtSecret }: SessionRoutesDeps) => {
  const routes = new Hono();
  const requireAuth = createRequireAuth(jwtSecret);

  routes.post("/login", async (c) => {
    const body = await readJsonBody(c);
    const result = body._tag === "Failure" ? body : await sessionService.login(body.value);

    if (result._tag === "Failure") {
      const { error } = result;
      switch (error.type) {
        case "MALFORMED_JSON":
          return c.json({ error: localizedMessage({ en: "Malformed JSON body" }) }, 400);
        case "VALIDATION_ERROR":
          return c.json({ error: localizedMessage({ en: error.message }) }, 400);
        case "INVALID_CREDENTIALS":
          return c.json({ error: localizedMessage({ en: "Invalid email or password" }) }, 401);
        default:
          return assertNever(error);
      }
    }

    const { account, ...tokens } = result.value;
    setSessionCookies(c, tokens);
    return c.json(account, 200);
  });

  routes.post("/refresh", async (c) => {
    const result = await sessionService.refresh(getCookie(c, authConfig.refreshTokenCookie));

    if (result._tag === "Failure") {
      const { error } = result;
      switch (error.type) {
        case "INVALID_TOKEN":
          return c.json(unauthorizedBody, 401);
        default:
          return assertNever(error.type);
      }
    }

    setSessionCookies(c, result.value);
    return c.body(null, 204);
  });

  routes.post("/logout", async (c) => {
    await sessionService.logout(getCookie(c, authConfig.refreshTokenCookie));
    clearSessionCookies(c);
    return c.body(null, 204);
  });

  routes.get("/me", requireAuth, async (c) => {
    const result = await sessionService.currentAccount(c.get("accountId"));

    if (result._tag === "Failure") {
      const { error } = result;
      switch (error.type) {
        case "INVALID_TOKEN":
          return c.json(unauthorizedBody, 401);
        default:
          return assertNever(error.type);
      }
    }

    return c.json(result.value, 200);
  });

  return routes;
};
