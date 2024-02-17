import React, { useState, useRef, useEffect} from "react";
import Default_profileIcon from "../../../Icons/Default_ProfilePic.jpg";
import { useDispatch } from "react-redux";
import { Box, Typography } from "@mui/material";
import MaterialModal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { setCredentials } from "../../../../Shared/redux/userSlices/authSlice";
import {
  useGetProfileDataMutation
} from "../../../../Shared/redux/userSlices/userSlice";
import SmallCircularProgressVariants from "../../../components/LoadingComponent/spinner"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  height: 220,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: 30,
  p: 3,
};

const ProfileImage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { userId } = useParams();
  const [userProfileData, {IsLoadingProfile}] = useGetProfileDataMutation();
  const [mappedData, setMappedData] = useState([]);
  const LoadingProfile = IsLoadingProfile;

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


  const profileImage = mappedData.profilePic ;
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (selectedFile) {
      try {
        formData.append("userId", userId);
        formData.append("file", selectedFile);
        const response = await fetch(
          "http://localhost:5000/upload-profileImage",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadResult = await response.json();
        console.log("uploadResult", uploadResult);
        const profileUpdatedData = uploadResult.updatedUser;
        dispatch(
          setCredentials({
            _id: profileUpdatedData._id,
            username: profileUpdatedData.username,
            emailId: profileUpdatedData.emailId,
            profilename: profileUpdatedData.profilename,
            Bio: profileUpdatedData.Bio,
            privatePublic: profileUpdatedData.privatePublic,
            profilePic: profileUpdatedData.profilePic,
            token: profileUpdatedData.token,
            postsByUser: profileUpdatedData.postsByUser,
            isPremium: profileUpdatedData.isPremium,
            paymentStatus: profileUpdatedData.paymentStatus,
            isVerified: profileUpdatedData.isVerified,
          })
        );
        handleClose();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <>
    {LoadingProfile ? (
      <SmallCircularProgressVariants />
    ) : (
    <div>
      <img
        src={profileImage || Default_profileIcon}
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          objectFit: "cover",
          cursor: "pointer",
        }}
        alt=""
        onClick={handleOpen}
      />
      <MaterialModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} style={{ padding: 0 }}>
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
                variant="3"
                component="h2"
                fontWeight={400}
                paddingTop={2}
                paddingBottom={1.5}
              >
                Change profile photo
              </Typography>
            </li>
            <Divider sx={{ width: "100%", borderColor: "grey" }} />
            <form onSubmit={handleFormSubmit}>
              <div className="MoreText">
                <label htmlFor="file">Upload photo:</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  ref={fileInputRef}
                  onChange={(event) => handleFileChange(event)}
                  required
                />
              </div>

              {selectedFile && (
                <div>
                  <img
                    src={selectedFile}
                    alt="Selected"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </div>
              )}
              <button type="submit">Submit</button>
            </form>

            <input type="file" ref={fileInputRef} style={{ display: "none" }} />
            <Divider sx={{ width: "100%", borderColor: "grey" }} />
            <li className="MoreText">
              <Typography
                variant="3"
                component="h3"
                style={{ color: "red", fontWeight: 600, fontSize: 18 }}
              >
                Remove profile photo
              </Typography>
            </li>
            <Divider sx={{ width: "100%", borderColor: "grey" }} />
            <li className="ProfileUpdateText">
              <Typography
                variant="3"
                component="h3"
                fontWeight={100}
                fontSize={18}
              >
                cancel
              </Typography>
            </li>
          </ul>
        </Box>
      </MaterialModal>
    </div>
        )}
    </>
  );
};

export default ProfileImage;
