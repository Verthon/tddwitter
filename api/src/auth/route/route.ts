import { Hono } from "hono";
import bcrypt from "bcrypt";

import sql from "@/infra/db.js";
import { createSQLAccountRepository } from "../repository/accountRepository.js";
import { createRegisterService } from "../register/registerService.js";

export const createAuthRoutes = (
  registerService: ReturnType<typeof createRegisterService>
) => {
  const authRoutes = new Hono();

  authRoutes.post("/register", async (c) => {
    const body = await c.req.json();
    const result = await registerService.register(body);

    if (result._tag === "Failure") {
      const status = result.error.type === "EMAIL_ALREADY_EXISTS" ? 409 : 400;
      return c.json({ error: result.error }, status);
    }

    const { id, email } = result.value;
    return c.json({ id, email }, 201);
  });

  // POST /login — TODO: implement in next iteration

  return authRoutes;
};

const repository = createSQLAccountRepository(sql);
const registerService = createRegisterService({
  repository,
  hashPassword: (password) => bcrypt.hash(password, 10),
});

export const authRoutes = createAuthRoutes(registerService);
