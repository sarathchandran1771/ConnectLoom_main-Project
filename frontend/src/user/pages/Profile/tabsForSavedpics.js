//user/pages/profile/tabs.js
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import MasonryImageList from "./profilePostContainer";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSpring, animated } from 'react-spring';
import Paper from '@mui/material/Paper';
import ProfilePost from './profilePost'


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
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  return (
    <Paper sx={{ bgcolor: 'transparent', width: '100%', marginLeft: '0%', padding: 0, display: 'flex', flexDirection: 'column' }}>
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
          <Tab icon={<DynamicFeedOutlinedIcon />} label="posts" {...a11yProps(0)} />
          <Tab icon={<ArchiveOutlinedIcon />} label="Archive"{...a11yProps(1)} />
          <Tab icon={<BookmarkOutlinedIcon />}label="Saved" {...a11yProps(2)} />
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
        <MasonryImageList />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <MasonryImageList />
        </TabPanel>
      </animated.div>
    </Paper>
  );
}
