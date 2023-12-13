import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <Box sx={modalStyle}>
            <ul style={{ listStyle: "none", textAlign: "center" }}>
                <li className="MoreText">
                  <Typography variant="3" component="h2">
                    Profile
                  </Typography>
                </li>
              <hr style={{ width: "100%", textAlign: "start" }} />
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
      </Modal>
    </div>
  );
}