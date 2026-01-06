import { userEvent, page } from "vitest/browser";
import { describe, it } from "vitest";
import { render } from "vitest-browser-react";

import { ShellNav } from "./ShellNav";
import { TestI18nProvider, TestQueryProvider, TestRouterProvider } from "src/test/testProvider";

describe("ShellNav - header for application shell", () => {
  it("should open the sidebar menu upon clicking on the hamburger menu", async () => {
    render(
      <TestQueryProvider>
        <TestRouterProvider>
          <TestI18nProvider>
            <ShellNav />
          </TestI18nProvider>
        </TestRouterProvider>
      </TestQueryProvider>
    );
    const hamburger = await page.getByRole("button", { name: "Toggle menu" });

    await userEvent.click(hamburger);
  });
});
