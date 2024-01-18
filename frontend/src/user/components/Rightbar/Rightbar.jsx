//rightbar.js
import React, { useState } from "react";
import { usePostFollowRequestMutation } from "../../../Shared/redux/userSlices/userSlice";
import "./Rightbar.css";
import Post from "../post/post";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
import { useNavigate, Link } from "react-router-dom";
import SmallCircularProgressVariants from "../LoadingComponent/spinner";

export default function Rightbar() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { profileData } = useSelector((state) => state.postData);
  const [postFollowRequestMutation] = usePostFollowRequestMutation();
  const [followStatusMap, setFollowStatusMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  const profileDataArray = Array.isArray(profileData) ? profileData : [];
  const loggedInUserId = userInfo?._id;
  const filteredData = profileDataArray.filter(
    (item) => item?.user?._id !== loggedInUserId
  );
  const uniqueUserIds = new Set();
  const uniqueFilteredData = filteredData.filter((item) => {
    const userId = item?.user?._id;

    if (!uniqueUserIds.has(userId)) {
      uniqueUserIds.add(userId);
      return true;
    }
    return false;
  });
  const handleUsernameClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleFollowRequest = async (userId) => {
    try {
      setLoadingMap((prevMap) => ({
        ...prevMap,
        [userId]: true,
      }));
      // Perform the follow request mutation
      const response = await postFollowRequestMutation({
        fromUserId: loggedInUserId,
        toUserId: userId,
      });
      // Display a success toast
      console.log("response", response);
      toast.success(response?.data?.message);
      setFollowStatusMap((prevMap) => ({
        ...prevMap,
        [userId]:
          response?.data?.message === "Friend request sent successfully"
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
        <div style={{ flex: 2, padding: 10 }}>
          <Post item={profileData} />
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ marginRight: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 20,
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
                <p style={{ color: "#A8A8A8", textAlign: "start" }}>
                  Suggested for you
                </p>

                {uniqueFilteredData.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 20,
                      marginTop: -20,
                    }}
                  >
                    <img
                      src={item?.user?.profilePic || Default_profileIcon}
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
                        to={`/profile/${item?.user?._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <p
                          style={{
                            textAlign: "start",
                            marginBottom: 0,
                            cursor: "pointer",
                          }}
                          onClick={() => handleUsernameClick(item?.user?._id)}
                        >
                          {item?.user?.username}
                        </p>
                      </Link>
                      <p
                        style={{
                          textAlign: "start",
                          marginTop: 4,
                          color: "#A8A8A8",
                          marginBottom: 18,
                        }}
                      >
                        Follow you
                      </p>
                    </div>

                    <div
                      style={{ paddingLeft: 15, cursor: "pointer" }}
                      onClick={() => handleFollowRequest(item?.user?._id)}
                    >
                      {loadingMap[item?.user?._id] ? (
                        <SmallCircularProgressVariants />
                      ) : (
                        <p style={{ color: "#0095F6" }}>
                          {followStatusMap[item?.user?._id] || "Follow"}
                        </p>
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