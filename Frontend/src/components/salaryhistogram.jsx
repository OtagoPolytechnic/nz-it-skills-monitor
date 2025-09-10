import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";
import useSalaryBuckets from "../hooks/useSalaryBuckets";

const API_BASE = import.meta.env.VITE_API_URL;
const ORDER = ['0-50k','50k-75k','75k-100k','100k-125k','125k-150k','150k-200k','200k+'];
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
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="band" tickMargin={6} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tickMargin={6} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                   formatter={(v) => [v, "Jobs"]} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
