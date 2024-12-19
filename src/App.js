import React from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Homepage/Home'; 
<<<<<<< HEAD
=======
import SettingsPage from './Components/SettingsPage/SettingsPage'
>>>>>>> 7f5af59 (Add files to maria branch)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/home" element={<Home />} />
<<<<<<< HEAD
=======
        <Route path="/settings" element={<SettingsPage/>}/>
>>>>>>> 7f5af59 (Add files to maria branch)
      </Routes>
    </Router>
  );
}

export default App;
