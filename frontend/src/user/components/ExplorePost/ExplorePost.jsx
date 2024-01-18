import React, { useState } from "react";
import axios from 'axios';
import "../../pages/Explore/Explore.css";
import { useDeletePostMutation } from "../../../Shared/redux/userSlices/userSlice";
import love from "../../Icons/Notifications.png";
import LikeButton from "../../Icons/Notifications.png";
import UnLike from "../../Icons/Unlike.png";
import CommentButton from "../../Icons/comment.png";
import sampleProfile from "../../Icons/sample_profile.JPG";
import EmojiButton from "../../Icons/Emoji.png";
import ShareButton from "../../Icons/sharePost.png";
import SaveButton from "../../Icons/Save.png";
import MoreOptions from "../../Icons/MoreOptions.png";
import carousel_icon from "../../Icons/Carousel_Icon.png";
import Modal from "react-modal";
import MaterialModal from "@mui/material/Modal";
import { Box, Typography} from "@mui/material";
import { Popover, Button } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';



export default function ExplorePost({ item }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [IsLike, setIsLike] = useState(LikeButton);
  
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState([]);

  console.log("item",item)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const theme = useTheme();

  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleImageOpen = () => {
    setOpen(true);
  };

  const handleImageClose = () => {
    setOpen(false);
  };

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };


  if (!Array.isArray(item.image)) {
    console.error('Expected item.image to be an array:', item.image);
    return null;
  }

  const handleLike = () => {
    if (IsLike === LikeButton) {
      setIsLike(UnLike);
    } else {
      setIsLike(LikeButton);
    }
  };
  
  const handleShowModal = () => {
    setModalIsOpen(true);
  };

  if (!item || !Array.isArray(item.image)) {
    return <p>No data available</p>;
  }

  const handleOpenDeleteConfirmation = (event) => {
    setAnchorEl(event.currentTarget);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
  };
  const handleOpen = () => {
    const postId = item._id
    console.log("postIdpostId", postId);
    setPostIdToDelete(postId);
    setOpen(true)

  };
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 250,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 28,
  };
  

  //workSpace
  const handleDelete = async () => {
    try {
      console.log("postIdToDeletepostIdToDelete",postIdToDelete)
      const response = await axios.delete(`http://localhost:5000/post/deletePosts/${postIdToDelete}`);
      handleCloseDeleteConfirmation()
      setModalIsOpen(false)
      console.log('Delete response:', response.data);
    } catch (error) {
      console.error('Delete error:', error.response ? error.response.data : error.message);
    }
  };
  

    // Use react-slick settings for the carousel

    const renderImages = () => {
      return item.image.map((url, index) => (
        <img
          key={index}
          src={url}
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          alt=""
          onClick={() => handleImageClick(index)}
        />
      ));
    };
  //workSpace


  return (
    <div className="container">
      {item.image.map((imageUrl, index) => (
        <div key={index}>
    <div className="imageforExplore" >
      {item.image.length > 1 && index === 0 && (
        <img
          src={carousel_icon}
          className="carouselIcon"
          alt="carousel_icon"
          style={{
            position:'absolute',
            top: 0,
            right: 0,
            width: '30px',
            height: '30px',
          }}
        />
        )}
        {imageUrl.length >= 1 && index === 0 && (
        <img src={imageUrl} className="imageforimage" alt="" />
              )}
            <div className="text">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <img src={love} className="logoForExplore" alt="" onClick={() => handleShowModal(item._id)} />
                <p style={{ marginLeft: 5 }}>{item?.likes}</p>
              </div>
              <div
                onClick={handleShowModal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <img src={CommentButton} className="logoForExplore" alt="" />
                <p style={{ marginLeft: 5 }}>{item?.comments}</p>
              </div>
            </div>
          </div>

          {/* <Modal
            style={{ overlay: { backgroundColor: "#2e2b2bc" } }}
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className={"modalForAPost"}
          >
            <div style={{ display: "flex" }}>
    <div style={{ flex: 1 }}>
      {item.image.length > 1 ? (
        <>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {item.image.map((url, index) => (
              <div key={index} style={{ margin: '0 8px', cursor: 'pointer' }}>
                <img
                  src={url}
                  style={{ width: '100%', height: '90vh', objectFit: 'cover' }}
                  alt=""
                  onClick={() => handleImageClick(index)}
                />
              </div>
            ))}
          </div>
          <SwipeableDrawer anchor="right" onClose={handleImageClose} onOpen={handleImageOpen}>
            <div style={{ width: '30%', padding: '16px' }}>
              <IconButton onClick={handleImageClose}>
                {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
              <Typography variant="h6">Image Carousel</Typography>
              {renderImages()}
            </div>
          </SwipeableDrawer>
        </>
      ) : (
        <img
          src={item.image[0]}
          style={{ width: '100%', height: '90vh', objectFit: 'cover' }}
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
                      <img src={MoreOptions} onClick={handleOpen} alt="" />
                      <MaterialModal
                      open={deleteConfirmationOpen}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={modalStyle}>
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
                          of Asia throughout the seventh lunar month,
                          carefully-constructed paper items are burned to honor
                          the dead and comfort wandering spirits.{" "}
                        </p>
                        <p style={{ color: "#A8A8A8", marginTop: -10 }}>1d</p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
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
                          of Asia throughout the seventh lunar month,
                          carefully-constructed paper items are burned to honor
                          the dead and comfort wandering spirits.{" "}
                        </p>
                        <p style={{ color: "#A8A8A8", marginTop: -10 }}>1d</p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
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
                          marginTop: 20,
                        }}
                      />
                      <div style={{ marginLeft: 20, paddingLeft: 10 }}>
                        <p>username</p>
                        <p style={{ marginTop: -15 }}>
                          During the #HungryGhostFestival, celebrated in parts
                          of Asia throughout the seventh lunar month,
                          carefully-constructed paper items are burned to honor
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
            </div>
          </Modal> */}
      <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={''}
      anchorOrigin={{
        vertical: "center",
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
      ))}
    </div>
  );
}
