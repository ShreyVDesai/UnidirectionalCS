import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">Commlink</div>
      <nav>
        {!token ? (
          <Link to="/login">Login</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
