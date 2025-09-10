// src/components/ChartStyle/SkillsBarChart.jsx
import React, { useId, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const SkillsBarChart = ({
  title,
  data,
  dataKey,
  barKey,
  chartMode,
  currentMode,
  expanded,
  onToggleExpand,
  layout = "Vertical", 
}) => {
  if (chartMode !== currentMode) return null;

  // sort desc by value
  const sortedData = [...data].sort((a, b) => b[barKey] - a[barKey]);

  // limit rows when collapsed (you can tune these)
  const displayedData = expanded ? sortedData : sortedData.slice(0, 15);

  // unique ids so multiple charts don’t clash
  const uid = useId();
  const gradientId = `barGradient-${uid}`;
  const shadowId = `barShadow-${uid}`;

  const [hovered, setHovered] = useState(null);

  // axis role flips with layout:
  const isVertical = layout === "vertical";
  const xType = isVertical ? "number" : "category";
  const yType = isVertical ? "category" : "number";

  // label key appears on the categorical axis
  const xDataKey = !isVertical ? dataKey : undefined;
  const yDataKey = isVertical ? dataKey : undefined;

  const handleMove = (state) => {
    setHovered(state?.activeTooltipIndex ?? null);
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={displayedData}
          layout={layout}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Modern, minimal styling (borrowed from SalaryHistogram) */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          <CartesianGrid
            vertical={isVertical ? false : true}
            horizontal={isVertical ? true : false}
            stroke="#e5e7eb"
          />

          <XAxis
            type={xType}
            dataKey={xDataKey}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            // keep whole numbers when numeric
            allowDecimals={false}
            tickFormatter={(v) =>
              isVertical && typeof v === "number" ? Math.round(v) : v
            }
            domain={xType === "number" ? [0, "dataMax"] : undefined}
            tickCount={xType === "number" ? 6 : undefined}
          />
          <YAxis
            type={yType}
            dataKey={yDataKey}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={isVertical ? 150 : undefined}
            domain={yType === "number" ? [0, "dataMax"] : undefined}
            tickCount={yType === "number" ? 6 : undefined}
          />

          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.06)" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
            formatter={(v) => [v, "Count"]}
            labelFormatter={(label) => String(label)}
          />

          <Bar
            dataKey={barKey}
            barSize={28}
            radius={[10, 10, 10, 10]}
            isAnimationActive
            animationDuration={500}
            style={{ filter: `url(#${shadowId})` }}
          >
            {displayedData.map((_, i) => (
              <Cell
                key={i}
                fill={hovered === i ? "#60a5fa" : `url(#${gradientId})`}
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
