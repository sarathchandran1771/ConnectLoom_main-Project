// eslint-disable-next-line react/jsx-no-undef
import React, { useState, useRef } from "react";
import "./editProfile.css";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import { setCredentials } from "../../../Shared/redux/userSlices/authSlice";
import MoreOptions from "./moreOption";

// Example import for a string type
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

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState(userInfo.username);
  const [profilename, setProfilename] = useState(userInfo.profilename);
  const [password, setPassword] = useState(userInfo.password);
  const [bio, setBio] = useState(userInfo.bio);
  const [checked, setChecked] = useState(userInfo.privatePublic);

  React.useEffect(() => {
    setChecked(userInfo.privatePublic);
  }, [userInfo.privatePublic]);

  if (!userInfo || userInfo.length === 0) {
    return <div>Loading...****</div>;
  }

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const StyledTextLink = styled("label")({
    cursor: "pointer",
    color: "blue",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  });

  //workspace
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileInputChange = (e) => {
    const profilePic = e.target.files[0];

    const imageUrl = URL.createObjectURL(profilePic);
    setSelectedImage(imageUrl);
    handleClose();
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // Handle image load
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  // Handle remove profile photo click
  const handleRemoveClick = () => {
    handleClose();
    setSelectedImage("");
  };
  //workspace
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("http://localhost:5000/edit-profile", {
        userId: userInfo._id,
        username: username,
        profilename: profilename,
        privatePublic: checked,
        profilePic: userInfo.profilePic,
        Bio: bio,
      });
      dispatch(setCredentials(response.data.updatedUser));
      // Handle success response
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="componentProfileEdit">
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={6} md={8}>
              <Item>
                <Grid container spacing={2} columns={10}>
                  <Grid className="usernameGrid" xs={5}>
                    <Item
                      style={{ backgroundColor: "black" }}
                      onClick={handleOpen}
                    >
                      {imageLoading ? (
                        // Display spinner while the image is loading
                        <div>Loading Spinner...</div>
                      ) : (
                        // Display the image
                        <img
                          src={selectedImage || Default_profileIcon}
                          style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                          alt=""
                          onLoad={handleImageLoad} // Add the onLoad event handler
                        />
                      )}
                    </Item>

                    <Item
                      style={{
                        justifyContent: "center",
                        marginTop: 10,
                        marginBottom: 5,
                      }}
                    >
                      <div>
                        <StyledTextLink
                          htmlFor="fileInput"
                          onClick={handleOpen}
                        >
                          Change profile photo
                        </StyledTextLink>
                        <VisuallyHiddenInput
                          id="fileInput"
                          type="file"
                          onChange={handleFileInputChange}
                        />
                      </div>
                    </Item>
                  </Grid>
                  <Grid className="usernameGrid" xs={5}>
                    <div className="usernameItem">
                      <div style={{ width: "120px" }}>
                        <label className="ListItems" htmlFor="usernameInput">
                          Username:
                        </label>
                      </div>
                      <div style={{ width: "100%", marginLeft: 15 }}>
                        <input
                          id="usernameInput"
                          className="InputItemsOfProfile"
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="usernameItem">
                      <div style={{ width: "120px" }}>
                        <p className="ListItems">Profilename:</p>
                      </div>
                      <div style={{ width: "100%", marginLeft: 15 }}>
                        <input
                          className="InputItemsOfProfile"
                          type="text"
                          value={profilename}
                          onChange={(e) => setProfilename(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="usernameItem">
                      <div style={{ width: "120px" }}>
                        <p className="ListItems"> emailId:</p>
                      </div>
                      <div style={{ width: "100%", marginLeft: 15 }}>
                        <input
                          className="InputItemsOfProfile"
                          value={userInfo.emailId}
                        />
                      </div>
                    </div>

                    <div className="usernameItem">
                      <div style={{ width: "120px" }}>
                        <p className="ListItems">Password:</p>
                      </div>
                      <div style={{ width: "100%", marginLeft: 15 }}>
                        <input
                          className="InputItemsOfProfile"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Item>
            </Grid>

            <MoreOptions />

            <Grid xs={6} md={4} borderRadius={50}>
              <div className="ListItemsProfileData">
                <p className="BioStyle">Bio</p>
              </div>
            </Grid>
            <Grid xs={6} md={8}>
              <div className="ListItemsProfileBio">
                <textarea
                  className="InputTextAreaProfileBio"
                  type="text"
                  placeholder="Enter your Data"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={false}
                />
              </div>

              <div style={{ display: "flex", marginTop: 25 }}>
                <p style={{ fontSize: 22 }}>Private account: </p>

                <Checkbox
                  sx={{
                    "&.MuiCheckbox-root": {
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    },
                    "&.Mui-checked": {
                      "&.MuiIconButton-root": {
                        borderColor: "white",
                      },
                    },
                  }}
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </div>
              <div style={{ width: 850, marginTop: -30 }}>
                <h6 style={{ color: "grey" }}>
                  When your account is public, your profile and posts can be
                  seen by anyone, on or off Instagram, even if they don’t have
                  an Instagram account. When your account is private, only the
                  followers you approve can see what you share, including your
                  photos or videos on hashtag and location pages, and your
                  followers and following lists.
                </h6>
              </div>
            </Grid>
            <Modal
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
                  <hr
                    style={{
                      width: "100%",
                      textAlign: "center",
                      overflow: "hidden",
                    }}
                  />
                  <li className="MoreText">
                    <Typography
                      variant="3"
                      component="h3"
                      onClick={handleUploadClick}
                      style={{ color: "blue", fontWeight: 600, fontSize: 18 }}
                    >
                      Upload photo
                    </Typography>
                  </li>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                  />
                  <hr style={{ width: "100%", textAlign: "start" }} />
                  <li className="MoreText">
                    <Typography
                      variant="3"
                      onClick={handleRemoveClick}
                      component="h3"
                      style={{ color: "red", fontWeight: 600, fontSize: 18 }}
                    >
                      Remove profile photo
                    </Typography>
                  </li>
                  <hr style={{ width: "100%", textAlign: "start" }} />
                  <li className="ProfileUpdateText">
                    <Typography
                      variant="3"
                      component="h3"
                      fontWeight={100}
                      fontSize={18}
                      onClick={handleClose}
                    >
                      cancel
                    </Typography>
                  </li>
                </ul>
              </Box>
            </Modal>
            <button className="saveChangesButton " type="submit">
              Save Changes
            </button>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

export default EditProfile;
