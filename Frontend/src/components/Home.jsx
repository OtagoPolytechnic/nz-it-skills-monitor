// src/components/Home.jsx
import React from 'react';
import Navbar from '../Navbar';
import ITJobsByCountryCard from './ITJobsByCountryCard';
import SkillsChart from './SkillsChart';
import '../App.css';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <ITJobsByCountryCard />
        <SkillsChart />
      </div>
    </div>
  );
};

export default Home;
