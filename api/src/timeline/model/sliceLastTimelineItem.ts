import type { ReadonlyProps } from "@/common/ReadonlyProps.js";
import type { TimelineItem } from "./TimelineItem.js";

type SliceLastTimelineItemProps = ReadonlyProps<{
  sortedItems: TimelineItem[];
  currentLimit: number;
}>;

export const sliceLastTimelineItem = ({
  sortedItems,
  currentLimit,
}: SliceLastTimelineItemProps) => {
  return sortedItems.slice(0, currentLimit);
};
