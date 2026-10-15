import { describe, expect, it } from "vitest";

import { createTestApp } from "@/common/test-utils/http.js";
import { createInMemoryTimelineRepository } from "../../list/repository.js";
import { createTimelineService } from "../../list/timelineService.js";
import { createTimelineRoutes } from "../route.js";

const setup = () => {
  const timelineService = createTimelineService({
    repository: createInMemoryTimelineRepository([
      { id: "1", publicId: "post-1", createdAt: 1000 },
    ]),
  });
  return { app: createTestApp(createTimelineRoutes({ timelineService })) };
};

describe("GET /timeline", () => {
  it("returns 200 with the timeline", async () => {
    const { app } = setup();

    const res = await app.request("/");

    expect(res.status).toBe(200);
    expect(await res.json()).toStrictEqual({
      items: [{ publicId: "post-1", createdAt: 1000 }],
      nextCursor: null,
      hasMoreItems: false,
    });
  });

  it("returns 400 with the standard error body for an invalid query", async () => {
    const { app } = setup();

    const res = await app.request("/?limit=0");

    expect(res.status).toBe(400);
    expect(await res.json()).toStrictEqual({
      error: { en: "Limit is less than minimal value" },
    });
  });
});
