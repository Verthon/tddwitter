import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { render } from 'vitest-browser-react';

import { TestI18nProvider, TestQueryProvider } from './testProvider';

type RenderWithProvidersOptions = {
  route?: string;
  path?: string;
};

const LocationProbe = () => {
  const { pathname } = useLocation();
  return <output data-testid="location">{pathname}</output>;
};

export const renderWithProviders = (
  ui: ReactNode,
  { route = '/', path = route }: RenderWithProvidersOptions = {},
) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <TestI18nProvider>
        <TestQueryProvider>
          <Routes>
            <Route path={path} element={ui} />
            <Route path="*" element={<LocationProbe />} />
          </Routes>
        </TestQueryProvider>
      </TestI18nProvider>
    </MemoryRouter>,
  );
