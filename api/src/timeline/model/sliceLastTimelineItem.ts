import type { ReadonlyProps } from "@/common/ReadonlyProps.js";
import type { TimelineItem } from "./TimelineItem.js";

type SliceLastTimelineItemProps = ReadonlyProps<{
  sortedItems: TimelineItem[];
}>;

export const sliceLastTimelineItem = ({
  sortedItems,
}: SliceLastTimelineItemProps) => {
  return sortedItems.slice(0, -1);
};
