// src/user/app.js
import Home from '../../user/pages/Home/Home';
import Login from '../../user/pages/Login/Login';
import Signup from '../../user/pages/Signup/Signup';
import EmailVerificationPage from '../../user/pages/Signup/MailVerification.jsx';
import Explore from '../../user/pages/Explore/Explore';
import Profile from '../../user/pages/Profile/Profile';
import ProfileEditPage from '../../user/pages/ProfileEdit/profileEditPage.jsx';
import Forgetpassword from '../../user/pages/forgetPassword/forgetpassword.jsx';
import ResetPassword from '../../user/pages/resetPassword/resetPassword.jsx';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');

  return token && userInfo;
};

const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

const userRoutes = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgetpassword',
    element: <Forgetpassword />,
  },
  {
    path: '/resetPassword/:id/:token',
    element: <ResetPassword />,
  },
  {
    path: '/home',
    element: <PrivateRoute element={<Home />} path="/home" />,
  },
  {
    path: '/explore',
    element: <PrivateRoute element={<Explore />} path="/explore" />,
  },
  {
    path: '/Profile',
    element: <PrivateRoute element={<Profile />} path="/Profile" />,
  },
  {
    path: '/editProfile',
    element: <PrivateRoute element={<ProfileEditPage />} path="/editProfile" />,
  },
  {
    path: '/verifyemail/:emailToken',
    element: <EmailVerificationPage />,
  },
];

export default userRoutes;
