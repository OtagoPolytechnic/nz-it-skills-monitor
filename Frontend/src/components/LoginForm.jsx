// src/components/LoginForm.jsx

// .env File : 
// VITE_ADMIN_USERNAME=admin
// VITE_ADMIN_PASSWORD=verylongadminpassword




import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === adminUsername && password === adminPassword) {
      onLoginSuccess(); // Show scraping button after login
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn">Login</button>
    </form>
  );
};

export default LoginForm;
