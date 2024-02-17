import React, { useEffect, useState,useRef } from "react";
import { Box, useTheme,Button,Typography  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import styled from "styled-components";
import AdvertisementUploadButton from "../../components/AdPublishingComponent/advertisementUploadButton";
import AdvertisementEditOption from "../../components/EditAdPost/EditAdPost";
import {
  useDeleteAdPostMutation
} from "../../../Shared/redux/adminSlices/adminApiSlices";
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

const StyledUploadButton = styled(Button)`
margin-bottom: 5px;
background-color: ${({ access, colors }) =>
access === 'blocked'
     ? colors.redAccent[700]
     : access === 'user' 
     ? colors.blocked[500]
     : 'white'};
`;
const Team = () => {
  const theme = useTheme();
  const [postAdData, setPostAdData] = useState([]);
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [deleteAdPost] = useDeleteAdPostMutation();

  const adminToken = localStorage.getItem('adminToken');


  const handleDeletePost = async (selectedPostId) => {
    try {
      const response = await deleteAdPost({
        postId: selectedPostId,
      });
      // console.log("response",response)
      fetchData()
    } catch (error) {
      // Handle any errors that occurred during the mutation
      console.error("Error sending follow request:", error);

    }
  };

  const fetchData = async () => {
    try {
      if (!adminToken) {
        console.error("adminToken not found in localStorage");
        return;
      }
      
      const response = await fetch("http://localhost:5000/admin/get-ad",{
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
      });
      const data = await response.json();
      const uploadedAdData = data.UploadedAds.map((ad, index) => ({
        ...ad,
        id: ad._id || index,
        fromDate: new Date(ad.fromDate).toLocaleDateString(),
        toDate: new Date(ad.toDate).toLocaleDateString(),
      }));
      setPostAdData(uploadedAdData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
const ImageComponent = ({ src, alt }) => <img src={src} alt={alt} style={{ width: '100%', height: '100%' }} />;


  useEffect(() => {
    fetchData()
  }, []);

  
      
  const columns = [
    { field: "adName", headerName: "ADs Name", flex: .5, cellClassName: "name-column--cell" },
    {
      field: 'adImage',
      headerName: 'Images',
      headerAlign: 'left',
      align: 'left',
      flex: .7,
      renderCell: ({ row }) => (
        <img src={row.adImage} alt={row.adName} style={{ width: '50%', height: '80px' }} />
        ),
    },
    { field: "sponsored", headerName: "Sponsored", flex: .6 },
    { field: "description", headerName: "Description", flex: .6 },
    { field: "fromDate", headerName: "fromDate", flex: .6},
    { field: "toDate", headerName: "Expires", flex: .6 },
    {
      field: "Access Level",
      headerName: "Edit",
      flex: .6,
      headerAlign: "center",
      renderCell: ({ row }) => {
      const { access, isDelete } = row;
        return (
           <button variant="outlined">
            <AdvertisementEditOption postId={row.id} />
           </button>    
        );
      },
    },
    {
      field: "accessLevel",
      headerName: "Action",
      flex: .6,
      headerAlign: "center",
      renderCell: ({ row }) => {
      const { access, isDelete} = row;     
        return (

                    <StyledAccessBox
                    access={access}
                    colors={colors}
                    onClick={() => handleDeletePost(row.id)}
                  >
                    {access === 'blocked' && <SecurityOutlinedIcon />}
                    {access === 'user' && <LockOpenOutlinedIcon />}
                    <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                    {access}
                    </Typography>
                    {isDelete ? (
                      <SecurityOutlinedIcon />
                      ) : (
                      <LockOpenOutlinedIcon />
                    )}
                    {isDelete ? (
                      <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                        Blocked
                      </Typography>
                    ) : (
                      <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                        Allow
                      </Typography>
                    )}
                  </StyledAccessBox>
        );
      },
    },
  ];

  return (
    
    <Box m="20px">
    <Header title="Promotions" subtitle="Managing the promotions and Ads" />
    <>
        <button variant="outlined"><AdvertisementUploadButton/></button>    

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none', border: '1px solid white' }}
          />
        </>
        <Box m="40px 0 0 0" height="75vh"
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
        <DataGrid checkboxSelection rows={postAdData} columns={columns} />
      </Box>
    </Box>
  ); 
};

export default Team;









          // <StyledAccessBox
          //   access={access}
          //   colors={colors}
          // >
          //   {access === 'blocked' && <SecurityOutlinedIcon />}
          //   {access === 'Allow' && <LockOpenOutlinedIcon />}
          //   <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
          //     {access}
          //   </Typography>
          //   {isDelete ? (
          //     <LockOpenOutlinedIcon />
          //   ) : (
          //     <SecurityOutlinedIcon />
          //   )}
          //   {isDelete ? (
          //     <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
          //       Allow
          //     </Typography>
          //   ) : (
          //     <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
          //       Blocked
          //     </Typography>
          //   )}
          // </StyledAccessBox>

 