import React, { useState } from "react";
import "./Popup.css";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

function Popup(props) {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false); // Track collapsed state

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
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return props.trigger ? (
    <div
      className={`popup ${
        props.position === "bottom-right" ? "bottom-right" : ""
      }`}
      style={{
        position: 'absolute',
        top: popupPosition.top + 'px',
        left: popupPosition.left + 'px',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="inner-popup">
        <button className="btn-close" onClick={() => props.setTrigger(false)}>
          <AiOutlineClose />
        </button>
        <button className="btn-collapse" onClick={toggleCollapse}>
          {isCollapsed ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
        </button>

        {!isCollapsed && props.children} {/* Only show children when not collapsed */}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
