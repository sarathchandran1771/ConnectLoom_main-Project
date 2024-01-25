//user/components/deletePost.js
import React from "react";
import { Popover, Box, Typography, Button } from '@mui/material';
import { useDeletePostMutation } from "../../Shared/redux/slices/userSlice";

const DeletePostConfirmation = ({ open, anchorEl, onClose, postId }) => {
  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleDelete = async () => {
    try {
      if (postId) {
        await deletePost({ postId: postId }); 
        onClose();
      } else {
        console.error("postId is undefined");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box p={2} sx={{ width: 250 }}>
        <Typography variant="h6" gutterBottom>
          Are you sure you want to delete the post?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default DeletePostConfirmation;
