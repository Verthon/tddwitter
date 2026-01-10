import { computeCursorMetaFields } from "../computeCursorMetaFields.js";

describe("computeCursorMetaFields", () => {
  it("informs about end of the timeline when there is no more items", () => {
    expect(
      computeCursorMetaFields({
        sortedItems: [
          { id: "2", publicId: "post-2", createdAt: 1710000000000 },
          { id: "1", publicId: "post-1", createdAt: 1700000000000 },
        ],
        currentLimit: 5,
      })
    ).toStrictEqual({ hasMoreItems: false, nextCursor: null });
  });

  it("informs that there are more items on the next cursor", () => {
    expect(
      computeCursorMetaFields({
        sortedItems: [
          { id: "2", publicId: "post-2", createdAt: 1710000000006 },
          { id: "80", publicId: "post-80", createdAt: 1710000000005 },
          { id: "14", publicId: "post-14", createdAt: 1710000000004 },
          { id: "5", publicId: "post-5", createdAt: 1710000000003 },
          { id: "3", publicId: "post-3", createdAt: 1710000000002 },
          { id: "1", publicId: "post-1", createdAt: 1710000000001 },
        ],
        currentLimit: 5,
      })
    ).toStrictEqual({
      hasMoreItems: true,
      nextCursor: { createdAt: 1710000000002, id: "3" },
    });
  });
});
