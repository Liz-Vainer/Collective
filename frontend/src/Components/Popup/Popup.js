import React, { useState, useEffect } from "react";
import "./Popup.css";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

function Popup(props) {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (props.trigger && props.position === "bottom-right") {
      const popupHeight = 600;
      const popupWidth = 1200;
      const marginFromBottom = 20;
      const marginFromRight = 20;

      setPopupPosition({
        top: Math.max(window.innerHeight - popupHeight - marginFromBottom, 0),
        left: Math.max(window.innerWidth - popupWidth - marginFromRight, 0),
      });
    }
  }, [props.trigger, props.position]);

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

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return props.trigger ? (
    <div
      className={`popup ${props.position === "bottom-right" ? "bottom-right" : ""}`}
      style={{
        position: "absolute",
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={`inner-popup ${isCollapsed ? "collapsed" : ""}`}>
        {/* Button container for collapsed state */}
        <div className={`buttons-container ${isCollapsed ? "show" : ""}`}>
          {/* Only render the close button if it's not within the InfoWindow */}
          {!props.isInInfoWindow && (
            <button className="btn-close" onClick={() => props.setTrigger(false)}>
              <AiOutlineClose />
            </button>
          )}
          <button className="btn-collapse" onClick={toggleCollapse}>
            {isCollapsed ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
          </button>
        </div>

        {/* Content that appears only when expanded */}
        {!isCollapsed && props.children}
      </div>
    </div>
  ) : null;
}

export default Popup;
