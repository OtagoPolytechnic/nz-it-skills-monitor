import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Navbar = ({
  categories = [],
  categoryFilter = "",
  onCategoryChange,
  chartType = "bar",
  onChartTypeChange
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);

  const catRef = useRef(null);
  const chartRef = useRef(null);

  const selectCategory = (value) => {
    if (onCategoryChange) onCategoryChange(value);
    setCatOpen(false);
    setMenuOpen(false);
  };

  const selectChartType = (value) => {
    if (onChartTypeChange) onChartTypeChange(value);
    setChartOpen(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (chartRef.current && !chartRef.current.contains(e.target)) setChartOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const labelize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span style={{ color: "#3b82f6" }}>IT</span> Skills Monitor
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

          {/* Category dropdown */}
          <div className="nav-dropdown" ref={catRef}>
            <button
              type="button"
              className="nav-link dropdown-trigger"
              onClick={() => {
                setCatOpen((o) => !o);
                setChartOpen(false);
              }}
            >
              {categoryFilter || "Category"}
              <span className="dropdown-arrow">▼</span>
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

          {/* Chart Type dropdown */}
          <div className="nav-dropdown" ref={chartRef}>
            <button
              type="button"
              className="nav-link dropdown-trigger"
              onClick={() => {
                setChartOpen((o) => !o);
                setCatOpen(false);
              }}
            >
              {`Chart Type: ${labelize(chartType)}`}
              <span className="dropdown-arrow">▼</span>
            </button>

            {chartOpen && (
              <div className="dropdown-menu">
                {["bar", "pie", "wordcloud"].map((t) => (
                  <button
                    key={t}
                    className={`dropdown-item${chartType === t ? " active" : ""}`}
                    onClick={() => selectChartType(t)}
                  >
                    {labelize(t)}
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
