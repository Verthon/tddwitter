# Route

Purpose: translate HTTP to a service call and the `Result` back to HTTP.

## Rules

- `createXRoutes(deps)` builds and returns a `new Hono()`. No module-level wiring, no `@/infra/*` imports. `api/src/index.ts` mounts it under `/api/<feature>`.
- Read the body with `readJsonBody(c)` from `@/common/http/readJsonBody.js`, never `c.req.json()` directly (it throws on invalid JSON, which would become a 500). It returns `Result<unknown, { type: "MALFORMED_JSON" }>`. Pass a failure straight into the route's switch (`body._tag === "Failure" ? body : await service.x(body.value)`) and map `MALFORMED_JSON` to 400. Pass the value to the service unchanged.
- Map each failure `type` to a status code in an exhaustive `switch` with `assertNever` (see [result.md](result.md)). No catch-all 500 branch.
- Don't catch thrown errors in routes. `handleUnexpectedError` (`@/common/http/handleUnexpectedError.js`, registered with `app.onError` in `api/src/index.ts`) logs them and returns a generic 500.
- Error bodies: `{ error: localizedMessage({ en: "…" }) }` from `@/i18n/localizedResponse.js`. Never send raw database messages to the client.
- Route tests: build the app with in-memory repositories, wrap it with `createTestApp(routes)` from `@/common/test-utils/http.js` (same `onError` as production) and call `app.request(path, init)`. They must not import `@/infra/db.js`.
- Test the unexpected path by replacing a port method with `rejectWith(error)` from the same module: expect 500, the generic body, and no leaked message.

## Pattern

```ts
export const createAuthRoutes = (registerService: RegisterService) => {
  const authRoutes = new Hono();
  authRoutes.post("/register", async (c) => {
    const body = await readJsonBody(c);
    const result = body._tag === "Failure" ? body : await registerService.register(body.value);
    if (result._tag === "Failure") { /* switch (error.type) → status incl. MALFORMED_JSON → 400, default: assertNever */ }
    return c.json({ id: result.value.id, email: result.value.email }, 201);
  });
  return authRoutes;
};
```

Reference: `api/src/auth/route/route.ts`, tests `api/src/auth/route/__tests__/register.spec.ts`, `api/src/timeline/route/__tests__/timeline.spec.ts`.
