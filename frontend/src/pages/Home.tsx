import React from "react";
import Header from "../components/Header";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="home">
        <h1>Welcome to Commlink</h1>
        <p>A platform for structured communication between Requesters and Responders</p>

        <div className="card-grid">
          <div className="feature-card">
            <span className="emoji">📨</span>
            <h3>Send Requests</h3>
            <p>Type A users can send requests to all responders.</p>
          </div>

          <div className="feature-card">
            <span className="emoji">✅</span>
            <h3>Accept & Respond</h3>
            <p>Type B users choose which requests to accept.</p>
          </div>

          <div className="feature-card">
            <span className="emoji">⏰</span>
            <h3>Time Controlled</h3>
            <p>1-hour response windows with automatic reminders.</p>
          </div>

          <div className="feature-card">
            <span className="emoji">🔄</span>
            <h3>Unidirectional</h3>
            <p>Structured communication flow for clarity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
