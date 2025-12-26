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

const RegisterPage: LazyComponent = lazy(
  () => import(/* webpackChunkName: "register-page" */ '../core/auth/pages/RegisterPage'),
);

const CreatePostPage: LazyComponent = lazy(
  () => import(/* webpackChunkName: "create-post-page" */ '../composer/pages/CreatePostPage'),
);

const PostDetailPage: LazyComponent = lazy(
  () => import(/* webpackChunkName: "post-detail-page" */ '../timeline/pages/PostDetailPage'),
);

const NotFoundPage: LazyComponent = lazy(
  () => import(/* webpackChunkName: "not-found-page" */ '../core/pages/NotFoundPage'),
);

const RootLayout = () => (
  <Outlet />
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={routesConfig.home} element={<TimelinePage />} />
        <Route path={routesConfig.login} element={<LoginPage />} />
        <Route path={routesConfig.signup} element={<RegisterPage />} />
        <Route path={routesConfig.createPost} element={<CreatePostPage />} />
        <Route path={routesConfig.post} element={<PostDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);
