import React, { useEffect, useState } from "react";
import "./App.css";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Home from "./Components/Homepage/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";

const App = () => {
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    // Call API when component mounts
    const callApi = async () => {
      try {
        const res = await fetch("http://localhost:3000");
        const text = await res.text();
        setApiResponse(text);
      } catch (error) {
        console.error("Error fetching API:", error);
      }
    };

    callApi();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

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
};

export default App;
