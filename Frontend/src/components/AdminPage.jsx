// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import LoginForm from './LoginForm';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ws, setWs] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [output, setOutput] = useState('');

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

  useEffect(() => {
    const socketUrl = `${import.meta.env.VITE_API_URL}/scrape-status`;
    const socket = new WebSocket(socketUrl);
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established to', socketUrl);
    };

    socket.onmessage = (event) => {
      setOutput((prevOutput) => prevOutput + event.data + '\n');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleScrapeStart = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/run-spiders`, {
        method: 'GET',
        headers: {
          Authorization: token,
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

  const stopScraper = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stop-spiders`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data);
      setStatusMessage(response.data.message);

    } catch (error) {
      console.error('Error stopping spiders:', error);
      setStatusMessage(error.response?.data?.error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="content-container">
        {isAuthenticated ? (
          <div>
            <h2>Admin Dashboard</h2>
            {statusMessage && <p>{statusMessage}</p>}
            <button onClick={handleScrapeStart} className="btn">
              Start Scraping
            </button>
            <button onClick={stopScraper} className="btn">
              Stop Spiders
            </button>
          </div>
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
      <pre>{output}</pre>
    </div>
  );
};

export default AdminPage;
