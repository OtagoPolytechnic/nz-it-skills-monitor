import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";
import useSalaryBuckets from "../hooks/useSalaryBuckets";

const API_BASE = import.meta.env.VITE_API_URL;
const ORDER = ['0-50k', '50k-75k', '75k-100k', '100k-125k', '125k-150k', '150k-200k', '200k+'];
const COLORS = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'];

export default function SalaryHistogram() {
  const { data: buckets, loading, err } = useSalaryBuckets(API_BASE);

  const data = useMemo(() => {
    const map = Object.fromEntries((buckets || []).map(b => [b.band, b.count]));
    return ORDER.map((band) => ({ band, count: Number(map?.[band] || 0) }));
  }, [buckets]);

  if (loading) return <div style={{ height: 360 }}>Loading salary distribution…</div>;
  if (err) return <div style={{ height: 360, color: "crimson" }}>Failed to load salary distribution.</div>;

  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="band" tickMargin={6} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tickMargin={6} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(v) => [v, "Jobs"]} />
          <Bar
  dataKey="count"
  barSize={28}
  radius={[10, 10, 10, 10]}
  isAnimationActive
  animationDuration={500}
  style={{ filter: "url(#barShadow)" }}
>
  {data.map((_, i) => (
    <Cell key={i} fill="url(#barGradient)" />
  ))}
</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
