import { decodeCursorParts } from "../decodeCursorParts.js";

describe("decodeCursorParts", () => {
  it("should return parts as undefined if the cursor from client is undefined", () => {
    expect(decodeCursorParts(undefined)).toEqual({
      createdAt: undefined,
      publicId: undefined,
    });
  });

  it("should return parts based on sent cursor from the client", () => {
    expect(decodeCursorParts("1766929065299_public_id_here")).toEqual({
      createdAt: 1766929065299,
      publicId: "public_id_here",
    });
  });
});
