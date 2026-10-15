import type { Context } from "hono";

import { failure, success, type Result } from "@/common/result/Result.js";

export type MalformedJson = { type: "MALFORMED_JSON" };

export const readJsonBody = async (
  c: Context,
): Promise<Result<unknown, MalformedJson>> => {
  try {
    return success(await c.req.json<unknown>());
  } catch (error) {
    if (error instanceof SyntaxError) {
      return failure({ type: "MALFORMED_JSON" as const });
    }
    throw error;
  }
};
