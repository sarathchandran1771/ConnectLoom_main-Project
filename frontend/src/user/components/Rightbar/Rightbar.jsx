//rightbar.js
import React, { useState,useEffect } from "react";
import {
   usePostFollowRequestMutation,
   useGetAllUserDataMutation 
  } from "../../../Shared/redux/userSlices/userSlice";
import "./Rightbar.css";
import Post from "../post/post";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
import { useNavigate, Link } from "react-router-dom";
import SmallCircularProgressVariants from "../LoadingComponent/spinner";

export default function Rightbar() {
  const navigate = useNavigate();
  const [postFollowRequestMutation] = usePostFollowRequestMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { profileData } = useSelector((state) => state.postData);
  const [usersProfileData] = useGetAllUserDataMutation();
  const [followStatusMap, setFollowStatusMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [allUsersData, setAllUsersData] = useState([]);
  const loggedInUserId = userInfo?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const  dataResponse  = await usersProfileData({ userId: loggedInUserId }).unwrap();  
        setAllUsersData(dataResponse.users)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }, [loggedInUserId]);



const filteredUsers = allUsersData.map(user => ({
  isPendingFollower: user.pendingFollowers.includes(loggedInUserId)
})); 

  const handleUsernameClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleFollowRequest = async (userId) => {
    try {

      const newFollowStatusMap = { ...followStatusMap };

      filteredUsers.forEach((user, index) => {
        const userId = allUsersData._id;

        newFollowStatusMap[userId] = user.isPendingFollower ? "Requested" : "Follow";
      });
      
      console.log("newFollowStatusMap", newFollowStatusMap);

      setFollowStatusMap(newFollowStatusMap);

      // Perform the follow request mutation
      const response = await postFollowRequestMutation({
        fromUserId: loggedInUserId,
        toUserId: userId,
      });
      // Display a success toast
      toast.success(response?.data?.message);
      setFollowStatusMap((prevMap) => ({
        ...prevMap,
        [userId]: filteredUsers.some(user => user.isPendingFollower)
          ? "Requested"
          : "Follow",
      }));
      setLoadingMap((prevMap) => ({
        ...prevMap,
        [userId]: false,
      }));
    } catch (error) {
      console.error("Error sending follow request:", error);
      // Display an error toast
      toast.error("Error sending friend request");

      // Set loading state to false for the specific user in case of an error
      setLoadingMap((prevMap) => ({
        ...prevMap,
        [userId]: false,
      }));
    }
  };

  return (
    <div className="mainRightbar">
      <div className="subMainRightBar">
        <div style={{ flex: 2, padding: 15 }}>
          <Post item={profileData} />
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ marginLeft: "20%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 10,
                marginTop: 30,
                cursor: "pointer",
              }}
            >
              <img
                src={userInfo?.profilePic || Default_profileIcon}
                alt=""
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ marginLeft: 10 }}>
                <p style={{ textAlign: "start" }}>{userInfo?.username}</p>
                <p
                  style={{
                    marginTop: -15,
                    textAlign: "start",
                    color: "#A8A8A8",
                  }}
                >
                  {userInfo?.profilename}
                </p>
              </div>
              <div style={{ marginLeft: "100px", cursor: "pointer" }}>
                <p
                  style={{ color: "#0095F6", fontSize: 15, fontWeight: "500" }}
                >
                  Switch
                </p>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p style={{ color: "#A8A8A8", textAlign: "start", marginLeft: 10 }}>
                  Suggested for you
                </p>

                {allUsersData.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 20,
                      marginTop: -5,
                    }}
                  >
                    <img
                      src={item?.profilePic || Default_profileIcon}
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flexGrow: 1, marginLeft: 10 }}>
                      <Link
                        to={`/profile/${item?._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <p
                          style={{
                            textAlign: "start",
                            marginBottom: 15,
                            cursor: "pointer",
                          }}
                          onClick={() => handleUsernameClick(item?._id)}
                        >
                          {item?.username}
                        </p>
                      </Link>
                    </div>

                    <div
                      style={{ paddingLeft: 15, cursor: "pointer" }}
                      onClick={() => handleFollowRequest(item?._id)}
                    >
                      {loadingMap[item?._id] ? (
                        <SmallCircularProgressVariants />
                      ) : (
                        <p style={{ color: "#0095F6" }}>
                          {followStatusMap[item?._id] || "Follow"}
                        </p>
                      //   <p style={{ color: "#0095F6" }}>
                      //   {followStatusMap[item?._id]}
                      // </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p
              style={{
                textAlign: "start",
                marginLeft: 30,
                fontSize: 13,
                color: "#A8A8A8",
              }}
            >
              © 2023 CONNECTLOOM FROM BETA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}