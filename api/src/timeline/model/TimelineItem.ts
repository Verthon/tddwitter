import type { TimelineItemRaw } from "./TimelineItemRaw.js";

export type TimelineItem = Pick<
  TimelineItemRaw,
  "id" | "createdAt" | "publicId"
>;
