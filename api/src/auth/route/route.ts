import { Hono } from "hono";

import { readJsonBody } from "@/common/http/readJsonBody.js";
import { assertNever } from "@/common/result/Result.js";
import { localizedMessage } from "@/i18n/localizedResponse.js";
import type { createRegisterService } from "../register/registerService.js";

export const createAuthRoutes = (
  registerService: ReturnType<typeof createRegisterService>,
) => {
  const authRoutes = new Hono();

  authRoutes.post("/register", async (c) => {
    const body = await readJsonBody(c);
    const result =
      body._tag === "Failure" ? body : await registerService.register(body.value);

    if (result._tag === "Failure") {
      const { error } = result;
      switch (error.type) {
        case "MALFORMED_JSON":
          return c.json(
            { error: localizedMessage({ en: "Malformed JSON body" }) },
            400,
          );
        case "DUPLICATE_EMAIL":
          return c.json(
            { error: localizedMessage({ en: "Email already exists" }) },
            409,
          );
        case "VALIDATION_ERROR":
          return c.json(
            { error: localizedMessage({ en: error.message }) },
            400,
          );
        default:
          return assertNever(error);
      }
    }

    const { id, email } = result.value;
    return c.json({ id, email }, 201);
  });

  return authRoutes;
};
