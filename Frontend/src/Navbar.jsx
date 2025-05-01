// src/components/Navbar.jsx
import React from 'react';
const [selectedCategory, setSelectedCategory] = useState('');
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/it-jobs" className="nav-link">IT Jobs Screen</Link>
      <Link to="/admin" className="nav-link">Admin</Link>
    </nav>
  );
};

export default Navbar;
