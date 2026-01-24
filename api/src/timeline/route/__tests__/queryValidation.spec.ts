import { parseTimelineQuery } from "../queryValidation.js";

describe("queryValidation", () => {
  describe("timeline", () => {
    it("should reject a query-less input from the client", () => {
      //@ts-expect-error runtime have no mercy
      expect(parseTimelineQuery()).toEqual({
        valid: false,
        reason: "Query cannot be empty",
      });
    });

    it("should reject query with id-less cursor", () => {
      expect(parseTimelineQuery({ cursor: 1234 })).toEqual({
        valid: false,
        reason: "Cursor must be a string or null",
      });
    });

    it("should reject cursor with non-numeric timestamp", () => {
      const result = parseTimelineQuery({ cursor: "abc_post_118" });
      expect(result).toEqual({
        valid: false,
        reason: "Invalid cursor format",
      });
    });

    it("should reject cursor with negative timestamp", () => {
      const result = parseTimelineQuery({ cursor: "-1766929065299_post_118" });
      expect(result).toEqual({
        valid: false,
        reason: "Invalid cursor format",
      });
    });

    it("should reject cursor missing delimiter", () => {
      const result = parseTimelineQuery({ cursor: "1766929065299post_118" });
      expect(result).toEqual({
        valid: false,
        reason: "Invalid cursor format",
      });
    });

    it("should reject query when the limit exceeds the maximum(100)", () => {
      expect(
        parseTimelineQuery({
          cursor: "1766929065299_public_id_here",
          limit: "101",
        }),
      ).toEqual({
        valid: false,
        reason: "Limit exceeds the maximum",
      });
    });

    it("should reject query when the limit is less than minimum(1)", () => {
      expect(
        parseTimelineQuery({
          cursor: "1766929065299_public_id_here",
          limit: "0",
        }),
      ).toEqual({
        valid: false,
        reason: "Limit is less than minimal value",
      });
    });

    it("should pass the empty limit and valid cursor", () => {
      expect(
        parseTimelineQuery({
          cursor: "1766929065299_public_id_here",
        }),
      ).toEqual({
        valid: true,
        data: { cursor: "1766929065299_public_id_here", limit: undefined },
      });
    });

    it("should pass the empty limit and null cursor when user hit timeline for the first time", () => {
      expect(
        parseTimelineQuery({
          cursor: undefined,
        }),
      ).toEqual({
        valid: true,
        data: { cursor: undefined, limit: undefined },
      });
    });
  });
});
