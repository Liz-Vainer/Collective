import React from 'react';
import './communityTemplate.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

export default function CommunityTemplate({ name, mainContent, sideContent }) {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="container">
      <h1 className="header">{name}</h1>
      <button
        className="back-home-btn"
        onClick={() => navigate("/home")} // Navigate to /home when clicked
      >
        Back Home
      </button>
      <div className="content">
        <div className="mainContainer">
          <p>{mainContent}</p>
        </div>
        <div className="sideContainer">
          <ul>
            {sideContent.map((item) => (
              <li key={item.name}>
                <a href="#" onClick={item.onClick}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
