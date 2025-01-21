import React from "react";
import "./Friends.css";
import useSendFriendRequest from "../../hooks/useSendFriendRequest";

const Friend = ({ user }) => {
  const { sendRequest } = useSendFriendRequest();
  const handleRequest = async () => {
    if (!user) return;
    await sendRequest(user._id);
  };
  return (
    <div className="existing-users-list">
      {/* User Details Section */}
      <div className="user-details">
        <img alt="Profile" src={user.profilePic} className="profile-pic" />
        <p>{user.name}</p>
      </div>

      {/* Add Friend Button */}
      <div className="add-friend-btn">
        <button onClick={handleRequest}>Add Friend</button>
      </div>
    </div>
  );
};

export default Friend;
