import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import {
  TestI18nProvider,
  TestQueryProvider,
  TestRouterProvider,
} from "src/test/testProvider";

import LoginPage from "./LoginPage";

describe('LoginPage', () => {
  it('allows user to login with email and password and redirects to homepage', async () => {
    render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <LoginPage />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    const emailInput = page.getByLabelText(/email/i);
    const passwordInput = page.getByLabelText(/password/i);
    const submitButton = page.getByRole('button', { name: /log in/i });

    await userEvent.fill(emailInput, 'user@example.com');
    await userEvent.fill(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await expect.poll(() => globalThis.location.pathname).toBe('/');
  });
})