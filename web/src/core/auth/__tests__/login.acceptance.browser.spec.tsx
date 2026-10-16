import { HttpResponse, http } from 'msw';
import { apiBase } from 'src/api/apiBase';
import enCore from 'src/core/i18n/en.json';
import { worker } from 'src/integrations/mockServer';
import { AppRoutes } from 'src/routing/Routes';
import { renderWithProviders } from 'src/test/renderWithProviders';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import LoginPage from '../pages/LoginPage';

const EMAIL = 'user@example.com';
const PASSWORD = 'correct-horse-battery';
const ACCOUNT = { id: 1, email: EMAIL };

const emailField = () =>
  page.getByLabelText(enCore['core.auth.login.emailLabel']);
const passwordField = () =>
  page.getByLabelText(enCore['core.auth.login.passwordLabel']);
const submitButton = () =>
  page.getByRole('button', { name: enCore['core.auth.login.submitButton'] });

const submitCredentials = async () => {
  await userEvent.fill(emailField(), EMAIL);
  await userEvent.fill(passwordField(), PASSWORD);
  await userEvent.click(submitButton());
};

describe('Login page', () => {
  it('AC-LOGIN-19: sends the credentials to the same-origin /api/auth/login and goes to the home page', async () => {
    let body: unknown;
    worker.use(
      http.post(`${apiBase}/auth/login`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(ACCOUNT);
      }),
    );
    await renderWithProviders(<LoginPage />, { route: '/login' });

    await submitCredentials();

    await expect.poll(() => body).toEqual({ email: EMAIL, password: PASSWORD });
    await expect
      .element(page.getByTestId('location'))
      .toHaveTextContent(/^\/$/);
  });

  it('AC-LOGIN-20: shows the wrong-credentials alert and stays on the page when the API returns 401', async () => {
    worker.use(
      http.post(`${apiBase}/auth/login`, () =>
        HttpResponse.json(
          { error: { en: 'Invalid email or password' } },
          { status: 401 },
        ),
      ),
    );
    await renderWithProviders(<LoginPage />, { route: '/login' });

    await submitCredentials();

    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent(enCore['core.auth.login.error.invalidCredentials']);
    await expect.element(submitButton()).toBeEnabled();
    await expect.element(page.getByTestId('location')).not.toBeInTheDocument();
  });

  it('AC-LOGIN-21: shows the generic error alert and stays on the page when the API fails with 500', async () => {
    worker.use(
      http.post(`${apiBase}/auth/login`, () =>
        HttpResponse.json(
          { error: { en: 'Something went wrong' } },
          { status: 500 },
        ),
      ),
    );
    await renderWithProviders(<LoginPage />, { route: '/login' });

    await submitCredentials();

    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent(enCore['core.auth.login.error.generic']);
    await expect.element(submitButton()).toBeEnabled();
    await expect.element(page.getByTestId('location')).not.toBeInTheDocument();
  });

  it('AC-LOGIN-21: shows the generic error alert and stays on the page when the request fails', async () => {
    worker.use(http.post(`${apiBase}/auth/login`, () => HttpResponse.error()));
    await renderWithProviders(<LoginPage />, { route: '/login' });

    await submitCredentials();

    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent(enCore['core.auth.login.error.generic']);
    await expect.element(submitButton()).toBeEnabled();
    await expect.element(page.getByTestId('location')).not.toBeInTheDocument();
  });

  it('AC-LOGIN-22: a signed-out user who logs in sees the signed-in navigation, read from /api/auth/me', async () => {
    let signedIn = false;
    let meRequests = 0;
    worker.use(
      http.get(`${apiBase}/auth/me`, () => {
        meRequests += 1;
        return signedIn
          ? HttpResponse.json(ACCOUNT)
          : HttpResponse.json(
              { error: { en: 'Unauthorized' } },
              { status: 401 },
            );
      }),
      http.post(`${apiBase}/auth/login`, () => {
        signedIn = true;
        return HttpResponse.json(ACCOUNT);
      }),
    );
    const sidebarLoginLinks = () =>
      page.getByRole('link', {
        name: enCore['core.auth.sidebar.login'],
        exact: true,
      });
    const createPostLinks = () =>
      page.getByRole('link', { name: enCore['core.nav.createPost'] });
    await page.viewport(1280, 800);
    await renderWithProviders(<AppRoutes />, { route: '/login', path: '/*' });
    await expect.element(submitButton()).toBeVisible();
    await expect.poll(() => meRequests).toBeGreaterThan(0);
    await expect.poll(() => sidebarLoginLinks().length).toBeGreaterThan(0);
    expect(createPostLinks().length).toBe(0);

    await submitCredentials();

    await expect.poll(() => createPostLinks().length).toBeGreaterThan(0);
    await expect.poll(() => sidebarLoginLinks().length).toBe(0);
  });
});
