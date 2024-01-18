import React, { useEffect, useState } from "react";
import LikeButton from "../../Icons/Notifications.png";
import UnLike from "../../Icons/Unlike.png";
import { useDispatch, useSelector } from "react-redux";
import {
  useLikeOnPostMutation,
  useCreateNotificationMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { setPostData } from "../../../Shared/redux/userSlices/postSlice";

const LikeOnPost = (props) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { profileData } = useSelector((state) => state.postData);
  const [likeOnPostMutation] = useLikeOnPostMutation();
  const [createNotification] = useCreateNotificationMutation();
  const [likeStates, setLikeStates] = useState({});
  const [likedPostById, setLikedPostById] = useState(null);
  const loggedInUser = userInfo?._id;
  const selectedPostId = props?.postId;
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPostId && profileData) {
      const userId = profileData?.user;
      if (userId) {
        setLikedPostById(userId);
      }
    }
  }, [selectedPostId, profileData]);

  const handleLike = async () => {
    try {
      const postId = selectedPostId;
      const response = await likeOnPostMutation({
        userId: loggedInUser,
        postId,
      });
      if (response?.data?.success) {
        setLikeStates((prevStates) => ({
          ...prevStates,
          [postId]: !prevStates[postId],
        }));
        dispatch(setPostData(response?.data?.updatedPostData));
        addNotificationForLikes();
      } else {
        console.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const addNotificationForLikes = async () => {
    try {
      const response = await createNotification({
        userId: likedPostById,
        type: "like",
        initiator: userInfo?._id,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const fetchInitialLikeStates = async () => {
    try {
      const initialLikeStates = profileData.reduce((acc, post) => {
        acc[post._id] = false;
        const likedByUser = post?.likes.some(
          (like) => like?.user === userInfo?._id
        );
        if (likedByUser) {
          acc[post._id] = true;
        }
        return acc;
      }, {});
      setLikeStates(initialLikeStates);
    } catch (err) {
      console.error("Error fetching initial like states:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchInitialLikeStates();
    };
    fetchData();
  }, [dispatch, loggedInUser]);

  return (
    <div key={selectedPostId} onClick={() => handleLike()}>
      <img
        src={likeStates[selectedPostId] ? LikeButton : UnLike}
        className="LogoPostIcons"
        alt=""
      />
    </div>
  );
};

export default LikeOnPost;
