import Messages from "./Messages";
import "./MessageContainer.css";
import MessageInput from "./MessageInput";
import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="message-container">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="message-header">
            <span>To:</span>
            <span>{selectedConversation.name}</span>
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
