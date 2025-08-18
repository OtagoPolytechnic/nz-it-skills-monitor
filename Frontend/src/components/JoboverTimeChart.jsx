import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function JobsOverTimeChart({ jobs }) {
  // Transform raw jobs array into date -> count array
  const counts = {};
  jobs.forEach((job) => {
    if (!job.date) return; // Skip if no date
    const date = job.date.split("T")[0]; // Only keep YYYY-MM-DD
    counts[date] = (counts[date] || 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
  <>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" minTickGap={30} />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="count"
        stroke="#3b82f6"
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
</>

);

}
