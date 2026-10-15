# Hono RPC (`hc`): not adopted

Don't introduce `hc`, `AppType` exports or chained-route rewrites without a decision recorded in `docs/tasks/` or an ADR. This page explains what it would take.

## How it works

`hc<AppType>(baseUrl)` from `hono/client` gives `web/` a client typed from the api's route definitions. Response types come from `c.json(body, status)`; request types come only from validators (`hono/validator`, `@hono/zod-validator`).

Verified here: a chained route (`new Hono().get(...)`) returning `c.json(..., 404)` and `c.json(..., 200)` gives a client whose `res.json()` narrows on `res.status`.

## What it would cost in this repo

- Every route factory would switch from `routes.post(...)` statements to one chained expression, and the composed app in `index.ts` would need its type exported. Today's factories give no route types at all.
- Request bodies would stay untyped: services take `unknown` and validate themselves, and `hc` only types inputs declared through a validator middleware. Getting typed inputs means moving validation into route validators, which contradicts [service.md](../../../../docs/architecture/api/service.md).
- `onError` responses (the generic 500) aren't in the inferred types unless declared separately.
- `web/` would need `hono` at the same version as `api/`, and a way to import the api's types. Its `tsconfig` uses `moduleResolution: bundler` and has no `@/` alias, while the api's source uses `@/` imports, so `web` can't type-check api source directly. It would need emitted `.d.ts` files or project references.
- The drift risk is between the MSW handlers and the real api. `hc` doesn't type MSW handlers; they would still need to be typed by hand from `InferResponseType`.

## Cheaper ways to catch drift

- Acceptance tests on the api route (`app.request`) pin status codes and bodies.
- The planned `pnpm e2e` with a real-api mode runs the same journeys against the real backend (see `docs/tasks/onboarding.md`).
