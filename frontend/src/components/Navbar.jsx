// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        Track<span>ify</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/">Browse</NavLink>

        {user ? (
          <>
            <NavLink to="/my-items">My Posts</NavLink>
            <Link to="/report" className="btn btn-primary btn-sm">+ Report Item</Link>
            <span className="nav-user">👤 {user.name?.split(" ")[0]}</span>
            <button className="nav-btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="nav-cta nav-links">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
