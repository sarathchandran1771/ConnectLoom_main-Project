import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import Divider from "@mui/material/Divider";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useReportOnCommentMutation } from "../../../../Shared/redux/userSlices/userSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ITEM_HEIGHT = 58;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const names = [
  "It's spam",
  "Nudity or sexual activity",
  "Hate speech or symbols",
  "Violence or dangerous organizations",
  "Sale of illegal or regulated goods",
  "Billying or harassment",
  "Intellectual property violation",
  "False information",
  "Suicide, self-injury or eating disorders",
  "I just don't like it",
];

export default function PostReportOnComment(props) {
  const [open, setOpen] = React.useState(false);
  const [postReportOnComment] = useReportOnCommentMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [reportReason, setReportReason] = React.useState([]);
  const { reportedCommentId } = props;
  const loggedInId = userInfo._id;
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setReportReason(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const addReportOnComment = async () => {
    try {
      const response = await postReportOnComment({
        userId: loggedInId,
        reportReason: reportReason,
        parentComment: reportedCommentId,
      }).unwrap();
      toast.success(response.message);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Call addReportOnComment asynchronously
      handleClose();
      await addReportOnComment();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div>
      <Button
        style={{
          color: "red",
          fontWeight: 400,
          fontSize: 18,
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        Report
      </Button>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Typography
                  id="spring-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ marginBottom: 10 }}
                >
                  Report
                </Typography>
              </div>
              <div style={{ cursor: "pointer" }}>
                <CloseOutlinedIcon onClick={handleClose} />
              </div>
            </div>
            <Divider sx={{ width: "100%", borderColor: "#494b4d" }} />
            <Typography
              id="spring-modal-title"
              variant="h6"
              component="h2"
              style={{ marginTop: 5 }}
            >
              Why are you reporting this comment?
            </Typography>
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={reportReason}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={reportReason.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <Button
              onClick={handleSubmit}
              style={{
                color: "red",
                fontWeight: 400,
                fontSize: 18,
                cursor: "pointer",
                marginLeft: "330px",
              }}
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
