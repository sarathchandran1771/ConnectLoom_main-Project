// src/user/app.js
import Home from '../../user/pages/Home/Home';
import Login from '../../user/pages/login/Login.jsx';
import Signup from '../../user/pages/Signup/Signup';
import EmailVerificationPage from '../../user/pages/Signup/MailVerification.jsx';
import Explore from '../../user/pages/Explore/Explore';
import Profile from '../../user/pages/Profile/Profile';
import ProfileEditPage from '../../user/pages/ProfileEdit/profileEditPage.jsx';
import Forgetpassword from '../../user/pages/forgetPassword/forgetpassword.jsx';
import ResetPassword from '../../user/pages/resetPassword/resetPassword.jsx';
import PaymentPage from '../../user/pages/paymentForPremium/payment'
import SuccessPage from'../../user/utils/sucessAndCancel/successPage.js'
import CancelPage from'../../user/utils/sucessAndCancel/cancelPage'
import ChatPage from'../../user/pages/chat/ChatMessage.js'
import { Navigate } from 'react-router-dom';
import CheckingUserStatus from './userBlockCheck.js'

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
    element: <PrivateRoute element={<CheckingUserStatus element={<Home />} path="/home" />} />,
  },
  {
    path: '/explore',
    element: <PrivateRoute element={<CheckingUserStatus element={<Explore />} path="/explore" /> } />,
  },
  {
    path: '/profile',
    element: <PrivateRoute element={<CheckingUserStatus element={<Profile />} path="/profile" /> } />,
  },  
  {
    path: '/profile/:userId',
    element: <PrivateRoute element={<CheckingUserStatus element={<Profile />} path="/profile/:userId" /> } />,
  },  
  {
    path: '/editProfile',
    element: <PrivateRoute element={<CheckingUserStatus element={<ProfileEditPage />} path="/editProfile" /> } />,
  },
  {
    path: '/inbox',
    element: <PrivateRoute element={<CheckingUserStatus element={<ChatPage />} path="/inbox" /> } />,
  },
  {
    path: '/verifyemail/:emailToken',
    element: <EmailVerificationPage /> ,
  },
  {
    path: '/payments',
    element: <PaymentPage /> ,
  },
  {
    path: '/success',
    element: <SuccessPage /> ,
  },
  {
    path: '/cancel',
    element: <CancelPage /> ,
  },
];

export default userRoutes;
