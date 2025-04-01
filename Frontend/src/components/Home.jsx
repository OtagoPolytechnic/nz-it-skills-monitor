// src/components/Home.jsx
import React from 'react';
import Navbar from '../Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="content-container">
        <h2>Welcome to the NZ IT Skills Monitor</h2>
      </div>
    </div>
  );
};

export default Home;
