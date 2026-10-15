# CORS for the web app

`web/` calls the api with absolute URLs (`PUBLIC_*_API`), so in the browser it's a different origin (another port) but the same site. Auth cookies then need two things: the web `fetch` sends `credentials: "include"`, and the api answers with CORS headers that allow credentials.

```ts
import { cors } from "hono/cors";

app.use("/api/*", cors({ origin: WEB_ORIGIN, credentials: true }));
app.route("/api/auth", createAuthRoutes(...));
```

- Register it in `api/src/index.ts`, before any `app.route(...)`. `WEB_ORIGIN` comes from env config, never a literal in code.
- Never use the default `origin: "*"` with `credentials: true`. Hono will send `Access-Control-Allow-Origin: *`, and browsers block credentialed responses carrying the wildcard (MDN, CORS guide).
- `origin` takes a string, an array of origins, or `(origin, c) => string | null`. An unknown origin gets no `Access-Control-Allow-Origin` header.
- Preflight (`OPTIONS` with `Access-Control-Request-Method`) gets a 204 with allow-origin, allow-credentials, the default methods (`GET, HEAD, PUT, POST, DELETE, PATCH`) and the request's `Access-Control-Request-Headers` echoed back, unless you set `allowHeaders`.
- Error responses keep the CORS headers: a 401 returned by `requireAuth` and a 500 from `handleUnexpectedError` both carry `Access-Control-Allow-Origin`, so the web app can read their bodies.

## Testing

```ts
const res = await app.request("/api/auth/login", {
  method: "OPTIONS",
  headers: {
    Origin: WEB_ORIGIN,
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type",
  },
});

expect(res.status).toBe(204);
expect(res.headers.get("Access-Control-Allow-Origin")).toBe(WEB_ORIGIN);
expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
```

`api/src/index.ts` can't be imported in a test: it opens the database connection and calls `serve`. Build the same `cors(...)` + `app.route(...)` composition in the test, wrap it with `createTestApp`, and request the full path (`/api/auth/login`).
