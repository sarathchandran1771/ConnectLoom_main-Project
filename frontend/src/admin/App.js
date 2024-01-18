// ./admin/app.js
import { useState,useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./pages/global/topbar";
import Sidebar from "./pages/global/sidebar";
import AdminLogin from "./pages/adminLogin/adminLogin";
import Dashboard from "./pages/dashboard/dashboard";
import UserManagement from "./pages/usermanagement/users.jsx";
import PostReportManagement from "./pages/postManagement/postReport.js";
import AdvertisementUpload from "./pages/advertisement_Upload/adsUpload.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import  './app.css'

function AdminRoutes() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenAndRedirect = () => {
      const token = localStorage.getItem("adminToken");
      const currentPath = window.location.pathname;

      if (!token && currentPath !== "/admin/adminLogin") {
        navigate("/admin/adminLogin");
      }
    };
    checkTokenAndRedirect();
    const handlePopstate = () => {
      checkTokenAndRedirect();
    };
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [navigate]);
  const token = localStorage.getItem("adminToken");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {token ? (
          <div className="app">
            <div className="sidebar-wrapper">
              <Sidebar isSidebar={isSidebar} />
            </div>
            <div className="main-wrapper">
              <Topbar setIsSidebar={setIsSidebar} />
              <main className="content">
                <Routes>
                 <Route path="/dashboard" element={<Dashboard />} /> 
                <Route path="/user-Management" element={<UserManagement />} />
                <Route path="/post-Management" element={<PostReportManagement />} />  
                <Route path="/ads-Upload" element={<AdvertisementUpload />} />  
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/adminLogin" element={<AdminLogin />} />
          </Routes>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminRoutes;