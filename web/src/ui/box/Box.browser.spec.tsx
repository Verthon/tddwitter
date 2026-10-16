import { renderWithProviders } from 'src/test/renderWithProviders';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { Box } from './Box';

const renderBox = () =>
  renderWithProviders(
    <Box component="section" aria-label="Padded box" padding={[2, 6, 12]}>
      content
    </Box>,
  );

const paddingOf = () =>
  getComputedStyle(page.getByRole('region', { name: 'Padded box' }).element())
    .paddingTop;

describe('Box', () => {
  it('applies the mobile padding below the md breakpoint', async () => {
    await page.viewport(414, 896);
    await renderBox();

    await expect.poll(paddingOf).toBe('8px');
  });

  it('applies the tablet padding at the md breakpoint', async () => {
    await page.viewport(800, 896);
    await renderBox();

    await expect.poll(paddingOf).toBe('24px');
  });

  it('applies the desktop padding at the lg breakpoint', async () => {
    await page.viewport(1280, 896);
    await renderBox();

    await expect.poll(paddingOf).toBe('48px');
  });

  it('applies a single padding value at every breakpoint', async () => {
    await page.viewport(1280, 896);
    await renderWithProviders(
      <Box component="section" aria-label="Padded box" padding={4}>
        content
      </Box>,
    );

    await expect.poll(paddingOf).toBe('16px');
  });
});
