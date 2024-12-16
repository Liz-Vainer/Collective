import React, { useState } from "react";
import './LoginSignup.css';
import user_icon from '../Assets/person_icon.png';
import email_icon from '../Assets/email_icon.png';
import password_open from '../Assets/password_look_icon.png';
import password_closed from '../Assets/password_closed_icon.png'
import background_login from '../Assets/background_login.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");

    return (
        <div className="body" style={{ backgroundImage: `url(${background_login})`} }>
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
                    {action === "Sign Up" && (
                    <div className="input">
                    <img src={email_icon} alt="email" className="image" />
                    <input type="email" placeholder="Email" />
                 </div>
                )}

                    <div className="input">
                        <img src={password_closed} alt="password" className="image" />
                        <input type="password" placeholder="Password" />
                    </div>
                    {action==="Login"&&(
                    <div className="forgotPassword">
                        Forgot Password? <span>Click Here!</span>
                    </div>
                    )}
                    <div className="submit-container">
                        <div
                            className={action === "Sign Up" ? "submit gray" : "submit"}
                            onClick={() => setAction("Login")}
                        >
                            Log In
                        </div>
                        <div
                            className={action === "Login" ? "submit gray" : "submit"}
                            onClick={() => setAction("Sign Up")}
                        >
                            Sign Up
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
