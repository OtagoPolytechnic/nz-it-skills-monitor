import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a0522d',
  '#40e0d0', '#ff69b4', '#87cefa', '#da70d6', '#32cd32',
];

const SkillsPieChart = ({ title, data, chartMode, currentMode, expanded, onToggleExpand }) => {
  if (chartMode !== currentMode) return null;

  const sorted = [...data].sort((a, b) => b.count - a.count);
  const displayedData = expanded ? sorted.slice(0, 20) : sorted.slice(0, 10);

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={displayedData}
            dataKey="count"
            nameKey="skill"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ index }) => `${displayedData[index].skill} (${displayedData[index].count})`}
          >
            {displayedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <button className="expand-btn" onClick={onToggleExpand}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

export default SkillsPieChart;
