import { sign } from "hono/jwt";
import { describe, it } from "vitest";

import { expectFailureOfType } from "@/common/test-utils/result.js";
import { verifyAccessToken } from "../accessToken.js";

const SECRET = "unit-test-secret-of-at-least-32-chars";
const inOneMinute = () => Math.floor(Date.now() / 1000) + 60;

describe("verifyAccessToken", () => {
  it.each([
    ["a non-numeric sub", { sub: "abc", exp: inOneMinute() }],
    ["a zero sub", { sub: "0", exp: inOneMinute() }],
    ["a missing sub", { exp: inOneMinute() }],
  ])("fails with INVALID_TOKEN for %s", async (_case, payload) => {
    const token = await sign(payload, SECRET, "HS256");

    expectFailureOfType(await verifyAccessToken(token, SECRET), "INVALID_TOKEN");
  });
});
