import React from "react";
import "./App.css";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Home from "./Components/Homepage/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }
  callApi() {
    fetch("http://localhost:3000")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }));
  }

  componentWillUnmount() {
    this.callApi();
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    );
  }
}
export default App;
