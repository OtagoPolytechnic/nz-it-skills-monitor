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
import { truncateLabel } from "../labelFormat"; // ensure file exists at src/components/labelFormat.js

// Single-line, truncated tick with full value on hover
const AxisTick = ({
  x,
  y,
  payload,
  textAnchor = "end",
  max = 30,
  fill = "#374151",
  fontSize = 12,
}) => {
  const full = String(payload?.value ?? "");
  const short = truncateLabel(full, max);
  return (
    <text
      x={x}
      y={y}
      dy={3}
      textAnchor={textAnchor}
      title={full}              // native hover shows full text
      className="recharts-text" // keep Recharts styling
      fill={fill}
      fontSize={fontSize}
    >
      {short}
    </text>
  );
};

const SkillsBarChart = ({
  title,
  data,
  dataKey,
  barKey,
  chartMode,
  currentMode,
  expanded,
  onToggleExpand,
  layout = "vertical", // use "vertical" or "horizontal"
}) => {
  if (chartMode !== currentMode) return null;

  // sort desc by value
  const sortedData = [...(data || [])].sort((a, b) => (b[barKey] ?? 0) - (a[barKey] ?? 0));

  // limit rows when collapsed
  const displayedData = expanded ? sortedData.slice(0, 25) : sortedData.slice(0, 15);

  // unique ids so multiple charts don’t clash
  const uid = useId();
  const gradientId = `barGradient-${uid}`;
  const shadowId = `barShadow-${uid}`;

  const [hovered, setHovered] = useState(null);

  // axis roles flip with layout:
  const isVertical = layout === "vertical";
  const xType = isVertical ? "number" : "category";
  const yType = isVertical ? "category" : "number";

  // label key appears on the categorical axis
  const xDataKey = !isVertical ? dataKey : undefined;
  const yDataKey = isVertical ? dataKey : undefined;

  const handleMove = (state) => setHovered(state?.activeTooltipIndex ?? null);

  // Titles/companies tend to be long: give a bit more Y width even with truncation
  const needsWideLabels = /title|company/i.test(title || "");
  const yAxisWidth = isVertical ? (needsWideLabels ? 200 : 150) : undefined;

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={displayedData}
          layout={layout}
          margin={{
            top: 8,
            right: 12,
            bottom: 0,
            left: isVertical && needsWideLabels ? 8 : 0,
          }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Visual polish */}
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

          {/* Numeric axis */}
          <XAxis
            type={xType}
            dataKey={xDataKey}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            domain={xType === "number" ? [0, "dataMax"] : undefined}
            tickCount={xType === "number" ? 6 : undefined}
            // If horizontal layout, the category labels live on X; apply truncation
            tick={!isVertical ? <AxisTick textAnchor="middle" max={30} /> : undefined}
          />

          {/* Category axis */}
          <YAxis
            type={yType}
            dataKey={yDataKey}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            interval={0} // show every label
            width={yAxisWidth}
            // If vertical layout, the category labels live on Y; apply truncation
            tick={isVertical ? <AxisTick textAnchor="end" max={30} /> : { fill: "#374151", fontSize: 12 }}
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
            // Ensure tooltip label is the FULL, untruncated category
            labelFormatter={(_, payload) => {
              const p0 = payload && payload[0] && payload[0].payload;
              return p0 && p0[dataKey] ? String(p0[dataKey]) : "";
            }}
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
              <Cell key={i} fill={hovered === i ? "#60a5fa" : `url(#${gradientId})`} />
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
