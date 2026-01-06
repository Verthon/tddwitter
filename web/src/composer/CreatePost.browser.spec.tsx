import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import {
  TestI18nProvider,
  TestQueryProvider,
  TestRouterProvider,
} from "src/test/testProvider";

import { CreatePostPage } from "./pages/CreatePostPage";

describe("CreatePost", () => {
  it("fills the create post form with content", async () => {
    await page.viewport(414, 896);

    await render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <CreatePostPage />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    const textarea = page.getByPlaceholder(/what's happening/i);
    await expect.element(textarea).toBeVisible();

    await textarea.fill("This is my first post on this Twitter clone!");

    await expect
      .element(textarea)
      .toHaveValue("This is my first post on this Twitter clone!");

    const charCount = page.getByText(/256 characters remaining out of 300/i);
    await expect.element(charCount).toBeVisible();

    const submitButton = page.getByRole("button", { name: /post/i });
    await expect.element(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    await expect.poll(() => globalThis.location.pathname).toBe("/");
  });
});
