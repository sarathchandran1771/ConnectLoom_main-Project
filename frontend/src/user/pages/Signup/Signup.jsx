//src/user/Signup/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate,useParams,Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation, useVerifyEmailMutation, useGoogleAuthMutation } from '../../../Shared/redux/userSlices/userSlice';
import { setCredentials } from '../../../Shared/redux/userSlices/authSlice';
import { GoogleLogin,GoogleOAuthProvider } from '@react-oauth/google';
import "./Signup.css";
import instagramLogo from "../../Icons/instagram_black.png";
import { toast } from 'react-toastify';


function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailId, setemailId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const [error, setError] = useState('');
  const { emailToken } = useParams();

//workSpace
const [googleAuth] = useGoogleAuthMutation();
const responseGoogle = (response) => {
  console.log("Client_ID_responseGoogle",response);
  if (response && response.profileObj) {
    console.log("Dispatching googleAuth action with profileObj:", response.profileObj);
    dispatch(googleAuth(response.profileObj));
  }
};

//workSpace


  const [register, { isLoading }] = useRegisterMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        if (emailToken) {
          setVerificationStatus(true);
          const response = await verifyEmail({ emailToken }).unwrap();
          setVerificationStatus(false);
          console.log("verifyEmailToken verify", response);
          dispatch(setCredentials(response));
          navigate('/home');
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setError("Error verifying email");
      }
    };

    if (!userInfo?.isVerified) {
      verifyEmailToken();
    }
  }, [emailToken, userInfo, verifyEmail, dispatch, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ username, emailId, password }).unwrap();
      console.log("res",res)
      dispatch(setCredentials({ ...res }));
      navigate('/home');
    } catch (err) {
      const errorMessage = err?.data?.error || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };
  
  
  return (
    
    <div className='mainSignupPage'>
      <div style={{marginTop:"4%"}}>
        <div className='signupRight'>
          <img src={instagramLogo} className='instagramLogo' alt="" />
          <p style={{fontWeight:600, fontSize:18, marginTop:-15, marginLeft:10,textAlign:"center",color:"#737373"}}>
            Sign up to see photos and videos from your friends.
          </p>

<GoogleOAuthProvider   clientId='538914185784-lvkjflgma50ikctonctvmb4fb9v4rgaq.apps.googleusercontent.com'>
<GoogleLogin
  buttonText="Login with Google"
  onSuccess={responseGoogle}
  onFailure={responseGoogle}
  cookiePolicy={'single_host_origin'}
/>

</GoogleOAuthProvider>

          <div style={{display:"flex"}}>
            <hr style={{height:0.1,width:120, marginTop:27}}/>
            <p style={{color:"#7c7580"}}>OR</p>
            <hr style={{height:0.1,width:120, marginTop:27}}/>
          </div>

          <div style={{marginLeft:20}}>
            <input
              type="text"
              placeholder='Mobile number, emailId'
              className='inputSignUpPage'
              value={emailId}
              onChange={(e) => setemailId(e.target.value)}
            />
            <input
              type="text"
              placeholder='Username'
              className='inputSignUpPage'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder='Password'
              className='inputSignUpPage'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <p style={{width:"90%", color:"#A8A8A8", fontSize:13, marginLeft:10, textAlign:'center' }}>
            People who use our service may have uploaded your contact information to ConnectLoom
          </p>

          <button
              className='LoginButton'
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </div>
      </div>
      {/* workspace */}
      <div>
  {verificationStatus ? (
    <p>It is loading</p>
  ) : (
    <div>
      {userInfo?.isVerified ? (
        <Link to='/home'>Click next</Link>
      ) : (
        <div>
          {error ? (
            <p>{error}</p>
          ) : null}
        </div>
      )}
    </div>
  )}
</div>

      {/* workspace */}
    </div>

  );
}

export default Signup;

