// adminRoutes.js
import React from "react";

 const Dashboard = React.lazy(() => import("../../admin/pages/dashboard/dashboard.jsx"));
const UserManagement = React.lazy(() => import("../../admin/pages/usermanagement/users.jsx"));
const PostReportManagement = React.lazy(() => import("../../admin/pages/postManagement/postReport.js"));
const AdminLogin = React.lazy(() => import("../../admin/pages/adminLogin/adminLogin"));

export const adminRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/user-Management", element: <UserManagement /> },
  { path: "/post-Management", element: <PostReportManagement /> },
];

export const loginRoute = { path: "/adminLogin", element: <React.Suspense fallback={<div>Loading...</div>}><AdminLogin /></React.Suspense> };
