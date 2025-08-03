// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import LoginForm from './LoginForm';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; 
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin`, {
          method: 'GET',
          headers: { Authorization: token },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token check failed:', error);
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleScrapeStart = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/run-spiders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ⬅️ 加 Bearer
      },
    });

    if (response.ok) {
      alert('Scraping Seek.com has started!');
      navigate('/');
    } else {
      alert('Failed to start scraping.');
    }
  } catch (err) {
    console.error(err);
    alert('Error connecting to backend.');
  }
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
