# Middleware

## Typed middleware

```ts
import { createMiddleware } from "hono/factory";

type AuthEnv = { Variables: { accountId: string } };

export const createRequireAuth = (secret: string) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    c.set("accountId", "…");
    await next();
  });
```

- `createMiddleware<Env>` types `c.set` / `c.get` / `c.var` inside the middleware. `Env` is `{ Variables?: …; Bindings?: … }`. On Node, `Bindings` stays empty; config comes through `deps`.
- Build middleware in a factory that takes its deps (`createRequireAuth(secret)`), same as `createXRoutes(deps)`.
- To stop the request, return a response (`return c.json(..., 401)`) and don't call `next()`. Expected failures return a response; they don't throw.
- Always `await next()`. Code after it runs once the handler has produced `c.res`.

## Getting the variable typed in the handler

Pass the middleware inline before the handler. Hono merges its `Env` into the handler's context, so `c.get("accountId")` is `string` with a plain `new Hono()`:

```ts
const routes = new Hono();
const requireAuth = createRequireAuth(jwtSecret);

routes.get("/me", requireAuth, (c) => {
  return c.json({ accountId: c.get("accountId") });
});
```

Prefer this inline form even when every route of a sub-app needs auth. `routes.use("/*", requireAuth)` guards at runtime but doesn't change handler types, so `c.get("accountId")` fails to compile on a plain `new Hono()`. Typing the sub-app as `new Hono<AuthEnv>()` fixes that; it mounts with `app.route` and `createTestApp` accepts it.

## Order

Middleware and handlers run in registration order. Register `use(...)` before the routes it guards, and mount children with `app.route(...)` after their routes are defined; a route added to a child after it was mounted is not served.
