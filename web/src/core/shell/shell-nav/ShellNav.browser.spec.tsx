import enCore from 'src/core/i18n/en.json';
import { renderWithProviders } from 'src/test/renderWithProviders';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { ShellNav } from './ShellNav';

describe('ShellNav - header for application shell', () => {
  it('should open the sidebar menu upon clicking on the hamburger menu', async () => {
    await page.viewport(414, 896);
    await renderWithProviders(<ShellNav />);

    const sidebar = page
      .getByRole('complementary', { name: 'Sidebar navigation' })
      .getByRole('link', { name: enCore['core.nav.home'] });
    await expect.element(sidebar).not.toBeInViewport();

    await userEvent.click(
      page.getByRole('button', { name: enCore['core.toggleMenu'] }),
    );

    await expect.element(sidebar).toBeInViewport({ ratio: 1 });
  });
});
