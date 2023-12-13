import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import styled from "styled-components";

const StyledAccessBox = styled(Box)`
  width: 60%;
  margin: 0 auto;
  padding: 5px;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  background-color: ${({ access, colors }) =>
 access === 'blocked'
      ? colors.redAccent[700]
      : access === 'user' 
      ? colors.blocked[500]
      : colors.greenAccent[700]};
  cursor: pointer;
`;


const Team = () => {
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const colors = tokens(theme.palette.mode);
console.log("Team posts",posts)
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/reportedPost");
      const data = await response.json();
      const postsWithId = data.reportedPosts.map((post, index) => ({
        ...post,
        id: post._id || index,
      }));
      setPosts(postsWithId);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccessClick = async (postId) => {
    try {
      const response = await fetch("http://localhost:5000/admin/updatePostStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const updatedPost = await response.json();
      console.log("Updated post:", updatedPost);

      // Refresh data to reflect changes
      fetchData();
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "createdAt", headerName: "Created at", flex: 0.8 },
    { field: "username", headerName: "Reported By", flex: 1, cellClassName: "name-column--cell" },
    { field: "isReport", headerName: "Is Report", type: "boolean", headerAlign: "left", align: "left", flex: 1 },
    { field: "reportCount", headerName: "Report Count", type: "Int32", flex: 1 },
    {
      field: "accessLevel",
      headerName: "Access",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { access, isReport } = row;

        return (
          <StyledAccessBox
            access={access}
            colors={colors}
            onClick={() => handleAccessClick(row.id)}
          >
            {access === 'blocked' && <SecurityOutlinedIcon />}
            {access === 'user' && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {access}
            </Typography>
            {isReport ? (
              < SecurityOutlinedIcon/>
            ) : (
              <LockOpenOutlinedIcon />
            )}
            {isReport ? (
              <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                Blocked
              </Typography>
            ) : (
              <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                Unblocked
              </Typography>
            )}
          </StyledAccessBox>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Reported Posts" subtitle="Managing the Posts" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={posts} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
