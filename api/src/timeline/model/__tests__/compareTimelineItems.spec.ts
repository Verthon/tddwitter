import { compareTimelineItems } from "../compareTimelineItems.js";

describe("compareTimelineItems - given any two timeline items determine which goes first", () => {
  it("orders newer items before older ones", () => {
    const older = { id: "1", createdAt: 1_320_000 };
    const newer = { id: "2", createdAt: 1_430_000 };

    expect(compareTimelineItems(newer, older)).toBeLessThan(0);
  });

  it("places older items after newer ones ", () => {
    const older = { id: "1", createdAt: 1_320_000 };
    const newer = { id: "2", createdAt: 1_430_000 };

    expect(compareTimelineItems(older, newer)).toBeGreaterThan(0);
  });

  it("uses id as a tie-breaker when createdAt is equal (higher id first)", () => {
    const higherId = { id: "13", createdAt: 1_320_000 };
    const lowerId = { id: "12", createdAt: 1_320_000 };

    expect(compareTimelineItems(higherId, lowerId)).toBeLessThan(0);
    expect(compareTimelineItems(lowerId, higherId)).toBeGreaterThan(0);
  });

  it("treats identical items as equal in ordering", () => {
    const a = { id: "1", createdAt: 1_320_000 };
    const b = { id: "1", createdAt: 1_320_000 };

    expect(compareTimelineItems(a, b)).toBe(0);
  });
});
