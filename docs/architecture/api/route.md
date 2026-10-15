# Route

Purpose: translate HTTP to a service call and the `Result` back to HTTP.

## Rules

- `createXRoutes(deps)` builds and returns a `new Hono()`. No module-level wiring, no `@/infra/*` imports. `api/src/index.ts` mounts it under `/api/<feature>`.
- Read the body as `unknown` (`c.req.json<unknown>()`) and pass it to the service unchanged.
- Map each failure `type` to a status code explicitly. Unknown failures return 500.
- Error bodies: `{ error: localizedMessage({ en: "…" }) }` from `@/i18n/localizedResponse.js`. Never send raw database messages to the client.
- Route tests: build the app with in-memory repositories and call `app.request(path, init)`. They must not import `@/infra/db.js`.

## Pattern

```ts
export const createAuthRoutes = (registerService: RegisterService) => {
  const authRoutes = new Hono();
  authRoutes.post("/register", async (c) => {
    const result = await registerService.register(await c.req.json<unknown>());
    if (result._tag === "Failure") { /* type → status */ }
    return c.json({ id: result.value.id, email: result.value.email }, 201);
  });
  return authRoutes;
};
```

Reference: `api/src/auth/route/route.ts`, test `api/src/auth/route/__tests__/register.spec.ts`.

Known deviations: timeline returns `{ message: { en } }` on 400, and register returns `error.details` (a raw DB message) on 500.
