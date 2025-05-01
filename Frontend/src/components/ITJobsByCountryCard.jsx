// src/components/ITJobsByCountryCard.jsx
import React, { useState } from 'react';
import {
  PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
  '#a4de6c', '#d0ed57', '#ffbb28', '#d291bc', '#ff9999',
  '#c2c2f0', '#ffb6b9', '#e6ee9c', '#ffcc80', '#bcaaa4'
];

const ITJobsByCountryCard = ({ jobData }) => {
  const [expanded, setExpanded] = useState(false);

  const locationCounts = jobData.reduce((acc, job) => {
    const loc = job.location || 'Unknown';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const sortedLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1]);

  const topLocations = sortedLocations.slice(0, 10);
  const remaining = sortedLocations.slice(10);

  const data = expanded
    ? sortedLocations.map(([name, value]) => ({ name, value }))
    : topLocations.map(([name, value]) => ({ name, value }));

  return (
    <div className="card">
      <h3>IT Jobs by Country</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
      <button onClick={() => setExpanded(!expanded)} style={{ marginTop: '10px' }}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

export default ITJobsByCountryCard;
