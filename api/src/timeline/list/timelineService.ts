import { createTimelineModel } from "../model/createTimelineModel.js";
import type { TimelineQueryParams } from "../route/timelineQueryParams.js";
import { decodeCursorParts } from "./decodeCursorParts.js";
import type { createTimelineItemRepository } from "./repository.js";

type TimelineItemRepository = ReturnType<typeof createTimelineItemRepository>;

type CreateTimelineServiceParams = {
  repository: TimelineItemRepository;
};

export type GetTimelineReturn = {
  createdAt: number | undefined;
  publicId: string | undefined;
  limit: number;
};

export const createTimelineService = ({
  repository,
}: CreateTimelineServiceParams) => {
  return {
    getTimeline: async (queryParams: TimelineQueryParams) => {
      const { createdAt, publicId } = decodeCursorParts(queryParams.cursor);
      const currentLimit = queryParams.limit ?? 20;
      const timelineData = await repository.findAll({
        createdAt,
        publicId,
        limit: currentLimit + 1,
      } satisfies GetTimelineReturn);

      const result = createTimelineModel({
        currentLimit: currentLimit,
        items: timelineData,
      });

      if (result._tag === "Success") {
        return {
          items: result.value.items.map((item) => {
            return {
              publicId: item.publicId,
              createdAt: item.createdAt,
            };
          }),
          nextCursor: result.value.nextCursor,
          hasMoreItems: result.value.hasMoreItems,
        };
      }

      return "Invariant violation" as const
    },
  };
};
