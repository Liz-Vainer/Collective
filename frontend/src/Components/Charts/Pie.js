// Components/PieChart.js
import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PieChart = ({ users, chartRef }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  });

  useEffect(() => {
    if (users.length > 0) {
      const genderCounts = { male: 0, female: 0, other: 0 };
      users.forEach((user) => {
        if (user.gender === "male") genderCounts.male++;
        if (user.gender === "female") genderCounts.female++;
        else genderCounts.other++;
      });

      setChartData({
        labels: ["Male", "Female", "Other"],
        datasets: [
          {
            data: [genderCounts.male, genderCounts.female, genderCounts.other],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    }
  }, [users]);

  return <Pie data={chartData} ref={chartRef} />;
};

export default PieChart;
