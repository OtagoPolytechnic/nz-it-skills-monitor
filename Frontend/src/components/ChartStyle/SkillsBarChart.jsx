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
  layout = "vertical",
}) => {
  if (chartMode !== currentMode) return null;

  const sortedData = [...data].sort((a, b) => b[barKey] - a[barKey]);
  const displayedData = expanded ? sortedData.slice(0, 30) : sortedData.slice(0, 15);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "4px",
          fontSize: "14px"
        }}>
          <strong>{label}</strong>
          <br />
          count: {payload[0].value}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout={layout} data={displayedData}>
          <XAxis 
          type={layout === "vertical" ? "number" : "category"} 
          dataKey={layout === "horizontal" ? dataKey : undefined} 
          tickFormatter={(value) =>
            layout === "vertical" && typeof value === "number"
              ? Math.round(value)
              : value
          }
          allowDecimals={false}
          domain={[0, 'dataMax']}
          tickCount={6}
          />
          <YAxis type={layout === "vertical" ? "category" : "number"} dataKey={layout === "vertical" ? dataKey : undefined} width={150} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={barKey}
            radius={[20, 20, 20, 20]}
            barSize={20}
            isAnimationActive={true}
            activeShape={false}
          >
            {displayedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="#4dd0e1" 
                radius={[0, 10, 10, 0]}
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
