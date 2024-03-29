import React, { useState, useEffect } from "react";
import {
  useRespondFollowRequestMutation,
  useCreateNotificationMutation,
  useGetProfileDataMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AcceptButton = () => {
  const { userId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const loggedInUserId = userInfo?._id;
  const [respondToRequest, { isLoading }] =
    useRespondFollowRequestMutation();
  const [createNotification] = useCreateNotificationMutation();
  const [userProfileData] = useGetProfileDataMutation();
  const [mappedData, setMappedData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const  dataResponse  = await userProfileData({ userId: userId }).unwrap();  
        setMappedData(dataResponse.user)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }, [userId]);

  const followUser = mappedData?.user?.pendingFollowers;
  const isFollowing = followUser && followUser.includes(userId);


  const handleAcceptClick = async (accept) => {
    try {
      const data = {
        toUserId: loggedInUserId,
        fromUserId: userId,
        accept: accept,
      };
      const response = await respondToRequest(data);
      addNotification();
    } catch (error) {
      console.error(error);
    }
  };

  const addNotification = async () => {
    try {
      const response = await createNotification({
        userId: userId,
        type: "friendRequestAccept",
        initiator: loggedInUserId,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      {isFollowing && (
        <div
          style={{
            cursor: "pointer",
            maxWidth: 110,
            paddingTop: "10px",
            marginRight: 5,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 280,
              backgroundColor: "#8a8a8a8a",
              height: 25,
              marginTop: 8,
            }}
          >
            <div style={{}}>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "#8a8a8a8a",
                  height: 25,
                  width: 140,
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                }}
                onClick={() => handleAcceptClick(true)}
                disabled={isLoading}
              >
                {isLoading ? "Accepting..." : "Accept"}
              </button>
            </div>
            <div>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "#8a8a8a8a",
                  height: 25,
                  width: 140,
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                }}
                onClick={() => handleAcceptClick(false)}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AcceptButton;
