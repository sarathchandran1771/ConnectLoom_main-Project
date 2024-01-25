// src/user/userBlockCheck.js
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {useCheckUserBlockedStatusMutation} from '../redux/userSlices/userSlice'
import { logout } from "../redux/userSlices/authSlice";
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

 
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');
  return token && userInfo;
};

const userInfoString = localStorage.getItem('userInfo');
const userInfo = JSON.parse(userInfoString);


const CheckingUserStatus = ({ element }) => {
  const dispatch = useDispatch();
  const [userBlocked, { isLoading }] = useCheckUserBlockedStatusMutation();

  useEffect(() => {
    const checkUserBlockedStatus = async () => {
      try {
        const response = await userBlocked({userId:userInfo?._id});
        if (response?.data?.isVerified === false) {
            toast.success("User is not verified.Logging out...");
            dispatch(logout());
          }
      } catch (error) {
        console.error('Error checking user blocked status:', error);
      }
    };

    if (isAuthenticated()) {
      checkUserBlockedStatus();
    }
  }, []);

  return isAuthenticated() ? element : <Navigate to="/" replace />;
};


export default CheckingUserStatus;