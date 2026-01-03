import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { HttpResponse } from 'msw';

import { LikeButton } from "../LikeButton";
import { TestQueryProvider, TestI18nProvider } from "src/test/testProvider";
import { mockEngagementResponse } from "../../mocks/mockEngagementResponse";

describe("LikeButton", () => {
  it("renders unfilled heart icon when not liked", async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-1/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 5 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeButton postId="test-post-1" />
        </TestI18nProvider>
      </TestQueryProvider>
    );

    const button = page.getByRole("button", { name: /like/i });
    await expect.element(button).toBeVisible();
  });

  it("renders filled heart icon when liked", async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-2/like',
      HttpResponse.json(
        { isLiked: true, likeCount: 12 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeButton postId="test-post-2" />
        </TestI18nProvider>
      </TestQueryProvider>
    );

    const button = page.getByRole("button", { name: /unlike/i });
    await expect.element(button).toBeVisible();
  });

  it("toggles like state when clicked", async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-3/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 3 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    mockEngagementResponse(
      'post',
      '/posts/test-post-3/like',
      HttpResponse.json(
        { isLiked: true, likeCount: 4 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeButton postId="test-post-3" />
        </TestI18nProvider>
      </TestQueryProvider>
    );

    const button = page.getByRole("button", { name: /like/i });
    await expect.element(button).toBeVisible();

    await userEvent.click(button);

    const unlikeButton = page.getByRole("button", { name: /unlike/i });
    await expect.element(unlikeButton).toBeVisible();
  });
});
