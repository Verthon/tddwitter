import type { ReadonlyProps } from "@/common/ReadonlyProps.js";

import type { TimelineItemRaw } from "./TimelineItemRaw.js";
import { compareTimelineItems } from "./compareTimelineItems.js";
import { sliceLastTimelineItem } from "./sliceLastTimelineItem.js";
import { computeCursorMetaFields } from "./computeCursorMetaFields.js";

type CreateTimelineModelProps = ReadonlyProps<{
  items: TimelineItemRaw[];
  currentLimit: number;
}>;

export const createTimelineModel = ({
  items,
  currentLimit,
}: CreateTimelineModelProps) => {
  const sortedItems = items.toSorted(compareTimelineItems);
  const currentItems = sliceLastTimelineItem({ sortedItems });
  const { hasMoreItems, nextCursor } = computeCursorMetaFields({
    currentLimit,
    sortedItems,
  });

  return {
    items: currentItems,
    hasMoreItems,
    nextCursor,
  };
};
