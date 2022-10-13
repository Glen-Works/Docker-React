import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';

import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Pages
const Overview = Loader(lazy(() => import('src/content/overview')));

// Status
const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

//login
const SignInSide = Loader(
  lazy(() => import('src/content/Login'))
);

//jwt Auth
const JwtAuth = Loader(
  lazy(() => import('src/content/JwtAuth'))
);

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <SignInSide />
  },
  {
    path: '500',
    element: <Status500 />
  },
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <JwtAuth />, // jwt權限 判斷
        children: [
          {
            path: '/',
            element: <Overview />
          },
          {
            path: 'overview',
            element: <Navigate to="/" replace />
          },
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          },
          {
            path: '*',
            element: <Status404 />
          }
        ]
      }
    ]
  }
];

export default routes;
