/* eslint-disable react-hooks/rules-of-hooks */
// src/user/resetPassword/resetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PasswordLockLogo from '../../Icons/forgetpasswordLock.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./resetPassword.css"
const ResetPassword = () => {
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/resetPassword/${id}/${token}`, {
        confirmPassword,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while resetting the password');
    }
  };
  return (
    <div className='mainForgetPasswordPage'>
      <div style={{ marginTop: "4%" }}>
        <div className='forgetPasswordRight'>
          <img style={{}} src={PasswordLockLogo} className='instagramLogo' alt="" />
          <p style={{ fontWeight: 600, fontSize: 18, marginTop: -15, marginLeft: 10, textAlign: "center", color: "#000" }}>
            Trouble logging in?
          </p>
          <p style={{ fontWeight: 600, fontSize: 18, marginTop: -15, marginLeft: 10, textAlign: "center", color: "#737373" }}>
            Enter your new password, and we'll send you a link to get back into your account.
          </p>
          <div style={{ marginLeft: 20 }}>
            <input
              type="password"
              placeholder='New Password'
              className='restSetPasswordInput'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <input
              type="password"
              placeholder='Confirm Password'
              className='restSetPasswordInput'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className='LoginButton' onClick={handleResetPassword}>
            Reset Password
          </button>

          <div style={{ display: "flex" }}>
            <hr style={{ height: 0.1, width: 125, marginTop: 27 }} />
            <p style={{ color: "#7c7580" }}>OR</p>
            <hr style={{ height: 0.1, width: 125, marginTop: 27 }} />
          </div>
          <Link to="/signup" style={{ textDecoration: 'none', color: "#A8A8A6" }}>
            <p style={{ color: "#00376B", textAlign: "center", fontWeight: 600 }}>Create a new account</p>
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
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar/>
    </div>
  );
};

export default ResetPassword;


{/* <div class="card-body p-4 p-lg-5 text-black">
<form onSubmit={handleResetPassword}>
  <div class="d-flex align-items-center mb-3 pb-1">
    <i
      class="fas fa-cubes fa-2x me-3"
      style={{ color: " #ff6219" }}
    ></i>
    <span class="h1 fw-bold mb-0">Forget Password?</span>
  </div>

  <h5
    class="fw-normal mb-3 pb-3"
    style={{ letterSpacing: "1px" }}
  >
    Type Your Email Here
  </h5>

  <div class="form-outline mb-4">
    <input
      type="password"
      id=""
      placeholder="Enter New Password"
      class="form-control form-control-lg"
      name="newPassword"
      value={input.newPassword}
      onChange={(e) =>
        setInput({
          ...input,
          [e.target.name]: e.target.value,
        })
      }
    />
  </div>

  <div class="form-outline mb-4">
    <input
      type="password"
      id=""
      placeholder="Enter Confirm Email"
      class="form-control form-control-lg"
      name="confirmPassword"
      value={input.confirmPassword}
      onChange={(e) =>
        setInput({
          ...input,
          [e.target.name]: e.target.value,
        })
      }
    />
  </div>

  <div class="pt-1 mb-4">
    <button
      class="btn btn-dark btn-lg btn-block"
      type="submit"
    >
      Change Password
    </button>
  </div>
</form>
</div> */}