import { createTimelineModel } from "../createTimelineModel.js";

describe("createTimelineModel", () => {
  it("returns a timeline slice with cursor pointing to the oldest item", () => {
    const result = createTimelineModel({
      currentLimit: 2,
      items: [
        { id: "3", publicId: "post-3", createdAt: 3 },
        { id: "2", publicId: "post-2", createdAt: 2 },
        { id: "1", publicId: "post-1", createdAt: 1 },
      ],
    });

    expect(result.items).toStrictEqual([
      { id: "3", publicId: "post-3", createdAt: 3 },
      { id: "2", publicId: "post-2", createdAt: 2 },
    ]);
    expect(result.hasMoreItems).toBe(true);
    expect(result.nextCursor).toEqual({ createdAt: 2, id: "2" });
  });
});
