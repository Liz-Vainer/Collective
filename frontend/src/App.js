import React from "react";
import "./App.css";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Home from "./Components/Homepage/Home";
import SettingsPage from "./Components/SettingsPage/SettingsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<LoginSignup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </UserProvider>
  );
}

export default App;
