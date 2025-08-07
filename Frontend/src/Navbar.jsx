import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">IT Monitor</div>

        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </button>

        <div className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/it-jobs" className="nav-link" onClick={() => setMenuOpen(false)}>IT Jobs</Link>
          <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
