import type { ReadonlyProps } from "@/common/ReadonlyProps.js";

import type { TimelineItemRaw } from "./TimelineItemRaw.js";
import { compareTimelineItems } from "./compareTimelineItems.js";
import { sliceLastTimelineItem } from "./sliceLastTimelineItem.js";
import { computeCursorMetaFields } from "./computeCursorMetaFields.js";
import { failure, success } from "@/common/result/Result.js";

type CreateTimelineModelProps = ReadonlyProps<{
  items: TimelineItemRaw[];
  currentLimit: number;
}>;

type TimelineError = {
  readonly _tag: "TimelineError";
  readonly message: string;
};

const timelineError = (message: string): TimelineError => ({
  _tag: "TimelineError",
  message,
});

export const createTimelineModel = ({
  items,
  currentLimit,
}: CreateTimelineModelProps) => {
  if (items.length > currentLimit + 1) {
    return failure(
      timelineError(
        "Invariant violation: The number of items exceeds the limit + 1."
      )
    );
  }

  const sortedItems = items.toSorted(compareTimelineItems);
  const currentItems = sliceLastTimelineItem({ sortedItems, currentLimit });
  const { hasMoreItems, nextCursor } = computeCursorMetaFields({
    currentLimit,
    sortedItems,
  });

  return success({
    items: currentItems,
    hasMoreItems,
    nextCursor,
  });
};
