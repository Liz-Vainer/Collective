import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./CommunityInfo.css";
import CommunityTemplate from "../ComTemplate/communityTemplate";
import communityPost1 from "../Assets/communityPost_1.jpg";
import MultipleCharts from "../Charts/Pie";
import { useUser } from "../../context/UserContext";

const CommunityInfo = () => {
  const [communityData, setCommunityData] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state for users
  const [userError, setUserError] = useState(null); // Error state for users
  const location = useLocation();

  // Parse the query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const selectedCommunityId = queryParams.get("id");
  const { authUser } = useUser(); // Destructure user from context

  useEffect(() => {
    if (!selectedCommunityId) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUserError(null); // Reset error state
      try {
        const response = await fetch("/find-users-by-community", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ communityId: selectedCommunityId }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.users) {
          setUsers(data.users);
        } else {
          setUserError(data.message || "Failed to fetch users.");
          setUsers([]);
        }
      } catch (err) {
        setUserError("An error occurred while fetching users.");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [selectedCommunityId]);

  useEffect(() => {
    const fakeCommunityData = [
      {
        id: 1,
        name: "Park Y.A",
        mainContent:
          "Welcome to Park Y.A Community! Here you can find information about our events, resources, and more.",
        sideContent: [
          { name: "Upcoming Events", type: "event" },
          { name: "Trending Topics", type: "topics" },
          ...(authUser?.userType === "Official"
            ? [{ name: "Charts", type: "charts" }]
            : []), // Conditionally add "Charts" if user is Official
          { name: "Resources", type: "resources" },
        ],
      },
    ];

    setCommunityData(fakeCommunityData);
  }, [authUser]);

  const renderSectionContent = (type) => {
    switch (type) {
      case "event":
        return (
          <div>
            <h2>Upcoming Event</h2>
            <img
              src={communityPost1}
              alt="Event"
              style={{
                width: "100%",
                height: "550px",
                borderRadius: "8px",
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
      case "charts":
        if (authUser?.userType !== "Official") {
          return <div>Access to charts is restricted.</div>;
        }
        return (
          <div className="community-charts">
            <h2>Community Charts</h2>
            {loadingUsers ? (
              <p>Loading charts...</p>
            ) : userError ? (
              <p>{userError}</p>
            ) : (
              <MultipleCharts data={users} />
            )}
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
            mainContent={
              currentSection
                ? renderSectionContent(currentSection)
                : community.mainContent
            }
            sideContent={community.sideContent.map((item) => ({
              ...item,
              onClick: () => setCurrentSection(item.type),
            }))}
          />
        ))
      )}
    </div>
  );
};

export default CommunityInfo;
