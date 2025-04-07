// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import LoginForm from './LoginForm';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleScrapeStart = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://127.0.0.1:5000/run-spiders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    alert(result.message || 'Scraping triggered!');
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
