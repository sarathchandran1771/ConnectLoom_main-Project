import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useGetPremiumUserMutation } from '../../../Shared/redux/adminSlices/adminApiSlices';

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartData, setChartData] = useState([]);
  const [getPremiumUser, { error }] = useGetPremiumUserMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPremiumUser();
        const users = response.data.users;
      console.log("Users:", users);

        // Define an array of month names
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        // Create an object to store data for each month
        const monthlyData = {};

        // Aggregate premium users by month and year
        users.forEach((user) => {
          const createdAt = new Date(user.createdAt);
          const monthName = monthNames[createdAt.getMonth()];
          const monthYear = `${monthName} ${createdAt.getFullYear()}`;

          if (monthlyData[monthYear]) {
            monthlyData[monthYear].data[0].y += 1;
          } else {
            monthlyData[monthYear] = {
              id: monthYear,
              color: tokens("dark").greenAccent[500], 
              data: [
                {
                  x: monthYear,
                  y: 1,
                },
              ],
            };
          }
        });

        // Convert the object values to an array
        const chartDataArray = Object.values(monthlyData);

        // Sort the data based on the predefined month order
        const sortedData = chartDataArray.sort((a, b) => {
          const monthA = monthNames.indexOf(a.id.split(" ")[0]);
          const monthB = monthNames.indexOf(b.id.split(" ")[0]);
          return monthA - monthB;
        });

        setChartData(sortedData);
        console.log("Monthly Data:", monthlyData);
        console.log("Chart Data:", chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 

  if (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <ResponsiveLine
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: "point",
        useUTC: false,
      }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
