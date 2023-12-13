//frontend/src/user/components/sidebar/sidebar.js
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useLogoutMutation,
  useGetDataPostedMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { logout } from "../../../Shared/redux/userSlices/authSlice";
import "./Sidebar.css";
import Homeicon from "../../Icons/home.png";
import Searchicon from "../../Icons/Search.png";
import Exploreicon from "../../Icons/Explore.png";
import Messageicon from "../../Icons/Messenger.png";
import Notificationicon from "../../Icons/Notifications.png";
import Createicon from "../../Icons/New post.png";
import Profileicon from "../../Icons/sample_profile.JPG";
import Instagram from "../../Icons/Instagram.png";
import InstagramIcon from "../../Icons/Instagramlogo.png";
import MoreIcon from "../../Icons/Settings.png";
import NewPost from "../../Icons/IconToCreateNewPost.png";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MaterialModal from "@mui/material/Modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Paper from "@mui/material/Paper";
import { TailSpin as Loader } from "react-loader-spinner";

export default function Sidebar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleShowModal = () => {
    setModalIsOpen(true);
  };

  const [image, setImage] = useState([]);
  const [imagepre, setimagePre] = useState([]);
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [logoutApiCall] = useLogoutMutation();

  const modalStyle = {
    position: "absolute",
    top: "80%",
    right: "70%",
    transform: "translate(-50%, -50%)",
    width: 250,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
  };

  //workSpace

  const { userInfo } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState([]);

  const [data] = useGetDataPostedMutation();

  //workSpace
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      console.log("logout");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSearchText = () => {
    setShowSearch(!showSearch);
  };

  const handlePostSubmit = async () => {
    try {
      setLoading(true);

      if (imagepre.length === 0) {
        throw new Error("There is no post available.");
      }
      // Get user information from localStorage
      const userinfoString = localStorage.getItem("userInfo");
      if (!userinfoString) {
        throw new Error("User information not found in localStorage");
      }

      const userinfo = JSON.parse(userinfoString);

      const apiUrl = "http://localhost:5000/post/post";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userinfo._id}`,
      };

      const data = new FormData();
      for (const img of image) {
        data.append("file", img);
      }
      data.append("upload_preset", "connectloom");
      data.append("cloud_name", "dnudvzoj9");

      // Use fetch to send the image data to Cloudinary
const cloudinaryResponses = await Promise.all(
  imagepre.map(async (img) => {
    const data = new FormData();
    data.append("file", img.file);
    data.append("upload_preset", "connectloom");
    data.append("cloud_name", "dnudvzoj9");

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/dnudvzoj9/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error(
        `Cloudinary API error: ${cloudinaryResponse.statusText}`
      );
    }

    return await cloudinaryResponse.json();
  })
);

      const cloudinaryData = cloudinaryResponses.map((res) => res);
      const requestData = {
        cloudinaryData: cloudinaryData,
        userinfo: userinfoString,
        headers: headers,
      };

      // Use fetch to send the data to your backend
      const backendResponse = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestData),
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend API error: ${backendResponse.statusText}`);
      }
      const responseData = await backendResponse.json();

      if (responseData) {
        setLoading(false);
        setModalIsOpen(false);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      if (error.response) {
        console.error("Response details:", error.response.data);
      }
    }
  };

  const handleFileChange = async (event) => {
    const selectedImages = event.target.files;
    setImage([...selectedImages]);
  
    const processImage = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
  
        reader.onload = (e) => {
          resolve({
            file: e.target.result,
            label: file.name,
          });
        };
  
        reader.readAsDataURL(file);
      });
    };
  
    try {
      const imageArray = await Promise.all(
        Array.from(selectedImages).map((file) => processImage(file))
      );
  
      console.log("imageArray",imageArray)

      setimagePre(imageArray);
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };
  
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % imagepre.length);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) =>
        (prevActiveStep - 1 + imagepre.length) % imagepre.length
    );
  };

  const handleStepChange = (index) => {
    setActiveStep(index);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: handleStepChange,
  };

  return (
    <div className="mainSidebar">
      <Modal
        isOpen={modalIsOpen}
        style={{ overlay: { backgroundColor: "#2e2b2bc" } }}
        onRequestClose={() => setModalIsOpen(false)}
        className={"modalForAPost"}
      >
        <div style={{ flex: 1, height: "70vh" }}>
          {imagepre.length === 0 ? (
            <div>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "auto",
                  justifyContent: "center",
                  fontWeight: 600,
                  marginTop: -10,
                }}
              >
                Create new Post
              </p>
              <div
                style={{
                  display: "flex",
                  marginTop: 100,
                  alignItems: "center",
                  margin: "auto",
                  justifyContent: "center",
                }}
              >
                <div style={{ marginTop: 240, marginLeft: 100 }}>
                  <img src={NewPost} style={{ marginLeft: 25 }} alt="" />
                  <p
                    style={{
                      fontWeight: 600,
                      marginLeft: "-40px",
                      fontSize: 18,
                    }}
                  >
                    Drag photos here
                  </p>
                  <label htmlFor="file">
                    <div
                      style={{
                        backgroundColor: "#0095F6",
                        paddingLeft: 60,
                        marginLeft: -30,
                        borderRadius: 4,
                      }}
                    >
                      <p style={{ paddingTop: "6px", paddingBottom: "7px" }}>
                        Choose Post
                      </p>
                    </div>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex" }}>
                <div
                  key={"index"}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Box sx={{ maxWidth: 600, flexGrow: 1 }}>
                    <Paper
                      square
                      elevation={0}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: 50,
                        pl: 2,
                        bgcolor: "background.default",
                      }}
                    >
                      <Typography>{imagepre[activeStep].label}</Typography>
                    </Paper>
                    <Slider {...settings}>
                      {imagepre.map((step, index) => (
                        <div key={index}>
                          <Box
                            component="img"
                            sx={{
                              height: 755,
                              display: "block",
                              maxWidth: 900,
                              overflow: "hidden",
                              width: 600,
                            }}
                            src={step.file}
                            alt={step.label}
                          />
                        </div>
                      ))}
                    </Slider>
                  </Box>
                  <div style={{ marginLeft: 100, width: 400 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        src="https://www.befunky.com/images/prismic/82e0e255-17f9-41e0-85f1-210163b0ea34_hero-blur-image-3.jpg?auto=avif,webp&format=jpg&width=896"
                        alt=""
                      />
                      <p
                        style={{
                          marginLeft: 10,
                          fontWeight: 600,
                          fontSize: 16,
                        }}
                      >
                        mamam
                      </p>
                    </div>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple
                      style={{ display: "none" }}
                    />
                    <textarea
                      type="text"
                      name="text"
                      className="textInputForPost"
                      id="text"
                      placeholder="write a description"
                    />
                    <button className="createPost" onClick={handlePostSubmit}>
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {loading && (
              <Loader
                type="TailSpin"
                color="#69edf0"
                height={100}
                width={100}
              />
            )}
          </div>
        </div>
      </Modal>

      <div>
        <div style={{ display: "flex", marginTop: "45px", marginLeft: "30px" }}>
          {showSearch === false ? (
            <img src={InstagramIcon} alt="" className="logos" />
          ) : (
            <img src={Instagram} alt="" className="logos" />
          )}
        </div>

        <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "30px",
              marginLeft: "30px",
              cursor: "pointer",
            }}
          >
            <img src={Homeicon} alt="Home" className="logos" />
            {showSearch && (
              <ul>
                <li className="listText">Home</li>
              </ul>
            )}
          </div>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "30px",
            marginLeft: "30px",
            cursor: "pointer",
          }}
          onClick={toggleSearchText}
        >
          <img src={Searchicon} alt="Search" className="logos" />
          {showSearch && (
            <ul>
              <li className="listText">Search</li>
            </ul>
          )}
        </div>

        <Link
          to={"/explore"}
          style={{ textDecoration: "none", color: "white" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "30px",
              marginLeft: "30px",
              cursor: "pointer",
            }}
          >
            <img src={Exploreicon} alt="Explore" className="logos" />
            {showSearch && (
              <ul>
                <li className="listText">Explore</li>
              </ul>
            )}
          </div>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "30px",
            marginLeft: "30px",
            cursor: "pointer",
          }}
        >
          <img src={Messageicon} alt="Message" className="logos" />
          {showSearch && (
            <ul>
              <li className="listText">Message</li>
            </ul>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "30px",
            marginLeft: "30px",
            cursor: "pointer",
          }}
        >
          <img src={Notificationicon} alt="Notification" className="logos" />
          {showSearch && (
            <ul>
              <li className="listText">Notification</li>
            </ul>
          )}
        </div>
        <div
          onClick={handleShowModal}
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "30px",
            marginLeft: "30px",
            cursor: "pointer",
          }}
        >
          <img src={Createicon} alt="Create" className="logos" />
          {showSearch && (
            <ul>
              <li className="listText">Create</li>
            </ul>
          )}
        </div>
        <Link to={"/profile"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "30px",
              marginLeft: "30px",
              cursor: "pointer",
            }}
          >
            <img src={Profileicon} alt="Profile" className="profileIcon" />
            {showSearch && (
              <ul>
                <li className="listText">Profile</li>
              </ul>
            )}
          </div>
        </Link>

        <MaterialModal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <ul style={{ listStyle: "none", textAlign: "center" }}>
              <Link to={"/profile"}>
                <li className="MoreText">
                  <Typography variant="3" component="h2">
                    Profile
                  </Typography>
                </li>
              </Link>
              <hr style={{ width: "100%", textAlign: "start" }} />
              <li className="MoreText" onClick={logoutHandler}>
                <Typography variant="3" component="h2">
                  Logout
                </Typography>
              </li>
              <hr style={{ width: "100%", textAlign: "start" }} />

              <li className="MoreText">
                <Typography variant="3" component="h2">
                  Settings
                </Typography>
              </li>
              <hr style={{ width: "100%", textAlign: "start" }} />
              <li className="MoreText">
                <Typography variant="3" component="h2">
                  Report
                </Typography>
              </li>
            </ul>
          </Box>
        </MaterialModal>
        <div className="moreIcon" onClick={handleOpen}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "30px",
              marginLeft: "30px",
              cursor: "pointer",
            }}
          >
            <img src={MoreIcon} alt="More" className="profileIcon" />
            {showSearch && (
              <ul>
                <li className="listText">More</li>
              </ul>
            )}
          </div>
        </div>
      </div>
      {!showSearch && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "black",
            marginLeft: 10,
          }}
        >
          <p
            style={{
              color: "white",
              fontWeight: 600,
              fontSize: 27,
              marginLeft: 10,
              marginTop: 35,
            }}
          >
            Search
          </p>
          <div
            style={{ display: "flex", alignContent: "center", marginLeft: 10 }}
          >
            <input
              type="text"
              className="showSearchInput"
              placeholder="Search"
            />
          </div>
          <hr />
          <p style={{ marginLeft: 10, fontWeight: 600 }}>Recent</p>

          <div style={{ height: "80vh", overflow: "auto" }}>
            {profileData.map((imagesArray, index) => (
              <div key={index}>
                {imagesArray.map((item, subIndex) => (
                  <div
                    key={subIndex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 15,
                      marginTop: -12,
                    }}
                  >
                    <img
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                      src={item.image}
                      alt=""
                    />
                    <div style={{ marginLeft: 10 }}>
                      <p style={{ marginTop: 20, fontSize: 15 }}>{item.name}</p>
                      <p style={{ marginTop: -15, color: "#A8A8A8" }}>
                        {item.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
