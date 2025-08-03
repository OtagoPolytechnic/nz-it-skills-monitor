// src/components/ChartStyle/SkillsBarChart.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = [
  '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0',
  '#00bcd4', '#8bc34a', '#ffc107', '#f44336', '#3f51b5',
];

const SkillsBarChart = ({ title, data, dataKey, barKey, chartMode, currentMode, expanded, onToggleExpand  }) => {
  if (chartMode !== currentMode) return null;

  const sortedData = [...data].sort((a, b) => b[barKey] - a[barKey]);
  const displayedData = expanded ? sortedData : sortedData.slice(0, 10);

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={displayedData}>
          <XAxis type="number" />
          <YAxis type="category" dataKey={dataKey} width={150} />
          <Tooltip />
          <Bar
            dataKey={barKey}
            radius={[0, 10, 10, 0]}
            isAnimationActive={true}
          >
            {displayedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <button className="expand-btn" onClick={onToggleExpand}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

export default SkillsBarChart;
