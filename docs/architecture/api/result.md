# Result

Purpose: return expected failures as values, so the caller has to handle them. Unexpected failures (infrastructure, bugs) are thrown and become a generic 500.

## Rules

- Every operation with an expected failure returns `Result<Value, Error>` from `@/common/result/Result.js`. Build with `success(value)` / `failure(error)`, branch on `result._tag`.
- Errors are tagged objects: `{ type: "UPPER_SNAKE" as const, ...details }`. Use `as const` so the union stays narrow.
- Untrusted input is validated with a zod schema and `safeParse`. A parse failure becomes `{ type: "VALIDATION_ERROR", message }`.
- Expected failure: something the caller can act on (validation, not found, duplicate). It goes in the `Result` error union. Anything else is thrown; never wrap it in a `Result`.
- Callers handle every failure `type` explicitly: `switch (error.type)` ending in `default: return assertNever(error)` from `@/common/result/Result.js`. A new failure type then breaks the build until it's handled.
- Tests unwrap with `expectSuccess(result)`, `expectFailureOfType(result, "TYPE")` (narrows to that variant) or `expectFailure(result)` from `@/common/test-utils/result.js`. Never read `.value` without checking.

## Pattern

```ts
const parsed = registerSchema.safeParse(input);
if (!parsed.success) {
  return failure({ type: "VALIDATION_ERROR" as const, message: parsed.error.message });
}
```

Reference: `api/src/auth/register/registerService.ts`.
