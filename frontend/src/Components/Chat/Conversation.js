import "./Conversation.css";
import useConversation from "../../zustand/useConversation";
import { useSocket } from "../../context/SocketContext";

const Conversation = ({ conversation }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocket();
  const isOnline = onlineUsers.includes(conversation._id);

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
      </div>
    </div>
  );
};

export default Conversation;
