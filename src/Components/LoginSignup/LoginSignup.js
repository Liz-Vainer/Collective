import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import user_icon from "../Assets/person_icon.png";
import email_icon from "../Assets/email_icon.png";
import password_open from "../Assets/password_look_icon.png";
import password_closed from "../Assets/password_closed_icon.png";
import background_login from "../Assets/background_login.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [showBody, setShowBody] = useState(false);
  const navigate = useNavigate(); // Use the navigate function from react-router-dom
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
      setShowBody(true); // Placeholder for SignUp
    }
  };

  return (
    <div
      className="body"
      style={{ backgroundImage: `url(${background_login})` }}
    >
      <div className="welcome-message">
        <h1>Welcome to Collective!</h1>
      </div>

      <div className="container">
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

          {action === "Sign Up" && ( //mail input only in sign up
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

          {action === "Login" && ( // forgot password for login
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
            {action === "Login" ? "Login" : "Sign Up"}
          </div>

          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => {
              if (action === "Sign Up") {
                handleSubmit(); // If in Sign Up, handle submission and navigate
              } else {
                setAction("Sign Up"); // Switch to Sign Up if in Login
              }
            }}
          >
            {action === "Login" ? "Sign Up" : "Login"}
          </div>
        </div>

        {showBody && (
          <div className="new-body">
            <h2>This is the new main body for Sign Up!</h2>
            {/* You can add any other content here for the new body */}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
