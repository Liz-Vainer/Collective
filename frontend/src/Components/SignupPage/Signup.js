import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "./useSignup";
import email_icon from "../Assets/email_icon.png";
import user_icon from "../Assets/person_icon.png";
import password_closed from "../Assets/password_closed_icon.png";
import password_open from "../Assets/password_look_icon.png";
import art_community from "../Assets/art_community.jpg";
import yoga_community from "../Assets/yoga_community.jpg";
import sports_community from "../Assets/sports_community.jpg";
import music_community from "../Assets/music_community.jpg";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const signup = useSignup();
  const [formValidationName, setFormValidationName] = useState(true);
  const [formValidationEmail, setFormValidationEmail] = useState(true);
  const [formValidationPassword, setFormValidationPassword] = useState(true);
  const [formValidationConfirmPassword, setFormValidationConfirmPassword] =
    useState(true);
  const carouselRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To prevent simultaneous animations
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(null);
  const [ethnicity, setEthnicity] = useState("other");
  const [interest, setInterest] = useState("other");
  const [isReligious, setIsReligious] = useState(false); // Track if user is religious
  const [religion, setReligion] = useState("no"); // Track selected religion
  const [userType, setUserType] = useState("citizen"); //
  const [showContainer, setShowContainer] = useState(false);
  const images = [
    art_community,
    yoga_community,
    sports_community,
    music_community,
  ];
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (userType === "citizen") {
      setShowContainer(true); // Trigger fade-in when userType is "citizen"
    } else {
      setShowContainer(false); // Hide the container if userType changes
    }
  }, [userType]); // Depend on userType change

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
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

  const handleReligionChange = (event) => {
    setReligion(event.target.value); // Set selected religion
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
    if (confirmPassword === "") {
      setFormValidationConfirmPassword(false);
      flag = false;
    } else {
      setFormValidationConfirmPassword(true);
    }
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setFormValidationConfirmPassword(false);
        flag = false;
      } else {
        setFormValidationConfirmPassword(true);
      }
    }

    if (!flag) {
      return false;
    } else {
      return true;
    }
  };

  const handleSignup = async () => {
    const succes = await signup(
      name,
      email,
      password,
      userType,
      age,
      isReligious,
      religion,
      ethnicity,
      interest,
      gender
    );
    if (succes) {
      navigate("/home");
    } else {
      console.log("singup does not work");
    }
  };

  return (
    <div className="body">
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
              onChange={(e) => setName(e.target.value)}
            />
            {!formValidationName && (
              <div className="error-popup">Invalid or empty field</div>
            )}
          </div>
          <div className="input">
            <img src={email_icon} alt="email" className="image" />
            <input
              name="email"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {!formValidationEmail && (
              <div className="error-popup">Invalid or empty field</div>
            )}
          </div>

          <div className="input">
            <img
              src={showPassword ? password_open : password_closed}
              alt="password"
              className="image"
              onClick={togglePasswordVisibility} // Toggle on click
              style={{ cursor: "pointer" }} // Add pointer cursor
            />
            <input
  name="password"
  type={showPassword ? "text" : "password"} // Use showPassword here
  placeholder="Password"
  onChange={(e) => setPassword(e.target.value)}
/>
            {!formValidationPassword && (
              <div className="error-popup">Invalid or empty field</div>
            )}
          </div>
          <div className="input">
            <img
              src={showConfirmPassword ? password_open : password_closed}
              alt="password"
              className="image"
              onClick={toggleConfirmPasswordVisibility} // Toggle on click
              style={{ cursor: "pointer" }} // Add pointer cursor
            />

            <input
              name="ConfirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {!formValidationConfirmPassword && (
              <div className="error-popup">Invalid or empty field</div>
            )}
          </div>
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
        </div>
      </div>

      {userType === "citizen" && (
        <div className={`second-container ${showContainer ? "show" : ""}`}>
          <h2>Can you tell us more about you?</h2>
          <h3>(Optional)</h3>

          {/* =================== Gender Question =================== */}
          <div className="question">
            <label htmlFor="gender-select">What is your gender?</label>
            <select
              id="gender-select"
              className="religion-list"
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
                checked={isReligious}
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
              <option value="other">Other</option>
              <option value="black">Black</option>
              <option value="middle-eastern">Middle Eastern</option>
              <option value="asian">Asian</option>
              <option value="caucasian">Caucasian</option>
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
              <option value="other">Other</option>
              <option value="sport">Sport</option>
              <option value="religion">Religion</option>
              <option value="entertainment">Entertainment</option>
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
        </div>
      )}

      <div className="submit-container">
        <div
          className="submit"
          onClick={() => {
            navigate("/");
          }}
        >
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
  );
};

export default Signup;
