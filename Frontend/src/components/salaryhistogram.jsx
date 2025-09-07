import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";

const BANDS = [
  { label: "0-50k",     min: 0,      max: 50000 },
  { label: "50k-75k",   min: 50001,  max: 75000 },
  { label: "75k-100k",  min: 75001,  max: 100000 },
  { label: "100k-125k", min: 100001, max: 125000 },
  { label: "125k-150k", min: 125001, max: 150000 },
  { label: "150k-200k", min: 150001, max: 200000 },
  { label: "200k+",     min: 200001, max: Infinity },
];

// --- salary parsing helpers ---
function parseFreeTextSalary(txt) {
  if (!txt) return null;
  const nums =
    txt.replace(/,/g, "")
      .match(/\$?\s*\d+(?:\.\d+)?\s*[kK]?/g)
      ?.map(raw => (/k/i.test(raw) ? Number(raw.replace(/[^\d.]/g, "")) * 1000
                                    : Number(raw.replace(/[^\d.]/g, "")))) || [];
  if (!nums.length) return null;
  return nums.length === 1 ? nums[0] : (nums[0] + nums[nums.length - 1]) / 2;
}

function pickAverage(job) {
  const mins = [job?.min_salary, job?.salary_min].map(Number);
  const maxs = [job?.max_salary, job?.salary_max].map(Number);
  const single = Number(job?.salary);

  const min = mins.find(n => Number.isFinite(n) && n > 0);
  const max = maxs.find(n => Number.isFinite(n) && n > 0);

  if (Number.isFinite(min) && Number.isFinite(max)) return (min + max) / 2;
  if (Number.isFinite(single) && single > 0) return single;
  if (Number.isFinite(min) && min > 0) return min;

  return parseFreeTextSalary(String(job?.salary_text || job?.salaryStr || job?.compensation || ""));
}

export default function SalaryHistogram({ jobs = [] }) {
  const [hovered, setHovered] = useState(null);

  const data = useMemo(() => {
    const counts = BANDS.map(b => ({ range: b.label, count: 0 }));
    for (const job of jobs) {
      const avg = pickAverage(job);
      if (!Number.isFinite(avg) || avg <= 0) continue;
      for (let i = 0; i < BANDS.length; i++) {
        const b = BANDS[i];
        if (avg >= b.min && (avg <= b.max || b.max === Infinity)) {
          counts[i].count += 1;
          break;
        }
      }
    }
    return counts;
  }, [jobs]);

  return (
    <div className="chart-card">

      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
          onMouseMove={(state) => setHovered(state?.activeTooltipIndex ?? null)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Modern, minimal styling */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="range"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.06)" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
            formatter={(v) => [v, "Jobs"]}
          />

          <Bar
            dataKey="count"
            barSize={28}
            radius={[10, 10, 10, 10]}
            isAnimationActive
            animationDuration={500}
            style={{ filter: "url(#barShadow)" }}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={hovered === i ? "#60a5fa" : "url(#barGradient)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
