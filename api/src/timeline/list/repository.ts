import type { Repository } from "@/common/repository/Repository.js";
import type { TimelineItemRaw } from "../model/TimelineItemRaw.js";
import type { ReadonlyProps } from "@/common/ReadonlyProps.js";
import { compareTimelineItems } from "../model/compareTimelineItems.js";

interface TimelineItemRepository extends Repository<TimelineItemRaw, string> {
  findMany(
    props: ReadonlyProps<{
      limit: number;
      cursor: { id: string, createdAt: number } | null;
    }>
  ): Promise<TimelineItemRaw[]>;
}

type InMemoryRepositoryOptions<Entity, Id> = ReadonlyProps<{
  getId: (entity: Entity) => Id;
}>;

const createInMemoryTimelineItemRepository = (
  options: InMemoryRepositoryOptions<TimelineItemRaw, string>
): TimelineItemRepository => {
  const storage = new Map<string, TimelineItemRaw>();

  return {
    getById: async (id) => {
      const record = storage.get(id);
      if (!record) {
        throw new Error("Record not found");
      }
      return record;
    },
    existsById: async (id) => storage.has(id),
    findById: async (id) => storage.get(id) ?? null,
    save: async (entity) => {
      storage.set(options.getId(entity), entity);
    },
    findAll: async () => Array.from(storage.values()),
    findMany: async ({ limit, cursor }) => {
      const allItems = Array.from(storage.values());
      const sortedItems = allItems.toSorted(compareTimelineItems);

      if (!cursor) {
        return sortedItems.slice(0, limit);
      }

      const cursorIndex = sortedItems.findIndex(
        (item) => item.id === cursor.id && item.createdAt === cursor.createdAt
      );

      if (cursorIndex === -1) {
        return sortedItems.slice(0, limit);
      }

      const startIndex = cursorIndex + 1;
      return sortedItems.slice(startIndex, startIndex + limit);
    },
  };
};
