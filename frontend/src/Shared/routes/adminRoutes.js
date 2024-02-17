// adminRoutes.js
import React from "react";

const Dashboard = React.lazy(() => import("../../admin/pages/dashboard/dashboard.jsx"));
const UserManagement = React.lazy(() => import("../../admin/pages/usermanagement/users.jsx"));
const PostReportManagement = React.lazy(() => import("../../admin/pages/postManagement/postReport.js"));
const AdminLogin = React.lazy(() => import("../../admin/pages/adminLogin/adminLogin"));
const AdvertisementUpload = React.lazy(() => import("../../admin/pages/advertisement_Upload/adsUpload.jsx"));
const ErrorPage = React.lazy(() => import('../../user/pages/error/ErrorPage.jsx')) 


export const adminRoutes = [
  { path: "/dashboard", element: <Dashboard /> ,errorElement: < ErrorPage />},
  { path: "/user-Management", element: <UserManagement /> },
  { path: "/post-Management", element: <PostReportManagement />},
  { path: "/adsUpload", element: <AdvertisementUpload /> },
];

export const loginRoute = { path: "/adminLogin", element: <React.Suspense fallback={<div>Loading...</div>}><AdminLogin /></React.Suspense> };
