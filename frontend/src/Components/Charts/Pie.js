import React, { useRef, useCallback } from "react";
import Chart from "chart.js/auto";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

// const { members } = useGetMembers(selectedCommunity._id);

// Utility function to capitalize the first letter
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const MultipleCharts = ({ data }) => {
  console.log("This is data", data);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  // Handle the download logic for all charts
  const downloadImage = useCallback(() => {
    // Create an array of refs for each chart
    const chartRefs = [ref1, ref2, ref3, ref4];
    const chartImages = [];

    // Generate images for each chart using toBase64Image()
    chartRefs.forEach((ref) => {
      if (ref.current) {
        const chartImage = ref.current.toBase64Image();
        chartImages.push(chartImage);
      }
    });

    // Create a new canvas to combine all the chart images
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the width and height of the combined canvas
    const maxWidth = 800; // Adjust to fit your needs
    const maxHeight = chartImages.length * 400; // Adjust height based on number of charts
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    // Draw each chart image onto the canvas
    chartImages.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const yPosition = index * 400; // Adjust vertical spacing between charts
        ctx.drawImage(img, 0, yPosition, maxWidth, 400); // Draw each image onto the canvas

        // Check if all images are drawn, then download the combined image
        if (index === chartImages.length - 1) {
          const link = document.createElement("a");
          link.download = "combined_charts.png"; // Name of the combined image
          link.href = canvas.toDataURL("image/png"); // Convert canvas to image
          link.click();
        }
      };
    });
  }, []);

  // Count the occurrences of each religion in the data
  const religionCounts = data.reduce((acc, item) => {
    console.log("This is religionCounts", acc);
    if (item.religion) {
      const religion = item.religion.toLowerCase(); // Convert to lowercase for consistency
      acc[religion] = (acc[religion] || 0) + 1;
    }
    return acc;
  }, {});

  // Prepare data for the Religion Distribution Bar chart
  const chartData2 = {
    labels: ["christian", "jewish", "muslim", "other"].map(
      capitalizeFirstLetter
    ), // Capitalize first letter
    datasets: [
      {
        label: "Religion Distribution",
        data: [
          religionCounts["christian"] || 0,
          religionCounts["jewish"] || 0,
          religionCounts["muslim"] || 0,
          religionCounts["other"] || 0,
        ],
        backgroundColor: [
          "rgba(253,135,135,0.8)",
          "rgba(45,210,157,0.8)",
          "rgba(100,100,255,0.8)",
          "rgba(200,200,200,0.8)", // Default color for "Other"
        ],
        borderRadius: 5,
      },
    ],
  };

  // Count the occurrences of each interest in the data
  const interestCounts = data.reduce((acc, item) => {
    if (item.interest) {
      const interest = item.interest.toLowerCase(); // Convert to lowercase for consistency
      acc[interest] = (acc[interest] || 0) + 1;
    }
    return acc;
  }, {});

  // Prepare data for the Interest Distribution Bar chart
  const chartData3 = {
    labels: ["sports", "music", "technology", "other"].map(
      capitalizeFirstLetter
    ), // Capitalize first letter
    datasets: [
      {
        label: "Interest Distribution",
        data: [
          interestCounts["sports"] || 0,
          interestCounts["music"] || 0,
          interestCounts["technology"] || 0,
          interestCounts["other"] || 0,
        ],
        backgroundColor: [
          "rgba(255,99,132,0.8)",
          "rgba(54,162,235,0.8)",
          "rgba(255,206,86,0.8)",
          "rgba(75,192,192,0.8)",
          "rgba(153,102,255,0.8)",
        ],
        borderRadius: 5,
      },
    ],
  };

  // Prepare data for the Age Distribution Bar chart
  const chartData1 = {
    labels: ["Male", "Female", "Other"].map(capitalizeFirstLetter), // Capitalize first letter
    datasets: [
      {
        label: "Gender Distribution",
        data: [
          data.filter((item) => item.gender.toLowerCase() === "male").length,
          data.filter((item) => item.gender.toLowerCase() === "female").length,
        ],
        backgroundColor: ["rgba(43,63,229,0.8)", "rgba(250,192,19,0.8)"],
        borderRadius: 5,
        borderColor: "rgba(245,39,100,0.8)",
      },
    ],
  };

  // Group users by age ranges (e.g., 0-20, 21-40, 41-60, 61+)
  const ageGroups = {
    "0-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61+": 0,
  };

  // Count the users in each age range
  data.forEach((item) => {
    const age = item.age;
    if (age <= 20) ageGroups["0-20"]++;
    else if (age <= 40) ageGroups["21-40"]++;
    else if (age <= 60) ageGroups["41-60"]++;
    else ageGroups["61+"]++;
  });

  // Prepare data for the Age Distribution Bar chart
  const chartData4 = {
    labels: ["0-20", "21-40", "41-60", "61+"], // Age ranges
    datasets: [
      {
        label: "Age Distribution",
        data: [
          ageGroups["0-20"], // Count of users aged 0-20
          ageGroups["21-40"], // Count of users aged 21-40
          ageGroups["41-60"], // Count of users aged 41-60
          ageGroups["61+"], // Count of users aged 61+
        ],
        backgroundColor: [
          "rgba(255,99,132,0.8)", // Color for 0-20
          "rgba(54,162,235,0.8)", // Color for 21-40
          "rgba(255,206,86,0.8)", // Color for 41-60
          "rgba(75,192,192,0.8)", // Color for 61+
        ],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          boxWidth: 0, // Set the box width to 0 to hide the box
          color: "black", // Keep the text color as you want
          font: {
            size: 14, // Adjust font size for the label
          },
        },
      },
    },
  };

  const options4 = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Ensure the legend is visible
        labels: {
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0]; // Access the first dataset
            const labels = chart.data.labels; // Access the data labels

            // Main label at the top
            const mainLabel = [
              {
                text: dataset.label, // Use the dataset's main label
                fillStyle: "transparent", // No color box for the main label
                strokeStyle: "transparent", // Remove any border
                hidden: false,
              },
            ];

            // Add individual labels with their colors
            const detailedLabels = labels.map((label, index) => ({
              text: `${label}`, // Add category label
              fillStyle: dataset.backgroundColor[index], // Match the background color
              strokeStyle: dataset.backgroundColor[index], // Match the border color
              hidden: false,
            }));

            // Combine the main label with the detailed labels
            return [...mainLabel, ...detailedLabels];
          },
          font: {
            size: 14, // Adjust font size
            weight: "bold", // Optional: make it bold
          },
          color: "black", // Text color for all labels
          boxWidth: 15, // Size of the color box
          boxHeight: 15, // Height of the color box
          padding: 10, // Padding between legend items
        },
      },
      tooltip: {
        enabled: true, // Keep tooltips enabled for interaction
      },
    },
  };

  return (
    <div className="charts">
      <button type="button" onClick={downloadImage}>
        Download Charts
      </button>
      <div className="pie" style={{ margin: "auto" }}>
        <Bar ref={ref1} data={chartData1} options={options} />
      </div>
      <div className="pie" style={{ margin: "auto" }}>
        <Bar ref={ref2} data={chartData2} options={options} />
      </div>
      <div className="pie" style={{ margin: "auto" }}>
        <Bar ref={ref3} data={chartData3} options={options} />
      </div>
      <div
        className="pie"
        style={{
          margin: "auto",
          width: "250px",
          height: "250px",
          padding: "10px",
        }}
      >
        <Doughnut ref={ref4} data={chartData4} options={options4} />
      </div>
    </div>
  );
};

export default MultipleCharts;
