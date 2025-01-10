import "./Message.css";
import { useUser } from "../../context/UserContext";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
  const { authUser } = useUser();
  const { selectedConversation } = useConversation();
  const fromMe = String(message.senderId) === String(authUser.id);

  // Correct alignment class based on sender/receiver
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePicture = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleClassName = fromMe ? "my-msg" : "their-msg"; // New classes

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="message-icon">
        <div>
          <img alt="Profile" src={profilePicture} />
        </div>
      </div>
      <div className={`chat-bubble ${bubbleClassName}`}>{message.message}</div>
      <div className="message-time">15:23</div>
    </div>
  );
};

export default Message;
