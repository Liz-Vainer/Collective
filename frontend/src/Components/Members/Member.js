import { useState } from "react";
import Popup from "../Popup/Popup";
import "./Members.css";
import useRemoveMember from "../../hooks/useRemoveMember";

const Member = ({ user, communityId }) => {
  const [infoButton, setInfoButton] = useState(false);
  const { removeMember, isLoading } = useRemoveMember(); // Include loading state
  const [isRemoving, setIsRemoving] = useState(false); // Local loading state for individual member

  const toggleInfo = () => {
    setInfoButton(!infoButton);
  };

  const toggleRemove = async () => {
    setIsRemoving(isLoading); // Start removing
    await removeMember(communityId, user.id);
    setIsRemoving(isLoading); // Reset removing state
  };

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

        {/* Remove User Button */}
        <div className="info">
          <button onClick={toggleRemove} disabled={isRemoving || isLoading}>
            {isRemoving ? "Removing..." : "Remove from community"}
          </button>
        </div>
      </div>

      {/* User Info Popup */}
      <Popup
        trigger={infoButton}
        setTrigger={toggleInfo}
        className="info-popup"
      >
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
