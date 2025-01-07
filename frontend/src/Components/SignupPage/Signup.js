import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import useSignup from "./useSignup";
import email_icon from "../Assets/email_icon.png";
import user_icon from "../Assets/person_icon.png";
import password_closed from "../Assets/password_closed_icon.png";
// import password_open from "../Assets/password_look_icon.png ";
import background_login from "../Assets/background_login.png";
import art_community from "../Assets/art_community.jpg";
import yoga_community from "../Assets/yoga_community.jpg";
import sports_community from "../Assets/sports_community.jpg";
import music_community from "../Assets/music_community.jpg";
import "./Signup.css";

const Signup = () => {
  const loggedUser = useUser();
  const navigate = useNavigate();
  const signup = useSignup();
  const [formValidationName, setFormValidationName] = useState(true);
  const [formValidationEmail, setFormValidationEmail] = useState(true);
  const [formValidationPassword, setFormValidationPassword] = useState(true);
  const carouselRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To prevent simultaneous animations

  const images = [
    art_community,
    yoga_community,
    sports_community,
    music_community,
  ];
  //In order to reset data for signup
  useEffect(() => {
    loggedUser.setUser(null);
    loggedUser.setName("");
    loggedUser.setPassword("");
    loggedUser.setEmail("");
    loggedUser.setGender("other");
    loggedUser.setAge(null);
    loggedUser.setEthnicity("other");
    loggedUser.setInterest("other");
    loggedUser.setIsReligious(false);
    loggedUser.setReligion("no");
  }, []);

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

  const handleReligionChange = (event) => {
    loggedUser.setReligion(event.target.value); // Set selected religion
  };

  //=================== Name and email and password validation ===============
  const validation1 = () => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    let flag = true;

    if (loggedUser.name === "") {
      setFormValidationName(false);
      flag = false;
    } else {
      setFormValidationName(true);
    }
    if (loggedUser.email === "") {
      setFormValidationEmail(false);
      flag = false;
    } else {
      setFormValidationEmail(true);
    }
    if (loggedUser.password === "") {
      setFormValidationPassword(false);
      flag = false;
    } else {
      setFormValidationPassword(true);
    }
    if (loggedUser.password) {
      if (regex.test(loggedUser.password)) {
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

  const handleSignup = async () => {
    const succes = await signup();
    if (succes) {
      navigate("/home");
    } else {
      console.log("success does not work");
    }
  };
  return (
    <div
      className="body"
      style={{ backgroundImage: `url(${background_login})` }}
    >
      // =================== Initial Body (Signup) ===================
      <div className="container">
        <div className="welcome-message">
          <h1>Welcome to Collective!</h1>
        </div>
        <div className="header">
          <div className="text">{"Signup"}</div>
          <div className="underlane"></div>
        </div>

        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="user" className="image" />
            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={(e) => loggedUser.setName(e.target.value)}
            />
            {!formValidationName && <h1 color="RED">CHANGE HERE LIZA/MARIA</h1>}
          </div>
          <div className="input">
            <img src={email_icon} alt="email" className="image" />
            <input
              name="email"
              type="text"
              placeholder="Email"
              onChange={(e) => loggedUser.setEmail(e.target.value)}
            />
            {!formValidationEmail && (
              <h1 color="RED">CHANGE HERE LIZA/MARIA</h1>
            )}
          </div>

          <div className="input">
            <img src={password_closed} alt="password" className="image" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => loggedUser.setPassword(e.target.value)}
            />
            {!formValidationPassword && (
              <h1 color="RED">CHANGE HERE LIZA/MARIA</h1>
            )}
          </div>

          <div className="question">
            <label htmlFor="user-type-select">Which user are you?</label>
            <select
              id="user-type-select"
              className="religion-list"
              value={loggedUser.userType}
              onChange={(e) => loggedUser.setUserType(e.target.value)}
            >
              <option value="citizen">Citizen</option>
              <option value="event-organizer">Event Organizer</option>
              <option value="city-official">City Official</option>
            </select>
          </div>
        </div>
      </div>
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
              loggedUser.setGender(e.target.value);
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
              loggedUser.setAge(e.target.value);
            }}
          />
        </div>

        {/* =================== Religious Question =================== */}
        <div className="question">
          <label>Are you religious?</label>
          <label>
            <input
              type="checkbox"
              checked={loggedUser.isReligious}
              onChange={(e) => loggedUser.setIsReligious(e.target.checked)}
            />
          </label>
          {loggedUser.isReligious && (
            <select
              className="religion-list"
              value={loggedUser.religion}
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
              loggedUser.setEthnicity(e.target.value);
            }}
          >
            <option value="other">Other</option>
            <option value="black">Black</option>
            <option value="middle-eastern">Middle Eastern</option>
            <option value="asian">Asian</option>
            <option value="caucasian">Caucasianr</option>
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
              loggedUser.setInterest(e.target.value);
            }}
          >
            <option value="other">Other</option>
            <option value="sport">Sport</option>
            <option value="religion">Religion</option>
            <option value="entertainmentr">Entertainment</option>
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
          <div
            className="submit"
            onClick={() => {
              navigate("/");
            }}
          >
            {/* "/" --> "/login" */}
            Back to Login
          </div>
          <div
            className="submit"
            onClick={() => {
              if (validation1()) {
                handleSignup();
              }
            }}
          >
            Continue
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
