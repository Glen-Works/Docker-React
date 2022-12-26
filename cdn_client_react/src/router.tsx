import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import BaseLayout from 'src/layouts/BaseLayout';
import SuspenseLoaderRouter from './components/SuspenseLoaderRouter';
import SidebarLayout from './layouts/SidebarLayout';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoaderRouter />}>
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

//LoginLayout
const LoginLayout = Loader(
  lazy(() => import('src/layouts/LoginLayout'))
);

//Login
const Login = Loader(
  lazy(() => import('src/page/Login/Login'))
);

//Register
const Register = Loader(
  lazy(() => import('src/page/Login/Register'))
);

// //ResetPassword
// const ResetPassword = Loader(
//   lazy(() => import('src/page/Login/ResetPassword'))
// );

//Dashboard
const Dashboard = Loader(
  lazy(() => import('src/page/Dashboard'))
);

//AuthLayout
const AuthLayout = Loader(
  lazy(() => import('src/layouts/AuthLayout'))
);

//AuthMenuLayout
const AuthMenuLayout = Loader(
  lazy(() => import('src/layouts/AuthMenuLayout'))
);

// UserProfile page
const UserProfile = Loader(
  lazy(() => import('src/page/Client/Header/UserProfile/index'))
);

// User page
const User = Loader(
  lazy(() => import('src/page/Management/User/index'))
);

// Menu page
const Menu = Loader(
  lazy(() => import('src/page/Management/Menu/index'))
);

// Role page
const Role = Loader(
  lazy(() => import('src/page/Management/Role/index'))
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
    path: '',
    element: <LoginLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      // {
      //   path: 'reset/password',
      //   element: <ResetPassword />
      // },
    ]
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
        element: <AuthLayout />,  // jwt權限 判斷
        children: [
          {
            path: '',
            element: <AuthMenuLayout />,  // menu權限 判斷
            children: [
              {
                path: '',
                element: <SidebarLayout />,
                children: [
                  {
                    path: 'dashboard',
                    element: <Dashboard />
                  },
                  {
                    path: 'user/profile',
                    element: <UserProfile />
                  },
                  {
                    path: 'user',
                    element: <User />
                  },
                  {
                    path: 'menu',
                    element: <Menu />
                  },
                  {
                    path: 'role',
                    element: <Role />
                  },
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
    ]
  }
];

export default routes;
