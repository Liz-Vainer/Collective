import React from "react";
import "./App.css";
import Home from "./Components/Homepage/Home";
import Signup from "./Components/SignupPage/Signup";
import Login from "./Components/LoginPage/Login";
import SettingsPage from "./Components/SettingsPage/SettingsPage";
import { useUser } from "./context/UserContext";
import background_login from "./Components/Assets/background_login.png";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const { authUser } = useUser();

  return (
    <div
      style={{
        backgroundImage: `url(${background_login})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/home" /> : <Signup />}
          />
          {/* Protected routes */}
          <Route
            path="/home"
            element={authUser ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/settings"
            element={authUser ? <SettingsPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
