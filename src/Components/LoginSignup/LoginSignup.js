import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import user_icon from "../Assets/person_icon.png";
import email_icon from "../Assets/email_icon.png";
import password_open from "../Assets/password_look_icon.png";
import password_closed from "../Assets/password_closed_icon.png";
import background_login from "../Assets/background_login.png";

import art_community from "../Assets/art_community.jpg";
import yoga_community from "../Assets/yoga_community.jpg";
import sports_community from "../Assets/sports_community.jpg";
import music_community from "../Assets/music_community.jpg";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [showBody, setShowBody] = useState(false); // Tracks if the new body should be displayed
  const navigate = useNavigate();
  const [isReligious, setIsReligious] = useState(false); // Track if user is religious
  const [religion, setReligion] = useState(""); // Track selected religion

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To prevent simultaneous animations
  const carouselRef = useRef(null);

  const images = [
    art_community,
    yoga_community,
    sports_community,
    music_community,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isAnimating]);

  useEffect(() => {
    if (carouselRef.current) {
      // Move the image left by applying a translateX on the wrapper
      const wrapper = carouselRef.current;
      wrapper.style.transform = `translateX(-${currentImageIndex * 300}px)`;

      // Allow the animation to complete before switching isAnimating
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000); // Match the transition duration
    }
  }, [currentImageIndex]);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async () => {
    if (action === "Login") {
      try {
        const response = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }), // Send email and password as JSON
        });

        const data = await response.json(); // Parse response

        if (response.ok) {
          // setName(data.name);
          // setPassword(data.password);
          alert("Login successful");
          navigate("/home"); // You can also store the user info in localStorage or context here if needed
        } else {
          // If login fails, show error message
          alert(data.message || "Invalid credentials. Please try again.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      }
    } else if (action === "Sign Up") {
      setShowBody(true); // Show the new body for Sign-Up
    }
  };

  // =================== Back to Login / Sign Up Functions ===================
  const handleBackToLogin = () => {
    setShowBody(false); // Hide the new body and return to the original one
    setAction("Login"); // Switch action back to Login
  };

  const handleBackToSignup = () => {
    setShowBody(false);
    setAction("Sign Up");
  };

  const handleContinue = () => {
    navigate("/home"); // Navigate to the main page (Home)
  };

  // =================== Handle Religious Checkbox ===================
  const handleCheckboxChange = (event) => {
    setIsReligious(event.target.checked); // Set if the user is religious
    if (!event.target.checked) {
      setReligion(""); // Reset religion selection if checkbox is unchecked
    }
  };

  const handleReligionChange = (event) => {
    setReligion(event.target.value); // Set selected religion
  };

  // =================== Main Body (Rendering Logic) ===================
  return (
    <div
      className="body"
      style={{ backgroundImage: `url(${background_login})` }}
    >
      {!showBody ? (
        // =================== Initial Body (Login/Signup) ===================
        <div className="container">
          <div className="welcome-message">
            <h1>Welcome to Collective!</h1>
          </div>
          <div className="header">
            <div className="text">{action}</div>
            <div className="underlane"></div>
          </div>

          <div className="inputs">
            <div className="input">
              <img src={user_icon} alt="user" className="image" />
              <input
                name="name"
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {action === "Sign Up" && (
              <div className="input">
                <img src={email_icon} alt="email" className="image" />
                <input type="email" placeholder="Email" />
              </div>
            )}

            <div className="input">
              <img src={password_closed} alt="password" className="image" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {action === "Login" && (
              <div className="forgotPassword">
                Forgot Password? <span>Click Here!</span>
              </div>
            )}
          </div>

          <div className="submit-container">
            <div
              className={action === "Sign Up" ? "submit gray" : "submit"}
              onClick={() => {
                if (action === "Login") {
                  handleSubmit(); // If in Login, handle submission and navigate
                } else {
                  setAction("Login"); // Switch to Login if in Sign Up
                }
              }}
            >
              Login
            </div>

            <div
              className={action === "Login" ? "submit gray" : "submit"}
              onClick={() => {
                if (action === "Sign Up") {
                  handleSubmit(); // Show new body for Sign-Up
                } else {
                  setAction("Sign Up"); // Switch to Sign Up if in Login
                }
              }}
            >
              Sign Up
            </div>
          </div>
        </div>
      ) : (
        // =================== New Body (For Sign Up) ===================
        <div className="container">
          <h2>Can you tell us more about you?</h2>
          <h3>(Optional)</h3>

          {/* =================== Age Question =================== */}
          <div className="question">
            <label htmlFor="age-input">What is your age?</label>
            <input
              type="number"
              id="age-input"
              className="age-input"
              placeholder="age"
            />
          </div>

          {/* =================== Religious Question =================== */}
          <div className="question">
            <label>Are you religious?</label>
            <label>
              <input
                type="checkbox"
                onChange={(e) => setIsReligious(e.target.checked)}
              />
            </label>
            {isReligious && (
              <select
                className="religion-list"
                value={religion}
                onChange={handleReligionChange}
              >
                <option value="muslim">Muslim</option>
                <option value="jewish">Jewish</option>
                <option value="christian">Christian</option>
                <option value="other">Other</option>
              </select>
            )}
          </div>

          {/* =================== Ethnicity Question =================== */}
          <div className="question">
            <label htmlFor="ethnicity-select">What is your ethnicity?</label>
            <select id="ethnicity-select" className="religion-list">
              <option value="caucasian">Caucasian</option>
              <option value="black">Black</option>
              <option value="middle-eastern">Middle Eastern</option>
              <option value="asian">Asian</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* =================== Interest Question =================== */}
          <div className="question">
            <label htmlFor="interest-select">
              What is your preferred interest?
            </label>
            <select id="interest-select" className="religion-list">
              <option value="entertainment">Entertainment</option>
              <option value="sport">Sport</option>
              <option value="religion">Religion</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* =================== Image Carousel =================== */}
          <div className="carousel-container">
            <div ref={carouselRef} className="carousel-wrapper">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Community"
                  className="carousel-image"
                />
              ))}
            </div>
          </div>

          {/* =================== Action Buttons (Back & Continue) =================== */}
          <div className="submit-container">
            <div className="submit" onClick={handleBackToSignup}>
              Back to Sign up
            </div>

            <div className="submit" onClick={handleContinue}>
              Continue
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
