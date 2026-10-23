import enEngagement from 'src/engagement/i18n/en.json';
import { AppRoutes } from 'src/routing/Routes';
import { renderWithProviders } from 'src/test/renderWithProviders';
import enTimeline from 'src/timeline/i18n/en.json';
import { timelineMockItems } from 'src/timeline/mocks/fixtures';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import Timeline from './Timeline';

const feed = () => page.getByRole('feed', { name: 'Timeline feed' });

describe('Timeline', () => {
  it('loads timeline items automatically on scroll in mobile viewport', async () => {
    await page.viewport(414, 896);

    await renderWithProviders(<Timeline />);

    await expect.poll(() => feed().getByRole('listitem').length).toBe(10);
    await expect
      .element(page.getByText(enTimeline['timeline.endOfTimeline']))
      .not.toBeInTheDocument();

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    });

    await expect
      .poll(() => feed().getByRole('listitem').length)
      .toBe(timelineMockItems.length);

    const lastItem = timelineMockItems[timelineMockItems.length - 1];
    await expect
      .element(
        feed().getByRole('listitem').filter({ hasText: lastItem.username }),
      )
      .toBeVisible();
    await expect
      .element(page.getByText(enTimeline['timeline.endOfTimeline']))
      .toBeVisible();
  });

  it('should display the details when list item is clicked', async () => {
    await page.viewport(414, 896);

    await renderWithProviders(<AppRoutes />, { path: '/*' });

    const [firstPost] = timelineMockItems;
    await userEvent.click(feed().getByRole('listitem').first());

    await expect
      .element(
        page.getByRole('heading', {
          name: enTimeline['postDetail.title'],
        }),
      )
      .toBeVisible();
    await expect.element(feed()).not.toBeInTheDocument();
    await expect.element(page.getByText(firstPost.content)).toBeVisible();
  });

  it('likes a post from the list without opening it', async () => {
    await page.viewport(414, 896);

    await renderWithProviders(<AppRoutes />, { path: '/*' });

    const firstItem = feed().getByRole('listitem').first();
    await userEvent.click(
      firstItem.getByRole('button', {
        name: enEngagement['engagement.like.ariaLabel'],
      }),
    );

    await expect
      .element(
        firstItem.getByRole('button', {
          name: enEngagement['engagement.unlike.ariaLabel'],
        }),
      )
      .toBeVisible();
    await expect.element(feed()).toBeInTheDocument();
  });
});
