// hooks/useGenderChartData.js
import { useState, useEffect } from "react";

const useGenderChartData = (users) => {
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

  // Use the effect to process the user data and create the chart data
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

  return chartData;
};

export default useGenderChartData;
