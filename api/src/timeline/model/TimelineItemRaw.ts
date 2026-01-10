type TimelineItemId = string;
type TimelineItemCreatedAt = number;

export type TimelineItemRaw = {
  id: TimelineItemId;
  publicId: string;
  createdAt: TimelineItemCreatedAt;
};