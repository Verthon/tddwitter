import enCore from 'src/core/i18n/en.json';
import { renderWithProviders } from 'src/test/renderWithProviders';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('allows user to login with email and password and redirects to homepage', async () => {
    await renderWithProviders(<LoginPage />, { route: '/login' });

    await userEvent.fill(
      page.getByLabelText(enCore['core.auth.login.emailLabel']),
      'user@example.com',
    );
    await userEvent.fill(
      page.getByLabelText(enCore['core.auth.login.passwordLabel']),
      'password123',
    );
    await userEvent.click(
      page.getByRole('button', {
        name: enCore['core.auth.login.submitButton'],
      }),
    );

    await expect.element(page.getByTestId('location')).toHaveTextContent('/');
  });
});
