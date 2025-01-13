import { useState } from "react";
import Popup from "../Popup/Popup";
import "./Members.css";

const Member = ({ user }) => {
  const [infoButton, setInfoButton] = useState(false);
  const toggleInfo = () => {
    setInfoButton(!infoButton);
  };
  const toggleRemove = () => {};
  return (
    <div>
      <div className="member">
        {/* User Details Section */}
        <div className="user-details">
          <img alt="Profile" src={user.profilePic} className="profile-pic" />
          <p>{user.name}</p>
        </div>

        {/* User info Button */}
        <div className="info">
          <button onClick={toggleInfo}>Info</button>
        </div>
        {/* User info Button */}
        <div className="info">
          <button onClick={toggleRemove}>Remove from community</button>
        </div>
      </div>
      <Popup trigger={infoButton} setTrigger={toggleInfo} position="center">
        <div className="member-info">
          <h2>{user.name}'s Information</h2>
          <div className="info-item">
            <strong>Age:</strong> {user.age}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="info-item">
            <strong>Ethnicity:</strong> {user.ethnicity}
          </div>
          <div className="info-item">
            <strong>Gender:</strong> {user.gender}
          </div>
          <div className="info-item">
            <strong>Religion:</strong> {user.religion}
          </div>
          <div className="info-item">
            <strong>Interest:</strong> {user.interest}
          </div>
          <div className="info-item">
            <strong>Favorites:</strong>
            {user.favorites.length > 0 ? (
              <ul>
                {user.favorites.map((favorite, index) => (
                  <li key={index}>{favorite.name}</li>
                ))}
              </ul>
            ) : (
              <p>No favorites</p>
            )}
          </div>

          <div className="info-item">
            <strong>Joined on:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Member;
