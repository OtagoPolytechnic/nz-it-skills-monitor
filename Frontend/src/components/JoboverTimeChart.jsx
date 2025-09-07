import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function JobsOverTimeChart({ jobs = [] }) {
  // roll up counts per calendar day (ISO date so sorting is easy)
  const data = useMemo(() => {
    const counts = jobs.reduce((acc, job) => {
      const raw =
        job?.date || job?.posted_at || job?.created_at || job?.createdAt;
      if (!raw) return acc;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return acc;
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .sort() // ISO dates sort correctly as strings
      .map((date) => ({ date, count: counts[date] }));
  }, [jobs]);

  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
        >
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="date"
            tickMargin={6}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tickMargin={6}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.06)" }}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(v) => [v, "Jobs"]}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
