import React from "react";
import "./Popup.css";
import {AiOutlineClose} from "react-icons/ai"

function Popup(props) {
  return props.trigger ? (
    <div
      className={`popup ${
        props.position === "bottom-right" ? "bottom-right" : ""
      }`}
    >
      <div className="inner-popup">
        
        {props.children}
      </div>
      <button className="btn-close" onClick={() => props.setTrigger(false)}>
      <AiOutlineClose />
        </button>
    </div>
  ) : (
    ""
  );
}

export default Popup;
