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

  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  // Fetch all jobs once
  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
      const data = await res.json();
      setAllJobs(data);
      setFilteredJobs(data); // default: show everything
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  // Filter jobs by selected category
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    const filtered = value
      ? allJobs.filter((job) => job.category.toLowerCase() === value.toLowerCase())
      : allJobs;
    setFilteredJobs(filtered);
  };

  // Recalculate skills every time filteredJobs changes
  const extractSkills = async (jobs) => {
    const grouped = {
      language: [],
      framework: [],
      tool: [],
      platform: [],
      methodology: [],
      database: [],
      'soft skill': [],
    };

    jobs.forEach((job) => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach((skill) => {
          const type = skill.type?.toLowerCase();
          const name = skill.name?.toLowerCase();
          if (type && name && grouped[type]) {
            grouped[type].push(name);
          }
        });
      }
    });

    const result = {};
    let hasAny = false;

    Object.entries(grouped).forEach(([type, skills]) => {
      const countMap = {};
      skills.forEach((skill) => {
        countMap[skill] = (countMap[skill] || 0) + 1;
      });

      const sorted = Object.entries(countMap)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count);

      result[type] = sorted;
      if (sorted.length > 0) hasAny = true;
    });

    setSkillsData(result);
    setHasData(hasAny);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    extractSkills(filteredJobs);
  }, [filteredJobs]);

  return (
    <div>
      <Navbar />
      <div className="stacked-dashboard">
        <div className="category-dropdown">
          <label htmlFor="categorySelect"><strong>Category:</strong></label>
          <select
            id="categorySelect"
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(allJobs.map((job) => job.category))]
              .filter(Boolean)
              .sort()
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

        </div>

        {!hasData && !isLoading && <p>No job data available.</p>}

        {hasData && (
          <>
            <ITJobsByCountryCard jobData={filteredJobs} />
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
