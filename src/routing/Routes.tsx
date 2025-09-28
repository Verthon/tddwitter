import { lazy, Suspense, type JSX } from "react";
import { Routes, Route, Outlet } from "react-router";

import { PageLoader } from "../ui/PageLoader/PageLoader";

import { routesConfig } from "./routesConfig";

type LazyComponent = React.LazyExoticComponent<() => JSX.Element>;

const TimelinePage: LazyComponent = lazy(
  () => import(/* webpackChunkName: "timeline-page" */ "../timeline/Timeline")
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
      </Route>
    </Routes>
  </Suspense>
);
