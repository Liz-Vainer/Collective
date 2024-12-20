import React from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Homepage/Home';
import SettingsPage from './Components/SettingsPage/SettingsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Info from './Components/Info/Info';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;
