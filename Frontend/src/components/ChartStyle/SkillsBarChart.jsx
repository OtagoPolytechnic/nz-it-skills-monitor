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
  const displayedData = expanded ? sortedData.slice(0, 20) : sortedData.slice(0, 15);

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
  const MultiLineYAxisTick = ({
    x,
    y,
    payload,
    maxLineChars = 28,
    lineHeight = 14,
    dx = 6,                 // nudge right into the gap
    anchor = "start",       // left-align text
    fill = "#374151",
    fontSize = 16,
  }) => {
    const text = String(payload?.value ?? "");
    const words = text.split(/\s+/);
    const lines = [];
    let current = "";
    for (const w of words) {
      const next = current ? current + " " + w : w;
      if (next.length <= maxLineChars) current = next;
      else { if (current) lines.push(current); current = w; }
    }
    if (current) lines.push(current);
  
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={dx} y={0} dy={4} textAnchor={anchor} fill={fill} fontSize={fontSize}>
          {lines.map((line, i) => (
            <tspan key={i} x={dx} dy={i === 0 ? 0 : lineHeight}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };
  

  // longest label in the currently displayed data
  const longestLabelLen = Math.max(
    0,
    ...displayedData.map((d) => String(d?.[dataKey] ?? "").length)
  );

  // Only widen for Job Titles (and optionally Job Companies)
  const needsWideLabels = title === "Job Titles" || title === "Job Companies";

  // ~7.2px per char + padding; clamp between 150 and 380
  const yAxisWidth = needsWideLabels
    ? Math.min(380, Math.max(150, Math.round(longestLabelLen * 7.2 + 24)))
    : isVertical
    ? 150
    : 80; // your usual widths

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={displayedData}
          layout={layout}
          margin={{ top: 8, right: 12, bottom: 0, left: (isVertical && needsWideLabels) ? 8 : 0 }}
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
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodOpacity="0.15"
              />
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
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            interval={0} // show every label
            width={isVertical ? yAxisWidth : undefined} // dynamic space
            tick={
              isVertical && needsWideLabels ? (
                <MultiLineYAxisTick maxLineChars={28} dx={6} anchor="start" /> // wrap long names
              ) : (
                { fill: "#374151", fontSize: 12, textAnchor: "end" }
              )
            }
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
