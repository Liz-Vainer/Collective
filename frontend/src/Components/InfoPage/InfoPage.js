import React from 'react';
import background_fornow from '../Assets/background_login.png';

const TeamMember = ({ name, description }) => (
  <div>
    <h4>{name}</h4>
    <p>{description}</p>
  </div>
);

const InfoPage = () => {
  return (
    <div 
      className="mainbody" 
      style={{ backgroundImage: `url(${background_fornow})`, backgroundColor: 'transparent' }}
    >
      <div className="main-container">
        <div className="welcome">
          <h1>MEET THE TEAM</h1>
          <p>
            Our vision is to create a platform that connects people with communities that suit them based on interests, hobbies, or specific needs.
            Our website is designed to help individuals find a place where they can grow,
            feel a sense of belonging, and be part of meaningful groups.
            The idea behind creating the site comes from the desire to simplify the process of finding suitable communities,
            so that everyone can find a place where they feel at home and support their personal development.
          </p>

          <TeamMember 
            name="Maria Badarne and Liza Vainer"
            description="They are responsible for developing the parts of the website that interact directly with the user.
            This includes creating an interactive user interface, managing the layout and structure of the pages, 
            and ensuring a smooth and engaging user experience. They work with React and CSS to build a dynamic and responsive front-end."
          />

          <TeamMember 
            name="Nathen Nurmoradov and Sean Matatov"
            description="They focus on the back-end development of the site, working on building the server-side logic, 
            database management, and creating APIs that connect the front-end with the data. 
            They use Node.js and MongoDB to ensure that the platform operates efficiently and securely."
          />
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
