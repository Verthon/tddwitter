import { type JSX, lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router';

import { PageLoader } from '../ui/PageLoader/PageLoader';

import { routesConfig } from './routesConfig';

type LazyComponent = React.LazyExoticComponent<() => JSX.Element>;

const TimelinePage: LazyComponent = lazy(
  () => import(/* webpackChunkName: "timeline-page" */ '../timeline/Timeline'),
);

const LoginPage: LazyComponent = lazy(
  () => import(/* webpackChunkName: "login-page" */ '../core/auth/pages/LoginPage'),
);

const RootLayout = () => (
  <>
    <Outlet />
  </>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={routesConfig.home} element={<TimelinePage />} />
        <Route path={routesConfig.login} element={<LoginPage />} />
      </Route>
    </Routes>
  </Suspense>
);
