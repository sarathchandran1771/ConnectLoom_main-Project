//src/user/login/login.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../../Shared/redux/userSlices/authSlice";
import { useLoginMutation } from "../../../Shared/redux/userSlices/userSlice";
import loginCoverPic from "../../Icons/loginPage-sample.png";
import instagramLogo from "../../Icons/instagram_black.png";
import { toast } from "react-toastify";
import "./login.css";
import FaceBookLoginPage from "./faceBookLogin"

function Login() {
  const [emailId, setemailId] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validate if email and password are provided
    if (!emailId || !password) {
      toast.error("Please enter both email/username and password.");
      return;
    }
    try {
      const userData = await login({ emailId, password }).unwrap();
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

      setemailId("");
      setPassword("");
      navigate("/home");
    } catch (error) {
      toast.error(error?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="mainLoginPage">
      <div className="left">
        <img
          style={{ position: "relative", top: "25px", left: "154px" }}
          src={loginCoverPic}
          alt=""
        />
      </div>
      <div style={{ marginTop: "4%" }}>
        <div className="right">
          <img src={instagramLogo} className="instagramLogo" alt="" />
          <div style={{ marginLeft: 20 }}>
            <input
              type="text"
              placeholder="Phone number, emailId, Username"
              className="inputLoginPage"
              value={emailId}
              onChange={(e) => setemailId(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              className="inputLoginPage"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="LoginButton"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div style={{ display: "flex" }}>
            <hr style={{ height: 0.1, width: 120, marginTop: 27 }} />
            <p style={{ color: "#7c7580" }}>OR</p>
            <hr style={{ height: 0.1, width: 120, marginTop: 27 }} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginLeft: 80,
            }}
          >
            {/* <p style={{ fontWeight: 600, color: "#385185" }}>
              Log in with facebook
            </p> */}
            <FaceBookLoginPage/>

          </div>
          <>
          </>
          <div>
            <Link to="/forgetpassword">
              <p
                style={{
                  color: "#00376B",
                  fontSize: 12,
                  cursor: "pointer",
                  marginLeft: 120,
                  marginTop: -10,
                }}
              >
                Forget Password?
              </p>
            </Link>
          </div>
        </div>

        <div className="rightBottomSection">
          <p style={{ color: "#000", marginLeft: 60 }}>
            Don't have an account?
          </p>
          <Link to="/signup">
            <p style={{ color: "#00376B" }}>Sign up</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
