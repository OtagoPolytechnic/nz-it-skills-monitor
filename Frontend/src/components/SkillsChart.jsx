// src/components/SkillsChart.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const SkillsChart = ({ title, data, dataKey, barKey }) => {
  const [expanded, setExpanded] = useState(false);

  if (!data?.length) return <div>No {title} data available.</div>;

  // Sort descending by count
  const sortedData = [...data].sort((a, b) => b[barKey] - a[barKey]);

  // Show top 10 or all based on expanded state
  const displayData = expanded ? sortedData : sortedData.slice(0, 10);

  return (
    <div className="card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={displayData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <XAxis type="number" />
          <YAxis
            dataKey={dataKey}
            type="category"
            width={150}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey={barKey}>
            <LabelList dataKey={barKey} position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {data.length > 10 && (
        <button className="btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      )}
    </div>
  );
};

export default SkillsChart;
