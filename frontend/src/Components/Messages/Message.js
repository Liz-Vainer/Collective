import "./Message.css";
import { useUser } from "../../context/UserContext";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
  const { authUser } = useUser();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId !== authUser._id;
  const chatClassName = fromMe ? "chat-start" : "chat-end";
  const profilePicture = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "my-msg" : "";
  console.log(message.message);
  return (
    <div className={`chat ${chatClassName}`}>
      <div className="message-icon">
        <div>
          <img alt="Profile" src={profilePicture} />
        </div>
      </div>
      <div className={`chat-bubble ${bubbleBgColor}`}>{message.message}</div>
      <div className="message-time">15:23</div>
    </div>
  );
};

export default Message;
