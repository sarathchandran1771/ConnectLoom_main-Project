import React, { useState } from "react";
import "./Post.css";
import MoreOptions from "../../Icons/MoreOptions.png";
import sampleProfile from "../../Icons/sample_profile.JPG";
import LikeButton from "../../Icons/Notifications.png";
import CommentButton from "../../Icons/comment.png";
import EmojiButton from "../../Icons/Emoji.png";
import ShareButton from "../../Icons/sharePost.png";
import SaveButton from "../../Icons/Save.png";
import UnLike from "../../Icons/Unlike.png";
import Modal from "react-modal";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MaterialModal from '@mui/material/Modal';
import {useGetReportPostMutation} from '../../../Shared/redux/userSlices/userSlice'
import { useDispatch } from 'react-redux';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none', 
  borderRadius: 5, 
  boxShadow: 24,
  p: 4,
};


export default function Post({ item }) {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [IsLike, setIsLike] = useState(LikeButton);
  const handleShowModal = () => {
    setModalIsOpen(true);
  };
  const [getReportPost] = useGetReportPostMutation();
  const [reportedPostId, setReportedPostId] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [comments, setComments] = useState([]);
  const [writtenComment, setwrittenComment] = useState("");

  const addComment = async () => {
    const comment = {
      postid: "8787870",
      username: "sarathkannan",
      comment: `${writtenComment}`,
      profile:
        "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    };
    setComments(comments.concat(comment));
  };

  const handleComment = () => {
    addComment();
  };

  const handleLike = () => {
    if (IsLike === LikeButton) {
      setIsLike(UnLike);
    } else {
      setIsLike(LikeButton);
    }
  };

  const handleReportMoodal = (postId) => {
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
    <div style={{ marginLeft: "120px", marginTop: "20PX" }}>
      {item && item.length > 0 ? (
        [...item].reverse().map((imageDetails, outerIndex) => (
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
                      src={sampleProfile}
                      alt=""
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <p style={{ marginLeft:6}}>{imageDetails?.user?.username}</p>
                  </div>
                  <div>
                    <img src={MoreOptions}  onClick={() => handleReportMoodal(imageDetails._id)} alt="" />
                  </div>
                </div>

                <Modal
                  style={{ overlay: { backgroundColor: "#2e2b2bc" } }}
                  isOpen={modalIsOpen}
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
                            <img src={MoreOptions} alt="" />
                          </div>
                        </div>

                        <div
                          className="scrollable-div"
                          style={{ height: "65vh" }}
                        >
                          {comments.map((item) => (
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
                                  marginTop: 20,
                                  
                                }}
                              />
                              <div style={{ marginLeft: 20, paddingLeft: 10 }}>
                                <p style={{marginLeft:5}}>{item.username}</p>
                                <p style={{ marginTop: -15 }}>{item.comment}</p>
                                <p style={{ color: "#A8A8A8", marginTop: -10 }}>
                                  1d
                                </p>
                              </div>
                            </div>
                          ))}

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
                                During the #HungryGhostFestival, celebrated in
                                parts of Asia throughout the seventh lunar
                                month, carefully-constructed paper items are
                                burned to honor the dead and comfort wandering
                                spirits.{" "}
                              </p>
                              <p style={{ color: "#A8A8A8", marginTop: -10 }}>
                                1d
                              </p>
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
                                During the #HungryGhostFestival, celebrated in
                                parts of Asia throughout the seventh lunar
                                month, carefully-constructed paper items are
                                burned to honor the dead and comfort wandering
                                spirits.{" "}
                              </p>
                              <p style={{ color: "#A8A8A8", marginTop: -10 }}>
                                1d
                              </p>
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
                                During the #HungryGhostFestival, celebrated in
                                parts of Asia throughout the seventh lunar
                                month, carefully-constructed paper items are
                                burned to honor the dead and comfort wandering
                                spirits.{" "}
                              </p>
                              <p style={{ color: "#A8A8A8", marginTop: -10 }}>
                                1d
                              </p>
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
                                During the #HungryGhostFestival, celebrated in
                                parts of Asia throughout the seventh lunar
                                month, carefully-constructed paper items are
                                burned to honor the dead and comfort wandering
                                spirits.{" "}
                              </p>
                              <p style={{ color: "#A8A8A8", marginTop: -10 }}>
                                1d
                              </p>
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
                                During the #HungryGhostFestival, celebrated in
                                parts of Asia throughout the seventh lunar
                                month, carefully-constructed paper items are
                                burned to honor the dead and comfort wandering
                                spirits.{" "}
                              </p>
                              <p style={{ color: "#A8A8A8", marginTop: -10 }}>
                                1d
                              </p>
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
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '100%',
                }}
              >
                {!imageLoaded && (
                  <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#ace3de',
                    filter: 'blur(5px)',
                    visibility: imageLoaded ? 'hidden' : 'visible',
                  }}
                  />
                )}

                <img
                  src={imgLink}
                  alt=""
                  loading="lazy"
                  style={{
                    display: imageLoaded ? 'block' : 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  onLoad={() => setImageLoaded(true)}
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
                    <div onClick={handleLike}>
                      <img src={IsLike} className="LogoPostIcons" alt="" />
                    </div>
                    <div
                      onClick={handleShowModal}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={CommentButton}
                        className="LogoPostIcons"
                        alt=""
                      />
                    </div>
                    <img src={ShareButton} className="LogoPostIcons" alt="" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={SaveButton} alt="" />
                  </div>
                </div>
                <p style={{ display: "flex", marginTop: "0px" }}>
                  14,155 likes
                </p>
                <p style={{ textAlign: "start" }}>
                  Photo by @daisygilardini / A northern fulmar, also called the
                  Arctic fulmar, follows our ship off Svalbard, with a...{" "}
                </p>
                <div onClick={handleShowModal} style={{ cursor: "pointer" }}>
                  <p style={{ textAlign: "start", color: "#A8A8A8" }}>
                    View all 2444 comments
                  </p>
                </div>
                <p
                  style={{
                    textAlign: "start",
                    fontSize: "11px",
                    color: "#A8A8A8",
                  }}
                >
                  5 Days Ago
                </p>

      <MaterialModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <Box sx={{...modalStyle,border: 'none'}}style={{padding:0, backgroundColor:'#292a2b',height:210}}>
            <ul style={{ listStyle: "none", textAlign: "center", padding:0,marigin:0  }}>
                <li className="MoreText" > 
                  <Typography   onClick={() => handleReportClick()} variant="3" component="h3"style={{color:"red",fontWeight:400,fontSize:18,cursor:'pointer'}}>
                    Report
                  </Typography>
                </li>
                <hr style={{ width: "100%", textAlign: "start", borderColor: "#494b4d" }} />
              <Typography variant="3" component="h3" style={{color:"red",fontWeight:400, fontSize:18,cursor:'pointer'}}>
                  Unfollow
                </Typography>
                <hr style={{ width: "100%", textAlign: "start", borderColor: "#494b4d" }} />
              <li className="MoreText">
                <Typography variant="3"color="White" component="h3"style={{fontWeight:400, fontSize:18,cursor:'pointer'}}>
                  About This account
                </Typography>
              </li>
              <hr style={{ width: "100%", textAlign: "start", borderColor: "#494b4d" }} />
              <li className="MoreText">
                <Typography variant="3" component="h3" style={{fontWeight:200,color:"White",fontSize:18,cursor:'pointer' }}   onClick={handleClose}>
                  Cancel
                </Typography>
              </li>
            </ul>
          </Box>
      </MaterialModal>
      </div>
            ))}
          </div>
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
}
