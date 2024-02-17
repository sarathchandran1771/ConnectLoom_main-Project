import React, { useState,useEffect, useRef, } from "react";
import SaveButton from "../../Icons/Save.png";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import _debounce from "lodash/debounce";
import { useSavePostMutation,useGetSavedPostMutation } from "../../../Shared/redux/userSlices/userSlice";
import BookmarkIcon from '@mui/icons-material/Bookmark';


const SavePost = (props) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [savedPostsmanage] = useSavePostMutation();
  const [getSavedPost] = useGetSavedPostMutation();
  const isArchiveOperation = useRef(false);
  const loggedinId = userInfo?._id;
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { postId } = props;
  const [isSaved, setIsSaved] = useState([]); 
  const [savedPosts, setSavedPosts] = React.useState([]); 

  const handleSavePost = async () => {
    try {
      isArchiveOperation.current = true;
      const response = await savedPostsmanage({
        postId: postId._id,
        userId: loggedinId,
      }).unwrap();

      // console.log("response saved",response)
      if (response && response.updatedSavePost) {
        setIsSaved(response.user);
        toast.success(response.message);
        handleClose();
      } else {
        toast.error("Error Save post");
      }
    } catch (error) {
      console.error("Error Save post:", error);
      if (error.response) {
        console.error("Response Data:", error.response);
      }
      toast.error("Error UnSave post");
    } finally {
      isArchiveOperation.current = false;
    }
  };


  useEffect(() => {
    if (!isArchiveOperation.current) {

    const fetchData = async () => {
      try {
        const { data } = await getSavedPost({ userId: loggedinId });
        setSavedPosts(data);
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }
  }, [getSavedPost, isSaved,isArchiveOperation.current]);


  const postIdSaved = savedPosts.map((postId) => postId.post._id);

  
  const mappedArray = postIdSaved && postIdSaved.map((postId, index) => ({
    index: index,
    postId: postId
  }));

  const isPostSaved = mappedArray && mappedArray.length > 0 && mappedArray.some(item => item.postId === postId._id);

  const debouncedClick = _debounce(() => {
    handleSavePost(postId);
  }, 100);

  
  return (
    <div> 
      <div style={{ display: "flex", alignItems: "center" }}>
        {isSaved && isPostSaved ? (
          <BookmarkIcon onClick={debouncedClick} style={{ color: "white" }} />
        ) : (
          <img onClick={debouncedClick} src={SaveButton} alt="" />
        )}
      </div>
    </div>
  );
};

export default SavePost;
