import { createHash, randomBytes } from "node:crypto";

const REFRESH_TOKEN_BYTES = 32;

export const createRefreshToken = () => randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");

export const hashRefreshToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
