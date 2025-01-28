// External libraries
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PostContainer from "./PostContainer";
import ChatPopup from "../Popup/ChatPopup";

import { FaDoorOpen, FaSearch, FaBars, FaCamera } from "react-icons/fa";

import Drawer from "@mui/material/Drawer";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  OverlayView,
} from "@react-google-maps/api";
import useStyles from "./DrawerStyle";
import { useUser } from "../../context/UserContext";
import useLogout from "../../hooks/useLogout";

// Styles and assets

import "./Home.css";
import user_icon from "../Assets/person_icon.png"; //temporary until we make community icon

// Components
import Popup from "../Popup/Popup";
import Members from "../Members/Members";
import Sidebar from "../Chat/Sidebar";
import MessageContainer from "../Messages/MessageContainer";
import useUserEvents from "../../zustand/useUserEvents";
import useGetJoinedEvents from "../../hooks/useGetJoinedEvents";

const Home = () => {
  const classes = useStyles(); // Use custom styles
  const { authUser, setAuthUser } = useUser(); // Destructure user from context
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { loading, logout } = useLogout();
  const { userEvents } = useUserEvents();
  useGetJoinedEvents(authUser.id);
  //===================== Navigation Handlers =====================
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    logout();
    navigate("/");
  };
  const handleSettings = () => {
    document.body.classList.add("move-left");
    setTimeout(() => {
      navigate("/settings");
    }, 500);
  };

  const handleMoreInfo = () => {
    const selectedCommunityId = selectedCommunity._id; // Example: passing only the community ID
    navigate(`/CommunityInfo?id=${selectedCommunityId}`);
  };

  useEffect(() => {
    // Remove any move transition classes when this component loads
    document.body.classList.remove("move-left", "move-right");
  }, []);
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

  //fetching communities from database
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch("/get-fake-communities", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This ensures cookies are sent
        });
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
  const [isMember, setIsMember] = useState();
  const [showMembers, setShowMembers] = useState(false);
  const chartRef = useRef(null); // Ref to access the pie chart instance

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Pie chart download function
  const downloadChart = () => {
    const chart = chartRef.current.chartInstance; // Get the chart instance
    const imageUrl = chart.toBase64Image(); // Generate the image as base64 string

    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "pie-chart.png"; // Set the file name
    a.click(); // Trigger download
  };

  const [newPfp, setNewPfp] = useState(authUser.profilePic); // To hold the newly selected profile picture

  useEffect(() => {
    if (selectedCommunity) {
      const fetchMembershipStatus = async () => {
        const result = await checkJoined(selectedCommunity);
        setIsMember(result);
      };
      fetchMembershipStatus();
    }
  }, [selectedCommunity]);

  //Leave community
  async function leaveCommunity(selectedCommunity) {
    try {
      const response = await fetch("/leave-community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId: selectedCommunity._id,
          userId: authUser.id,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`Left the ${selectedCommunity.name}!`);
        setIsMember(false);
      } else {
        console.error(
          `Your are still a member of the ${selectedCommunity.name}!`,
          data
        );
      }
    } catch (err) {
      console.error("An error occurred while trying to leave a community", err);
    }
  }

  //Join community
  async function joinCommunity(selectedCommunity) {
    try {
      const response = await fetch("/join-community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId: selectedCommunity._id,
          userId: authUser.id,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`Joined the ${selectedCommunity.name}!`);
        setIsMember(true);
      } else {
        console.error(
          `Your are not a member of the ${selectedCommunity.name}!`,
          data
        );
      }
    } catch (err) {
      console.error("An error occurred while trying to join a community", err);
    }
  }
  //Check if user is a member of the community
  async function checkJoined(selectedCommunity) {
    try {
      const response = await fetch("/check-joined-community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId: selectedCommunity._id,
          userId: authUser.id,
        }),
        credentials: "include",
      });
      const data = await response.json();
      console.log("This is response from checkJoined: ", data);
      if (response.ok) {
        return data.member;
      } else {
        console.error("Your are not a member of this community!", data);
        return data.member;
      }
    } catch (err) {
      console.error(
        "An error occurred while checking community membership",
        err
      );
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        let newProfilePic = reader.result; // Get the base64 data from the reader
        setNewPfp(newProfilePic); // Optionally update the state
        updateProfilePicture(newProfilePic); // Pass the profile picture directly
      };

      reader.readAsDataURL(file);
    }
  };

  // Update user profile picture
  const updateProfilePicture = async (profilePic) => {
    if (!profilePic) return;
    try {
      const response = await fetch(`/update-profile-pic/${authUser.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePic: profilePic, // Use the profilePic passed as a parameter
          userType: authUser.userType,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Profile picture updated successfully!");
        setAuthUser(data); // Assuming `setAuthUser` updates the user profile in the state
        localStorage.setItem("user-info", JSON.stringify(data));
      } else {
        console.error("Failed to update profile picture: ", data);
      }
    } catch (err) {
      console.error("Error updating profile picture:", err);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  // Fetch user's favorites from the backend
  useEffect(() => {
    const fetchFavorites = async () => {
      if (authUser.userType !== "Official")
        try {
          const response = await fetch(
            `/users/${authUser.id}/fav/${authUser.userType}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // This ensures cookies are sent
            }
          );
          const data = await response.json();

          if (response.ok) {
            setFavorites(data.favorites);
            authUser.favorites = data.favorites;
          } else {
            alert(data.message || "Failed to fetch favorites.");
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          alert("An error occurred. Please try again.");
        }
    };

    fetchFavorites();
  }, [authUser.id, authUser.userType]);

  const onLoad = useCallback((mapInstance) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  //add comunity to favorites
  const addToFavorites = async (community) => {
    if (!favorites.some((fav) => fav.name === community.name)) {
      try {
        const response = await fetch("/users/add-to-fav", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This ensures cookies are sent
          body: JSON.stringify({
            id: authUser.id, // Pass the user's id from the logged-in user
            community, // Send the community object directly
            userType: authUser.userType,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          authUser.favorites = data.favorites;
          setFavorites(authUser.favorites);
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
        credentials: "include", // This ensures cookies are sent
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
        credentials: "include", // This ensures cookies are sent
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
        credentials: "include", // This ensures cookies are sent
        body: JSON.stringify({
          id: authUser.id,
          community,
          userType: authUser.userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        authUser.favorites = data.favorites;
        setFavorites(authUser.favorites);
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
    <div className="mainbody">
      {/* Upper Tool Section */}
      <div className="upper-tool">
        <button className="exit-button" onClick={handleBackToLogin}>
          <FaDoorOpen size={30} color="white" />
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
      <PostContainer />
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
            options={{ suppressInfoWindows: true }} // Correct option
          >
            {/* Markers for Filtered Communities */}
            {filteredCommunities.map((community) => (
              <Marker
                key={community._id}
                position={{ lat: community.lat, lng: community.lng }}
                onClick={() => setSelectedCommunity(community)}
                options={{ suppressInfoWindows: true }} // Correct option
              />
            ))}

            {/* InfoWindow for Selected Community */}
            {selectedCommunity && (
              <OverlayView
                position={{
                  lat: selectedCommunity.lat,
                  lng: selectedCommunity.lng,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} // Correct pane
              >
                <div className="info-window-content">
                  <button
                    className="close-button"
                    onClick={() => setSelectedCommunity(null)}
                  >
                    X
                  </button>
                  <h3>{selectedCommunity.name}</h3>
                  <p>Welcome to {selectedCommunity.name} community!</p>
                  <div className="action-buttons">
                    {authUser.userType !== "Official" &&
                      !authUser.favorites.some(
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
                    {authUser.userType !== "Official" && !isMember && (
                      <button onClick={() => joinCommunity(selectedCommunity)}>
                        Join Community
                      </button>
                    )}
                    {authUser.userType !== "Official" && isMember && (
                      <button
                        onClick={() => {
                          leaveCommunity(selectedCommunity);
                        }}
                      >
                        Leave Community
                      </button>
                    )}
                    {authUser.userType !== "Official" &&
                      authUser.favorites.some(
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
                    {authUser.userType === "Official" && (
                      <button
                        onClick={() => {
                          removeCommunity(selectedCommunity);
                          setSelectedCommunity(false);
                        }}
                      >
                        Remove Community
                      </button>
                    )}
                    {authUser.userType === "Official" && (
                      <button
                        onClick={() => {
                          setShowMembers(true);
                        }}
                      >
                        Show members
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleMoreInfo();
                      }}
                    >
                      More info
                    </button>
                  </div>
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        </div>
        {/* Pop up for showing members*/}
        <Popup
          trigger={showMembers}
          setTrigger={setShowMembers}
          position="bottom-right"
          className="popup"
        >
          <div className="">
            <h2>Member List</h2>
            <Members selectedCommunity={selectedCommunity} />
          </div>
        </Popup>
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
                <select
                  name="category"
                  className="dropdown"
                  onChange={(e) => setCommunityCategory(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Sport">Sport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Religon">Religon</option>
                  <option value="Other">Other</option>
                </select>
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
        <button
          className={`chat-button ${isChatOpen ? "hidden" : ""}`}
          onClick={toggleChat}
        >
          Chat
        </button>
        {/* Chat Popup */}
        {authUser.userType === "User" && isChatOpen && (
          <ChatPopup trigger={isChatOpen} setTrigger={setIsChatOpen}>
            <div className="inner-chat-popup">
              <Sidebar />
              <MessageContainer />
            </div>
          </ChatPopup>
        )}

        {/* Right Toolbox for Favorites */}
        {authUser.userType !== "Official" && (
          <div className="right-toolside">
            <h3>Your Favorites</h3>
            <ul>
              {favorites.map((fav) => (
                <li key={fav._id}>
                  {fav.name}
                  <button
                    onClick={() => handleMoreInfo(fav)}
                    className="more-info-btn"
                  >
                    More Info
                  </button>
                </li>
              ))}
            </ul>

            {authUser.userType === "User" && (
              <div className="events-joined">
                <h3>Events Joined</h3>
                {userEvents ? (
                  <ul>
                    {userEvents.map((eventName, index) => (
                      <li key={index}>{eventName}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No events joined yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/*Right toolbox for city official user*/}
        {/* Right Toolbox for Favorites */}
        {authUser.userType === "Official" && (
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
          className="drawer-trigger"
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
          classes={{ paper: classes.drawerPaper }}
        >
          <div
            className={classes.drawerContent}
            onMouseLeave={() => setDrawerOpen(false)}
          >
            {/* User Greeting */}
            <div className={classes.drawerText}>Hello!</div>

            {/* Profile Section */}
            <div className={classes.profileSection}>
              <img src={newPfp} alt="Profile" className={classes.profilePic} />
              <FaCamera
                size={30}
                color="#067029"
                className={classes.changePfpIcon}
                onClick={triggerFileInput} // Trigger the file input on icon click
              />
              <button
                onClick={triggerFileInput}
                className={classes.changeProfileBtn}
              >
                Change Profile
              </button>
              {/* Hidden File Input */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange} // Handle the file input change
                style={{ display: "none" }}
              />
            </div>

            {/* Quote Section */}
            <div className={classes.quoteSection}>
              "Nature does not hurry, yet everything is accomplished." – Lao Tzu
            </div>

            {/* Settings Button */}
            <button
              onClick={handleSettings}
              className={classes.changeProfileBtn}
            >
              Settings
            </button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Home;
