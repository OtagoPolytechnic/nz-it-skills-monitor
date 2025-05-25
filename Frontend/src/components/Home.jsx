// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import ChartWrapper from './ChartStyle/ChartWrapper';
import '../App.css';

const Home = () => {
  const [skillsData, setSkillsData] = useState({
    language: [], framework: [], tool: [], platform: [],
    methodology: [], database: [], 'soft skill': [],
  });
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const [globalChartType, setGlobalChartType] = useState('bar');
  const [chartTypes, setChartTypes] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [locationChartType, setLocationChartType] = useState('bar');
  const [locationExpanded, setLocationExpanded] = useState(false);

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

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => { extractSkills(filteredJobs); }, [filteredJobs]);
  useEffect(() => {
  const updated = {};
  Object.keys(skillsData).forEach(key => {
    updated[key] = globalChartType;
  });
  setChartTypes(updated);
  setLocationChartType(globalChartType); // 🔥 this line syncs location
}, [globalChartType]);

  const extractSkills = (jobs) => {
    const grouped = {
      language: [], framework: [], tool: [], platform: [],
      methodology: [], database: [], 'soft skill': [],
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
      skillList.forEach(skill => {
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

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    const filtered = value
      ? allJobs.filter((job) => job.category.toLowerCase() === value.toLowerCase())
      : allJobs;
    setFilteredJobs(filtered);
  };

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

    const data = locationExpanded
      ? [...sorted.map(([name, value]) => ({ name, value })), ...(missing ? [{ name: 'None', value: missing }] : [])]
      : sorted.slice(0, 10).map(([name, value]) => ({ name, value }));

    return data;
  };

  const renderLocationChart = () => {
  const data = getLocationData();

  const handleLocationChartChange = (type) => {
    setLocationChartType(type);
  };

  const chartData = data.map(item => ({
    skill: item.name,
    count: item.value
  }));

  return (
    <div className="chart-card">
      <h3>Locations</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        <button onClick={() => handleLocationChartChange('bar')}>Bar</button>
        <button onClick={() => handleLocationChartChange('pie')}>Pie</button>
        <button onClick={() => handleLocationChartChange('wordcloud')}>Word Cloud</button>
      </div>
      <ChartWrapper
        chartType={locationChartType}
        title="Locations"
        data={chartData}
        dataKey="skill"
        barKey="count"
        expanded={locationExpanded}
        onToggleExpand={() => setLocationExpanded(!locationExpanded)}
      />
      
    </div>
  );
};


  const renderSkillChart = (title, data, typeKey) => {
    const isValid = Array.isArray(data) && data.length > 0 &&
      data.every(item => item && typeof item.skill === 'string' && typeof item.count === 'number');
    if (!isValid) return null;

    const currentType = chartTypes[typeKey] || globalChartType;
    const isExpanded = expandedSections[typeKey] || false;

    const setLocalChartType = (mode) => {
      setChartTypes(prev => ({ ...prev, [typeKey]: mode }));
    };

    const toggleExpand = () => {
      setExpandedSections(prev => ({
        ...prev,
        [typeKey]: !prev[typeKey],
      }));
    };

    return (
      <div className="chart-card" key={typeKey}>
        <h3>{title}</h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <button onClick={() => setLocalChartType('bar')}>Bar</button>
          <button onClick={() => setLocalChartType('pie')}>Pie</button>
          <button onClick={() => setLocalChartType('wordcloud')}>Word Cloud</button>
        </div>
        <ChartWrapper
          chartType={currentType}
          title={title}
          data={data}
          dataKey="skill"
          barKey="count"
          expanded={isExpanded}
          onToggleExpand={toggleExpand}
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
            {[...new Set(allJobs.map((job) => job.category))].filter(Boolean).sort().map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
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
              renderSkillChart(type.charAt(0).toUpperCase() + type.slice(1), list, type)
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
