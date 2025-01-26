import React, { useState, useEffect } from "react";
import VerticalComponent from "./VerticalComponent";
import MainComponent from "./MainComponent";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [selectedItem, setSelectedItem] = useState("Profile"); // Default to Profile

  useEffect(() => {
    // Remove the 'move-left' class after navigation
    document.body.classList.remove("move-left");
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="settings-page-container">
      <div className="settings-page-content">
        <VerticalComponent onItemClick={handleItemClick} />
        <div className="divider"></div>
        <MainComponent selectedItem={selectedItem} />
      </div>
    </div>
  );
};

export default SettingsPage;
