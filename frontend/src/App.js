import React from "react";
import "./App.css";
import Home from "./Components/Homepage/Home";
import Signup from "./Components/SignupPage/Signup";
import Login from "./Components/LoginPage/Login";
import SettingsPage from "./Components/SettingsPage/SettingsPage";
import ChartEmbed from "./Components/ChartEmbed Component/chart";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useUser } from "./context/UserContext";

function App() {
  const { authUser } = useUser();

  return (
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
        <Route
          path="/home"
          element={authUser ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/charts"
          element={authUser ? <ChartEmbed /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
