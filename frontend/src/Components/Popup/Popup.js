import React from "react";
import "./Popup.css";

function Popup(props) {
  return props.trigger ? (
    <div
      className={`popup ${
        props.position === "bottom-right" ? "bottom-right" : ""
      }`}
    >
      <div className="inner-popup">
        <button className="btn-close" onClick={() => props.setTrigger(false)}>
          Close
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
