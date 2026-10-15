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
  if (items.length > currentLimit + 1) {
    throw new Error(
      "Invariant violation: The number of items exceeds the limit + 1."
    );
  }

  const sortedItems = items.toSorted(compareTimelineItems);
  const currentItems = sliceLastTimelineItem({ sortedItems, currentLimit });
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
