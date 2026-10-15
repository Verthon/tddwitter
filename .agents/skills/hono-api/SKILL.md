---
name: hono-api
description: Hono 4.11 how-tos for this repo's api. Use when writing or testing anything under api/src/**/route/, middleware, cookies, JWT/auth, CORS, or the Hono app wiring in api/src/index.ts.
---

# Hono recipes for `api/`

The rules live in `docs/architecture/api/` ([building-blocks](../../../docs/architecture/api/building-blocks.md), [route](../../../docs/architecture/api/route.md), [result](../../../docs/architecture/api/result.md), [service](../../../docs/architecture/api/service.md)). This skill only shows how to do them in Hono 4.11.3. If the two disagree, the docs win; report the conflict.

Every recipe here was run against the installed `hono@4.11.3` and `@hono/node-server@1.19.6`. Don't add packages for anything below.

## Load on demand

| Writing | Read |
|---|---|
| Login, logout, `/me`, auth cookies, signing or verifying JWTs | [references/cookies-jwt.md](references/cookies-jwt.md) |
| A middleware, or `c.set` / `c.get` | [references/middleware.md](references/middleware.md) |
| Route tests with cookies, `Set-Cookie`, token expiry | [references/testing.md](references/testing.md) |
| CORS for the web app | [references/cors.md](references/cors.md) |
| Considering `hc` / RPC types for `web/` | [references/rpc.md](references/rpc.md) |
| Checking where a claim comes from | [references/sources.md](references/sources.md) |

## Route factory

```ts
import { Hono } from "hono";

import { readJsonBody } from "@/common/http/readJsonBody.js";
import { assertNever } from "@/common/result/Result.js";
import { localizedMessage } from "@/i18n/localizedResponse.js";
import type { PostService } from "../create/postService.js";

export const createPostRoutes = ({ postService }: { postService: PostService }) => {
  const routes = new Hono();

  routes.post("/", async (c) => {
    const body = await readJsonBody(c);
    const result = body._tag === "Failure" ? body : await postService.create(body.value);

    if (result._tag === "Failure") {
      const { error } = result;
      switch (error.type) {
        case "MALFORMED_JSON":
          return c.json({ error: localizedMessage({ en: "Malformed JSON body" }) }, 400);
        case "VALIDATION_ERROR":
          return c.json({ error: localizedMessage({ en: error.message }) }, 400);
        default:
          return assertNever(error);
      }
    }

    return c.json(result.value, 201);
  });

  return routes;
};
```

Mount it only in `api/src/index.ts`: `app.route("/api/posts", createPostRoutes({ postService }))`.

## Reading the request

- Body: `readJsonBody(c)` only. It parses with or without a `Content-Type` header.
- Path params: `c.req.param("publicId")`. Query: `c.req.query("limit")` (one) or `c.req.query()` (all). Values are strings (`c.req.query("limit")` is `string | undefined`). Pass them on unchanged; the service or a parse function validates them (see `api/src/timeline/route/route.ts`).
- Don't use `validator` from `hono/validator` or `@hono/zod-validator`: services validate their own `unknown` input ([service.md](../../../docs/architecture/api/service.md)). Also, per the Hono docs, the `json` validator sees `{}` when the request has no `Content-Type: application/json`.
- Status codes: `c.json(body, status)`. Empty response: `c.body(null, 204)`.

## Errors

- Thrown errors reach `handleUnexpectedError` (`app.onError` in `index.ts`, and in `createTestApp`). It returns `HTTPException`s unchanged (status and plain-text message) and turns everything else into the generic 500.
- Don't call `onError` or `notFound` on a feature sub-app. `notFound` only works on the top-level app. A sub-app `onError` registered before `app.route(...)` overrides the global one for that sub-app's routes; registered after, it's silently ignored. Either way it bypasses the shared handler.
- Don't throw `HTTPException` for expected failures. They are `Result` failures mapped in the route's `switch`, with the standard `{ error: localizedMessage(...) }` body.
- Routing is strict: `GET /api/auth/me/` does not match `/me`.

## Route tests

```ts
import { createTestApp, rejectWith } from "@/common/test-utils/http.js";

const setup = (repository: PostRepository = createInMemoryPostRepository()) => ({
  app: createTestApp(createPostRoutes({ postService: createPostService({ repository }) })),
});

const res = await app.request("/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "hi" }),
});
expect(res.status).toBe(201);
```

Paths in tests are relative to the sub-app (`/`, not `/api/posts`). For the unexpected path use `rejectWith(new Error("…"))` and spy on `console.error`; see `api/src/auth/route/__tests__/register.spec.ts`. Cookies: [references/testing.md](references/testing.md).

## `@hono/node-server`

- `serve({ fetch: app.fetch, port }, (info) => …)` in `index.ts` is the only Node-specific code. Tests never start a server; `app.request` runs in-process.
- Client IP: `getConnInfo(c)` from `@hono/node-server/conninfo` (Node only). Under `app.request` it throws, so the route returns 500. Pass it in through deps if a tested route needs it.
