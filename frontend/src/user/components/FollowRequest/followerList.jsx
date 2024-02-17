import React, { useState,useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useParams } from "react-router-dom";
import {
    useGetfollowersDataMutation,
  } from "../../../Shared/redux/userSlices/userSlice";
import { useNavigate } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'hidden',
    maxHeight: '550px',
  };

const FollowerList = ({mappedData}) => {

    const navigate = useNavigate();
    const { userId } = useParams();
    const [followersData, { isLoading }] = useGetfollowersDataMutation();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [followersIds, setFollowersIds] = useState([]);
    const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await followersData({ userId: userId }).unwrap();
        setFollowersIds(data);
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }, [mappedData, userId]);

  const handleProfileClick = (selectedId) => {
     setSelectedId(selectedId);
     navigate(`/profile/${selectedId}`);
     setOpen(false)
  };

  return (
    <div >
      <Button style={{ marginLeft: "20px", cursor:'pointer', color:'white'}} onClick={handleOpen}>{mappedData?.user?.account?.followersCount} followers</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Follower List
          </Typography>
          <div>
          {followersIds && followersIds.map(user => (
          <div key={user._id} onClick={() => handleProfileClick(user?._id)} style={{display:'flex', marginTop:20,  maxHeight: '500px', overflowY: 'hidden' }}>
            <div>
                <img style={{height:"50px", width:"45px",borderRadius:"45px"}} src={user?.profilePic} alt="" /> 
            </div>
            <div>
                <p key={user._id} style={{ color: 'black', marginLeft: 10 }}>{user?.username}</p>
            </div>
          </div>
            ))} 
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default FollowerList
