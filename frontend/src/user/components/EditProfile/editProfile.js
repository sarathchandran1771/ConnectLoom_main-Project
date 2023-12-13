// eslint-disable-next-line react/jsx-no-undef
import React,{useState,useRef }  from 'react';
import './editProfile.css'
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Default_profileIcon from '../../Icons/Default_ProfilePic.jpg'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Example import for a string type
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

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {userInfo} = useSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState(userInfo.username);
  const [profilename, setProfilename] = useState(userInfo.profilename);
  const [password, setPassword] = useState(userInfo.password);
  const [privatePublic, setPrivatePublic] = useState(userInfo.privatePublic);
  const [bio, setBio] = useState(userInfo.bio); 
  
  const [state, setState] = React.useState({
    right: false,
  });

  if (!userInfo || userInfo.length === 0) {
    // Handle loading state or empty data here
    return <div>Loading...</div>;
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };  

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const StyledTextLink = styled('label')({
    cursor: 'pointer',
    color: 'blue', 
    textDecoration: 'none', 
    '&:hover': {
      textDecoration: 'none',
    },
  });

  //workspace
  // Reference to the file input element
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileInputChange = (e) => {
    const profilePic = e.target.files[0];

    const imageUrl = URL.createObjectURL(profilePic);
    setSelectedImage(imageUrl);
    handleClose()
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
      handleClose()
      setSelectedImage('');

    };


  //workspace
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>

  );


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.patch('http://localhost:5000/edit-profile',{
        userId: userInfo._id,
        username: username,
        profilename: profilename,
        password: password,
        privatePublic: userInfo.privatePublic,
        profilePic: userInfo.profilePic, 
        Bio: bio,
      });
  
      // dispatch(updateUserProfile(response.data.updatedUser));

      // Handle success response
      console.log(response.data);
      navigate('/')
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return (
    <div className="componentProfileEdit">
      <form onSubmit={handleSubmit}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid  container spacing={2}>
          <Grid  xs={6} md={8}>
            <Item >
              <Grid container spacing={2} columns={10}>
                <Grid className="usernameGrid" xs={5}>
                <Item style={{  backgroundColor:'black'}} onClick={handleOpen}>
                  {imageLoading ? (
            // Display spinner while the image is loading
            <div >Loading Spinner...</div>
          ) : (
            // Display the image
            <img
            src={selectedImage || Default_profileIcon}
            style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid white',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
      <StyledTextLink htmlFor="fileInput" onClick={handleOpen}>
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
                  <Item className="usernameItem">
                    
                    <p className="ListItems">Username:</p>
                    <input className="InputItemsOfProfile" type="text" value={username}
                     onChange={(e) => setUsername(e.target.value)}
                    />
                  </Item>
                  <Item className="usernameItem">
                    <p className="ListItems">Profilename:</p>
                    <input
            className="InputItemsOfProfile"
            type="text"
            value={profilename}
            onChange={(e) => setProfilename(e.target.value)}
          />
                  </Item>
                  <Item className="usernameItem">
                    <p className="ListItems"> emailId:</p>
                    <input className="InputItemsOfProfile" value={userInfo.emailId}/>
                  </Item>
                  <Item className="usernameItem">
  <p className="ListItems">Password:</p>
  <input
    className="InputItemsOfProfile"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</Item>

                </Grid>
              </Grid>
            </Item>
          </Grid>

          <Grid xs={6} md={4}>
            <Item>
              <React.Fragment key={"right"}>
                <Button onClick={toggleDrawer("right", true)}>
                  More Options
                </Button>
                <SwipeableDrawer
                  anchor={"right"}
                  open={state["right"]}
                  onClose={toggleDrawer("right", false)}
                  onOpen={toggleDrawer("right", true)}
                >
                  {list("right")}
                </SwipeableDrawer>
              </React.Fragment>
            </Item>
          </Grid>

          <Grid xs={6} md={4} borderRadius={50}>

            <Item className="ListItemsProfileData">
            <p className="ListItems">Bio</p>
            </Item>
            <Item className="ListProfileDataGender">
            <p className="ListItems">Gender</p>
            </Item>
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
          /></div>
            <Item className="ItemsProfileData">
              <text  className="InputItemsOfProfileData" type="text" placeholder='Enter your Data' value={"Gender"} />

            </Item>
          </Grid>
          <Modal
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
              <hr style={{ width: "100%", textAlign: "center", overflow:"hidden" }} />
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
              <hr style={{ width: "100%", textAlign: "start" }} />
              <li className="MoreText">
                <Typography variant="3"onClick={handleRemoveClick} component="h3"style={{color:"red",fontWeight:600, fontSize:18}}>
                Remove profile photo
                </Typography>
              </li>
              <hr style={{ width: "100%", textAlign: "start" }} />
              <li className="ProfileUpdateText">
                <Typography variant="3" component="h3"fontWeight={100} fontSize={18} onClick={handleClose}>
                  cancel
                </Typography>
              </li>
            </ul>
          </Box>
      </Modal>
  <button className='saveChangesButton ' type="submit">Save Changes</button>
        </Grid>
      </Box>
</form>
    </div>
  );
}

export default EditProfile;

