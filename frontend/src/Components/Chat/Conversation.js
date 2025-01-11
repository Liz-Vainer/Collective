import "./Conversation.css";
import useConversation from "../../zustand/useConversation";
import { useSocket } from "../../context/SocketContext";
import useRemoveFriend from "../../hooks/useRemoveFriend";

const Conversation = ({ conversation }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { removeFriend } = useRemoveFriend();

  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers, socket } = useSocket();
  const isOnline = onlineUsers.includes(conversation._id);

  const handleRemove = async () => {
    if (!conversation) return;
    await removeFriend(conversation._id);
    // Emit the removeFriend event to the backend
    socket.emit("removeFriend", conversation._id);
    setSelectedConversation(null);
  };

  return (
    <div
      className={`conversation ${isSelected ? "bg-conv" : ""}`}
      onClick={() => setSelectedConversation(conversation)}
    >
      {/* Status circle (online/offline) */}
      <div
        className={`status-circle ${isOnline ? "logged-in" : "logged-out"}`}
      ></div>

      {/* Profile Picture */}
      <div className="conversation-details">
        <img
          alt="Profile"
          src={conversation.profilePic}
          className="profile-pic"
        />
        <div>
          <p>{conversation.name}</p>
        </div>
        <div>
          <button onClick={handleRemove}>remove friend</button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
