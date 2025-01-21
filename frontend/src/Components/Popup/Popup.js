import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Popup.css";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

function Popup(props) {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Adjust the popup position to the center
  useEffect(() => {
    if (props.trigger) {
      const popupHeight = props.height || 400; // Dynamic height based on content
      const popupWidth = props.width || 600; // Dynamic width based on content

      setPopupPosition({
        top: Math.max(window.innerHeight / 2 - popupHeight / 2, 0), // Center vertically
        left: Math.max(window.innerWidth / 2 - popupWidth / 2, 0),  // Center horizontally
      });
    }
  }, [props.trigger, props.position, props.height, props.width]);

  // Enable drag functionality for the popup
  const handleMouseDown = (e) => {
    const offsetX = e.clientX - popupPosition.left;
    const offsetY = e.clientY - popupPosition.top;

    const handleMouseMove = (e) => {
      setPopupPosition({
        top: e.clientY - offsetY,
        left: e.clientX - offsetX,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Toggle collapse state of the popup (header + body)
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Popup content including draggable, collapsible, and close functionality
  const popupContent = (
    <div
      className={`popup`}
      style={{
        position: "absolute",
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
        height: isCollapsed ? "90px" : "auto", // Adjust height based on collapse
        width: "auto", // Dynamic width based on content
        minWidth: "400px",
        maxWidth: "900px",
        borderRadius: "12px", // Rounded corners
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Softer shadow
        transition: "none", // No transition for instant movement
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Close and collapse buttons on the left */}
      <div className="popup-header">
        <button className="btn-close" onClick={() => props.setTrigger(false)}>
          <AiOutlineClose />
        </button>
        <button className="btn-collapse" onClick={toggleCollapse}>
          {isCollapsed ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
        </button>
      </div>

      {/* Content area */}
      <div className={`popup-body ${isCollapsed ? "collapsed" : ""}`}>
        {props.children}
      </div>
    </div>
  );

  // Render the popup using React Portals to avoid container restrictions
  return props.trigger
    ? ReactDOM.createPortal(popupContent, document.body)
    : null;
}

export default Popup;
