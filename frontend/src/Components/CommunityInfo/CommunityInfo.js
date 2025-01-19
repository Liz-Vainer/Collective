import React, { useState, useEffect } from "react";

import "./CommunityInfo.css";
import CommunityTemplate from "../ComTemplate/communityTemplate"; // Corrected import path
import communityPost1 from "../Assets/communityPost_1.jpg"; // Import the image

const CommunityInfo = () => {
  const [communityData, setCommunityData] = useState([]);
  const [currentSection, setCurrentSection] = useState(null); // State to track which section is clicked

  useEffect(() => {
    // Fake community data without an API
    const fakeCommunityData = [
      {
        id: 1,
        name: "Park Y.A",
        mainContent:
          "Welcome to Park Y.A Community! Here you can find information about our events, resources, and more.",
        sideContent: [
          { name: "Upcoming Events", type: "event" },
          { name: "Trending Topics", type: "topics" },
          { name: "Resources", type: "resources" },
        ],
      },
    ];

    // Set the fake data to the state
    setCommunityData(fakeCommunityData);
  }, []);

  // Render content based on the clicked section
  const renderSectionContent = (type) => {
    switch (type) {
      case "event":
        return (
          <div>
            <h2>Upcoming Event</h2>
            <img
              src={communityPost1} // Use the imported image
              alt="Event"
              style={{
                width: "100%", // Ensure it takes the full width
                height: "550px", // Maintain aspect ratio
                borderRadius: "8px", // Optionally, add some rounding to the corners
              }}
            />
          </div>
        );
      case "topics":
        return (
          <div>
            <h2>Trending Topics</h2>
            <ul>
              <li>Community Gardening Tips</li>
              <li>How to Stay Active in the Winter</li>
              <li>Volunteer Opportunities in Park Y.A</li>
            </ul>
          </div>
        );
      case "resources":
        return <div>Resources will be available soon.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="community-info">
    
      {communityData.length === 0 ? (
        <div>Loading...</div>
      ) : (
        communityData.map((community) => (
          <CommunityTemplate
            key={community.id}
            name={community.name}
            mainContent={currentSection ? renderSectionContent(currentSection) : community.mainContent}
            sideContent={community.sideContent.map((item) => ({
              ...item,
              onClick: () => setCurrentSection(item.type), // When clicked, set current section
            }))}
          />
        ))
      )}
    </div>
  );
};

export default CommunityInfo;
