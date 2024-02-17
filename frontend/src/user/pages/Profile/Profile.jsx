//user/pages/profile/profile.js
import React, { useState, useEffect } from "react";
import "./Profile.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import SettingIcon from "../../Icons/Settingslogo.png";
import "../../pages/Explore/Explore.css";
import { useSelector } from "react-redux";
import { Link} from "react-router-dom";
import Divider from "@mui/material/Divider";
import FullWidthTabs from "./tabsForSavedpics";
import { useParams } from "react-router-dom";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import FollowButton from "../../components/FollowRequest/followRequest";
import AcceptButton from "../../components/FollowRequest/acceptButton";
import ProfileImage from './profileImage/profileImage'
import FollowerList from "../../components/FollowRequest/followerList";
import FollowingList from "../../components/FollowRequest/followingList";
import {
  useGetProfileDataMutation
} from "../../../Shared/redux/userSlices/userSlice";
import ReportOnUser from '../../components/reportUser/reportUser'

export default function Profile() {
  const [userProfileData] = useGetProfileDataMutation();
  const [profileMappedData, setProfileMappedData] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const  dataResponse  = await userProfileData({ userId: userId }).unwrap();  
      setMappedData(dataResponse.user)
      setProfileMappedData(dataResponse.postByUser)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }, [userId]);

  const totalPostCount = profileMappedData ? profileMappedData?.length : 0;
  
  return (
    <div>
      <div className="homeSubContainer">
        <div className="homeSidebar">
          <Sidebar />
        </div>

        <div className="profileRightbar">
          <div className="subProfileRightbar">
            <div style={{ width: "70%", display: "flex" }}>

                <ProfileImage/>
              <div style={{ marginLeft: "25px", textAlign: "start" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex" }}>
                    <p
                      style={{
                        marginLeft: "100px",
                        fontWeight: "800",
                        color: "white",
                      }}
                    >
                      {mappedData?.username}
                    </p>
                    {mappedData?.isPremium === true ? (
                      <VerifiedOutlinedIcon
                        color="secondary"
                        style={{ height: 35, width: 35, marginTop: 15 }}
                      />
                    ) : null}
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    {userInfo?._id === mappedData?._id && (
                      <Link to={`/editProfile`}>
                        <button
                          style={{
                            paddingLeft: "18px",
                            paddingRight: "20px",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                            borderRadius: "9px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Edit Profile
                        </button>
                      </Link>
                    )}

                    {userInfo?._id !== mappedData?._id && (
                      <div style={{ display: "flex", paddingLeft: 20 }}> 
                        <FollowButton />
                        <div
                          style={{
                            cursor: "pointer",
                            paddingLeft: 5,
                            paddingTop: "6px",
                          }}
                        >
                          <ReportOnUser userId={userId} />
                        </div>
                      </div>
                    )}

                    {userInfo?._id === mappedData?._id && (
                      <img
                        src={SettingIcon}
                        style={{ marginLeft: "20px", cursor: "pointer" }}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginRight: "10px",
                    }}
                  >
                    {totalPostCount} posts 
                  </p>
                  <FollowerList mappedData={mappedData} />
                  <FollowingList mappedData={mappedData} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <p
                    style={{
                      marginTop: "5px",
                      fontWeight: 600,
                    }}
                  >
                    {mappedData?.Bio}
                  </p>
                </div>
                <AcceptButton />
              </div>
            </div>
          </div>

          <div style={{ alignItems: "center", marginTop: "10%" }}>
            <Divider sx={{ width: "90%", borderColor: "white" }} />
            <FullWidthTabs />
          </div>
        </div>
        {/* <MaterialModal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle} style={{ padding: 0 }}>
            <ul
              style={{
                listStyle: "none",
                textAlign: "center",
                padding: 0,
                marigin: 0,
              }}
            >
              <li className="MoreText">
                <Typography
                  variant="3"
                  component="h2"
                  fontWeight={400}
                  paddingTop={2}
                  paddingBottom={1.5}
                >
                  Change profile photo
                </Typography>
              </li>
              <Divider sx={{ width: "100%", borderColor: "grey" }} />
              <li className="MoreText">
                <Typography
                  variant="3"
                  component="h3"
                  onClick={handleUploadClick}
                  style={{ color: "blue", fontWeight: 600, fontSize: 18 }}
                >
                  Upload photo
                </Typography>
              </li>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
              <Divider sx={{ width: "100%", borderColor: "grey" }} />
              <li className="MoreText">
                <Typography
                  variant="3"
                  onClick={handleRemoveClick}
                  component="h3"
                  style={{ color: "red", fontWeight: 600, fontSize: 18 }}
                >
                  Remove profile photo
                </Typography>
              </li>
              <Divider sx={{ width: "100%", borderColor: "grey" }} />
              <li className="ProfileUpdateText">
                <Typography
                  variant="3"
                  component="h3"
                  fontWeight={100}
                  fontSize={18}
                  onClick={handleClose}
                >
                  cancel
                </Typography>
              </li>
            </ul>
          </Box>
        </MaterialModal> */}
      </div> 
    </div>
  );
}