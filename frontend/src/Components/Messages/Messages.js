import Message from "./Message";
import "./Messages.css";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/messageSkeleton";

const Messages = () => {
  const { messages } = useGetMessages();
  console.log("messages: ", messages);
  return (
    <div className="messages">
      {messages.length > 0 &&
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
      {[...Array(3)].map((_, idx) => (
        <MessageSkeleton key={idx} />
      ))}
      {messages.length === 0 && <p>Send a message to start the conversation</p>}
    </div>
  );
};

export default Messages;
