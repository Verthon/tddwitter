import { createTimelineModel } from "../model/createTimelineModel.js";
import type { TimelineQueryParams } from "../route/timelineQueryParams.js";
import { decodeCursorParts } from "./decodeCursorParts.js";
import type { TimelineCursorParams, TimelineItemRepository } from "./repository.js";

type CreateTimelineServiceParams = {
  repository: TimelineItemRepository;
};

export const createTimelineService = ({
  repository,
}: CreateTimelineServiceParams) => {
  return {
    getTimeline: async (queryParams: TimelineQueryParams) => {
      const { createdAt, publicId } = decodeCursorParts(queryParams.cursor);
      const currentLimit = queryParams.limit ?? 20;
      const timelineData = await repository.findAllCursorBased({
        createdAt,
        publicId,
        limit: currentLimit + 1,
      } satisfies TimelineCursorParams);

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
