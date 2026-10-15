# Service

Purpose: run one use case. Validate input, call ports and model functions, return a `Result`.

## Rules

- `createXService(deps)` returns an object with one async method per use case.
- `deps` holds ports (repositories) and capabilities as functions (`hashPassword`). Never import `@/infra/*` here.
- Public methods take `unknown` input and validate it first (see [result.md](result.md)). The schema lives in `<useCase>/<useCase>Validation.ts` or `<useCase>Schema.ts`.
- Business rules live in `model/` functions, so the service only orchestrates.
- Unit-test services with in-memory repositories and fake capabilities.

## Pattern

```ts
type RegisterDeps = {
  repository: AccountRepository;
  hashPassword: (password: string) => Promise<string>;
};

export const createRegisterService = (deps: RegisterDeps) => ({
  async register(input: unknown) { /* validate → hash → save → Result */ },
});
```

Reference: `api/src/auth/register/registerService.ts`.
