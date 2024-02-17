import React, { useState, useEffect } from "react";
import {
  usePostFollowRequestMutation,
  useGetPendingRequestMutation,
  useCreateNotificationMutation,
  useGetProfileDataMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FollowButton = () => {
  const { userId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const loggedInUserId = userInfo?._id;
  const [postFollowRequestMutation] = usePostFollowRequestMutation();
  const [getPendings] = useGetPendingRequestMutation();
  const [userProfileData] = useGetProfileDataMutation();
  const [createNotification] = useCreateNotificationMutation();
  const [followStatusMap, setFollowStatusMap] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [ownedProfile, setOwnedProfile] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const  dataResponse  = await userProfileData({ userId: userId }).unwrap();  
        setOwnedProfile(dataResponse.user)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }, [userId]);

  const followersArray = ownedProfile.user?.followers || [];
  const isFollowing = followersArray.includes(loggedInUserId);

  const handleFollowRequest = async () => {
    try {
      // Perform the follow request mutation
      const response = await postFollowRequestMutation({
        fromUserId: loggedInUserId,
        toUserId: userId,
      });
      console.log("touserId",userId)
      console.log("loggedInUserId",loggedInUserId)
      console.log("response",response)
      setTimeout(() => {
        addNotification();
      }, 100);
      toast.success(response?.data?.message);
    } catch (error) {
      console.error("Error sending follow request:", error);
      // Display an error toast
      toast.error("Error sending friend request");
    }
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        if (userId) {
          // Fetch chat content
          const getPendingResponse = await getPendings({
            fromUserId: loggedInUserId,
            toUserId: userId,
          });
          setPendingRequests(getPendingResponse?.data?.pendingRequest);
          if (isFollowing) {
            // Check if there is a pending request
            if (pendingRequests?.acceptFollow === null) {
              setFollowStatusMap((prevMap) => ({
                ...prevMap,
                [userId]: "Requested",
              }));
            } else {
              // User is following, and there is no pending request
              setFollowStatusMap((prevMap) => ({
                ...prevMap,
                [userId]: "Unfollow",
              }));
            }
          } else {
            // User is not following
            setFollowStatusMap((prevMap) => ({
              ...prevMap,
              [userId]:
                getPendingResponse?.data?.pendingRequest?.acceptFollow === null
                  ? "Requested"
                  : "Follow",
            }));
          }
        }
      } catch (error) {
        // console.error("Error fetching chat data:", error);
      }
    };
    fetchPendingRequests();
  }, [userId, loggedInUserId, isFollowing]);

  const addNotification = async () => {
    try {
      const response = await createNotification({
        userId: userId,
        type: "followRequest",
        initiator: loggedInUserId,
      });
    } catch (error) {
      // console.error("Error adding comment:", error);
    }
  };

  return (
    <div
      onClick={handleFollowRequest}
      style={{
        cursor: "pointer",
        maxWidth: 110,
        paddingTop: "10px",
        marginRight: 5,
      }}
    >
      <button
        style={{
          cursor: "pointer",
          backgroundColor: "blue",
          height: 35,
          width: 110,
          border: "none",
          borderRadius: 8,
          color: "white",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {followStatusMap[userId] || "Follow"}{" "}
      </button>
    </div>
  );
};

export default FollowButton;
