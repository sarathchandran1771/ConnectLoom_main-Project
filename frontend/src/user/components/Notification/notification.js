import React, { useState, useEffect } from "react";
import { useGetNoteficationsMutation } from "../../../Shared/redux/userSlices/userSlice";
import "./notification.css";
import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import RedirectedNotification from '../redirectedNotification/RedirectedNotification'

const SearchFriend = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [notifications] = useGetNoteficationsMutation();
  const [selectedId, setSelectedId] = useState("");
  const [notifyData, setNotifyData] = useState([]);
  const navigate = useNavigate();
  const userId = userInfo?._id;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (userId) {
          const response = await notifications({ userId });
          setNotifyData(response.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [notifications, userId]);

  const formatDateDistance = (date) => {
    const now = new Date();
    const minutesDifference = differenceInMinutes(now, new Date(date));

    if (minutesDifference < 60) {
      return `${minutesDifference}m`;
    }
    const hoursDifference = differenceInHours(now, new Date(date));

    if (hoursDifference < 24) {
      return `${hoursDifference}h`;
    }

    const daysDifference = differenceInDays(now, new Date(date));

    return `${daysDifference}d`;
  };

  const handleProfileClick = (selectedId) => {
    const matchingProfileData = notifyData.find(profileData => profileData?._id === selectedId);
    console.log("matchingProfileData",matchingProfileData)
  
    if (matchingProfileData && matchingProfileData?.type === 'comment') {
      navigate(`/notify/${selectedId}`);
    } else if(matchingProfileData && matchingProfileData?.type === 'followRequest'){
      navigate(`/profile/${userId}`); 
    } else if(matchingProfileData && matchingProfileData?.type === 'friendRequestAccept'){
      const initiator = matchingProfileData?.initiator?._id
      navigate(`/profile/${initiator}`); 
    } else if(matchingProfileData && matchingProfileData?.type === 'like'){
      navigate(`/notify/${selectedId}`); 
    }
  };
  
  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "comment":
        return "Comment on your post";
      case "followRequest":
        return " sends a Follow request";
      case "like":
        return "Likes your post";
      case "replyComment":
        return "Reply to your comment";
      case "friendRequestAccept":
        return "Accepted friend request  ";
      default:
        return null;
    }
  };
  return (
    <div className="notification-container">
      <p className="notification-title">Notifications</p>
      <Divider sx={{ width: "90%", borderColor: "white" }} />

      <p className="week-title">This week</p>

      <div className="profile-list">
        {notifyData.map((notification) => (
          <div className="profile-item" key={notification._id}>
            <img
              style={{ width: 30, height: 30, borderRadius: "50%" }}
              src={
                (notification.initiator && notification.initiator.profilePic) ||
                Default_profileIcon
              }
              alt=""
            />
            <div className="userData-notify">
              <div className="UserData-Div">
                <p style={{ marginTop: 25, fontSize: 15, marginLeft: 3 }}>
                  {notification.initiator && notification.initiator.username}
                </p>
                <p
                  style={{
                    marginTop: 25,
                    color: "#A8A8A8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginLeft: 3,
                  }}
                  onClick={() => handleProfileClick(notification._id)}
                  >
                  {renderNotificationContent(notification)}
                </p>
                <p
                  style={{
                    marginTop: 25,
                    color: "#A8A8A8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginLeft: 3,
                  }}
                >
                  {notification.createdAt &&
                    formatDateDistance(new Date(notification.createdAt))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFriend;
