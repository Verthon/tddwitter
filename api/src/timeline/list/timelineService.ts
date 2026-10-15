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

      const timeline = createTimelineModel({
        currentLimit: currentLimit,
        items: timelineData,
      });

      return {
        items: timeline.items.map((item) => ({
          publicId: item.publicId,
          createdAt: item.createdAt,
        })),
        nextCursor: timeline.nextCursor,
        hasMoreItems: timeline.hasMoreItems,
      };
    },
  };
};
