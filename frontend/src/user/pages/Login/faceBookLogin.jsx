import React,{useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import FacebookLogin from '@greatsumini/react-facebook-login';
import {
    useFaceBookLoginMutation
  } from "../../../Shared/redux/userSlices/userSlice";
import { setCredentials } from "../../../Shared/redux/userSlices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const FaceBookLoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [faceBookLogin, { isLoading }] = useFaceBookLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);
const appId = process.env.REACT_APP_FACEBOOK_APP_ID
    useEffect(() => {
      if (userInfo) {
        navigate("/home");
      }
    }, [navigate, userInfo]);

  const handleLoginSuccess = async (response) => {
    console.log('Login Success!', response);
    try {
    const userData = await faceBookLogin({accessToken: response.accessToken,userID:response.userID}).unwrap();
     dispatch(
        setCredentials({
          _id: userData._id,
          username: userData.username,
          emailId: userData.emailId,
          profilename:userData.profilename,
          Bio: userData.Bio,
          privatePublic:userData.privatePublic,
          profilePic:userData.profilePic,
          token: userData.token,
          postsByUser:userData.postsByUser,
          isPremium:userData.isPremium,
          paymentStatus:userData.paymentStatus,
          isVerified:userData.isVerified
        })
      );
      navigate("/home");
    } catch (error) {
        toast.error(error?.data?.message || "Invalid email or password");
      }
  };

  const handleLoginFail = (error) => {
    console.log('Login Failed!', error);
    // Add your logic for handling login failure here
  };

  const handleProfileSuccess = (response) => {
    console.log('Get Profile Success!', response);
    // Add your logic for handling successful profile retrieval here
  };

  return (
    <div>
      <FacebookLogin
        appId={appId}
        onSuccess={handleLoginSuccess}
        onFail={handleLoginFail}
        onProfileSuccess={handleProfileSuccess}
        style={{
          backgroundColor: '#4267b2',
          color: '#fff',
          fontSize: '16px',
          padding: '12px 14px',
          border: 'none',
          borderRadius: '6px',
          marginBottom:25
        }}
      />
    </div>
  );
};

export default FaceBookLoginPage;
