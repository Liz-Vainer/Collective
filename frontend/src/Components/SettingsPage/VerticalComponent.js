import React from "react";
import "./VerticalComponent.css";

const VerticalComponent = ({ onItemClick }) => {
  const menuItems = [
    
    "Profile",
    "Community Settings",
    "Help",
    "Credits",
    "Delete account"
  ];

  return (
    <div className="vertical-container">
      <div className="profile">
        <img src="/path-to-profile-image.jpg" alt="Profile" className="profile-image" />
      </div>
      <div className="settings-list">
        <ul>
          {menuItems.map((item) => (
            <li key={item} onClick={() => onItemClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VerticalComponent;
