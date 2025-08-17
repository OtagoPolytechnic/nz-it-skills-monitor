// src/components/ChartStyle/SkillsBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#e91e63",
  "#9c27b0",
  "#00bcd4",
  "#8bc34a",
  "#ffc107",
  "#f44336",
  "#3f51b5",
];

const SkillsBarChart = ({
  title,
  data,
  dataKey,
  barKey,
  chartMode,
  currentMode,
  expanded,
  onToggleExpand,
}) => {
  if (chartMode !== currentMode) return null;

  const sortedData = [...data].sort((a, b) => b[barKey] - a[barKey]);
  const displayedData = expanded ? sortedData : sortedData.slice(0, 10);

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="horizontal" data={displayedData}>
          <XAxis type="category" dataKey={dataKey} />
          <YAxis type="number" />
          <Tooltip />
          <Bar
            dataKey={barKey}
            radius={[0, 10, 10, 0]}
            isAnimationActive={true}
          >
            {displayedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#4dd0e1"
                radius={[10, 10, 0, 0]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <button className="expand-btn" onClick={onToggleExpand}>
        {expanded ? "Collapse" : "Expand"}
      </button>
    </div>
  );
};

export default SkillsBarChart;
