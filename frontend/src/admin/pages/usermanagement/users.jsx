import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
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
    access === "blocked"
      ? colors.redAccent[700]
      : access === "user"
      ? colors.blocked[500]
      : colors.greenAccent[700]};
  cursor: pointer;
`;

const Team = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const colors = tokens(theme.palette.mode);

  const adminToken = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
    // Fetch adminToken from localStorage
    if (!adminToken) {
      console.error("adminToken not found in localStorage");
      return;
    }
      const response = await fetch("http://localhost:5000/admin/userData", {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
      });
      const data = await response.json();
      const usersWithIdAndStrings = data.user.map((user, index) => ({
        ...user,
        id: user._id || index,
      }));
      setUsers(usersWithIdAndStrings);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccessClick = async (userId) => {
    try {
      if (!adminToken) {
        console.error("adminToken not found in localStorage");
        return;
      }
      const response = await fetch(
        "http://localhost:5000/admin/updateUserStatus",
        {
          method: "PATCH",
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const updatedUser = await response.json();
      // Refresh data to reflect changes
      fetchData();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const columns = [
    { field: "index", headerName: "ID", flex: 0.3 },
    {
      field: "username",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "isVerified",
      headerName: "Verified",
      type: "boolean",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    { field: "", headerName: "Premium", flex: 1 },
    { field: "mobileNumber", headerName: "Phone Number", flex: 1 },
    { field: "emailId", headerName: "Email", flex: 1 },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { access, isVerified } = row;
        return (
          <StyledAccessBox
            access={access}
            colors={colors}
            onClick={() => handleAccessClick(row.id)}
          >
            {access === "blocked" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
            {isVerified ? <LockOpenOutlinedIcon /> : <SecurityOutlinedIcon />}
            {isVerified ? (
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                User
              </Typography>
            ) : (
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                Blocked
              </Typography>
            )}
          </StyledAccessBox>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="User Details" subtitle="Managing the Users" />
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
        <DataGrid checkboxSelection rows={users} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
