import { sign, verify } from "hono/jwt";
import {
  JwtHeaderInvalid,
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenNotBefore,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";
import { z } from "zod";

import { failure, success, type Result } from "@/common/result/Result.js";
import { authConfig } from "../config/jwt.js";

export type InvalidToken = { type: "INVALID_TOKEN" };

const nowInSeconds = () => Math.floor(Date.now() / 1000);

export const signAccessToken = (accountId: number, secret: string) =>
  sign(
    { sub: String(accountId), exp: nowInSeconds() + authConfig.accessTokenTtlSeconds },
    secret,
    "HS256",
  );

const accessTokenPayloadSchema = z.object({
  sub: z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number),
});

const isTokenError = (error: unknown) =>
  error instanceof JwtTokenInvalid ||
  error instanceof JwtHeaderInvalid ||
  error instanceof JwtTokenExpired ||
  error instanceof JwtTokenNotBefore ||
  error instanceof JwtTokenIssuedAt ||
  error instanceof JwtTokenSignatureMismatched;

export const verifyAccessToken = async (
  token: string,
  secret: string,
): Promise<Result<{ accountId: number }, InvalidToken>> => {
  try {
    const parsed = accessTokenPayloadSchema.safeParse(await verify(token, secret, "HS256"));
    if (!parsed.success) {
      return failure({ type: "INVALID_TOKEN" as const });
    }
    return success({ accountId: parsed.data.sub });
  } catch (error) {
    if (isTokenError(error)) {
      return failure({ type: "INVALID_TOKEN" as const });
    }
    throw error;
  }
};
