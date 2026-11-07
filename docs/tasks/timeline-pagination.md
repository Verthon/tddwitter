# Timeline pagination

Created: 2026-11-07

## Goal

Paging through the timeline never loses or repeats a post. These are known bugs, not fixed, moved out of PR #2 by `docs/decision-log.md` D-009. This file is input for the timeline spec (`GOAL.md` MVP item 4). Delete it when that spec covers everything here.

## Known bugs

1. **The cursor has less precision than the column.** `posts.created_at` stores microseconds, and the cursor goes through `Date`, which keeps milliseconds. Rows at `.123900`, `.123700` and `.123600`, read one per page, returned only the first. The cursor became `.123`, and the other two compared as newer than it. A database test showed this on 2026-11-06, in commit `ff088725`.
2. **The model sorts again after SQL.** SQL orders by `(created_at, public_id)`. `createTimelineModel` then sorts by `(milliseconds, Number(id))` and takes the cursor from that order, so on a tie the cursor row can differ from the last row SQL returned. Found by reading the code, not shown by a test.
3. **The route cannot accept the cursor it returns.** `nextCursor` is an object with `createdAt`, `id` and `publicId`, while the query takes a string, `<createdAt>_<publicId>`. Audit finding 17 lists this with a related problem: a huge cursor value throws `RangeError`, which reads as a 500.

## Decide first

What does the timeline order by?

- `ORDER BY id DESC` with an opaque cursor removes the timestamp, tie-break and collation problems, if `created_at` always follows insert order.
- `created_at` with `public_id` as the tie-break keeps the current shape. It then needs either a millisecond column (D-008) or a cursor with microseconds.

Research, not reviewed: `~/Projects/advisors/databases/research/overview.md`.

## What the spec needs

- Acceptance tests go through the route and use the cursor the route really returns. A test that builds its own cursor misses bug 2 and bug 3.
- Run them on real Postgres. The in-memory repository holds JavaScript numbers, so it cannot show bug 1.
- Cover posts that differ only in microseconds, and posts with equal timestamps.
- One order only, used by SQL and by the cursor.
