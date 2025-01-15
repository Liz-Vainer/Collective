import React, { useState } from "react";
import VerticalComponent from "./VerticalComponent";
import MainComponent from "./MainComponent";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [selectedItem, setSelectedItem] = useState("Profile"); // Default to Profile

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
