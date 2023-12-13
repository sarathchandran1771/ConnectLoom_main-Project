import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useVerifyEmailMutation } from '../../../Shared/redux/userSlices/userSlice';
import { setCredentials } from '../../../Shared/redux/userSlices/authSlice';
import './EmailVerificationPage.css';
import { FaCheck, FaTimes } from 'react-icons/fa';




const EmailVerificationPage = () => {
  const { emailToken } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const [response, setResponse] = useState({ ok: false });
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();
  const { userInfo } = useSelector((state) => state.auth);


  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        console.log("Starting email verification...");
  

        const data = await verifyEmail({ emailToken }).unwrap();


        console.log("Verification data:", data);
  
        if (data.isVerified) {
          console.log('Email verified successfully.');
          setVerificationStatus('Email verified successfully.');
          dispatch(setCredentials(data));
          navigate('/home');
        } else {
          console.log('Email verification failed.');
          setVerificationStatus('Email verification failed.');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('An error occurred while verifying email.');
      }
    };
  
    if (!userInfo?.isVerified) {
      console.log('Initiating email verification...');
      verifyEmailToken();
    } else {
      console.log('Email already verified.');
      setVerificationStatus('Email already verified.');
    }
  }, [emailToken, userInfo, verifyEmail, dispatch, navigate]);
  

  return (
    <div className="verification-container">
      <h1>Email Verification</h1>
      <div className={`status-icon ${response.ok ? 'success' : 'failure'}`}>
        {response.ok ? <FaCheck className="success-icon" /> : <FaTimes className="failure-icon" />}
      </div>
      <p className={`status-message ${response.ok ? 'success' : 'failure'}`}>{verificationStatus}</p>
    </div>
  );
};

export default EmailVerificationPage;
