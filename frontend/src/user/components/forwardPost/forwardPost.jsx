import React, { useState,useEffect } from "react";
import ShareButton from "../../Icons/sharePost.png";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Divider from "@mui/material/Divider";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "./ForwardPost.css"
import {
  useGetAllFriendsDataMutation,
  useCreateChatRoomMutation,
  useAddMessageMutation
 } from "../../../Shared/redux/userSlices/userSlice";
 import { useSelector } from "react-redux";
 import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
 import io from "socket.io-client";



 const ENDPOINT = "http://localhost:5000";
 var socket, selectedChatCompare;


const style = {
  position: 'absolute',
  top: '50%',
  left: '45.5%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const ForwardPost = (props) => {
  const selectedPostId = props?.postId;
  const [usersProfileData] = useGetAllFriendsDataMutation();
  const [createRoom] = useCreateChatRoomMutation();
  const [chatContent] = useAddMessageMutation();
  const { userInfo } = useSelector((state) => state.auth); 
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [allUsersData, setAllUsersData] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const loggedInUserId = userInfo?._id;
  const [socketConnected, setSocketConnected] = useState(false);
  const [allOfSelectedUsers, setAllOfSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const  dataResponse  = await usersProfileData({ userId: loggedInUserId }).unwrap();  
        setAllUsersData(dataResponse.users)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }, [loggedInUserId]);


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connection", () => setSocketConnected(true));
  }, []);


  const handleCheckboxChange = (index,user) => {
    const newCheckedUsers = [...checkedUsers];
    newCheckedUsers[index] = !newCheckedUsers[index];
    setCheckedUsers((prevCheckedUsers) => {
      const newCheckedUsers = [...prevCheckedUsers];
      newCheckedUsers[index] = !newCheckedUsers[index];
      setCheckedUsers(newCheckedUsers);
      if (newCheckedUsers[index] === true) {
        // If the checkbox is checked, add data to allOfSelectedUsers
        generateChatRoomId(user._id);
      } else {
        // If the checkbox is unchecked, remove data from allOfSelectedUsers
        setAllOfSelectedUsers((prevSelectedUsers) => {
          const updatedSelectedUsers = prevSelectedUsers.filter(
            (selectedUserId) => selectedUserId.receiver !== user._id
          );
          return updatedSelectedUsers;
        });
      }
      return newCheckedUsers;

    });
  };

  const generateChatRoomId = async (toUserIds) => {
    try {
      const response = await createRoom({
        fromUserId: loggedInUserId,
        toUserId: toUserIds,
      });
      if (response.data && response.data.chatRoom) {
        setAllOfSelectedUsers((prevUsers) => {
          const updatedUsers = [...prevUsers, response.data.chatRoom];
          const uniqueUsers = Array.from(new Set(updatedUsers.map((user) => user.receiver)))
            .map((receiver) => updatedUsers.find((user) => user.receiver === receiver));
          return uniqueUsers;
        });

      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const receiverData = allOfSelectedUsers.map(item => item.receiver);

  const handleSendMessage = async () => {
      try {

        for (const toUserId of receiverData) {
          const data = {
            fromUserId: loggedInUserId,
            toUserId: toUserId,
            forwardedPostId: selectedPostId,
          };
  
        const response = await chatContent(data).unwrap();
        if (response) {
          // Emit the message to the socket
          socket.emit("new message", response);
        } else {
          console.error("Failed to get sender information from the response");
        }
      }
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle other errors if needed
      }
  };
  
  return (
    <div>
      <img onClick={handleOpen} src={ShareButton} alt="" />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center", alignItems: "center" }}>
              <Typography
                id="spring-modal-title"
                variant="h6"
                component="h2"
                style={{ marginBottom: 4, display: "inline-block" }}
              >
                Share...
              </Typography>
            </div>
            <div style={{ cursor: "pointer" }}>
              <CloseOutlinedIcon onClick={handleClose} />
            </div>
          </div>
          <Divider sx={{ width: "100%", borderColor: "#494b4d" }} />

          <Typography
            id="modal-modal-description"
            sx={{ color: "black"}}
          >
            <div style={{display:'flex'}}>
            <div ><p style={{color:'black'}}>To: </p></div>
            <div style={{marginTop:'10px',marginLeft:'2px',width:'95%',fontSize:20}}>
              <input style={{fontSize:18,height:25,width:'100%',border:'none',outline: 'none',paddingTop:5}} placeholder="Search..." type="text" />
            </div>
            </div>
          </Typography>
          <Divider sx={{ width: "100%", borderColor: "#494b4d" }} />
          <p style={{ color: "black",fontSize:'20', fontWeight: "400", marginLeft:10, marginTop:10}}>Suggested</p>
          
          <div style={{marginTop:14,height:'50vh',overflow:'auto', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent'}} >

          <div>
      {allUsersData.map((user,index) => (
        <div
          className="hover-container"
          style={{ display: 'flex', justifyContent: 'space-between' }}
          key={user._id}
          onClick={() => handleCheckboxChange(index,user)}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ marginTop: 10 }}>
              <img
                style={{ height: 50, width: 50, borderRadius: '50%' }}
                src={user?.profilePic || Default_profileIcon}
                alt=""
              />
            </div>
            <div>
              <p style={{ color: 'black', fontSize: '20', fontWeight: '400', marginLeft: 10, marginTop: 20 }}>
                {user.username}
              </p>
            </div>
          </div>
          <div style={{ marginLeft: 10, marginTop: 10 }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={checkedUsers[index] || false} />}
              />
            </FormGroup>
          </div>
        </div>
      ))}
    </div>

          </div>
          <Divider sx={{ width: "100%", borderColor: "#494b4d" }} />
<div style={{width:'100%',height:'30px',marginTop:'15px'}}>
  <div onClick={handleSendMessage}>
    <button style={{width:'100%',height:'40px',backgroundColor:'#26b0de',border:'none',color:'white',fontSize:'18px',borderRadius:'8px',cursor:'pointer'}}>Send</button>
  </div>
</div>

        </Box>
      </Modal>
    </div>
  );
}

export default ForwardPost
