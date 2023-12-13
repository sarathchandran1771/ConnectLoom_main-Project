import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ConnectLoom_Logo from '../../../Shared/Icons/ConnectLoom_Logo.png'
import { setCredentials } from '../../../Shared/redux/adminSlices/adminAuthSlice';
import { useAdminLoginMutation  } from '../../../Shared/redux/adminSlices/adminApiSlices'
import { toast } from 'react-toastify';
import './adminLogin.css';


function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the generated useAdminLoginMutation hook
  const [login, { isLoading }] = useAdminLoginMutation();


  const handleLogin = async (e) => {
    e.preventDefault();

      // Check if username or password is empty
  if (!username) {
    toast.error('Please fill username');
    return;
  }else if(!password){
    toast.error('Please fill password');
  }

    try {
      // Calling the adminLogin mutation directly
      const adminData = await login({ username, password }).unwrap();


      dispatch(setCredentials({
        token: adminData.token,
      }));

      setUsername('');
      setPassword('');
      toast.success('LoggedIn successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.log("/admin/AdminLogin", error);
    // Check if the error response contains a specific message
    const errorMessage = error?.data?.message || error?.message || 'Login failed';

    toast.error(errorMessage);
    }
  };



  return (
    <div className="mainLoginPage">
      <div className="AdminLeft">
        <img
          style={{ position: "relative", top: "25px", left: "154px" }}
          src={""}
          alt=""
        />
      </div>
      <div style={{ marginTop: "4%" }}>
        <div className="AdminRight">
          <img src={ConnectLoom_Logo} className="ConnectLoomLogo" alt="" />
          <div style={{ marginLeft: 20 }}>
          <input
            type="text"
            placeholder="Username"
            className="inputForLoginPage"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            className="inputForLoginPage"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          <button className="LoginButton" onClick={handleLogin} disabled={isLoading}
 >
          {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>     
      </div>
    </div>
  );
}

export default AdminLogin

