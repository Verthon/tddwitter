import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router';
import { PageLoader } from './ui/PageLoader/PageLoader';

type LazyComponent = React.LazyExoticComponent<() => JSX.Element>;

const TimelinePage: LazyComponent = lazy(() => import(/* webpackChunkName: "timeline-page" */ './timeline/Timeline'));

const RootLayout = () => (
  <>
    <Outlet />
  </>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<TimelinePage />} />
      </Route>
    </Routes>
  </Suspense>
);
