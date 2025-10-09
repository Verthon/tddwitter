import { userEvent } from "@vitest/browser/context";
import { describe, it } from "vitest";
import { render } from "vitest-browser-react";

import { ShellNav } from "./ShellNav";
import { I18nProvider } from "src/i18n/I18nProvider";
import { MemoryRouter } from "react-router";

describe("ShellNav - header for application shell", () => {
  it("should open the sidebar menu upon clicking on the hamburger menu", async () => {
    const { getByRole } = render(
      <MemoryRouter>
        <I18nProvider>
          <ShellNav />
        </I18nProvider>
      </MemoryRouter>
    );
    const hamburger = await getByRole("button", { name: "Toggle menu" });

    await userEvent.click(hamburger);
  });
});
