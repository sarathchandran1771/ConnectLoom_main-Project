import React, { useState,useEffect} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
  useGetfollowingsDataMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { useParams } from "react-router-dom";
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

const FollowingList = ({mappedData}) => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [followingUsersData, { isLoading }] = useGetfollowingsDataMutation();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [followingIds, setFollowingIds] = useState([]);
    const [selectedId, setSelectedId] = useState("");

  // Extract following IDs and update the state when the component mounts
  useEffect(() => {

    const fetchData = async () => {
      try {
        const { data } = await followingUsersData({ userId: userId }).unwrap();

        setFollowingIds(data)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData(); 
  }, [mappedData, userId]);

  // console.log("followingIds", followingIds);
  const handleProfileClick = (selectedId) => {
    setSelectedId(selectedId);
    navigate(`/profile/${selectedId}`);
    setOpen(false)
 };

  return (
    <div>
      <Button style={{ marginLeft: "20px", cursor:'pointer', color:'white'}} onClick={handleOpen}>{mappedData?.user?.account?.followingCount} Following</Button>
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
          {followingIds && followingIds.map(user => (
          <div style={{display:'flex', marginTop:20,  maxHeight: '500px', overflowY: 'hidden' }}>
            <div>
                <img style={{height:"50px", width:"45px",borderRadius:"45px"}} src={user?.profilePic} alt="" /> 
            </div>
            <div onClick={() => handleProfileClick(user?._id)}>
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

export default FollowingList
