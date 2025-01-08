import useSendMessage from "../../hooks/useSendMessage";
import "./MessageInput.css";
import { useState } from "react";
const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    console.log("message");
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="message-input-container">
        <input
          type="text"
          className="message-input-field"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="message-send-button">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
