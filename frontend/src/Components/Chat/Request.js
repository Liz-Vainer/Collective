import React from "react";
import "./Friends.css";
import useAcceptRequest from "../../hooks/useAcceptRequest";
import useRejectRequest from "../../hooks/useRejectRequest";
import { useSocket } from "../../context/SocketContext"; // Importing the socket context

const Request = ({ user }) => {
  const { acceptRequest } = useAcceptRequest();
  const { rejectRequest } = useRejectRequest();
  const { socket } = useSocket();

  const handleAccept = async () => {
    if (!user) return;
    await acceptRequest(user._id);
    // Emit the acceptFriendRequest event to the backend
    socket.emit("acceptFriendRequest", user._id);
  };
  const handleReject = async () => {
    if (!user) return;
    await rejectRequest(user._id);
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
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleReject}>Reject</button>
      </div>
    </div>
  );
};

export default Request;
