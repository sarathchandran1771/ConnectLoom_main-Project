// ./admin/MyRoutes.js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import your admin pages dynamically
const AdminLogin = React.lazy(() => import('./pages/adminLogin/adminLogin'));
const Dashboard = React.lazy(() => import('./pages/dashboard/dashboard'));
const UserManagement = React.lazy(() => import('./pages/usermanagement/users.jsx'));

const router = createBrowserRouter([
  {
    path: '/adminLogin',
    element: <AdminLogin />,
    loader: () => import('./pages/adminLogin/adminLogin'),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
        loader: () => import('./pages/dashboard/dashboard'),
      },
      {
        path: '/userManagement',
        element: <UserManagement />,
        loader: () => import('./pages/usermanagement/users.jsx'),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

export default router;
