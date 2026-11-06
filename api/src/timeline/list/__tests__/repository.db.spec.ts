import { createTestSql, truncateAllTables } from "@/common/test-utils/testDb.js";
import { createSQLTimelineRepository } from "../repository.js";

const sql = createTestSql();
const repository = createSQLTimelineRepository(sql);

const insertPost = async (publicId: string, createdAt: string): Promise<void> => {
  await sql`
    INSERT INTO posts (public_id, username, content, created_at)
    VALUES (${publicId}, 'ada', 'hello', ${createdAt}::text::timestamptz)
  `;
};

const noCursor = { createdAt: undefined, publicId: undefined };

const readAllPages = async (limit: number): Promise<string[]> => {
  const seen: string[] = [];
  let cursor: { createdAt: number | undefined; publicId: string | undefined } = noCursor;

  for (;;) {
    const page = await repository.findAllCursorBased({ ...cursor, limit });
    seen.push(...page.map((item) => item.publicId));
    const last = page.at(-1);
    if (page.length < limit || !last) return seen;
    cursor = { createdAt: last.createdAt, publicId: last.publicId };
  }
};

beforeEach(() => truncateAllTables(sql));
afterAll(() => sql.end());

describe("createSQLTimelineRepository", () => {
  it("returns an empty list when there are no posts", async () => {
    await expect(
      repository.findAllCursorBased({ ...noCursor, limit: 10 }),
    ).resolves.toEqual([]);
  });

  it("orders by newest first and maps rows to timeline items", async () => {
    await insertPost("older", "2026-01-01T00:00:00.000Z");
    await insertPost("newer", "2026-01-02T00:00:00.000Z");

    const items = await repository.findAllCursorBased({ ...noCursor, limit: 10 });

    expect(items.map((item) => item.publicId)).toEqual(["newer", "older"]);
    expect(items[0]?.createdAt).toBe(Date.parse("2026-01-02T00:00:00.000Z"));
  });

  it("orders by public id when timestamps are equal", async () => {
    await insertPost("a", "2026-01-01T00:00:00.000Z");
    await insertPost("b", "2026-01-01T00:00:00.000Z");

    const items = await repository.findAllCursorBased({ ...noCursor, limit: 10 });

    expect(items.map((item) => item.publicId)).toEqual(["b", "a"]);
  });

  it("respects the limit", async () => {
    await insertPost("a", "2026-01-01T00:00:00.000Z");
    await insertPost("b", "2026-01-02T00:00:00.000Z");

    const items = await repository.findAllCursorBased({ ...noCursor, limit: 1 });

    expect(items.map((item) => item.publicId)).toEqual(["b"]);
  });

  it("pages through posts with equal timestamps without losing or repeating any", async () => {
    await insertPost("a", "2026-01-01T00:00:00.000Z");
    await insertPost("b", "2026-01-01T00:00:00.000Z");
    await insertPost("c", "2026-01-01T00:00:00.000Z");

    await expect(readAllPages(1)).resolves.toEqual(["c", "b", "a"]);
  });

  it("pages through posts that differ only in microseconds without losing or repeating any", async () => {
    await insertPost("first", "2026-01-01T00:00:00.123900Z");
    await insertPost("second", "2026-01-01T00:00:00.123700Z");
    await insertPost("third", "2026-01-01T00:00:00.123600Z");

    const seen = await readAllPages(1);

    expect(seen.toSorted()).toEqual(["first", "second", "third"]);
  });
});
