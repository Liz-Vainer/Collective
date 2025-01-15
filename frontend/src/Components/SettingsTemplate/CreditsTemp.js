import React from 'react';
import './CreditsTemp.css';
import lizPfp from '../Assets/liz_pfp.jpg';
import seanPfp from '../Assets/sean_pfp.jpg';
import natanPfp from '../Assets/natan_pfp.jpg';
import mariaPfp from '../Assets/maria_pfp.jpg';
import { useNavigate } from 'react-router-dom';

const teamMembers = [
  {
    name: "Elizaveta (Liz) Vainer",
    description: "Frontend Developer. Specializes in UI/UX design.",
    imgSrc: lizPfp, 
    icon: 'frontend-icon', // Frontend icon (animated for Liz)
  },
  {
    name: "Sean Matatov",
    description: "Fullstack Developer. Specializes in databases.",
    imgSrc: seanPfp,
    icon: 'cog-icon', // Animated cog icon for Sean
  },
  {
    name: "Nathan Normuradov",
    description: "Backend Developer. Specializes in graph algorithms.",
    imgSrc: natanPfp,
    icon: 'cog-icon', // Animated cog icon for Nathan
  },
  {
    name: "Maria Badarne",
    description: "Frontend Developer. Specializes in Unit Testing.",
    imgSrc: mariaPfp,
    icon: 'frontend-icon', // Frontend icon for Maria
  },
];

const CreditsTemp = () => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate('/home');
  };

  return (
    <div className="credits-container">
      <div className="profile-header">
        <h2>Meet the team:</h2>
        <button className="back-home-button" onClick={handleNavigate}>Back home</button>
      </div>
      <div className="team-members">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={`team-member ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <img
              src={member.imgSrc}
              alt={`${member.name}'s profile`}
              className="profile-picture"
            />
            <div className="description">
              <h3>{member.name}
                <span className={`icon ${member.icon}`} />
              </h3>
              <p>{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditsTemp;
