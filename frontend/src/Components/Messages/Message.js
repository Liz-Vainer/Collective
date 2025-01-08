import "./Message.css";
import { useUser } from "../../context/UserContext";
import useConversation from "../../zustand/useConversation";

const Message = (message) => {
  const { authUser } = useUser();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const checkClassName = fromMe ? "chat-end" : "chat-start";
  return (
    <div className="message">
      <div className="message-icon">
        <div>Icon</div>
      </div>
      <div className="message-text">Hey Buddy!</div>
      <div className="message-time">15:23</div>
    </div>
  );
};

export default Message;
