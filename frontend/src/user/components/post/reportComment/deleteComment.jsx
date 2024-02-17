import React from "react";
import { toast } from "react-toastify";
import { useDeleteCommentMutation } from "../../../../Shared/redux/userSlices/userSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteComment = (props) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [deleteOnComment] = useDeleteCommentMutation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { commentId } = props;
  const loggedInId = userInfo._id;

  const postDeletComment = async () => {
    try {
      const response = await deleteOnComment({
        userId: loggedInId,
        commentId: commentId,
      });
      toast.success(response.message);
      handleClose();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDelete = () => {
    postDeletComment();
  };
  return (
    <div>
      <DeleteIcon onClick={handleOpen} color="error" variant="outlined" />
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            <div>Are you sure want to delete ?</div>
            <div>
              <CloseOutlinedIcon onClick={handleClose} />
            </div>
          </div>
          <Divider sx={{ width: "100%", borderColor: "#494b4d" }} />
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <Button
              style={{
                color: "Blue",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                border: "1px solid #000",
              }}
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteComment;
