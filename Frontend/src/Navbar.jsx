import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Navbar = ({ categories = [], categoryFilter = "", onCategoryChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectCategory = (value) => {
    if (onCategoryChange) onCategoryChange(value);
    setCatOpen(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span style={{ color: "#3b82f6" }}>IT</span> Monitor
        </div>

        <button
          className={`hamburger-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </button>

        <div className={`navbar-links ${menuOpen ? "show" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className="nav-link dropdown-trigger"
              onClick={() => setCatOpen((o) => !o)}
            >
              {categoryFilter || "Category"}
              <span className="caret" />
            </button>

            {catOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => selectCategory("")}>
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`dropdown-item${categoryFilter === cat ? " active" : ""}`}
                    onClick={() => selectCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
