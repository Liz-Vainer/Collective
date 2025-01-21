import React from "react";
import "./MainComponent.css";
import ProfileTemplate from "../SettingsTemplate/ProfileTemplate";
import CommunitySettingsTemplate from "../SettingsTemplate/ComSetTem";
import HelpTemplate from "../SettingsTemplate/HelpTemplate";
import CreditsTemp from "../SettingsTemplate/CreditsTemp";
import { useUser } from "../../context/UserContext";

const MainComponent = ({ selectedItem }) => {
  const { authUser, setAuthUser } = useUser(); // Destructure user from context
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        const res = await fetch("/delete-account", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: authUser.id }),
          credentials: "include", // Include cookies for authenticated requests
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to delete account.");
        }

        alert("Your account has been successfully deleted.");
        localStorage.clear(); // Clear local storage
        setAuthUser(null); // Clear user context
      } catch (err) {
        console.error("Error deleting account:", err);
        alert(
          "An error occurred while deleting your account. Please try again."
        );
      }
    }
  };

  const renderTemplate = () => {
    switch (selectedItem) {
      case "Profile":
        return <ProfileTemplate />;
      case "Community Settings":
        return <CommunitySettingsTemplate />;
      case "Help":
        return <HelpTemplate />;
      case "Credits":
        return <CreditsTemp />;
      case "Delete account":
        return (
          <div className="delete-account-container">
            <p>
              Are you sure you want to delete your account? This action is
              irreversible.
            </p>
            <button onClick={handleDeleteAccount}>Confirm Delete</button>
          </div>
        );
      default:
        return <ProfileTemplate />;
    }
  };

  return <div className="main-content-container">{renderTemplate()}</div>;
};

export default MainComponent;
