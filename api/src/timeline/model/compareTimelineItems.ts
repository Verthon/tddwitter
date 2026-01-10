import type { TimelineItem } from "./TimelineItem.js";

type CompareTimelineItemsItem = Pick<TimelineItem, "id" | "createdAt">;

export const compareTimelineItems = (
  first: CompareTimelineItemsItem,
  second: CompareTimelineItemsItem
) => {
  if (second.createdAt === first.createdAt) {
    return Number(second.id) - Number(first.id);
  }

  return second.createdAt - first.createdAt;
};
