import Messages from "./Messages";
import "./MessageContainer.css";
import MessageInput from "./MessageInput";

const MessageContainer = () => {
  const NoChatSelected = false;
  return (
    <div className="message-container">
      {NoChatSelected ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="message-header">
            <span>To:</span>
            <span>Name</span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  return (
    <div className="no-chat-selected">
      <div className="no-chat-message">
        <p className="welcome-message">Welcome User</p>
        <p className="instruction-message">Select a chat to start messaging</p>
      </div>
    </div>
  );
};
