import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../components/LineChart/LineChart";
import StatBox from "../../components/StatBox/StatBox";
import ProgressCircle from "../../components/ProgressCircle/ProgressCircle";
import {
  useGetAllUsersMutation,
  useGetPremiumUserMutation,
} from "../../../Shared/redux/adminSlices/adminApiSlices";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [getPremiumUser, { data, error, isLoading }] = useGetPremiumUserMutation();
  const [chartData, setChartData] = useState([]);
  const [recentTransaction, setRecentTransaction] = useState([]);
  const [getAllUsers, { userData }] = useGetAllUsersMutation();
  const [allclients, setAllClients] = useState([]);
  const setLimit = 10000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch premium user data
        const premiumUserResponse = await getPremiumUser();
        const premiumUsers = premiumUserResponse.data.users;
        const totalPremiumUsers = premiumUsers.length;
        const revenuePerPremiumUser = 500;
        const totalRevenue = totalPremiumUsers * revenuePerPremiumUser;

        // Set premium user data
        setChartData(totalRevenue);
        setRecentTransaction(premiumUsers);
        // Fetch all users data
        const allUsersResponse = await getAllUsers();
        const allUsers = allUsersResponse.data.user;
        // Set all clients data
        setAllClients(allUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getPremiumUser, getAllUsers]);
  
  const validChartData = isNaN(chartData) ? 0 : chartData;
  const validSetLimit = isNaN(setLimit) ? 1 : setLimit;
  const percentage = validChartData / validSetLimit;
  const totalAmount = recentTransaction.length * 500;

  const formattedTotalAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalAmount);

  return (
    <Box m="20px">
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={recentTransaction.length.toString()} // Update title 
            subtitle="Sales Obtained"
            progress={(recentTransaction.length / 100).toFixed(2)} // Update progress 
            increase={`+${Math.floor(Math.random() * 30)}%`} 
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={allclients?.length?.toString()}
            subtitle="New Clients"
            progress={(allclients?.length / 100).toFixed(2)}
            increase={`+${Math.floor(Math.random() * 10)}%`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={formattedTotalAmount}
            subtitle="Total Amount"
            progress={(totalAmount / 1000000).toFixed(2)} 
            increase={`+${Math.floor(Math.random() * 50)}%`} 
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {recentTransaction.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box minWidth="150px">
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.username}
                </Typography>
              </Box>
              <Box color={colors.grey[100]} minWidth="100px">
                {new Date(transaction.updatedAt).toLocaleDateString()}
              </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                $500
              </Box>
            </Box>
          ))}
        </Box>
        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Revenue Generated
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle progress={percentage} size="125" />
            <Typography variant="h5" color="#2ecc71" sx={{ mt: "15px" }}>
              ${chartData} revenue generated ({(percentage * 100).toFixed(2)}%)
            </Typography>
            <Typography>
              Total Limit to achieve. Limit: ${setLimit}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
