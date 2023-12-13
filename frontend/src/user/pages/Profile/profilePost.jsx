//user/pages/profile/profile.js
import React, { useState, useRef, useEffect } from "react";
import "./Profile.css";
import "../../pages/Explore/Explore.css";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import MaterialModal from "@mui/material/Modal";
import carousel_icon from "../../Icons/Carousel_Icon.png";
import love from "../../Icons/Notifications.png";
import CommentButton from "../../Icons/comment.png";
import MoreOptions from "../../Icons/MoreOptions.png";
import sampleProfile from "../../Icons/sample_profile.JPG";
import ReactModal from "react-modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";
import ShareButton from "../../Icons/sharePost.png";
import SaveButton from "../../Icons/Save.png";
import LikeButton from "../../Icons/Notifications.png";
import UnLike from "../../Icons/Unlike.png";
import EmojiButton from "../../Icons/Emoji.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Popover, Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDeletePostMutation } from "../../../Shared/redux/userSlices/userSlice";

const StyledModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 250,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 28,
};

export default function ProfilePost() {
  const [activeStep, setActiveStep] = useState(0);

  const { profileData } = useSelector((state) => state.postData);
  const [mappedData, setMappedData] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [imageLoading, setImageLoading] = useState(false);
  //workSpace
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useTheme();
  const [postIdToDelete, setPostIdToDelete] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [IsLike, setIsLike] = useState(LikeButton);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);


  const [deletePost, { isLoading }] = useDeletePostMutation();

  //workSpace
  useEffect(() => {
    const newMappedData = profileData
      .map((post) => {
        if (post.user && post.user._id === userInfo._id) {
          return {
            postInfo: post,
            userInfo: userInfo,
          };
        }
        return null;
      })
      .filter(Boolean);

    setMappedData(newMappedData);
  }, [userInfo, profileData]);

  // Reference to the file input element
  const fileInputRef = useRef(null);

  //********************************* */
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % mappedData.length);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) =>
        (prevActiveStep - 1 + mappedData.length) % mappedData.length
    );
  };

  const handleStepChange = (index) => {
    setActiveStep(index);
  };


  const handleImageChange = (postId, index) => {
    // You can add any additional logic here if needed
    setActiveImageIndex(index);
  };


  const handleDelete = async (postId) => {
    try {
      const response = await deletePost({ postId: selectedPostId });
  
      if (response) {
        toast.success('Post deleted successfully');
        setModalIsOpen(false);
      } else {
        toast.error('Error deleting post');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error('Error deleting post');
    }
  };
  
  

  //********************************* */
  if (!profileData || profileData.length === 0) {
    // Handle loading state or empty data here
    return <div>Loading...</div>;
  }
  const userProfile = profileData[0];

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

  // the functions for the handling comment_modal  slider  open & close
  const handleImageOpen = () => {
    setIsOpen(true);
  };
  // the functions for the handling comment_modal  slider  open & close
  const handleImageClose = () => {
    setIsOpen(false);
  };

  const handleImageClick = (postId, index) => {
    setSelectedImageIndex({ ...selectedImageIndex, [postId]: index });
    setSelectedIndex(index);
  };

  const handleShowModal = (postId) => {
    setSelectedPostId(postId);
    setModalIsOpen(true);
  };

  // the function for handle Open DeleteConfirmation
  const handleOpenDeleteConfirmation = (event) => {
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  //    the function for handle close DeleteConfirmation
  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    handleCommentModalClose();
    setModalIsOpen(false);
  };

  // the function for handle Likes

  const handleLike = () => {
    if (IsLike === LikeButton) {
      setIsLike(UnLike);
    } else {
      setIsLike(LikeButton);
    }
  };

  // the function for handle Comment ModalOpen
  const handleCommentModalOpen = (index) => {
    const postId = selectedPostId;
    console.log("postIdpostId", postId);
    setIsOpen(true);
    setPostIdToDelete(postId);
  };
  const handleCommentModalClose = () => setIsOpen(false);

  const renderImages = (mappedItem) => {
    return Array.isArray(mappedItem.postInfo.image)
      ? mappedItem.postInfo.image.map((url, index) => (
          <img
            key={index}
            src={url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            alt=""
            onClick={() => handleImageClick(index)}
          />
        ))
      : null;
  };

  //work Space

  return (
    <div className="profilePostContainer">
      {mappedData.map((mappedItem, index) => (
        <div key={index}>
          <div className="imageforExplore">
            {Array.isArray(mappedItem.postInfo.image) &&
              mappedItem.postInfo.image
                .slice(0, 1)
                .map((imageUrl, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={imageUrl}
                    className="imageforimage"
                    alt=""
                  />
                ))}
            {Array.isArray(mappedItem.postInfo.image) &&
              mappedItem.postInfo.image.length > 1 && (
                <img
                  src={carousel_icon}
                  className="carouselIcon"
                  alt="carousel_icon"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "30px",
                    height: "30px",
                  }}
                />
              )}
            <div className="coveredLikesAndComments">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <img src={love} className="logoForExplore" alt="" />
                <p style={{ marginLeft: 5 }}>{mappedItem.postInfo.likes}500</p>
              </div>
              <div
                onClick={() => {
                  console.log("image specific ID", mappedItem.postInfo._id);
                  handleShowModal(mappedItem.postInfo._id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <img src={CommentButton} className="logoForExplore" alt="" />
                <p style={{ marginLeft: 5 }}>
                  100
                </p>
              </div>
            </div>
          </div>

          <ReactModal
            style={{ overlay: { backgroundColor: "#2e2b2bc" } }}
            isOpen={modalIsOpen && selectedPostId === mappedItem.postInfo._id}
            onRequestClose={() => setModalIsOpen(false)}
            className={"modalForAPost"}
          >
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                {mappedItem.postInfo.image.length > 1 ? (
                  <>
                    <div style={{ display: "flex", overflowX: "auto" }}>
                      {mappedItem.postInfo.image.map((url, index) => (
                        <div
                          key={index}
                          style={{ margin: "0 8px", cursor: "pointer" }}
                        >
                          <img
                            src={url}
                            style={{
                              width: "100%",
                              height: "90vh",
                              objectFit: "cover",
                            }}
                            alt=""
                            onClick={() =>
                              handleImageClick(mappedItem.postInfo._id, index)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <SwipeableDrawer
                      anchor="right"
                      onClose={handleImageClose}
                      onOpen={handleImageOpen}
                    >
                      <div style={{ width: "80%", padding: "16px" }}>
                        <IconButton onClick={handleImageClose}>
                          {theme.direction === "rtl" ? (
                            <ChevronLeftIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </IconButton>
                        <Typography variant="h6">Image Carousel</Typography>
                        {mappedItem.postInfo.image.length > 1 && (
                          <Slider
                            dots={true}
                            infinite={true}
                            speed={500}
                            slidesToShow={1}
                            slidesToScroll={1}
                            afterChange={(index) =>
                              handleImageChange(mappedItem.postInfo._id, index)
                            }
                          >
                            {mappedItem.postInfo.image.map((url, index) => (
                              <div
                                key={index}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  maxHeight: "90vh",
                                }}
                              >
                                <img
                                  src={url}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "90vh",
                                    objectFit: "contain",
                                  }}
                                  alt=""
                                  onClick={() => {
                                    console.log("url", url);
                                    handleImageClick(
                                      mappedItem.postInfo._id,
                                      index
                                    );
                                  }}
                                />
                              </div>
                            ))}
                          </Slider>
                        )}
                      </div>
                    </SwipeableDrawer>
                  </>
                ) : (
                  <img
                    src={
                      mappedItem.postInfo.image[
                        selectedImageIndex[mappedItem.postInfo._id] || 0
                      ]
                    }
                    style={{
                      width: "100%",
                      height: "90vh",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                )}
              </div>

              <div style={{ flex: 1, height: "90vh" }}>
                <div style={{ height: "77vh", overflow: "auto" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <img
                        src={sampleProfile}
                        alt=""
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ paddingLeft: 10 }}>
                        <p style={{ marginBottom: 16 }}>Username</p>
                        <p style={{ marginTop: -20 }}>Profilename</p>
                      </div>
                    </div>
                    <div>
                      <img
                        src={MoreOptions}
                        onClick={handleCommentModalOpen}
                        alt=""
                      />
                      <MaterialModal
                       open={isOpen}
                        onClose={handleCommentModalClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={StyledModal}>
                          <ul
                            style={{ listStyle: "none", textAlign: "center" }}
                          >
                            <li className="MoreText">
                              <Typography variant="3" component="h2">
                                <p
                                  onClick={handleOpenDeleteConfirmation}
                                  style={{ color: "black" }}
                                >
                                  {" "}
                                  Delete post
                                </p>
                                <handleDelete
                                  open={deleteConfirmationOpen}
                                  anchorEl={anchorEl}
                                  onClose={handleCloseDeleteConfirmation}
                                  postId={postIdToDelete}
                                />
                              </Typography>
                            </li>
                          </ul>
                        </Box>
                      </MaterialModal>
                    </div>
                  </div>

                  <div className="scrollable-div" style={{ height: "65vh" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: 30,
                      }}
                    >
                      <img
                        src={sampleProfile}
                        alt=""
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginTop: -80,
                        }}
                      />
                      <div style={{ marginLeft: 20, paddingLeft: 10 }}>
                        <p>username</p>
                        <p style={{ marginTop: -15 }}>
                          During the #HungryGhostFestival, celebrated in parts
                          the dead and comfort wandering spirits.{" "}
                        </p>
                        <p style={{ color: "#A8A8A8", marginTop: -10 }}>1d</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginLeft: 30, marginTop: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ marginTop: 10, marginLeft: -15 }}>
                      <img
                        onClick={handleLike}
                        src={IsLike}
                        style={{ marginLeft: 13, cursor: "pointer" }}
                        alt=""
                      />
                      <img
                        onClick={handleShowModal}
                        src={CommentButton}
                        style={{ marginLeft: 13, cursor: "pointer" }}
                        alt=""
                      />
                      <img
                        src={ShareButton}
                        style={{ marginLeft: 13, cursor: "pointer" }}
                        alt=""
                      />
                    </div>
                    <div style={{ marginTop: 10, cursor: "pointer" }}>
                      <img src={SaveButton} alt="" />
                    </div>
                  </div>
                  <p style={{ marginTop: -4 }}>79,596 likes</p>
                  <p style={{ marginTop: -10, fontSize: 11, color: "#A8A8A8" }}>
                    1 Day Ago
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginLeft: 30,
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 0.2 }}>
                    <img
                      src={EmojiButton}
                      style={{ cursor: "pointer", width: 25, height: 25 }}
                      alt=""
                    />
                  </div>
                  <div style={{ flex: 4, marginLeft: 10 }}>
                    <textarea
                      type="text"
                      style={{
                        width: "100%",
                        backgroundColor: "black",
                        border: "none",
                        color: "white",
                      }}
                      placeholder="Add a comment"
                    />
                  </div>
                  <div style={{ flex: 0.3, marginTop: -16, marginLeft: 70 }}>
                    <p
                      style={{
                        cursor: "pointer",
                        color: "#0095F6",
                        fontWeight: 600,
                      }}
                    >
                      Post
                    </p>
                  </div>
                </div>
              </div>


              <Popover
            open={deleteConfirmationOpen}
            anchorEl={anchorEl}
            onClose={handleCloseDeleteConfirmation}
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
                <Button onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="error" disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </Box>
            </Box>
          </Popover>

            </div>
          </ReactModal>
        </div>
      ))}
    </div>
  );
}
