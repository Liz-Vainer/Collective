import React from "react";
import "./VerticalComponent.css";
import { useUser } from "../../context/UserContext";

const VerticalComponent = ({ onItemClick }) => {
  const { authUser } = useUser();
  const menuItems = [
    "Profile",
    "Help",
    "Credits",
    "Delete account",
  ];

  return (
    <div className="vertical-container">
      <div className="profile">
        <img
          src={authUser.profilePic}
          alt="Profile"
          className="profile-image"
        />
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
