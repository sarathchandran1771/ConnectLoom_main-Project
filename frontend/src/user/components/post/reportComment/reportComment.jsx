import React, { useState } from "react";
import { useReportOnCommentMutation } from "../../../../Shared/redux/userSlices/userSlice";
import Typography from "@mui/material/Typography";
import MaterialModal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MoreOptions from "../../../Icons/MoreOptions.png";
import Divider from "@mui/material/Divider";
import PostReportOnComment from "./postReportComment"


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

const ReportOnComment = (props) => {
  const [getReportPost] = useReportOnCommentMutation();
  const [reportedCommentId, setReportedCommentId] = useState(null);
  const [open, setOpen] = useState(false);
  const { commentId } = props;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleReportModal = () => {
    setReportedCommentId(commentId);
    handleOpen(true);
  };

  return (
    <>
      <div>
        <img src={MoreOptions} onClick={() => handleReportModal()} alt="" />
      </div>
      <MaterialModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{ ...modalStyle, border: "none" }}
          style={{
            padding: 0,
            backgroundColor: "#292a2b",
            height: 120,
          }}
        >
          <ul
            style={{
              listStyle: "none",
              textAlign: "center",
              padding: 0,
              marigin: 0,
            }}
          >
            <li className="MoreText">
               <PostReportOnComment reportedCommentId={reportedCommentId}/>
            </li>
            <Divider sx={{ width: "100%", borderColor: "#494b4d" }} />
            <li className="MoreText">
              <Typography
                variant="3"
                component="h3"
                style={{
                  fontWeight: 200,
                  color: "White",
                  fontSize: 18,
                  cursor: "pointer",
                  paddingTop:6
                }}
                onClick={handleClose}
              >
                Cancel
              </Typography>
            </li>
          </ul>
        </Box>
      </MaterialModal>
    </>
  );
};

export default ReportOnComment;
