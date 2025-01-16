import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Popup.css";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

function Popup(props) {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Adjust the popup position when it is triggered and positioned in the "bottom-right" corner
  useEffect(() => {
    if (props.trigger && props.position === "bottom-right") {
      const popupHeight = 600; // Default popup height
      const popupWidth = 1200; // Default popup width
      const marginFromBottom = 20;
      const marginFromRight = 20;

      setPopupPosition({
        top: Math.max(window.innerHeight - popupHeight - marginFromBottom, 0),
        left: Math.max(window.innerWidth - popupWidth - marginFromRight, 0),
      });
    }
  }, [props.trigger, props.position]);

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

  // Toggle collapse state of the popup
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Popup content including draggable, collapsible, and close functionality
  const popupContent = (
    <div
      className={`popup ${
        props.position === "bottom-right" ? "bottom-right" : ""
      }`}
      style={{
        position: "absolute",
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={`inner-popup ${isCollapsed ? "collapsed" : ""}`}>
        {/* Button container for close and collapse functionality */}
        <div className="buttons-container">
          {/* Close button */}
          <button className="btn-close" onClick={() => props.setTrigger(false)}>
            <AiOutlineClose />
          </button>
          {/* Collapse button */}
          <button className="btn-collapse" onClick={toggleCollapse}>
            {isCollapsed ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
          </button>
        </div>

        {/* Display content only when the popup is not collapsed */}
        {!isCollapsed && props.children}
      </div>
    </div>
  );

  // Render the popup using React Portals to avoid container restrictions
  return props.trigger
    ? ReactDOM.createPortal(popupContent, document.body)
    : null;
}

export default Popup;
