import React from "react";
import "./App.css";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Home from "./Components/Homepage/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
