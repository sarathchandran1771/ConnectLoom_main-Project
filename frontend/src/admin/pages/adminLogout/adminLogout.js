import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { IconButton } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useLogoutMutation  } from '../../../Shared/redux/adminSlices/adminApiSlices';
import { logout } from "../../../Shared/redux/adminSlices/adminAuthSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '15%',
  left: '94%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export default function LogoutHandlerModal() {
const dispatch = useDispatch();
const navigate = useNavigate();
const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

  const [logoutApiCall] = useLogoutMutation();


  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      handleClose()
      navigate("/admin/adminLogin");
      toast.success('LogOut successfully');

    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <IconButton onClick={handleOpen}><PersonOutlinedIcon/></IconButton>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography onClick={logoutHandler} id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Logout
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}