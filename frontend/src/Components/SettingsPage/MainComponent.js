import React from "react";
import "./MainComponent.css";
import ProfileTemplate from "../SettingsTemplate/ProfileTemplate";
import HelpTemplate from "../SettingsTemplate/HelpTemplate";
import CreditsTemp from "../SettingsTemplate/CreditsTemp";

const MainComponent = ({ selectedItem }) => {
  const handleDeleteAccount = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (userConfirmed) {
      console.log("Account deletion triggered (backend work)");
    }
  };

  const renderTemplate = () => {
    switch (selectedItem) {
      case "Profile":
        return <ProfileTemplate />;
     
      case "Help":
        return <HelpTemplate />;
      case "Credits":
        return <CreditsTemp />;
      case "Delete account":
        handleDeleteAccount(); 
        return null; 
      default:
        return <ProfileTemplate />;
    }
  };

  return <div className="main-content-container">{renderTemplate()}</div>;
};

export default MainComponent;
