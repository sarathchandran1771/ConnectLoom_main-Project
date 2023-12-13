/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
// import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Link to={to}>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.primary[300],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    </Link>
  );
};


const sidebar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Admin Pannel
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`data:image/jpeg;base64,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`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Ed Roh
                </Typography>
                <Typography variant="h5" color={colors.redAccent[500]}>
                  ConntectLoom Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Users"
              to="/admin/user-Management"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Post Information"
              to="/admin/post-Management"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/admin/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Complaints
            </Typography>
            <Item
              title="user report"
              to="/admin/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="post report"
              to="/admin/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default sidebar;