import { HttpResponse } from 'msw';
import enEngagement from 'src/engagement/i18n/en.json';
import { renderWithProviders } from 'src/test/renderWithProviders';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { mockEngagementResponse } from '../../mocks/mockEngagementResponse';
import { LikeButtonComponent as LikeButton } from '../LikeButton';

describe('LikeButton', () => {
  it('renders unfilled heart icon when not liked', async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-1/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 5 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await renderWithProviders(<LikeButton postId="test-post-1" />);

    const button = page.getByRole('button', {
      name: enEngagement['engagement.like.ariaLabel'],
      exact: true,
    });
    await expect.element(button).toBeVisible();
  });

  it('renders filled heart icon when liked', async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-2/like',
      HttpResponse.json(
        { isLiked: true, likeCount: 12 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await renderWithProviders(<LikeButton postId="test-post-2" />);

    const button = page.getByRole('button', {
      name: enEngagement['engagement.unlike.ariaLabel'],
      exact: true,
    });
    await expect.element(button).toBeVisible();
  });

  it('toggles like state when clicked', async () => {
    mockEngagementResponse(
      'get',
      '/posts/test-post-3/like',
      HttpResponse.json(
        { isLiked: false, likeCount: 3 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    mockEngagementResponse(
      'post',
      '/posts/test-post-3/like',
      HttpResponse.json(
        { isLiked: true, likeCount: 4 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await renderWithProviders(<LikeButton postId="test-post-3" />);

    const button = page.getByRole('button', {
      name: enEngagement['engagement.like.ariaLabel'],
      exact: true,
    });
    await expect.element(button).toBeVisible();

    await userEvent.click(button);

    const unlikeButton = page.getByRole('button', {
      name: enEngagement['engagement.unlike.ariaLabel'],
      exact: true,
    });
    await expect.element(unlikeButton).toBeVisible();
  });
});
