import React from "react";

const VerticalComponent = () => {
  return (
    <div className="vertical-container">
      <div className="profile">
        <img src="/path-to-profile-image.jpg" alt="Profile" className="profile-image" />
        <h3>John Doe</h3>
      </div>
      <div className="settings-list">
        <ul>
          <li>Profile</li>
          <li>Settings</li>
          <li>Privacy</li>
          <li>Notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default VerticalComponent;
