import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import SuspenseLoader from 'src/components/SuspenseLoader';
import BaseLayout from 'src/layouts/BaseLayout';
import SidebarLayout from './layouts/SidebarLayout';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader isOpen={true} />}>
    <Component {...props} />
  </Suspense>
);
// Status
const Status404 = Loader(
  lazy(() => import('src/page/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/page/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/page/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/page/Status/Maintenance'))
);

//login
const SignInSide = Loader(
  lazy(() => import('src/page/Login'))
);

//AuthLayout
const AuthLayout = Loader(
  lazy(() => import('src/layouts/AuthLayout'))
);

// SampleContent
const SampleContent = Loader(
  lazy(() => import('src/page/Sample/SampleContent'))
);

// SampleDataTable
const SampleDataTable = Loader(
  lazy(() => import('src/page/Sample/SampleDataTable'))
);

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <SignInSide />
  },
  {
    path: '',
    element: <Navigate to="login" replace />
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
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <AuthLayout />, // jwt權限 判斷
        children: [
          {
            path: '',
            element: <SidebarLayout />,
            children: [
              {
                path: 'samplecontent',
                element: <SampleContent />
              },
              {
                path: 'sampledatatable',
                element: <SampleDataTable />
              },
              {
                path: '500',
                element: <Status500 />
              },
              {
                path: '*',
                element: <Status404 />
              }
            ]
          }
        ]
      }
    ]
  }
];

export default routes;
