import React, { useState,useEffect } from "react";
import axios from 'axios';
import { 
  useDeletePostMutation,
  useGetAllPostsMutation
 } from "../../../Shared/redux/userSlices/userSlice";
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
import './ExplorePost.css'



export default function ExplorePost( props ) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [IsLike, setIsLike] = useState(LikeButton);
  const [exploreData] = useGetAllPostsMutation();
  const [deletePost, { isLoading }] = useDeletePostMutation();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { newExplores } = props;

  const [newExploreData, setNewExploreData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataResponse = await exploreData().unwrap();
        setNewExploreData(dataResponse.users);
      } catch (error) {
        console.error("Error fetching Saved posts:", error);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = () => {
    setModalIsOpen(true);
  };

  const handleClose = () => setOpen(false);

  //workSpace
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://connectloom.shop/post/deletePosts/${postIdToDelete}`
      );
      setModalIsOpen(false);
      console.log("Delete response:", response.data);
    } catch (error) {
      console.error(
        "Delete error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  //workSpace

  return (
    <div className="mainExploreRightbar">
    {newExplores?.map((postData, outIndex) => (
      <div key={outIndex} className="container">
        {postData?.image?.map((imageUrl, index) => (
          <div key={index} className="imageforExplore">
              <div style={{ display: "flex" }}>
                {newExplores?.image?.length > 1 && index === 0 && (
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
              </div>
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
                  <img src={love} className="logoForExplore" alt="" />
                  <p style={{ marginLeft: 5 }}>{newExplores?.likes}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <img src={CommentButton} className="logoForExplore" alt="" />
                  <p style={{ marginLeft: 5 }}>{newExplores?.comments}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
