// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import ChartWrapper from './ChartStyle/ChartWrapper';
import '../App.css';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
  '#a4de6c', '#d0ed57', '#ffbb28', '#d291bc', '#ff9999',
];

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
  const [expanded, setExpanded] = useState(false);
  const [globalChartType, setGlobalChartType] = useState('bar');

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
      const data = await res.json();
      setAllJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    const filtered = value
      ? allJobs.filter((job) => job.category.toLowerCase() === value.toLowerCase())
      : allJobs;
    setFilteredJobs(filtered);
  };

  const extractSkills = (jobs) => {
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
      if (Array.isArray(job.skills)) {
        job.skills.forEach((skill) => {
          const type = skill?.type?.toLowerCase();
          const name = skill?.name?.toLowerCase();
          if (type && name && grouped[type]) {
            grouped[type].push(name);
          }
        });
      }
    });

    const result = {};
    let hasAny = false;

    for (const [type, skillList] of Object.entries(grouped)) {
      const countMap = {};

      skillList.forEach((skill) => {
        if (typeof skill === 'string' && skill.trim()) {
          countMap[skill] = (countMap[skill] || 0) + 1;
        }
      });

      const sorted = Object.entries(countMap)
        .map(([skill, count]) => ({ skill, count }))
        .filter(item => typeof item.skill === 'string' && typeof item.count === 'number')
        .sort((a, b) => b.count - a.count);

      result[type] = sorted;
      if (sorted.length > 0) hasAny = true;
    }

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

  const getLocationData = () => {
    const locationCounts = filteredJobs.reduce((acc, job) => {
      const loc = job.location?.trim();
      if (loc && loc.toLowerCase() !== 'none') {
        acc[loc] = (acc[loc] || 0) + 1;
      } else {
        acc['__MISSING__'] = (acc['__MISSING__'] || 0) + 1;
      }
      return acc;
    }, {});

    const realLocations = Object.entries(locationCounts).filter(([name]) => name !== '__MISSING__');
    const missing = locationCounts['__MISSING__'];
    const sorted = realLocations.sort((a, b) => b[1] - a[1]);

    const data = expanded
      ? [...sorted.map(([name, value]) => ({ name, value })), ...(missing ? [{ name: 'None', value: missing }] : [])]
      : sorted.slice(0, 10).map(([name, value]) => ({ name, value }));

    return data;
  };

  const renderLocationChart = () => {
    const data = getLocationData();
    const chartData = data.map(item => ({
      skill: item.name,
      count: item.value
    }));

    return (
      <div className="chart-card">
        <h3>Locations</h3>
        <ChartWrapper
          chartType={globalChartType}
          title="Locations"
          data={chartData}
          dataKey="skill"
          barKey="count"
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
        />
      </div>
    );
  };

  const renderSkillChart = (title, data, typeKey) => {
    const isValid =
      Array.isArray(data) &&
      data.length > 0 &&
      data.every(item => item && typeof item.skill === 'string' && typeof item.count === 'number');

    if (!isValid) return null;

    return (
      <div className="chart-card" key={typeKey}>
        <ChartWrapper
          chartType={globalChartType}
          title={title}
          data={data}
          dataKey="skill"
          barKey="count"
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
        />
      </div>
    );
  };

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
                <option key={cat} value={cat}>{cat}</option>
              ))}
          </select>
        </div>

        {/* Global chart type buttons */}
        <div className="global-chart-type-toggle" style={{ margin: '1rem 0' }}>
          <strong>Global Chart Type: </strong>
          <button onClick={() => setGlobalChartType('bar')}>Bar</button>
          <button onClick={() => setGlobalChartType('pie')}>Pie</button>
          <button onClick={() => setGlobalChartType('wordcloud')}>Word Cloud</button>
        </div>

        {!hasData && !isLoading && <p>No job data available.</p>}

        {hasData && (
          <>
            {renderLocationChart()}
            {Object.entries(skillsData).map(([type, list]) =>
              renderSkillChart(
                type.charAt(0).toUpperCase() + type.slice(1),
                list,
                type
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
