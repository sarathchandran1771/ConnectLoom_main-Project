import React, { useState, useEffect, useRef } from "react";
import SaveButton from "../../Icons/Save.png";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import _debounce from "lodash/debounce";
import { useSavePostMutation } from "../../../Shared/redux/userSlices/userSlice";

const SavePost = (props) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [savedPostsmanage] = useSavePostMutation();
  const isArchiveOperation = useRef(false);
  const loggedinId = userInfo?._id;
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { postId } = props;

  const handleSavePost = async () => {
    try {
      isArchiveOperation.current = true;
      const response = await savedPostsmanage({
        postId: postId,
        userId: loggedinId,
      });
      if (response) {
        toast.success("Post Save successfully");
        handleClose();
      } else {
        toast.error("Error Save post");
      }
    } catch (error) {
      console.error("Error Save post:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
      toast.error("Error UnSave post");
    } finally {
      isArchiveOperation.current = false;
    }
  };
  const debouncedClick = _debounce(() => {
    handleSavePost(postId);
  }, 100);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img onClick={debouncedClick} src={SaveButton} alt="" />
      </div>
    </div>
  );
};

export default SavePost;
