import { HttpResponse } from 'msw';
import { TestI18nProvider, TestQueryProvider } from 'src/test/testProvider';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { mockEngagementResponse } from '../../mocks/mockEngagementResponse';
import { LikeCount } from '../LikeCount';

describe('LikeCount', () => {
  it('displays like count with proper formatting', async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-1/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 1230 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeCount postId="test-post-1" />
        </TestI18nProvider>
      </TestQueryProvider>,
    );

    await expect.element(page.getByText('1,230 likes')).toBeVisible();
  });

  it('displays zero likes correctly', async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-2/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 0 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeCount postId="test-post-2" />
        </TestI18nProvider>
      </TestQueryProvider>,
    );

    await expect.element(page.getByText('0 likes')).toBeVisible();
  });

  it('displays single like correctly', async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-3/like',
      HttpResponse.json(
        { isLiked: true, likeCount: 1 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await render(
      <TestQueryProvider>
        <TestI18nProvider>
          <LikeCount postId="test-post-3" />
        </TestI18nProvider>
      </TestQueryProvider>,
    );

    await expect.element(page.getByText('1 like')).toBeVisible();
  });
});
