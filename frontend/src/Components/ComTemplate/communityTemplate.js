import React from 'react';
import './communityTemplate.css';

export default function CommunityTemplate({ name, mainContent, sideContent }) {
  return (
    <div className="container">
      <h1 className="header">{name}</h1>

      <div className="content">
        <div className="mainContainer">
          <p>{mainContent}</p>
        </div>
        <div className="sideContainer">
          <ul>
            {sideContent.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
