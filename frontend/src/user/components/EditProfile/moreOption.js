import React, { useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { useNavigate } from "react-router-dom";
import PaidTwoToneIcon from "@mui/icons-material/PaidTwoTone";

const MoreOptions = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Payments", "Ad preferences", "Blocked Accounts"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleListItemClick(text)}>
                <ListItemIcon>
                  {index % 3 === 0 ? (
                    <PaidTwoToneIcon />
                  ) : index % 3 === 1 ? (
                    <AddCardOutlinedIcon />
                  ) : (
                    <BlockOutlinedIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
    </Box>
  );

  const handleListItemClick = (text) => {
    // Handle navigation based on the selected option
    switch (text) {
      case "Payments":
        navigate("/payments");
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Grid container xs={6} md={4}>
        <Grid item>
          <div style={{ height: 50, width: 150, border: "1px solid white" }}>
            <React.Fragment key={"right"}>
              <Button
                onClick={toggleDrawer("right", true)}
                style={{
                  color: "white",
                  textAlign: "center",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  lineHeight: "40px",
                }}
              >
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
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MoreOptions;
