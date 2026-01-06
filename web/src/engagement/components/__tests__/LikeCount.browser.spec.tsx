import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { HttpResponse } from 'msw';

import { LikeCount } from "../LikeCount";
import { TestQueryProvider, TestI18nProvider } from "src/test/testProvider";
import { mockEngagementResponse } from "../../mocks/mockEngagementResponse";

describe("LikeCount", () => {
  it("displays like count with proper formatting", async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-1/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 1230 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeCount postId="test-post-1" />
        </TestI18nProvider>
      </TestQueryProvider>
    );

    await expect.element(page.getByText("1230 likes")).toBeVisible();
  });

  it("displays zero likes correctly", async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-2/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 0 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeCount postId="test-post-2" />
        </TestI18nProvider>
      </TestQueryProvider>
    );

    await expect.element(page.getByText("0 likes")).toBeVisible();
  });

  it("displays single like correctly", async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-3/like',
      HttpResponse.json(
        { isLiked: true, likeCount: 1 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeCount postId="test-post-3" />
        </TestI18nProvider>
      </TestQueryProvider>
    );

    await expect.element(page.getByText("1 likes")).toBeVisible();
  });
});
