import React from "react";
import VerticalComponent from "./VerticalComponent";
import MainComponent from "./MainComponent";
import './SettingsPage.css';
const SettingsPage = () => {
  return (
    <div className="settings-page-container">
      <div className="settings-page-content">
        <VerticalComponent />
        <div className="divider"></div>
        <MainComponent />
      </div>
    </div>
  );
};

export default SettingsPage;
