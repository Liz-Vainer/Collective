import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./ChatPopup.css"; // Ensure styles are properly defined
import { AiOutlineClose, AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

function ChatPopup({ trigger, position, setTrigger, children }) {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Set popup position when triggered and positioned in the center of the screen
  useEffect(() => {
    if (trigger) {
      const popupHeight = 600; // Default popup height
      const popupWidth = 900; // Default popup width

      setPopupPosition({
        top: Math.max((window.innerHeight - popupHeight) / 2, 0),
        left: Math.max((window.innerWidth - popupWidth) / 2, 0),
      });
    }
  }, [trigger]);

  // Handle drag functionality
  const handleMouseDown = (e) => {
    const offsetX = e.clientX - popupPosition.left;
    const offsetY = e.clientY - popupPosition.top;

    const handleMouseMove = (e) => {
      setPopupPosition({
        top: Math.max(0, e.clientY - offsetY),
        left: Math.max(0, e.clientX - offsetX),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Toggle collapse functionality
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Popup content
  const popupContent = (
    <div
      className="chat-popup"
      style={{
        position: "absolute",
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
        width: "900px", /* Using percentage width for better responsiveness */
        height: isCollapsed ? "50px" : "auto",
        zIndex: 1000,
        borderRadius: "12px", /* Rounded corners */
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", /* Softer shadow */
        display: "flex",
        flexDirection: "column",
        transition: "height 0.3s ease-in-out, transform 0.3s ease-in-out",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Popup Header */}
      <div className="popupChat-header">
        <button className="btn-close" onClick={() => setTrigger(false)}>
          <AiOutlineClose />
        </button>
        <button className="btn-collapse" onClick={toggleCollapse}>
          {isCollapsed ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
        </button>
      </div>

      {/* Popup Body */}
      <div className={`popupChat-body ${isCollapsed ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );

  // Use React Portal to render the popup
  return trigger ? ReactDOM.createPortal(popupContent, document.body) : null;
}

export default ChatPopup;
