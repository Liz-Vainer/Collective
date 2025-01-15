import React from 'react';
import './ChatPopup.css';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';

const ChatPopup = ({ trigger, setTrigger }) => {
  return (
    trigger && (
      <div className="chat-popup">
        <div className="inner-chat-popup">
          <Sidebar />
          <MessageContainer />
        </div>
      </div>
    )
  );
};

export default ChatPopup;