import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SkillsChart = ({ title, data, dataKey, barKey }) => {
  const [expanded, setExpanded] = useState(false);
  const sortedData = [...data].sort((a, b) => b[barKey] - a[barKey]);
  const displayedData = expanded ? sortedData : sortedData.slice(0, 10);

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={displayedData}>
          <XAxis type="number" />
          <YAxis type="category" dataKey={dataKey} width={150} />
          <Tooltip />
          <Bar dataKey={barKey} fill="#000" />
        </BarChart>
      </ResponsiveContainer>

      <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

export default SkillsChart;
