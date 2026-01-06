import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import {
  TestI18nProvider,
  TestQueryProvider,
  TestRouterProvider,
} from "src/test/testProvider";

import Timeline from "./Timeline";

describe("Timeline", () => {
  it("loads timeline items automatically on scroll in mobile viewport", async () => {
    await page.viewport(414, 896);

    await render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <Timeline />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    await expect
      .poll(() => page.getByRole("list").getByRole("listitem").length)
      .toBe(10);

    // Scroll to trigger loading more items
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    });

    // Wait for more items to load after scroll
    await expect
      .poll(() => page.getByRole("list").getByRole("listitem").length, {
        timeout: 5000,
      })
      .toBe(10);

    // Scroll again to see the end message
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    });

    await expect.element(page.getByText(/davidops/i)).toBeVisible();
    const status = page.getByRole("status");
    await expect.element(status).toHaveTextContent(/you've reached the end/i);
    await expect.element(status).toBeVisible();
  });

  it("should display the details when list item is clicked", async () => {
    await page.viewport(414, 896);

    await render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <Timeline />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    const firstItem = page
      .getByRole("list")
      .getByRole("listitem")
      .first();

    await userEvent.click(firstItem);
  });
});
