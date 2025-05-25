import React from 'react';
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
  '#a4de6c', '#d0ed57', '#ffbb28', '#d291bc', '#ff9999',
];

const SkillsPieChart = ({ title, data, chartMode, currentMode, expanded, onToggleExpand }) => {
  if (chartMode !== currentMode) return null;

  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={sortedData}
            dataKey="count"
            nameKey="skill"
            cx="50%"
            cy="50%"
            outerRadius={220}
            fill="#8884d8"
            label={({ name }) => name}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>

      <button className="expand-btn" onClick={onToggleExpand}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

export default SkillsPieChart;
