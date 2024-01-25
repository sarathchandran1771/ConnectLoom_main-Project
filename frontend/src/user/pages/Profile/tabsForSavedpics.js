//user/pages/profile/tabs.js
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import SavedPost from "./savedPosts.js";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {animated } from 'react-spring';
import Paper from '@mui/material/Paper';
import ProfilePost from './profilePost'
import ArchivedPosts from './archivedPost.jsx'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 0}}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }
  export default function FullWidthTabs() {

    const theme = useTheme();
    const [value, setValue] = useState(0);
    const {userInfo} = useSelector((state) => state.auth);
    const { userId } = useParams();

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };


    const isOwnProfile = () => {
      return userInfo?._id === userId;
    };

// Define the tabs for own and other profiles
const tabsForOwnProfile = [
  <Tab icon={<DynamicFeedOutlinedIcon />} label="posts" {...a11yProps(0)} />,
  <Tab icon={<ArchiveOutlinedIcon />} label="Archive" {...a11yProps(1)} />,
  <Tab icon={<BookmarkOutlinedIcon />} label="Saved" {...a11yProps(2)} />,
];

const tabsForOtherProfile = [
  <Tab icon={<DynamicFeedOutlinedIcon />} label="posts" {...a11yProps(0)} />,
];

const tabsToDisplay = isOwnProfile() ? tabsForOwnProfile : tabsForOtherProfile;

// 

  return (
    <Paper
    sx={{
      bgcolor: 'transparent',
      width: '100%',
      marginLeft: '0%',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="black"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
        sx={{ backgroundColor: 'transparent' }}
      >
        {tabsToDisplay }  
      </Tabs>
    </AppBar>
      <animated.div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
        <ProfilePost/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
        <ArchivedPosts />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <SavedPost />
        </TabPanel>
      </animated.div>
    </Paper>
  );
}
