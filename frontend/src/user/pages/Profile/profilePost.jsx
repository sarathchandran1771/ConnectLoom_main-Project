//user/pages/profile/profile.js
import React, { useState, useEffect } from "react";
import "./Profile.css";
import "../../pages/Explore/Explore.css";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import MaterialModal from "@mui/material/Modal";
import carousel_icon from "../../Icons/Carousel_Icon.png";
import LockIcon from "../../Icons/Lock_Icon.png";
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
import { Popover, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useArchivePostMutation,
  useDeletePostMutation,
  useGetProfileDataMutation
} from "../../../Shared/redux/userSlices/userSlice";
import { useParams } from "react-router-dom";
import LinearColor from "../../components/LoadingComponent/LinerBuffer"

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
  const { profileData} = useSelector((state) => state.postData);
  const { userInfo } = useSelector((state) => state.auth);
  const [mappedData, setMappedData] = useState([]);
  const [open, setOpen] = React.useState(false);
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
  const [archivepost, { LoadingArchive }] = useArchivePostMutation();
  const [userProfileData, {IsLoadingProfile}] = useGetProfileDataMutation();
  const { userId } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0); 

  //workSpace
  const privateAccount = mappedData.privatePublic;
  const ownProfile = mappedData._id === userId;
  const LoadingProfile = IsLoadingProfile;


  const followersArray = mappedData[0]?.user?.followers;
  let friendFollower
  if (followersArray) {
    friendFollower = followersArray.includes(userInfo._id);
  }
      
    useEffect(() => {
      const fetchData = async () => {
        try {
          const  dataResponse  = await userProfileData({ userId: userId }).unwrap();  
        setMappedData(dataResponse.postByUser)
        } catch (error) {
          console.error('Error fetching Saved posts:', error);
        }
      }
      fetchData();
    }, [userId]);


 
  //********************************* */

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

  const handleDelete = async () => {
    try {
      const response = await deletePost({ postId: selectedPostId });

      if (response) {
        toast.success("Post deleted successfully");
        setModalIsOpen(false);
      } else {
        toast.error("Error deleting post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post");
    }
  };

  const handleArchivePost = async () => {
    try {
      const response = await archivepost({ postId: selectedPostId });

      if (response) {
        toast.success("Post Archive successfully");
        setModalIsOpen(false);
      } else {
        toast.error("Error Archive post");
      }
    } catch (error) {
      console.error("Error Archive post:", error);
      toast.error("Error Archive post");
    }
  };

  //********************************* */

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    setIsOpen(true);
    setPostIdToDelete(postId);
  };
  const handleCommentModalClose = () => setIsOpen(false);

  //work Space
  return (
    <>
    {LoadingProfile ? (
      <LinearColor />
    ) : (
    <div className="profilePostContainer">
      {!ownProfile && privateAccount && !friendFollower ? (
        <div
          style={{
            textAlign: "center",
            margin: "auto",
            maxWidth: "500px",
            marginLeft: "80%",
          }}
        >
          <div
            style={{
              width: "500px",
              height: "150px",
              border: "1px white solid",
              padding: "20px",
            }}
          >
            <p>This Account is Private</p>
            <p>Follow to see their photos and videos.</p>
            <div>
              <img
                style={{
                  height: 65,
                  width: 65,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                src={LockIcon}
                alt=""
              />
            </div>
          </div>
        </div>
      ) : (
        mappedData.map((post, postIndex) => (
          <div key={postIndex}>
            <div className="imageforExplore">
              {Array.isArray(post?.image) &&
                post.image
                  .slice(0, 1)
                  .map((imageUrl, imageIndex) => (
                    <img
                      key={imageIndex}
                      src={imageUrl}
                      className="imageforimage"
                      alt={`Image ${imageIndex + 1}`}
                    />
                  ))}
              {Array.isArray(post?.image) && post?.image?.length > 1 && (
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
                  <p style={{ marginLeft: 5 }}>{post?.comments?.length}</p>
                </div>
                <div
                  onClick={() => {
                    handleShowModal(post._id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <img src={CommentButton} className="logoForExplore" alt="" />
                  <p style={{ marginLeft: 5 }}>{post?.comments?.length}</p>
                </div>
              </div>
            </div>

            <ReactModal
              style={{ overlay: { backgroundColor: "#2e2b2bc" } }}
              isOpen={modalIsOpen && selectedPostId === post?._id}
              onRequestClose={() => setModalIsOpen(false)}
              className={"modalForAPost"}
            >
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  {Array.isArray(post.image) && (
                    <>
                      <div style={{ display: "flex", overflowX: "auto" }}>
                        {post.image.map((imageUrl, imageIndex) => (
                          <div
                            key={imageIndex}
                            style={{ margin: "0 8px", cursor: "pointer" }}
                          >
                            <img
                              src={imageUrl}
                              style={{
                                width: "100%",
                                height: "90vh",
                                objectFit: "cover",
                              }}
                              alt=""
                              onClick={() =>
                                handleImageClick(post?._id, imageIndex)
                              }
                            />
                          </div>
                        ))}
                      </div>
                      {post.image.length > 1 && (
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
                            <Slider
                              dots={true}
                              infinite={true}
                              speed={500}
                              slidesToShow={1}
                              slidesToScroll={1}
                              afterChange={(index) =>
                                handleImageChange(post?._id, index)
                              }
                            >
                              {post.image.map((url, index) => (
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
                                    onClick={() =>
                                      handleImageClick(post?._id, index)
                                    }
                                  />
                                </div>
                              ))}
                            </Slider>
                          </div>
                        </SwipeableDrawer>
                      )}
                    </>
                  )}
                </div>

                {/* The rest of your code for the right side of the modal */}
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
                              {userId === userInfo._id && (
                                <>
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
                                  <li className="MoreText">
                                    <Typography variant="3" component="h2">
                                      <p
                                        onClick={handleArchivePost}
                                        style={{ color: "black" }}
                                      >
                                        {" "}
                                        Archive post
                                      </p>

                                      <handleDelete
                                        open={deleteConfirmationOpen}
                                        anchorEl={anchorEl}
                                        onClose={""}
                                        postId={postIdToDelete}
                                      />
                                    </Typography>
                                  </li>
                                </>
                              )}
                              <li className="MoreText">
                                <Typography variant="3" component="h2">
                                  <p style={{ color: "black" }}> Save post</p>

                                  <handleDelete
                                    open={deleteConfirmationOpen}
                                    anchorEl={anchorEl}
                                    onClose={handleCloseDeleteConfirmation}
                                    postId={postIdToDelete}
                                  />
                                </Typography>
                              </li>
                              {userId !== userInfo?._id && (
                                <li className="MoreText">
                                  <Typography variant="3" component="h2">
                                    <p style={{ color: "black" }}>
                                      {" "}
                                      Report post
                                    </p>

                                    <handleDelete
                                      open={deleteConfirmationOpen}
                                      anchorEl={anchorEl}
                                      onClose={handleCloseDeleteConfirmation}
                                      postId={postIdToDelete}
                                    />
                                  </Typography>
                                </li>
                              )}
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
                    <p
                      style={{ marginTop: -10, fontSize: 11, color: "#A8A8A8" }}
                    >
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button onClick={handleClose} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDelete}
                        color="error"
                        disabled={isLoading}
                      >
                        {isLoading ? "Deleting..." : "Delete"}
                      </Button>
                    </Box>
                  </Box>
                </Popover>
              </div>
            </ReactModal>
          </div>
        ))
      )}
    </div>
    )}
    </>
  );
}
