// src/user/Signup/Signup.jsx
import React, { useState } from 'react';
import PasswordLockLogo from "../../Icons/forgetpasswordLock.png";
import { Link, useNavigate } from 'react-router-dom';
import "./forgetpassword.css";
import axios from 'axios';

const ForgetPassword = () => {
  const [emailId, setemailId] = useState('');
  const [isMailSent, setIsMailSent] = useState(false);
  const navigate = useNavigate();

  const handleForgetpassword = async (e) => {
    e.preventDefault();
  
    axios.post('http://localhost:5000/forgetPassword', { emailId })
      .then(res => {
        console.log("Response :", res.data);
        if (res.data.status === 'Token sent successfully') {
          console.log("Mail id is verified");
          setIsMailSent(true);
        }
      })
      .catch(err => console.log(err));
  };
  
  return (
<div className="mainForgetPasswordPage" >
<div style={{ marginTop: "4%", filter: isMailSent ? 'blur(5px)' : 'none' }}>
    <div className='forgetPasswordRight'>
      <img style={{}} src={PasswordLockLogo} className='instagramLogo' alt="" />
      <p style={{ fontWeight: 600, fontSize: 18, marginTop: -15, marginLeft: 10, textAlign: "center", color: "#000" }}>
        Trouble logging in?
      </p>
      <div style={{ marginLeft: 20 }}>
        <input
          type="email"
          placeholder='email Id'
          className='inputForForgetPassword'
          value={emailId}
          onChange={(e) => setemailId(e.target.value)}
        />
      </div>
      <button className='LoginButton' onClick={handleForgetpassword}>
        Send login Link
      </button>

      <div style={{ display: "flex" }}>
        <hr style={{ height: 0.1, width: 125, marginTop: 27 }} />
        <p style={{ color: "#7c7580" }}>OR</p>
        <hr style={{ height: 0.1, width: 125, marginTop: 27 }} />
      </div>

      <Link to="/signup" style={{ textDecoration: 'none', color: "#A8A8A6" }}>
        <p style={{ color: "#00376B", textAlign: "center", fontWeight: 600 }}>Create new account</p>
      </Link>

      <div>
        <div style={{ display: "flex" }}>
          <hr style={{ height: 0.1, width: 520, marginTop: 30 }} />
        </div>

        <Link to="/" style={{ textDecoration: 'none', color: "#A8A8A6" }}>
          <p style={{ color: "#A0A0A9", textAlign: "center", fontWeight: 600 }}>Back to login</p>
        </Link>
      </div>
    </div>
  </div>

  {isMailSent && (
    <div className="success-message-container">
      <div className="success-message">
        Mail sent successfully!
      </div>
      
    </div>
  )}
</div>



  );
}
export default ForgetPassword;
