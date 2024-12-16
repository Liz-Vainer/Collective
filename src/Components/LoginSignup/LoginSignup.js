import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import user_icon from '../Assets/person_icon.png';
import email_icon from '../Assets/email_icon.png';
import password_open from '../Assets/password_look_icon.png';
import password_closed from '../Assets/password_closed_icon.png';
import background_login from '../Assets/background_login.png';

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [showBody,setShowBody]=useState(false);
  const navigate = useNavigate(); // Use the navigate function from react-router-dom

  const handleSubmit = () => {
    if (action === "Login") {
      navigate("/home"); // Redirect to the Home page after login
    } else if (action === "Sign Up") {
     setShowBody(true); // Redirect to the Home page after signup
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
            <input type="text" placeholder="Name" />
          </div>

       
          {action === "Sign Up" && (//mail input only in sign up
            <div className="input">
              <img src={email_icon} alt="email" className="image" /> 
              <input type="email" placeholder="Email" />
            </div>
          )}

        
          <div className="input">
            <img src={password_closed} alt="password" className="image" />
            <input type="password" placeholder="Password" />
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
