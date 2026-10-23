import enComposer from 'src/composer/i18n/en.json';
import { renderWithProviders } from 'src/test/renderWithProviders';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { CreatePostPage } from './pages/CreatePostPage';

describe('CreatePost', () => {
  it('fills the create post form with content', async () => {
    await page.viewport(414, 896);

    await renderWithProviders(<CreatePostPage />, { route: '/create-post' });

    const textarea = page.getByLabelText(enComposer['composer.form.label']);
    await expect.element(textarea).toBeVisible();

    await userEvent.fill(
      textarea,
      'This is my first post on this Twitter clone!',
    );

    await expect
      .element(textarea)
      .toHaveValue('This is my first post on this Twitter clone!');

    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent(
        enComposer['composer.form.charCount']
          .replace('{remaining}', '256')
          .replace('{max}', '300'),
      );

    const submitButton = page.getByRole('button', {
      name: enComposer['composer.button.tweet'],
    });
    await expect.element(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    await expect.element(page.getByTestId('location')).toHaveTextContent('/');
  });
});
