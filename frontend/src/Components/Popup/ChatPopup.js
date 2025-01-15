import React from 'react';
import './ChatPopup.css';
import Sidebar from '../Chat/Sidebar';
import Conversations from '../Chat/Conversations';


const ChatPopup = ({ trigger, setTrigger }) => {
  return (
    trigger && (
      <div className="chat-popup">
        <div className="inner-chat-popup">
          <Sidebar />
          <Conversations />
        </div>
      </div>
    )
  );
};

export default ChatPopup;