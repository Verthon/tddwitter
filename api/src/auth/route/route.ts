import { Hono } from "hono";

import { localizedMessage } from "@/i18n/localizedResponse.js";
import type { createRegisterService } from "../register/registerService.js";

export const createAuthRoutes = (
  registerService: ReturnType<typeof createRegisterService>,
) => {
  const authRoutes = new Hono();

  authRoutes.post("/register", async (c) => {
    const body = await c.req.json<unknown>();
    const result = await registerService.register(body);

    if (result._tag === "Failure") {
      if (result._tag === "Failure" && result.error.type === "DATABASE_ERROR") {
        return c.json(
          { error: localizedMessage({ en: result.error.details }) },
          500,
        );
      }

      if (
        result._tag === "Failure" &&
        result.error.type === "DUPLICATE_EMAIL"
      ) {
        return c.json(
          { error: localizedMessage({ en: "Email already exists" }) },
          409,
        );
      }

      if (
        result._tag === "Failure" &&
        result.error.type === "VALIDATION_ERROR"
      ) {
        return c.json(
          { error: localizedMessage({ en: result.error.message }) },
          400,
        );
      }

      return c.json({ error: localizedMessage({ en: "unknown error" }) }, 500);
    }

    const { id, email } = result.value;
    return c.json({ id, email }, 201);
  });

  return authRoutes;
};
