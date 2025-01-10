import Message from "./Message";
import "./Messages.css";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/messageSkeleton";
import { useEffect, useRef } from "react";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This will trigger whenever the messages array changes

  return (
    <div className="messages">
      {loading ? (
        // Show skeletons when loading
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
      ) : messages.length > 0 ? (
        // Render messages when not loading and there are messages
        messages.map((message, idx) => (
          <div
            key={message._id}
            ref={idx === messages.length - 1 ? lastMessageRef : null}
          >
            <Message message={message} />
          </div>
        ))
      ) : (
        // Show fallback text when not loading and no messages
        <p>Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
