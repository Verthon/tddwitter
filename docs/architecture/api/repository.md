# Repository

Purpose: port for loading and saving one kind of data. Services depend on the port, never on postgres.

## Rules

- Declare the port as an explicit type next to the adapters. Compose it from `@/common/repository/Repository.js` (`FindById`, `Save`, `FindAllCursorBased`) when they fit.
- SQL adapter: `createSQLXRepository(sql: Sql): XRepository`. postgres.js tagged templates only, never string concatenation. Map snake_case rows to domain types in one `toX(row)` function.
- In-memory adapter: `createInMemoryXRepository(seed?)` ending in `satisfies XRepository`. It must enforce the same constraints the database enforces (e.g. unique email), or tests pass against a fake the database would reject.
- Expected outcomes (not found, duplicate) are `Result` failures with a tagged `type`.
- Infrastructure failures: open question, see `docs/tasks/onboarding.md`. Don't add new `DATABASE_ERROR` results until it's decided.

## Pattern

```ts
export type TimelineItemRepository = FindAllCursorBased<TimelineItem, TimelineCursorParams>;

export const createSQLTimelineRepository = (sql: Sql): TimelineItemRepository => ({
  async findAllCursorBased({ createdAt, limit, publicId }) { /* … */ },
});
```

Reference: `api/src/timeline/list/repository.ts`.

Known deviation: `AccountRepository` is `ReturnType<typeof createSQLAccountRepository>`, so the port is derived from the adapter. Don't copy it.
