import { expectFailure, expectSuccess } from "@/common/test-utils/result.js";
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

    const timeline = expectSuccess(result);

    expect(timeline.items).toStrictEqual([
      { id: "3", publicId: "post-3", createdAt: 3 },
      { id: "2", publicId: "post-2", createdAt: 2 },
    ]);
    expect(timeline.hasMoreItems).toBe(true);
    expect(timeline.nextCursor).toEqual({ createdAt: 2, id: "2" });
  });

  it("returns all items when the items count is equal to the limit", () => {
    const result = createTimelineModel({
      currentLimit: 3,
      items: [
        { id: "3", publicId: "post-3", createdAt: 3 },
        { id: "2", publicId: "post-2", createdAt: 2 },
        { id: "1", publicId: "post-1", createdAt: 1 },
      ],
    });

    const timeline = expectSuccess(result);

    expect(timeline.items).toStrictEqual([
      { id: "3", publicId: "post-3", createdAt: 3 },
      { id: "2", publicId: "post-2", createdAt: 2 },
      { id: "1", publicId: "post-1", createdAt: 1 },
    ]);
    expect(timeline.hasMoreItems).toBe(false);
    expect(timeline.nextCursor).toBeNull();
  });

  it("returns a failure if the items length violates the invariant", () => {
    const result = createTimelineModel({
      currentLimit: 2,
      items: [
        { id: "4", publicId: "post-4", createdAt: 4 },
        { id: "3", publicId: "post-3", createdAt: 3 },
        { id: "2", publicId: "post-2", createdAt: 2 },
        { id: "1", publicId: "post-1", createdAt: 1 },
      ],
    });

    const error = expectFailure(result);

    expect(error.message).toBe(
      "Invariant violation: The number of items exceeds the limit + 1."
    );
  });
});
