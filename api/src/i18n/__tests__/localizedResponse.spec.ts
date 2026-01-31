import { localizedMessage } from "../localizedResponse.js";
import type { LocalizedMessage } from "../localizedResponse.js";

describe("localizedMessage", () => {
  it("should return a localized message with all required locales", () => {
    const result = localizedMessage({ en: "Hello" });

    expect(result).toEqual({ en: "Hello" });
  });

  it("should enforce the LocalizedMessage type", () => {
    const message: LocalizedMessage = localizedMessage({ en: "Test" });

    expect(message).toHaveProperty("en");
  });

  it("should work as a value in a domain error dictionary", () => {
    const errors = {
      passwordTooShort: localizedMessage({ en: "Too short" }),
      emailInvalid: localizedMessage({ en: "Invalid email" }),
    };

    expect(errors.passwordTooShort).toEqual({ en: "Too short" });
    expect(errors.emailInvalid).toEqual({ en: "Invalid email" });
  });
});
