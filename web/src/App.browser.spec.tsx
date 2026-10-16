import { Dialog } from '@base-ui/react/dialog';
import { useState } from 'react';
import { renderWithProviders } from 'src/test/renderWithProviders';
import enTimeline from 'src/timeline/i18n/en.json';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { App } from './App';

const PortalledPopup = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <Dialog.Root defaultOpen modal={false}>
      <Dialog.Portal>
        <Dialog.Popup
          aria-label="Popup"
          className="fixed inset-x-0 top-0 h-48 bg-white"
        >
          <button
            type="button"
            className="size-full"
            onClick={() => setClicked(true)}
          >
            {clicked ? 'Clicked' : 'Click me'}
          </button>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

describe('App', () => {
  it('keeps portalled popups above the app z-index layers', async () => {
    await page.viewport(414, 896);
    await renderWithProviders(
      <>
        <App />
        <PortalledPopup />
      </>,
      { route: '/', path: '/*' },
    );

    await expect
      .element(
        page.getByRole('heading', { name: enTimeline['timeline.heading'] }),
      )
      .toBeVisible();

    await userEvent.click(page.getByRole('button', { name: 'Click me' }), {
      timeout: 2000,
    });

    await expect
      .element(page.getByRole('button', { name: 'Clicked' }))
      .toBeVisible();
  });
});
