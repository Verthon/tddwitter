# Sources

Checked 2026-10-15 against installed `hono@4.11.3` and `@hono/node-server@1.19.6`. When the docs and the installed code differ, the code wins for this repo.

## Official (hono.dev, honojs)

- Routing, grouping, `basePath`, ordering: https://hono.dev/docs/api/routing
- App API, `onError`, `notFound` (top-level only), strict mode: https://hono.dev/docs/api/hono
- `HTTPException`: https://hono.dev/docs/api/exception
- Cookie helper: https://hono.dev/docs/helpers/cookie
- JWT helper (`sign`, `verify`, `decode`, error classes): https://hono.dev/docs/helpers/jwt
- JWT middleware: https://hono.dev/docs/middleware/builtin/jwt
- CORS middleware: https://hono.dev/docs/middleware/builtin/cors
- Factory, `createMiddleware`: https://hono.dev/docs/helpers/factory
- Validation: https://hono.dev/docs/guides/validation
- Testing guide (`app.request`): https://hono.dev/docs/guides/testing
- Testing helper (`testClient`): https://hono.dev/docs/helpers/testing
- RPC (`hc`): https://hono.dev/docs/guides/rpc
- Best practices: https://hono.dev/docs/guides/best-practices
- Node adapter (`serve`, `getConnInfo`): https://github.com/honojs/node-server

## Read from installed source (`api/node_modules/hono/dist`)

- `middleware/jwt/jwt.js`: throws `HTTPException(401)` with a plain-text body; the `Authorization` header wins over the cookie.
- `utils/jwt/jwt.js`: `alg` defaults to `HS256`; `exp`/`nbf`/`iat` are checked only when present.
- `hono-base.js` `route()`: a sub-app's `onError` is captured when it's mounted.
- `middleware/cors/index.js`: the default `origin` is `*`, even with `credentials: true`.
- `helper/cookie/index.js`: `path` defaults to `/`; `deleteCookie` sets `Max-Age=0`.

## OAuth security BCP

- Refresh token rotation with reuse detection (refresh-tokens.md): RFC 9700 §4.14.2, https://www.rfc-editor.org/rfc/rfc9700#section-4.14.2 (cited from the RFC text, not re-fetched for this skill update)

## Browser behavior (MDN)

- `Set-Cookie` (`Secure` on localhost, `SameSite`, `Max-Age`): https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
- Site definition (the port is ignored): https://developer.mozilla.org/en-US/docs/Glossary/Site
- CORS with credentials (no `*`): https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS

No secondary sources were needed.
