// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => {
  return (
<nav className="navbar">
  <div className="navbar-container">
    <div className="logo">IT Monitor</div>
    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
      ☰
    </button>
    <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/it-jobs" className="nav-link">IT Jobs Screen</Link>
      <Link to="/admin" className="nav-link">Admin</Link>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
