import React from 'react';
import background_fornow from '../Assets/background_login.png';
import { useNavigate } from 'react-router-dom';
import { FaDoorOpen,FaCog,FaInfoCircle} from 'react-icons/fa';
import { GoogleMap,LoadScript,Marker } from '@react-google-maps/api';
import './Home.css';  

const Home = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/");
  };
  const handleSettings = () => {
    navigate("/settings")
  };
  const handleInfo = () => {
    // Add functionality for info button, e.g. navigate to an info page
    alert("Info Button Clicked");
  };
  const mapContainerStyle = {
    height: '100%',
    width: '100%',
  };
  const center = {
    lat: 31.2518,  // Latitude for Be'er Sheva, Israel
    lng: 34.7913,  // Longitude for Be'er Sheva, Israel
  };
  return (
    <div className="mainbody" style={{ backgroundImage: `url(${background_fornow})`, backgroundColor: 'transparent' }}>
      <button className="backButton" onClick={handleBackToLogin}>
        Back to Login
      </button>

      <div className="upper-tool">
      <button className="exit-button" onClick={handleBackToLogin}>
          <FaDoorOpen size={30} color="white" />
        </button>
        <button className="settings-button" onClick={handleSettings}>
          <FaCog size={30} color="white" />
        </button>
        <button className="info-button" onClick={handleInfo}>
          <FaInfoCircle size={30} color="white" />
        </button>
        </div>  {/* Upper tool is placed above everything */}
        
      
      <div className="main-container">
        <div className="center-main">
          <h1>Welcome to the Home Page!</h1>
          <p>This is the page you navigate to after login or signup.</p>
          <h1>Welcome to Be'er Sheba!</h1>
          <p>Here is a map of Be'er Sheba, Israel.</p>
          <LoadScript googleMapsApiKey="AIzaSyDXrYi-yg0G4hUZ9_OLbuRC7Uzx_2zJI3c" version='weeekly'>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
        >
          {/* You can add a Marker to the map */}
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>

          
        </div>

        <div className="right-toolside"></div>
      </div>
    </div>
  );
};

export default Home;
