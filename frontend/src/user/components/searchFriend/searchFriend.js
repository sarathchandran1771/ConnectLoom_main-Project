import React, { useState } from "react";
import { useGetMessageMutation } from "../../../Shared/redux/userSlices/userSlice";
import SearchIcon from "../../Icons/Search.png";
import "./searchFriend.css";
import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
import { useNavigate } from "react-router-dom";
import _debounce from "lodash/debounce";
import GeometrySkeleton from "../LoadingComponent/Skeleton.jsx";
import Box from "@mui/material/Box";

const SearchFriend = () => {
  const [searchInput, setSearchInput] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [searchUsers, { error, isLoading }] = useGetMessageMutation();
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      if (!searchInput) {
        setProfileData([]);
        return;
      }

      const response = await searchUsers({ userId: searchInput });

      if (response.data.length > 0) {
        setProfileData(response.data);
      } else {
        setProfileData([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Debounce the handleSearch function
  const debouncedSearch = _debounce(handleSearch, 500);

  const handleProfileClick = (selectedId) => {
    setSelectedId(selectedId);
    navigate(`/profile/${selectedId}`);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      debouncedSearch.cancel();
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch();
  };

  const handleSearchIconClick = () => {
    debouncedSearch.cancel();
    handleSearch();
  };

  return (
    <div className="search-friend-container">
      <p className="search-title">Search</p>
      <div className="search-input-container">
        <input
          type="text"
          className="showSearchInput"
          placeholder="Search"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <img
          src={SearchIcon}
          alt="Search Icon"
          onClick={handleSearchIconClick}
          style={{ cursor: "pointer" }}
          className="search-icon"
        />
      </div>
      <hr />
      <p className="recent-title">Recent</p>

      <div className="profile-list">
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              height: "100%",
            }}
          >
            <GeometrySkeleton />
          </Box>
        ) : profileData.length === 0 && searchInput ? (
          <p style={{ marginLeft: 15 }}>No results found</p>
        ) : (
          profileData.map((item) => (
            <div
              key={item._id}
              className="profile-item"
              onClick={() => handleProfileClick(item._id)}
            >
              <img
                style={{ width: 50, height: 50, borderRadius: "50%" }}
                src={item.profilePic || Default_profileIcon}
                alt=""
              />
              <div style={{ marginLeft: 10 }}>
                <p style={{ marginTop: 25, fontSize: 15 }}>{item.username}</p>
                <p style={{ marginTop: -15, color: "#A8A8A8" }}>
                  {item.profilename}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchFriend;
