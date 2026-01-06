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
  it('redirects to homepage after successful registration', async () => {
    render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <RegisterPage />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    await userEvent.fill(page.getByLabelText(/username/i), 'johndoe');
    await userEvent.fill(page.getByLabelText(/email/i), 'john@example.com');
    await userEvent.fill(page.getByLabelText(/^password$/i), 'password123');
    await userEvent.fill(page.getByLabelText(/confirm password/i), 'password123');
    await userEvent.click(page.getByRole('button', { name: /sign up/i }));

    await expect.poll(() => globalThis.location.pathname).toBe('/');
  });

  it('displays validation error for invalid email', async () => {
    render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <RegisterPage />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    await userEvent.fill(page.getByLabelText(/username/i), 'johndoe');
    await userEvent.fill(page.getByLabelText(/email/i), 'invalidemail');
    await userEvent.fill(page.getByLabelText(/^password$/i), 'password123');
    await userEvent.fill(page.getByLabelText(/confirm password/i), 'password123');
    await userEvent.click(page.getByRole('button', { name: /sign up/i }));

    await expect.element(page.getByLabelText(/email/i)).toBeInvalid();
  });

  it('displays validation error for missing required fields', async () => {
    render(
      <TestRouterProvider>
        <TestI18nProvider>
          <TestQueryProvider>
            <RegisterPage />
          </TestQueryProvider>
        </TestI18nProvider>
      </TestRouterProvider>
    );

    await userEvent.click(page.getByRole('button', { name: /sign up/i }));

    await expect.element(page.getByLabelText(/username/i)).toBeInvalid();
    await expect.element(page.getByLabelText(/email/i)).toBeInvalid();
    await expect.element(page.getByLabelText(/^password$/i)).toBeInvalid();
  });
})
