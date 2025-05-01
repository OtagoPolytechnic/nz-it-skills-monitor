// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import ITJobsByCountryCard from './ITJobsByCountryCard';
import SkillsChart from './SkillsChart';
import '../App.css';

const Home = () => {
  const [skillsData, setSkillsData] = useState({
    language: [],
    framework: [],
    tool: [],
    platform: [],
    methodology: [],
    database: [],
    'soft skill': [],
  });

  const [jobData, setJobData] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  // Fetch jobs (for location pie chart)
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
      const data = await res.json();
      setJobData(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  // Fetch skills
  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const types = Object.keys(skillsData);
      const results = await Promise.all(
        types.map(async (type) => {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/skills?type=${type}`);
          const data = await res.json();
          return { type, data };
        })
      );

      const newSkillsData = {};
      let dataExists = false;

      results.forEach(({ type, data }) => {
        const countMap = {};

        data.forEach((skill) => {
          const name = skill.name.toLowerCase();
          countMap[name] = (countMap[name] || 0) + 1;
        });

        const sortedArray = Object.entries(countMap)
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count);

        newSkillsData[type] = sortedArray;
        if (sortedArray.length > 0) dataExists = true;
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
    fetchJobs();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="stacked-dashboard">
        <div className="category-dropdown">
          <label htmlFor="categorySelect"><strong>Category:</strong></label>
          <select
            id="categorySelect"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">-- Select a category --</option>
            <option>Architects</option>
            <option>Business/Systems Analysts</option>
            <option>Computer Operators</option>
            <option>Consultants</option>
            <option>Database Development & Administration</option>
            <option>Developers/Programmers</option>
            <option>Engineering - Hardware</option>
            <option>Engineering - Network</option>
            <option>Engineering - Software</option>
            <option>Help Desk & IT Support</option>
            <option>Management</option>
            <option>Networks & Systems Administration</option>
            <option>Product Management & Development</option>
            <option>Programme & Project Management</option>
            <option>Sales - Pre & Post</option>
            <option>Security</option>
            <option>Team Leaders</option>
            <option>Technical Writing</option>
            <option>Telecommunications</option>
            <option>Testing & Quality Assurance</option>
            <option>Web Development & Production</option>
            <option>Other</option>
          </select>
        </div>

        {!hasData && !isLoading && <p>No job data available.</p>}

        {hasData && (
          <>
            <ITJobsByCountryCard jobData={jobData} />

            <SkillsChart title="Soft Skills" dataKey="skill" barKey="count" data={skillsData['soft skill']} />
            <SkillsChart title="Languages" dataKey="skill" barKey="count" data={skillsData.language} />
            <SkillsChart title="Frameworks & Libraries" dataKey="skill" barKey="count" data={skillsData.framework} />
            <SkillsChart title="DevOps & Tools" dataKey="skill" barKey="count" data={skillsData.tool} />
            <SkillsChart title="Databases" dataKey="skill" barKey="count" data={skillsData.database} />
            <SkillsChart title="Methodologies" dataKey="skill" barKey="count" data={skillsData.methodology} />
            <SkillsChart title="Platforms" dataKey="skill" barKey="count" data={skillsData.platform} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
