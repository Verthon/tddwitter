import type { ReadonlyProps } from "@/common/ReadonlyProps.js";
import type { TimelineItem } from "./TimelineItem.js";

type ComputeCursorMetaFieldsProps = ReadonlyProps<{
  sortedItems: TimelineItem[];
  currentLimit: number;
}>;

export const computeCursorMetaFields = ({
  sortedItems,
  currentLimit,
}: ComputeCursorMetaFieldsProps) => {
  const hasMoreItems = sortedItems.length > currentLimit;
  const cursorItem = hasMoreItems
    ? sortedItems.at(currentLimit - 1)
    : null;
  const nextCursor = cursorItem
    ? { createdAt: cursorItem.createdAt, id: cursorItem.id }
    : null;

  return {
    hasMoreItems,
    nextCursor,
  };
};
