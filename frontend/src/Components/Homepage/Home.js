import React, { useState, useCallback, useEffect } from "react";
import background_fornow from "../Assets/background_login.png";
import { useNavigate } from "react-router-dom";
import {
  FaDoorOpen,
  FaCog,
  FaInfoCircle,
  FaSearch,
  FaBars,
  FaCamera,
} from "react-icons/fa";
import Drawer from "@mui/material/Drawer";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import "./Home.css";
import { useUser } from "../UserContext";
import Popup from "../Popup/Popup";
import Sidebar from "../Chat/Sidebar";
import user_icon from "../Assets/person_icon.png"; //temporary until we make community icon
import MessageContainer from "../Messages/MessageContainer";

const Home = () => {
  const { user } = useUser(); // Destructure user from context
  const [drawerOpen, setDrawerOpen] = useState(false);

  //===================== Navigation Handlers =====================
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/");
  };
  const handleSettings = () => navigate("/settings");
  const handleInfo = () => alert("Info Button Clicked");

  //===================== Google Map Configuration =====================
  const mapContainerStyle = {
    height: "80%",
    width: "100%",
  };

  const center = {
    lat: 31.252973,
    lng: 34.791462, // Coordinates for Be'er Sheva, Israel
  };

  //===================== Fake Communities Data =====================
  const [fakeCommunities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch("/get-fake-communities");
        const data = await response.json();

        if (response.ok) {
          setCommunities(data.communities || []);
        } else {
          alert(data.message || "Failed to fetch communities.");
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        alert("An error occurred. Please try again.");
      }
    };

    fetchCommunities();
  }, []);

  //===================== State Management =====================
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDXrYi-yg0G4hUZ9_OLbuRC7Uzx_2zJI3c",
  });

  const [map, setMap] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [buttonPopup, setButtonPopup] = useState(false); //Popup for adding community
  const [addAction, setAddAction] = useState("Add"); //action fo adding community
  const [name, setCommunityName] = useState("");
  const [category, setCommunityCategory] = useState("");
  const [lng, setCommunityLng] = useState();
  const [lat, setCommunityLat] = useState();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const [newPfp, setNewPfp] = useState(null); // To hold the newly selected profile picture
  const profilePicture = user.profilePicture || user_icon || null; // Default profile picture

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setNewPfp(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };
  // Fetch user's favorites from the backend
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user.userType !== "Official")
        try {
          const response = await fetch(
            `/users/${user.id}/fav/${user.userType}`
          );
          const data = await response.json();

          if (response.ok) {
            setFavorites(data.favorites);
            user.favorites = data.favorites;
          } else {
            alert(data.message || "Failed to fetch favorites.");
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          alert("An error occurred. Please try again.");
        }
    };

    fetchFavorites();
  }, [user.id, user.userType]);

  const onLoad = useCallback((mapInstance) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const addToFavorites = async (community) => {
    if (!favorites.some((fav) => fav.name === community.name)) {
      try {
        const response = await fetch("/users/add-to-fav", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id, // Pass the user's id from the logged-in user
            community, // Send the community object directly
            userType: user.userType,
          }),
        });

        const data = await response.json();
        console.log(favorites); // Check the current favorites before adding
        console.log(data); // Check what is returned by the backend

        if (response.ok) {
          user.favorites = data.favorites;
          setFavorites(user.favorites);
          alert("Added to favorites");
        } else {
          alert(data.message || "Failed to add to favorites");
        }
      } catch (error) {
        console.error("Error adding to favorites:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert(`${community.name} is already in your favorites.`);
    }
  };

  //adding communities for official user
  const addCommunityPopup = async () => {
    try {
      const response = await fetch(`/add-community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, category, lng, lat }),
      });

      if (response.ok) {
        const newCommunity = { name, category, lng, lat }; // Optimistically update state with new community
        setCommunities((prev) => [...prev, newCommunity]);

        setTimeout(async () => {
          // Wait for state update, then fetch updated communities
          const communitiesResponse = await fetch("/get-fake-communities");
          const communitiesData = await communitiesResponse.json();
          if (communitiesResponse.ok) {
            setCommunities(communitiesData.communities);
            alert("Community created!");
          } else {
            alert("Failed to fetch updated communities.");
          }
        }, 100); // Adding a small delay for the UI update
      } else {
        alert("There was an issue creating a community.");
      }
    } catch (error) {
      console.error("Error during user creation:", error);
      alert("An error occurred. Please try again.");
    }
  };

  //deleting community by official user
  const removeCommunity = async (community) => {
    try {
      const name = community.name;
      const response = await fetch(`/remove-community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        const response = await fetch("/get-fake-communities");
        const data = await response.json();
        setCommunities(data.communities); // Update with fresh data
        alert("Community deleted!");
      } else {
        alert(data.message || "There was an issue deleting the community.");
      }
    } catch (err) {}
  };

  //deleting community from favotites
  const removeFavorite = async (community) => {
    try {
      const response = await fetch(`/remove-favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          community,
          userType: user.userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        user.favorites = data.favorites;
        setFavorites(user.favorites);
        alert("Community removed from favorites!");
      } else {
        alert(data.message || "There was an issue deleting the community.");
      }
    } catch (err) {}
  };

  // Filtered Communities Based on Search Query and Category
  const filteredCommunities = fakeCommunities.filter((community) => {
    const matchesCategory =
      activeCategory === "All" || community.category === activeCategory;
    const matchesSearch = community.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  //===================== Loading/Error Handling =====================
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  //===================== Component UI =====================
  return (
    <div
      className="mainbody"
      style={{
        backgroundImage: `url(${background_fornow})`,
        backgroundColor: "transparent",
      }}
    >
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

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
          <button className="search-icon-button">
            <FaSearch size={20} color="gray" />
          </button>
        </div>

        {/* Category Buttons */}
        <div className="category-buttons">
          {["All", "Sport", "Entertainment", "Religion"].map((category) => (
            <button
              key={category}
              className={`category-button ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-container">
        <div className="center-main">
          <h1>Welcome to Be'er Sheba!</h1>
          {/* Google Map */}
          <GoogleMap
            className="google-map"
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Markers for Filtered Communities */}
            {filteredCommunities.map((community) => (
              <Marker
                key={community._id}
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
                  {user.userType !== "Official" &&
                    !user.favorites.some(
                      (fav) => fav.name === selectedCommunity.name
                    ) && (
                      <button
                        onClick={() => {
                          addToFavorites(selectedCommunity);
                          setSelectedCommunity(null);
                        }}
                      >
                        Add to Favorites
                      </button>
                    )}

                  {user.userType !== "Official" &&
                    user.favorites.some(
                      (fav) => fav.name === selectedCommunity.name
                    ) && (
                      <button
                        onClick={() => {
                          removeFavorite(selectedCommunity);
                          setSelectedCommunity(false);
                        }}
                      >
                        Remove from favorites
                      </button>
                    )}

                  {user.userType === "Official" && (
                    <button
                      onClick={() => {
                        removeCommunity(selectedCommunity);
                        setSelectedCommunity(false);
                      }}
                    >
                      Remove Community
                    </button>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/*Popup for adding communities */}
        <Popup
          className="popup"
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
        >
          <div className="popup-container">
            <div className="popup-message"></div>
            <div className="popup-header">
              <div className="text">Enter Community Details:</div>
              <div className="underlane"></div>
            </div>

            <div className="inputs">
              <div className="input">
                <img src={user_icon} alt="user" className="image" />
                <input
                  name="name"
                  type="text"
                  placeholder="Community Name"
                  onChange={(e) => setCommunityName(e.target.value)}
                />
              </div>
            </div>

            <div className="inputs">
              <div className="input">
                <img src={user_icon} alt="user" className="image" />
                <input
                  name="category"
                  type="text"
                  placeholder="Community Category"
                  onChange={(e) => setCommunityCategory(e.target.value)}
                />
              </div>
            </div>

            <div className="inputs">
              <div className="input">
                <img src={user_icon} alt="user" className="image" />
                <input
                  name="lng"
                  type="number"
                  placeholder="Lng"
                  onChange={(e) => setCommunityLng(e.target.value)}
                />
              </div>
            </div>

            <div className="inputs">
              <div className="input">
                <img src={user_icon} alt="user" className="image" />
                <input
                  name="lat"
                  type="number"
                  placeholder="Lat"
                  onChange={(e) => setCommunityLat(e.target.value)}
                />
              </div>
            </div>

            <button
              className="add-comm-btn"
              onClick={() => {
                addCommunityPopup(addAction);
                setAddAction(null);
                setButtonPopup(false);
              }}
            >
              Add Community
            </button>
          </div>
        </Popup>

        <Popup
          trigger={isChatOpen}
          setTrigger={toggleChat}
          position="bottom-right"
        >
          <div className="chat">
            <Sidebar />
            <MessageContainer />
          </div>
        </Popup>

        {/* Right Toolbox for Favorites */}
        {user.userType !== "Official" && (
          <div className="right-toolside">
            <h3>Your Favorites</h3>
            <ul>
              {favorites.map((fav) => (
                <li key={fav._id}>{fav.name}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="drawer-toggle-button"
          onClick={() => setDrawerOpen(true)}
          onMouseEnter={() => setDrawerOpen(true)} // Open on hover
          // Open the drawer on button click
        >
          <FaBars size={30} color="white" />
        </button>

        {/* Drawer Component */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div
            className="drawer-content"
            onMouseLeave={() => setDrawerOpen(false)}
          >
            {/* Profile Section */}
            <div className="profile-section">
              <img alt="Profile" className="profile-pic" />
              <FaCamera size={50} color="gray" className="change-pfp-icon" />
              <button onClick={triggerFileInput} className="change-profile-btn">
                Change Profile
              </button>
              {/* Hidden File Input */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Other Drawer Buttons */}
            <button onClick={handleBackToLogin}>Back to Login</button>
            <button onClick={handleSettings}>Settings</button>
            <button onClick={handleInfo}>Info</button>
          </div>
        </Drawer>
        {/*Right toolbox for city official user*/}
        {/* Right Toolbox for Favorites */}
        {user.userType === "Official" && (
          <div className="right-toolside">
            <h3>Communities List</h3>
            <ul>
              {filteredCommunities.map((community) => (
                <li key={community._id}>{community.name}</li>
              ))}
            </ul>
            <button
              className="add-comm-btn"
              onClick={() => setButtonPopup(true)}
            >
              Add Community
            </button>
          </div>
        )}

        <button
          className={`chat-button ${isChatOpen ? "hidden" : ""}`}
          onClick={toggleChat}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default Home;
