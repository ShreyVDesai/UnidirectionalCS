import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequesterDashboard from "./pages/RequesterDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/requester" element={<RequesterDashboard />} />
        <Route path="/responder" element={<ResponderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
