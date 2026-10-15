# Result

Purpose: return expected failures as values, so the caller has to handle them.

## Rules

- Every operation with an expected failure returns `Result<Value, Error>` from `@/common/result/Result.js`. Build with `success(value)` / `failure(error)`, branch on `result._tag`.
- Errors are tagged objects: `{ type: "UPPER_SNAKE" as const, ...details }`. Use `as const` so the union stays narrow.
- Untrusted input is validated with a zod schema and `safeParse`. A parse failure becomes `{ type: "VALIDATION_ERROR", message }`.
- Tests unwrap with `expectSuccess(result)` / `expectFailure(result)` from `@/common/test-utils/result.js`. Never read `.value` without checking.

## Pattern

```ts
const parsed = registerSchema.safeParse(input);
if (!parsed.success) {
  return failure({ type: "VALIDATION_ERROR" as const, message: parsed.error.message });
}
```

Reference: `api/src/auth/register/registerService.ts`.
