import Message from "./Message";
import "./Messages.css";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/messageSkeleton";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  console.log("messages: ", messages);

  return (
    <div className="messages">
      {loading ? (
        // Show skeletons when loading
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
      ) : messages.length > 0 ? (
        // Render messages when not loading and there are messages
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      ) : (
        // Show fallback text when not loading and no messages
        <p>Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
