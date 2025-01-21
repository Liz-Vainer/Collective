import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const ComSetTem = () => {
  const { authUser } = useUser(); // User data from context
  const [joinedCommunity, setJoinedCommunity] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
 const navigate = useNavigate();
  useEffect(() => {
    // Assuming `authUser` contains relevant community-related data
    setJoinedCommunity(authUser.joinedCommunity);  // Set joined community
    setFavorites(authUser.favorites);  // Set favorite communities
    setSearchHistory(authUser.searchHistory);  // Set search history
  }, [authUser]);
  const BackToHome = () => {
    navigate('/home'); // Navigate to the login page (change '/login' if your route is different)
  };
  return (
    <div className="community-settings-container">
        <div className="community-header">
        <h2>Community Settings:</h2>
    <button className="back-home-button" onClick={BackToHome}>Back home</button>
  </div>

      <div className="community-section">
        <h3>Community Joined</h3>
       
      </div>

      <div className="favorites-section">
        <h3>Favorites</h3>
        
      </div>

      <div className="search-history-section">
        <h3>Search History</h3>
        
      </div>
    </div>
  );
};

export default ComSetTem;
