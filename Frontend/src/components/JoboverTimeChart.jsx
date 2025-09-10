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
import useJobsOverTime from "../hooks/useJobsOverTime";

const API_BASE = import.meta.env.VITE_API_URL;

export default function JobsOverTimeChart() {
  const { data: raw, loading, err } = useJobsOverTime(API_BASE);

  const data = useMemo(() => {
    if (!Array.isArray(raw)) return [];
    return [...raw]
      .filter(r => r && r.date && typeof r.count === "number")
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [raw]);

  if (loading) return <div style={{ height: 360 }}>Loading jobs over time…</div>;
  if (err) return <div style={{ height: 360, color: "crimson" }}>Failed to load jobs over time.</div>;
  if (data.length === 0) return <div style={{ height: 360 }}>No data yet.</div>;

  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="date" tickMargin={6} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tickMargin={6} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "rgba(59,130,246,0.06)" }}
                   contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                   formatter={(v) => [v, "Jobs"]} />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
