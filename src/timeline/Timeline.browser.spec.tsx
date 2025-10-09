import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "@vitest/browser/context";

import {
  TestI18nProvider,
  TestQueryProvider,
  TestRouterProvider,
} from "src/test/testProvider";

import Timeline from "./Timeline";

describe("Timeline", () => {
  it("loads timeline items automatically on scroll in mobile viewport", async () => {
    await page.viewport(414, 896);

    const screen = await render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <Timeline />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    await expect
      .poll(
        () => document.querySelectorAll('[data-testid="timeline-item"]').length
      )
      .toBe(7);

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    });

    await expect
      .poll(
        () => document.querySelectorAll('[data-testid="timeline-item"]').length,
        { timeout: 5000 }
      )
      .toBe(15);

    await expect.element(page.getByText(/davidops/i)).toBeVisible();
    await expect
      .element(screen.getByText(/you've reached the end/i))
      .toBeVisible();
  });
});
