// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Access .env variables for admin credentials
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  // Guest Login
  const handleGuestLogin = () => {
    localStorage.setItem('userRole', 'guest');
    navigate('/it-jobs'); // Redirect to ITJobsScreen after guest login
  };

  // Admin Login with .env credentials
  const handleAdminLogin = () => {
    const username = prompt('Enter Admin Username:');
    const password = prompt('Enter Admin Password:');

    // Check if the entered credentials match the ones in .env
    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem('userRole', 'admin');
      navigate('/admin'); // Redirect to admin page
    } else {
      setError('Invalid Admin Credentials!');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleGuestLogin} className="btn">
        Login as Guest
      </button>
      <button onClick={handleAdminLogin} className="btn">
        Login as Admin
      </button>
    </div>
  );
};

export default Login;
