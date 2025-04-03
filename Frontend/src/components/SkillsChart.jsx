// src/components/SkillsChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SkillsChart = ({ title, data, dataKey, barKey }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey={dataKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={barKey} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;
