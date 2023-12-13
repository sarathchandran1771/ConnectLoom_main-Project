//user/pages/profile/profile.js
import React,{useState,useRef, useEffect  }  from 'react';
import './Profile.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import SettingIcon from '../../Icons/Settingslogo.png';
import "../../pages/Explore/Explore.css";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography} from "@mui/material";
import MaterialModal from '@mui/material/Modal';
import Default_profileIcon from '../../Icons/Default_ProfilePic.jpg'
import { useTheme } from '@mui/material/styles';
import LikeButton from "../../Icons/Notifications.png";
import UnLike from "../../Icons/Unlike.png";
import Divider from '@mui/material/Divider';
import FullWidthTabs from "./tabsForSavedpics"

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  height:220,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius:'15px',
  boxShadow: 30,
  p: 3,
};

export default function Profile() {
  const { profileData } = useSelector((state) => state.postData);
  const [mappedData, setMappedData] = useState([]);
  const {userInfo} = useSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState('');
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //workSpace


  useEffect(() => {
    const newMappedData = profileData.map(post => {
      if (post.user && post.user._id === userInfo._id) {
        return {
          postInfo: post,
          userInfo: userInfo 
        };
      }
      return null; 
    }).filter(Boolean);

    setMappedData(newMappedData);
  }, [userInfo, profileData]); 
  console.log("Mapped Data:", mappedData); 


  // Reference to the file input element
  const fileInputRef = useRef(null);

  if (!profileData || profileData.length === 0) {
    // Handle loading state or empty data here
    return <div>Loading...</div>;
  }
  // const userProfile = profileData[0];


  // functions for handeling the modal (open & close) & setting the URL  of the profile pic
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileInputChange = (e) => {
    const profilePic = e.target.files[0];
    const imageUrl = URL.createObjectURL(profilePic);
    uploadProfileImage();
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
      uploadProfileImage();
      setImageLoading(false);
    };

    // Handle remove profile photo click
    const handleRemoveClick = () => {
      handleClose()
      setSelectedImage('');
    };
// ****************************************************************************
const uploadProfileImage = async () => {
  try {
    // Ensure selectedImage is populated with the correct file
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const file = new File([blob], selectedImage.name || "profile_image.jpg");


    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "connectloom");
    data.append("cloud_name", "dnudvzoj9");
    console.log("selectedImage:", selectedImage);
    console.log("Cloudinary Request Data:", data);
    
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/dnudvzoj9/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    

    if (!cloudinaryResponse.ok) {
      try {
        const cloudinaryError = await cloudinaryResponse.json();
        console.error("Cloudinary API error:", cloudinaryError);
        throw new Error(`Cloudinary API error: ${cloudinaryError.message}`);
      } catch (error) {
        console.error("Error parsing Cloudinary API error response:", error);
      }
    }
    const cloudinaryData = await cloudinaryResponse.json();
    console.log("cloudinaryData", cloudinaryData);

    const apiUrl = "http://localhost:5000/uplaod-profileImage";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo._id}`,
    };

    const requestData = {
      cloudinaryData,
      userinfo: userInfo._id,
      headers: headers,
    };

    const backendResponse = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestData),
    });

    if (!backendResponse.ok) {
      console.error("Backend API error:", backendResponse.statusText);
      throw new Error(`Backend API error: ${backendResponse.statusText}`);
    }

    const responseData = await backendResponse.json();
    console.log("responseData", responseData);

    if (responseData) {
      setLoading(false);
      setModalIsOpen(false);
      navigate("/home");
    }
  } catch (error) {
    console.error("Error uploading file:", error.message);
    console.error("Error details:", error);
  }
};

//*********************************************************************** */
// the functions for the handling comment modal  open & close
    const handleImageOpen = () => {
      setIsOpen(true);
    };
  
    const handleImageClose = () => {
      setIsOpen(false);
    };
  
    const handleImageClick = (index) => {
      console.log('Clicked on image with index:', index);

      setSelectedIndex(index);
    };

    const handleShowModal = () => {
      setModalIsOpen(true);
    };



    // the function for handle Open DeleteConfirmation
    const handleOpenDeleteConfirmation = (event) => {
      setAnchorEl(event.currentTarget);
      setDeleteConfirmationOpen(true);
    };

      // the function for handle close DeleteConfirmation
    const handleCloseDeleteConfirmation = () => {
      setDeleteConfirmationOpen(false);
    };

    const handleLike = () => {
      if (IsLike === LikeButton) {
        setIsLike(UnLike);
      } else {
        setIsLike(LikeButton);
      }
    };
  

    // the function for handle Comment ModalOpen
        const handleCommentModalOpen = (index) => {
          const postId = mappedData[index].postInfo._id; 
          console.log("postIdpostId", postId);
          setPostIdToDelete(postId);
          setIsOpen(true)
      
        };
        const handleCommentModalClose = () => setIsOpen(false);
  
  
        const renderImages = (mappedItem) => {
          return Array.isArray(mappedItem.postInfo.image)
            ? mappedItem.postInfo.image.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                  alt=""
                  onClick={() => handleImageClick(index)}
                />
              ))
            : null;
        };
    //work Space
    const totalPostCount = mappedData.length;

  return (
    <div>
      <div className="homeSubContainer">
        <div className="homeSidebar">
          <Sidebar />
        </div>

        <div className="profileRightbar">
          
        <div className="subProfileRightbar">
  {mappedData.length > 0 && mappedData[0]?.postInfo?.user && (
    <div style={{ width: "70%", display: 'flex' }}>
      {imageLoading ? (
        <div>Loading Spinner...</div>
      ) : (
        <img
          src={mappedData[0].postInfo?.user?.profilePic || Default_profileIcon}
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          alt=""
          onClick={handleOpen}
          onLoad={handleImageLoad}
        />
      )}
      <div style={{ marginLeft: "25px", textAlign: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <p style={{ marginLeft: '100px', fontWeight: "800", color: '' }}>{mappedData[0].postInfo.user.username}</p>
          </div>
          <div style={{ marginLeft: '20px' }}>
            <Link to={`/editProfile`}>
              <button
                style={{
                  paddingLeft: '18px',
                  paddingRight: '20px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Edit Profile
              </button>
            </Link>
            <img
              src={SettingIcon}
              style={{ marginLeft: '20px', cursor: 'pointer' }}
              alt=""
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '18px', marginRight: '10px' }}>{totalPostCount} posts</p>
          <p style={{ marginLeft: '20px' }}>{mappedData[0].postInfo.followers} followers</p>
          <p style={{ marginLeft: '20px' }}>{mappedData[0].postInfo.following} following</p>
        </div>


        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
  <p
    style={{
      marginTop: '5px',
      fontWeight: 600,
    }}
  >
    {mappedData.length > 0 ? (mappedData[0]?.postInfo?.user?.Bio || "No bio available") : "No bio available"}
  </p>
</div>


      </div>
    </div>
  )}
</div>



<div style={{alignItems:'center', marginTop:"10%"}}>
<Divider sx={{ width: '90%', borderColor: 'white' }} />

<FullWidthTabs />
</div>
        </div>

        <MaterialModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <Box sx={modalStyle} style={{padding:0}}>
            <ul style={{ listStyle: "none", textAlign: "center", padding:0,marigin:0 }}>
                <li className="MoreText">
                  <Typography variant="3" component="h2" fontWeight={400} paddingTop={2}paddingBottom={1.5}>
                    Change profile photo
                  </Typography>
                </li>
<Divider sx={{ width: '100%', borderColor: 'grey' }} />
              <li className="MoreText">
                  <Typography variant="3" component="h3" onClick={handleUploadClick} style={{color:"blue",fontWeight:600, fontSize:18}}>
                    Upload photo
                  </Typography>
                </li>
                <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
<Divider sx={{ width: '100%', borderColor: 'grey' }} />
              <li className="MoreText">
                <Typography variant="3"onClick={handleRemoveClick} component="h3"style={{color:"red",fontWeight:600, fontSize:18}}>
                Remove profile photo
                </Typography>
              </li>
<Divider sx={{ width: '100%', borderColor: 'grey' }} />
              <li className="ProfileUpdateText">
                <Typography variant="3" component="h3"fontWeight={100} fontSize={18} onClick={handleClose}>
                  cancel
                </Typography>
              </li>
            </ul>
          </Box>
      </MaterialModal>

      </div>

    </div>
  );
}
