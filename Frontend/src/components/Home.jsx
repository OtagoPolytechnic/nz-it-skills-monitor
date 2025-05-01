// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import ITJobsByCountryCard from './ITJobsByCountryCard';
import SkillsChart from './SkillsChart';
import '../App.css';

const Home = () => {
  const [skillsData, setSkillsData] = useState({
    'soft skill': [],
    language: [],
    framework: [],
    tool: [],
    platform: [],
    methodology: [],
    database: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const types = Object.keys(skillsData);
      const results = await Promise.all(
        types.map(async (type) => {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/skills?type=${encodeURIComponent(type)}`);
          const data = await res.json();
          return { type, data };
        })
      );
  
      const newSkillsData = {};
      let dataExists = false;
  
      results.forEach(({ type, data }) => {
        const skillCountMap = {};
        data.forEach((s) => {
          const skillName = s.name.toLowerCase();
          skillCountMap[skillName] = (skillCountMap[skillName] || 0) + 1;
        });
  
        const aggregatedData = Object.entries(skillCountMap).map(([name, count]) => ({
          skill: name,
          count,
        }));
  
        newSkillsData[type] = aggregatedData;
        if (aggregatedData.length > 0) dataExists = true;
      });
  
      setSkillsData(newSkillsData);
      setHasData(dataExists);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="stacked-dashboard">
        {isLoading ? (
          <p>Loading data from backend...</p>
        ) : hasData ? (
          <>
            <ITJobsByCountryCard />
            <SkillsChart title="Soft Skills" dataKey="skill" barKey="count" data={skillsData['soft skill']} />
            <SkillsChart title="Languages" dataKey="skill" barKey="count" data={skillsData.language} />
            <SkillsChart title="Frameworks & Libraries" dataKey="skill" barKey="count" data={skillsData.framework} />
            <SkillsChart title="DevOps & Tools" dataKey="skill" barKey="count" data={skillsData.tool} />
            <SkillsChart title="Databases" dataKey="skill" barKey="count" data={skillsData.database} />
            <SkillsChart title="Methodologies" dataKey="skill" barKey="count" data={skillsData.methodology} />
            <SkillsChart title="Platforms" dataKey="skill" barKey="count" data={skillsData.platform} />
          </>
        ) : (
          <p>No data scraping at the moment... Please login to Admin first.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
