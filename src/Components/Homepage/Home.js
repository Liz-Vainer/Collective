import React, { useState, useCallback } from 'react';
import background_fornow from '../Assets/background_login.png';
import { useNavigate } from 'react-router-dom';
import { FaDoorOpen, FaCog, FaInfoCircle } from 'react-icons/fa';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import './Home.css';

const Home = () => {
  //===================== Navigation Handlers =====================
  const navigate = useNavigate();

  const handleBackToLogin = () => navigate("/");
  const handleSettings = () => navigate("/settings");
  const handleInfo = () => alert("Info Button Clicked");

  //===================== Google Map Configuration =====================
  const mapContainerStyle = {
    height: '80%',
    width: '100%',
  };

  const center = {
    lat: 31.252973,
    lng: 34.791462, // Coordinates for Be'er Sheva, Israel
  };

  //===================== Fake Communities Data =====================
  const fakeCommunities = [
    { id: 1, name: "Art Lovers", lat: 31.2561, lng: 34.7946 },
    { id: 2, name: "Tech Enthusiasts", lat: 31.2543, lng: 34.7921 },
    { id: 3, name: "Foodies Hub", lat: 31.2508, lng: 34.7905 },
    { id: 4, name: "Fitness Freaks", lat: 31.2535, lng: 34.7890 },
  ];

  //===================== State Management =====================
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDXrYi-yg0G4hUZ9_OLbuRC7Uzx_2zJI3c',
  });

  const [map, setMap] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const onLoad = useCallback((mapInstance) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const addToFavorites = (community) => {
    if (!favorites.some((fav) => fav.id === community.id)) {
      setFavorites([...favorites, community]);
    } else {
      alert(`${community.name} is already in your favorites.`);
    }
  };

  //===================== Loading/Error Handling =====================
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  //===================== Component UI =====================
  return (
    <div
      className="mainbody"
      style={{
        backgroundImage: `url(${background_fornow})`,
        backgroundColor: 'transparent',
      }}
    >
      {/* Back to Login Button */}
      <button className="backButton" onClick={handleBackToLogin}>
        Back to Login
      </button>

      {/* Upper Tool Section */}
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
      </div>

      {/* Main Content Section */}
      <div className="main-container">
        <div className="center-main">
          <h1>Welcome to the Home Page!</h1>
          <p>This is the page you navigate to after login or signup.</p>
          <h1>Welcome to Be'er Sheba!</h1>
          <p>Here is a map of Be'er Sheba, Israel.</p>

          {/* Google Map */}
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Central Marker */}
            <Marker position={center} />

            {/* Markers for Fake Communities */}
            {fakeCommunities.map((community) => (
              <Marker
                key={community.id}
                position={{ lat: community.lat, lng: community.lng }}
                onClick={() => setSelectedCommunity(community)}
              />
            ))}

            {/* InfoWindow for Selected Community */}
            {selectedCommunity && (
              <InfoWindow
                position={{
                  lat: selectedCommunity.lat,
                  lng: selectedCommunity.lng,
                }}
                onCloseClick={() => setSelectedCommunity(null)}
              >
                <div>
                  <h3>{selectedCommunity.name}</h3>
                  <p>Welcome to {selectedCommunity.name} community!</p>
                  <button
                    onClick={() => {
                      addToFavorites(selectedCommunity);
                      setSelectedCommunity(null);
                    }}
                  >
                    Add to Favorites
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Right Toolbox for Favorites */}
        <div className="right-toolside">
          <h3>Your Favorites</h3>
          <ul>
            {favorites.map((fav) => (
              <li key={fav.id}>{fav.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
