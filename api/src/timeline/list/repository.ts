import type { FindAllCursorBased } from "@/common/repository/Repository.js";
import type { Sql } from "postgres";

import type { TimelineItem } from "../model/TimelineItem.js";

export type TimelineCursorParams = {
  createdAt: number | undefined;
  publicId: string | undefined;
  limit: number;
};

type PostRow = {
  id: string;
  public_id: string;
  created_at: Date;
};

export type TimelineItemRepository = FindAllCursorBased<
  TimelineItem,
  TimelineCursorParams
>;

export const createInMemoryTimelineRepository = (
  seed: TimelineItem[] = [],
): TimelineItemRepository => {
  const storage = new Map(seed.map((item) => [item.id, item]));

  return {
    findAllCursorBased({ createdAt, limit, publicId }) {
      let items = Array.from(storage.values()).sort(
        (a, b) =>
          b.createdAt - a.createdAt || b.publicId.localeCompare(a.publicId),
      );

      if (createdAt !== undefined && publicId !== undefined) {
        items = items.filter(
          (item) =>
            item.createdAt < createdAt ||
            (item.createdAt === createdAt && item.publicId < publicId),
        );
      }

      return Promise.resolve(items.slice(0, limit));
    },
  };
};

export const createSQLTimelineRepository = (sql: Sql): TimelineItemRepository => ({
  async findAllCursorBased({ createdAt, limit, publicId }) {
    const hasCursor = createdAt !== undefined && publicId !== undefined;
    const rows = await sql<PostRow[]>`
      SELECT id, public_id, created_at
      FROM posts
      WHERE ${
        hasCursor
          ? sql`(created_at, public_id) < (${new Date(createdAt)}, ${publicId})`
          : sql`TRUE`
      }
      ORDER BY created_at DESC, public_id DESC
      LIMIT ${limit}
    `;
    return rows.map((row) => ({
      id: row.id,
      publicId: row.public_id,
      createdAt: row.created_at.getTime(),
    }));
  },
});
