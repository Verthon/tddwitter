import { Hono } from "hono";

import { localizedMessage } from "@/i18n/localizedResponse.js";
import type { createTimelineService } from "../list/timelineService.js";
import { parseTimelineQuery } from "./queryValidation.js";

type CreateTimelineRoutesProps = {
  timelineService: ReturnType<typeof createTimelineService>;
};

export const createTimelineRoutes = ({
  timelineService,
}: CreateTimelineRoutesProps) => {
  const timelineRoutes = new Hono();

  timelineRoutes.get("/", async (c) => {
    const { limit, cursor } = c.req.query();
    const query = parseTimelineQuery({ limit, cursor });

    if (!query.valid) {
      return c.json({ error: localizedMessage({ en: query.reason }) }, 400);
    }

    const timeline = await timelineService.getTimeline(query.data);
    return c.json(timeline);
  });

  return timelineRoutes;
};
