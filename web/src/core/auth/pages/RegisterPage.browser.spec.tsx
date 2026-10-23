import enCore from 'src/core/i18n/en.json';
import { renderWithProviders } from 'src/test/renderWithProviders';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import RegisterPage from './RegisterPage';

const usernameField = () =>
  page.getByLabelText(enCore['core.auth.register.usernameLabel']);
const emailField = () =>
  page.getByLabelText(enCore['core.auth.register.emailLabel']);
const passwordField = () =>
  page.getByLabelText(enCore['core.auth.register.passwordLabel']);
const confirmPasswordField = () =>
  page.getByLabelText(enCore['core.auth.register.confirmPasswordLabel']);
const submitButton = () =>
  page.getByRole('button', { name: enCore['core.auth.register.submitButton'] });

describe('RegisterPage', () => {
  it('redirects to homepage after successful registration', async () => {
    await renderWithProviders(<RegisterPage />, { route: '/signup' });

    await userEvent.fill(usernameField(), 'johndoe');
    await userEvent.fill(emailField(), 'john@example.com');
    await userEvent.fill(passwordField(), 'password123');
    await userEvent.fill(confirmPasswordField(), 'password123');
    await userEvent.click(submitButton());

    await expect.element(page.getByTestId('location')).toHaveTextContent('/');
  });

  it('displays validation error for invalid email', async () => {
    await renderWithProviders(<RegisterPage />, { route: '/signup' });

    await userEvent.fill(usernameField(), 'johndoe');
    await userEvent.fill(emailField(), 'invalidemail');
    await userEvent.fill(passwordField(), 'password123');
    await userEvent.fill(confirmPasswordField(), 'password123');
    await userEvent.click(submitButton());

    await expect.element(emailField()).toBeInvalid();
    await expect.element(page.getByTestId('location')).not.toBeInTheDocument();
  });

  it('displays validation error for missing required fields', async () => {
    await renderWithProviders(<RegisterPage />, { route: '/signup' });

    await userEvent.click(submitButton());

    await expect.element(usernameField()).toBeInvalid();
    await expect.element(emailField()).toBeInvalid();
    await expect.element(passwordField()).toBeInvalid();
    await expect.element(confirmPasswordField()).toBeInvalid();
  });
});
