import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import user_icon from '../Assets/person_icon.png';
import email_icon from '../Assets/email_icon.png';
import password_open from '../Assets/password_look_icon.png';
import password_closed from '../Assets/password_closed_icon.png';
import background_login from '../Assets/background_login.png';
import axios from "axios";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [showBody,setShowBody]=useState(false);
  const navigate = useNavigate(); // Use the navigate function from react-router-dom

  const handleSubmit = async () => {
    // Collect the form data (name, email, password)
    const requestBody = {
      name: document.getElementById("name")?.value, // for name (Login or Sign Up)
      // email: document.getElementById("email")?.value, // for email (only Sign Up)
      password: document.getElementById("password")?.value, // for password
    };
  
    try {
      if (action === "Login") {
        // Send POST request for login
        const response = await axios.post("http://localhost:3000/users/login", requestBody);
  
        // If login is successful (status code 200)
        if (response.status === 200) {
          alert("Login successful!"); // Optionally show success message
          // Redirect to the home page after login
          navigate("/home");
        }
      } else if (action === "Sign Up") {
        // Send POST request for sign up
        const response = await axios.post("http://localhost:3000/users", requestBody);
  
        // If sign up is successful
        if (response.status === 200) {
          alert("Sign Up successful! Please log in."); // Success message for sign up
          setAction("Login"); // Change action to Login after successful sign up
          // You can also redirect the user to the login page or home if you want
          // navigate("/login"); 
        }
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        alert(error.response.data.message); // Show error message from backend
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };
  
  
  return (
    <div className="body" style={{ backgroundImage: `url(${background_login})` }}> 
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
            <input id="name" type="text" placeholder="Name" />
          </div>

       
          {action === "Sign Up" && (//mail input only in sign up
            <div className="input">
              <img src={email_icon} alt="email" className="image" /> 
              <input id="email" type="email" placeholder="Email" />
            </div>
          )}

        
          <div className="input">
            <img src={password_closed} alt="password" className="image" />
            <input id="password" type="password" placeholder="Password" />
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
