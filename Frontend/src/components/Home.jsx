// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import SkillsBarChart from './ChartStyle/SkillsBarChart';
import SkillsPieChart from './ChartStyle/SkillsPieChart';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
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
  const [locationChartMode, setLocationChartMode] = useState('bar');

  const chartModesPerCategory = {
    'soft skill': useState('bar'),
    language: useState('bar'),
    framework: useState('bar'),
    tool: useState('bar'),
    platform: useState('bar'),
    methodology: useState('bar'),
    database: useState('bar'),
  };

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

  const renderChart = (title, data, chartMode, setChartMode) => {
    const isValid = Array.isArray(data) && data.length > 0 &&
      data.every(item => item && typeof item.skill === 'string' && typeof item.count === 'number');

    if (!isValid) {
      return (
        <div className="chart-card">
          <h3>{title}</h3>
          <p style={{ padding: '1rem' }}>No valid data available.</p>
        </div>
      );
    }

    return (
      <div className="chart-card">
        <h3>{title}</h3>
        <div className="chart-toggle-buttons">
          <button onClick={() => setChartMode('bar')}>Bar</button>
          <button onClick={() => setChartMode('pie')}>Pie</button>
        </div>
        {chartMode === 'bar' ? (
          <SkillsBarChart title={title} data={data} dataKey="skill" barKey="count" chartMode="bar" currentMode={chartMode} />
        ) : (
          <SkillsPieChart title={title} data={data} dataKey="skill" barKey="count" chartMode="pie" currentMode={chartMode} />
        )}
      </div>
    );
  };

  const renderLocationChart = () => {
    const data = getLocationData();

    return (
      <div className="chart-card">
        <h3>Locations</h3>
        <div className="chart-toggle-buttons">
          <button onClick={() => setLocationChartMode('bar')}>Bar</button>
          <button onClick={() => setLocationChartMode('pie')}>Pie</button>
        </div>
        {locationChartMode === 'pie' ? (
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={220}
                fill="#8884d8"
                label={({ name }) => name}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart layout="vertical" data={data}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="button-wrapper">
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
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

        {!hasData && !isLoading && <p>No job data available.</p>}

        {hasData && (
          <>
            {renderLocationChart()}
            {Object.entries(skillsData).map(([type, data]) => {
              const [chartMode, setChartMode] = chartModesPerCategory[type];
              return renderChart(type.charAt(0).toUpperCase() + type.slice(1), data, chartMode, setChartMode);
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
