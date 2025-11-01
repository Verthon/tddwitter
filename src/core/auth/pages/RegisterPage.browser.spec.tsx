import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import {
  TestI18nProvider,
  TestQueryProvider,
  TestRouterProvider,
} from "src/test/testProvider";

import RegisterPage from "./RegisterPage";

describe('RegisterPage', () => {
  it('allows user to register with username, email, password, and confirmation, then redirects to homepage', async () => {
    render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <RegisterPage />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    const usernameInput = page.getByLabelText(/username/i);
    const emailInput = page.getByLabelText(/email/i);
    const passwordInput = page.getByLabelText(/^password$/i);
    const confirmPasswordInput = page.getByLabelText(/confirm password/i);
    const submitButton = page.getByRole('button', { name: /sign up/i });

    await userEvent.fill(usernameInput, 'johndoe');
    await userEvent.fill(emailInput, 'john@example.com');
    await userEvent.fill(passwordInput, 'password123');
    await userEvent.fill(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    await expect.poll(() => window.location.pathname).toBe('/');
  });
})
