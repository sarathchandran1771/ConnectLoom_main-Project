//post.js
import React, { useState, useEffect } from "react";
import "./Post.css";
import CommentButton from "../../Icons/comment.png";
import EmojiButton from "../../Icons/Emoji.png";
import ShareButton from "../../Icons/sharePost.png";
import Modal from "react-modal";
import {
  useGetAllPostsMutation,
  useCommentOnPostMutation,
  useGetCommentsMutation,
  useCreateNotificationMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
import { toast } from "react-toastify";
import { setPostData } from "../../../Shared/redux/userSlices/postSlice";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import AdpostByAdmin from "./adPost";
import ReportPost from "./reportPost";
import LikeOnPost from "./LikeOnPost";
import SavePost from "./savePost";
import ReportOnComment from "./reportComment/reportComment";
import DeleteComment from "./reportComment/deleteComment";
import Divider from "@mui/material/Divider";
import ForwardPost from "../forwardPost/forwardPost";

const Post = () => {
  const dispatch = useDispatch();
  const [fetchPostApi, { isLoading }] = useGetAllPostsMutation();
  const [commentOnPost] = useCommentOnPostMutation();
  const [getCommentOnPost] = useGetCommentsMutation();
  const [createNotification] = useCreateNotificationMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const [profileDatas, setProfileDatas] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [postIdSelected, setPostIdSelected] = useState(null);
  const [selectedId, setSelectedID] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [comments, setComments] = useState([]);
  const [writtenComment, setwrittenComment] = useState("");
  const loggedinId = userInfo?._id;
  const isPremium = userInfo?.isPremium === true;

  useEffect(() => {
    if (postIdSelected && profileDatas) {
      const imageDetails = profileDatas.find(
        (image) => image._id === postIdSelected
      );
      if (imageDetails) {
        setSelectedID(imageDetails?.user?._id);
      }
    }
  }, [postIdSelected, profileDatas]);

  const handleShowModal = async (postId) => {
    if (postId !== null) {
      await setPostIdSelected(postId);
      setModalIsOpen(true);
    }
    fetchComments(postId);
  };

  const fetchComments = async (postId) => {
    try {
      if (loggedinId !== null) {
        const response = await getCommentOnPost({
          postId: postId,
        }).unwrap();
        setComments(response.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const addComment = async () => {
    try {
      setwrittenComment("");
      const response = await commentOnPost({
        postId: postIdSelected,
        userId: loggedinId,
        commentContent: writtenComment,
      });
      const commentId = response?.data?.savedComment?._id;
      const newComment = response?.data?.comment;
      setComments((prevComments) => [newComment, ...prevComments]);
      setTimeout(() => {
        addNotificationForComments(commentId);
      }, 1000);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addNotificationForComments = async (commentId) => {
    try {
      const response = await createNotification({
        userId: selectedId,
        type: "comment",
        initiator: loggedinId,
        target: commentId,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDateDistance = (date) => {
    const now = new Date();
    const minutesDifference = differenceInMinutes(now, new Date(date));

    if (minutesDifference < 60) {
      return `${minutesDifference}m`;
    }

    const hoursDifference = differenceInHours(now, new Date(date));

    if (hoursDifference < 24) {
      return `${hoursDifference}h`;
    }

    const daysDifference = differenceInDays(now, new Date(date));

    return `${daysDifference}d`;
  };

  const handleComment = () => {
    addComment();
  };

  const fetchInitialLikeStates = async () => {
    try {
      const res = await fetchPostApi();
      setProfileDatas(res.data.posts);
      dispatch(setPostData(res.data.posts));
    } catch (err) {
      console.error("Error fetching initial like states:", err);
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchInitialLikeStates();
    };
    fetchData();
  }, [comments, fetchPostApi, dispatch, userInfo?._id]);

  return (
    <div style={{ marginLeft: "120px", marginTop: "20px" }}>
      {profileDatas && profileDatas.length > 0 ? (
        [...profileDatas].reverse().map((imageDetails, outerIndex) => (
          <div key={outerIndex}>
            {imageDetails.image.map((imgLink, innerIndex) => (
              <div key={`${outerIndex}-${innerIndex}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        imageDetails?.user?.profilePic || Default_profileIcon
                      }
                      alt=""
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <p style={{ marginLeft: 6 }}>
                      {imageDetails?.user?.username}
                    </p>
                  </div>
                  <ReportPost postId={imageDetails._id} />
                </div>

                <Modal
                  style={{ overlay: { backgroundColor: "#2e2b2bc" } }}
                  isOpen={modalIsOpen && postIdSelected === imageDetails?._id}
                  onRequestClose={() => setModalIsOpen(false)}
                  className={"modalForAPost"}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      <img
                        src={imgLink}
                        style={{
                          width: "100%",
                          height: "90vh",
                          objectFit: "cover",
                        }}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div style={{ flex: 1, height: "90vh" }}>
                      <div
                        style={{
                          height: "77vh",
                          overflow: "auto",
                          paddingLeft: 15,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            boxShadow: "0px 4px 5px rgba(0, 0, 0, 2)",
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
                              src={userInfo?.profilePic}
                              alt=""
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            <div style={{ paddingLeft: 10 }}>
                              <p style={{ marginBottom: 16 }}>
                                {userInfo?.username}
                              </p>
                              <p style={{ marginTop: -16 }}>
                                {userInfo?.profilename}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className="scrollable-div"
                          style={{ height: "65vh" }}
                        >
                          {comments
                            .filter((commentData) => commentData)
                            .map((commentData) => (
                              <div
                                key={commentData?._id}
                                style={{ display: "flex" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: 30,
                                    width: "100%",
                                  }}
                                >
                                  <img
                                    src={
                                      commentData?.user?.profilePic ||
                                      Default_profileIcon
                                    }
                                    alt=""
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                      marginBottom: 20,
                                    }}
                                  />
                                  <div style={{ marginLeft: 10 }}>
                                    <p
                                      style={{ marginLeft: 5, paddingTop: 28 }}
                                    >
                                      {commentData?.user?.username ||
                                        "Unknown User"}
                                    </p>
                                    <p style={{ marginTop: -5 }}>
                                      {commentData?.content}
                                    </p>

                                    <p
                                      style={{
                                        color: "#A8A8A8",
                                        marginTop: -5,
                                      }}
                                    >
                                      {commentData?.createdAt &&
                                        formatDateDistance(
                                          new Date(commentData?.createdAt)
                                        )}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    marginTop: 30,
                                    cursor: "pointer",
                                    marginRigt: 5,
                                  }}
                                >
                                  <>
                                    <ReportOnComment
                                      commentId={commentData?._id}
                                    />
                                  </>
                                  {loggedinId === commentData?.user?._id && (
                                    <>
                                      <DeleteComment
                                        commentId={commentData?._id}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
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
                          <div
                            style={{
                              marginTop: 0,
                              marginLeft: -15,
                              display: "flex",
                            }}
                          >
                            <LikeOnPost postId={imageDetails._id} />
                            <div style={{ paddingTop: 10, paddingLeft: -10 }}>
                              <img
                                src={CommentButton}
                                style={{ marginLeft: 13, cursor: "pointer" }}
                                alt=""
                              />
                            </div>
                            <div style={{ paddingTop: 10, paddingLeft: -10 }}>
                              <img
                                src={ShareButton}
                                style={{ marginLeft: 13, cursor: "pointer" }}
                                alt=""
                              />
                            </div>
                          </div>

                          <SavePost postId={imageDetails._id} />
                        </div>
                        <p style={{ marginTop: -4 }}>79,596 likes</p>
                        <p
                          style={{
                            marginTop: -10,
                            fontSize: 11,
                            color: "#A8A8A8",
                          }}
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
                            onChange={(e) => setwrittenComment(e.target.value)}
                            placeholder="Add a comment"
                          />
                        </div>
                        <div
                          style={{ flex: 0.3, marginTop: -16, marginLeft: 70 }}
                          onClick={handleComment}
                        >
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
                </Modal>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "80%",
                  }}
                >
                  {!imageLoaded && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#ace3de",
                        filter: "blur(10px)",
                        visibility: imageLoaded ? "hidden" : "visible",
                      }}
                    />
                  )}
                  <img
                    key={imageDetails._id}
                    src={imgLink}
                    alt=""
                    loading="lazy"
                    style={{
                      opacity: imageLoaded ? 1 : 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "opacity 0.5s ease",
                    }}
                    onLoad={() => {
                      setImageLoaded(true);
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <LikeOnPost postId={imageDetails._id} />
                    <div
                      onClick={() => {
                        handleShowModal(imageDetails._id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={CommentButton}
                        className="LogoPostIcons"
                        alt=""
                      />
                    </div>
                    <ForwardPost
                      className="LogoPostIcons"
                      postId={imageDetails._id}
                    />
                  </div>
                  <SavePost postId={imageDetails} />
                </div>

                <div key={"index"}>
                  <p style={{ display: "flex", marginTop: "0px" }}>
                    {imageDetails.likes.length} likes
                  </p>
                  {/* <p style={{ textAlign: "start" }}>
                    Photo by @daisygilardini / A northern fulmar, also called
                    the Arctic fulmar, follows our ship off Svalbard, with a...
                  </p> */}
                  <div
                    onClick={() => handleShowModal(imageDetails["index"]._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <p
                      onClick={() => handleShowModal(imageDetails["index"]._id)}
                      style={{ textAlign: "start", color: "#A8A8A8" }}
                    >
                      View all {imageDetails.comments.length} comments
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    textAlign: "start",
                    fontSize: "14px",
                    color: "#A8A8A8",
                  }}
                >
                  {imageDetails?.createdAt &&
                    formatDateDistance(new Date(imageDetails?.createdAt))}
                </p>

                <Divider
                  sx={{
                    width: "100%",
                    borderColor: "#494b4d",
                    marginBottom: 5,
                  }}
                />

                {!isPremium && (outerIndex + 1) % 2 === 0 && (
                  <div key={`adElements-${outerIndex}`}>
                    <AdpostByAdmin />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default Post;
