import "./MessageInput.css";
const MessageInput = () => {
  return (
    <form className="message-input">
      <div className="message-input-container">
        <input
          type="text"
          className="message-input-field"
          placeholder="Send a message"
        />
        <button className="message-send-button">Send</button>
      </div>
    </form>
  );
};

export default MessageInput;
