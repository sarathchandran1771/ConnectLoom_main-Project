import React, { useState } from "react";
import { useGetReportPostMutation } from "../../../Shared/redux/userSlices/userSlice";
import Typography from "@mui/material/Typography";
import MaterialModal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MoreOptions from "../../Icons/MoreOptions.png";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

const ReportPost = (props) => {
  const [getReportPost] = useGetReportPostMutation();
  const [reportedPostId, setReportedPostId] = useState(null);
  const [open, setOpen] = useState(false);
  const { postId } = props;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleReportModal = () => {
    setReportedPostId(postId);
    handleOpen(true);
  };

  const handleReportClick = () => {
    if (reportedPostId) {
      getReportPost({ postId: reportedPostId });
    }
    setReportedPostId(null);
    handleClose(false);
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
            height: 210,
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
              <Typography
                onClick={() => handleReportClick()}
                variant="3"
                component="h3"
                style={{
                  color: "red",
                  fontWeight: 400,
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                Report
              </Typography>
            </li>
            <hr
              style={{
                width: "100%",
                textAlign: "start",
                borderColor: "#494b4d",
              }}
            />
            <Typography
              variant="3"
              component="h3"
              style={{
                color: "red",
                fontWeight: 400,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              Unfollow
            </Typography>
            <hr
              style={{
                width: "100%",
                textAlign: "start",
                borderColor: "#494b4d",
              }}
            />
            <li className="MoreText">
              <Typography
                variant="3"
                color="White"
                component="h3"
                style={{
                  fontWeight: 400,
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                About This account
              </Typography>
            </li>
            <hr
              style={{
                width: "100%",
                textAlign: "start",
                borderColor: "#494b4d",
              }}
            />
            <li className="MoreText">
              <Typography
                variant="3"
                component="h3"
                style={{
                  fontWeight: 200,
                  color: "White",
                  fontSize: 18,
                  cursor: "pointer",
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

export default ReportPost;
