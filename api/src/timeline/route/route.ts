import { Hono } from "hono";

import sql from "@/infra/db.js";
import { createTimelineItemRepository } from "../list/repository.js";
import { createTimelineService } from "../list/timelineService.js";
import { parseTimelineQuery } from "./queryValidation.js";

export const timelineRoutes = new Hono();

const timelineRepository = createTimelineItemRepository(sql);
const timelineService = createTimelineService({
  repository: timelineRepository,
});

timelineRoutes.get("/", async (c) => {
  const { limit, cursor } = c.req.query();

  const { valid, data, reason } = parseTimelineQuery({ limit, cursor });

  if (!valid) {
    return c.json({ message: { en: reason }}, 400);
  }

  const timeline = await timelineService.getTimeline(data);
  return c.json(timeline);
});
