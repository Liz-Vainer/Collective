import React, { useState, useEffect, useRef, use } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import user_icon from "../Assets/person_icon.png";
import email_icon from "../Assets/email_icon.png";
import password_open from "../Assets/password_look_icon.png";
import password_closed from "../Assets/password_closed_icon.png";
import background_login from "../Assets/background_login.png";
import { useUser } from "../UserContext";

import art_community from "../Assets/art_community.jpg";
import yoga_community from "../Assets/yoga_community.jpg";
import sports_community from "../Assets/sports_community.jpg";
import music_community from "../Assets/music_community.jpg";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [showBody, setShowBody] = useState(false); // Tracks if the new body should be displayed
  const navigate = useNavigate();
  const [userType, setUserType] = useState("citizen");

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

  useEffect(() => {
    if (action === "Continue") {
      handleSubmit();
    }
  }, [action]);

  const {
    user,
    setUser,
    name,
    setName,
    password,
    setPassword,
    email,
    setEmail,
    age,
    setAge,
    ethnicity,
    setEthnicity,
    interest,
    setInterest,
    isReligious,
    setIsReligious,
    religion,
    setReligion,
    gender,
    setGender,
  } = useUser();

  const [formValidationName, setFormValidationName] = useState(true);
  const [formValidationEmail, setFormValidationEmail] = useState(true);
  const [formValidationPassword, setFormValidationPassword] = useState(true);

  const handleSubmit = async () => {
    if (action === "Login") {
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password }),
        });
        const data = await response.json();

        if (response.ok) {
          setUser(data); // Store user info (including userType) in the context
          alert("Login successful");

          navigate("/home");
        } else {
          alert(data.message || "Invalid credentials. Please try again.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      }
    } else if (action === "Continue") {
      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            userType,
            age,
            isReligious,
            religion,
            ethnicity,
            interest,
            gender,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("User created!");
          setUser(data); // Make sure the data has user information
        } else {
          alert(data.message || "There was an issue signing up.");
        }
      } catch (error) {
        console.error("Error during user creation:", error);
        alert("An error occurred. Please try again.");
      }

      navigate("/home"); // Navigate to the main page (Home)
    }
  };

  //=================== Name and email and password validation ===============
  const validation1 = () => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    let flag = true;

    if (name === "") {
      setFormValidationName(false);
      flag = false;
    } else {
      setFormValidationName(true);
    }
    if (email === "") {
      setFormValidationEmail(false);
      flag = false;
    } else {
      setFormValidationEmail(true);
    }
    if (password === "") {
      setFormValidationPassword(false);
      flag = false;
    } else {
      setFormValidationPassword(true);
    }
    if (password) {
      if (regex.test(password)) {
        setFormValidationPassword(true);
      } else {
        flag = false;
        setFormValidationPassword(false);
      }
    }
    if (!flag) {
      return false;
    } else {
      return true;
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
              {!formValidationName && (
                <h1 color="RED">CHANGE HERE LIZA/MARIA</h1>
              )}
            </div>

            {action === "Sign Up" && (
              <div className="input">
                <img src={email_icon} alt="email" className="image" />
                <input
                  name="email"
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!formValidationEmail && (
                  <h1 color="RED">CHANGE HERE LIZA/MARIA</h1>
                )}
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
              {!formValidationPassword && (
                <h1 color="RED">CHANGE HERE LIZA/MARIA</h1>
              )}
            </div>
            {action === "Sign Up" && (
              <div className="question">
                <label htmlFor="user-type-select">Which user are you?</label>
                <select
                  id="user-type-select"
                  className="religion-list"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="citizen">Citizen</option>
                  <option value="event-organizer">Event Organizer</option>
                  <option value="city-official">City Official</option>
                </select>
              </div>
            )}
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
                  if (validation1()) {
                    setShowBody(true); // Show new body for Sign-Up
                  }
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
          {/* =================== Gender Question =================== */}
          <div className="question">
            <label htmlFor="gender-select">What is your gender?</label>
            <select
              id="gender-select"
              className="gender-list"
              onChange={(e) => {
                setGender(e.target.value);
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* =================== Age Question =================== */}
          <div className="question">
            <label htmlFor="age-input">What is your age?</label>
            <input
              type="number"
              id="age-input"
              className="age-input"
              placeholder="age"
              min="18"
              max="100"
              onChange={(e) => {
                setAge(e.target.value);
              }}
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
            <select
              id="ethnicity-select"
              className="religion-list"
              onChange={(e) => {
                setEthnicity(e.target.value);
              }}
            >
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
            <select
              id="interest-select"
              className="religion-list"
              onChange={(e) => {
                setInterest(e.target.value);
              }}
            >
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

            <div
              className="submit"
              onClick={() => {
                setAction("Continue");
              }}
            >
              Continue
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
