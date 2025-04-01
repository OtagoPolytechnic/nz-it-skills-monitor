// src/components/AdminPage.jsx
import React, { useState } from 'react';
import Navbar from '../Navbar';
import LoginForm from './LoginForm';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleScrapeStart = () => {
    alert('Scraping Seek.com has started!');
    // Add backend scraping logic here
  };

  return (
    <div>
      <Navbar />
      <div className="content-container">
        {isAuthenticated ? (
          <div>
            <h2>Admin Dashboard</h2>
            <button onClick={handleScrapeStart} className="btn">
              Start Scraping
            </button>
          </div>
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
