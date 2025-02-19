import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "./useLogin";

import user_icon from "../Assets/person_icon.png";
import background_login from "../Assets/background_login.png";
import password_open from "../Assets/password_look_icon.png";
import password_closed from "../Assets/password_closed_icon.png";
import art_community from "../Assets/art_community.jpg";
import yoga_community from "../Assets/yoga_community.jpg";
import sports_community from "../Assets/sports_community.jpg";
import music_community from "../Assets/music_community.jpg";
import "./Login.css";

const Login = () => {
  const login = useLogin(); 
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To prevent simultaneous animations
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formValidationName, setFormValidationName] = useState(true);
  const [formValidationPassword, setFormValidationPassword] = useState(true);
  const images = [
    art_community,
    yoga_community,
    sports_community,
    music_community,
  ];
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validation1 = () => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    let flag = true;

    if (name === "") {
      setFormValidationName(false);
      flag = false;
    } else {
      setFormValidationName(true);
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

  const handleSubmit = async () => {
    const success = await login(name, password); // Call the login function
    if (success) {
      navigate("/home"); // Navigate to the home page
    } else {
      console.log("success does not work");
    }
  };

  return (
    <div
      className="body"
      style={{ backgroundImage: `url(${background_login})` }}
    >
      <div className="container">
        <div className="welcome-message">
          <h1>Welcome to Collective!</h1>
        </div>
        <div className="header">
          <div className="text">Login</div>
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
               <div className="error-popup">Invalid or empty field</div>
            )}
          </div>

          <div className="input">
          <img
              src={passwordVisible ? password_open : password_closed}
              alt="password toggle"
              className="image"
              onClick={togglePasswordVisibility}
            />
            <input
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {!formValidationPassword && (
               <div className="error-popup">Invalid or empty field</div>
            )}
          </div>
        </div>
        <div className="forgotPassword">
          Forgot Password? <span>Click Here!</span>
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
        
      </div>
      <div className="submit-container-login">
          <div
            className={"submit"}
            onClick={() => {
              handleSubmit();
            }}
          >
            Login
          </div>
          <div
            className={"submit gray"}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </div>
        </div>
    </div>
  );
};

export default Login;
