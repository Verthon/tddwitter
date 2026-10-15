# API building blocks

Layout: `api/src/<feature>/` holds one vertical slice. Folders inside it: `<useCase>/` (service + validation), `repository/`, `route/`, `model/` (pure functions), `config/`. Tests sit in `__tests__/<file>.spec.ts` next to the code.

| If you need… | Read | Key traits |
|---|---|---|
| An operation that can fail | [result.md](result.md) | `Result`, tagged `{ type }` errors |
| Load or save data | [repository.md](repository.md) | explicit port type, SQL + in-memory adapters |
| One use case | [service.md](service.md) | `createXService(deps)`, validates `unknown` input, ports only |
| An HTTP endpoint | [route.md](route.md) | `createXRoutes(deps)`, maps failures to status codes |
| Pure domain logic | `api/src/timeline/model/` | plain functions, no I/O |

Wiring happens only in `api/src/index.ts` (composition root). Imports use the `@/` alias and `.js` extensions.
