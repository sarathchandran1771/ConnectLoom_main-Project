//src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
 import store from './Shared/redux/store/store.js';
import { Route, Routes, BrowserRouter,Navigate } from 'react-router-dom';
import UserRoutes from './user/App';
import AdminRoutes from './admin/App'
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatProvider from './user/components/chat/chatContext/chatContext.js'; 
Modal.setAppElement('#root');

const isAdmin = window.location.pathname.includes('/admin');
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <ChatProvider>
        <Routes>
          {isAdmin ? (
            // If isAdmin is true, render the admin routes
            <>
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/*" element={<Navigate to="/user" />} />
            </>
          ) : (
            // If isAdmin is false, render the user routes
            <Route path="/*" element={<UserRoutes />} />
          )}
        </Routes>
        </ChatProvider>
      </BrowserRouter>
    </Provider>
    <ToastContainer />
  </React.StrictMode>
);
