import React from 'react';
import background_fornow from '../Assets/background_login.png';
import { useNavigate } from 'react-router-dom';
import './Home.css';  
const Home = () => {
  const navigate=useNavigate();
  const handleBackToLogin = ()=>{
    navigate("/");
  }
  return (
    
    <div className="mainbody" style={{ backgroundImage: `url(${background_fornow})` }}>
        <button className="backButton" onClick={handleBackToLogin}>
        Back to Login
      </button>
      <h1>Welcome to the Home Page!</h1>
      <p>This is the page you navigate to after login or signup.</p>
    </div>
  );
};

export default Home;