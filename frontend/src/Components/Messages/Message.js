import "./Message.css";

const Message = () => {
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
