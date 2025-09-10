// src/components/AverageSalaryOverTimeChart.jsx
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

// ----- salary helpers -----
function parseFreeTextSalary(txt) {
  if (!txt) return null;
  const nums =
    txt
      .replace(/,/g, "")
      .match(/\$?\s*\d+(?:\.\d+)?\s*[kK]?/g)
      ?.map((raw) =>
        /k/i.test(raw)
          ? Number(raw.replace(/[^\d.]/g, "")) * 1000
          : Number(raw.replace(/[^\d.]/g, ""))
      ) || [];
  if (!nums.length) return null;
  return nums.length === 1 ? nums[0] : (nums[0] + nums[nums.length - 1]) / 2;
}

function pickAverage(job) {
  const mins = [job?.min_salary, job?.salary_min].map(Number);
  const maxs = [job?.max_salary, job?.salary_max].map(Number);
  const single = Number(job?.salary);
  const min = mins.find((n) => Number.isFinite(n) && n > 0);
  const max = maxs.find((n) => Number.isFinite(n) && n > 0);
  if (Number.isFinite(min) && Number.isFinite(max)) return (min + max) / 2;
  if (Number.isFinite(single) && single > 0) return single;
  if (Number.isFinite(min) && min > 0) return min;
  return parseFreeTextSalary(
    String(job?.salary_text || job?.salaryStr || job?.compensation || "")
  );
}

const nzMoney = (n) =>
  n == null
    ? ""
    : n.toLocaleString("en-NZ", {
        style: "currency",
        currency: "NZD",
        maximumFractionDigits: 0,
      });

export default function AverageSalaryOverTimeChart({ jobs = [] }) {
  // Average salary per calendar day (same date sources as JobsOverTimeChart)
  const data = useMemo(() => {
    const buckets = new Map(); // key: YYYY-MM-DD -> { sum, count }
    for (const job of jobs) {
      const raw =
        job?.date || job?.posted_at || job?.created_at || job?.createdAt || job?.scraped_at;
      if (!raw) continue;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) continue;
      const day = d.toISOString().slice(0, 10); // YYYY-MM-DD

      const avg = pickAverage(job);
      if (!Number.isFinite(avg) || avg <= 0) continue;

      const rec = buckets.get(day) || { sum: 0, count: 0 };
      rec.sum += avg;
      rec.count += 1;
      buckets.set(day, rec);
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([date, { sum, count }]) => ({
        date,
        avg: Math.round(sum / count),
      }));
  }, [jobs]);

  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="date" tickMargin={6} axisLine={false} tickLine={false} />
          <YAxis
            allowDecimals={false}
            tickMargin={6}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
          />
          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.06)" }}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(v) => [nzMoney(v), "Avg Salary"]}
            labelFormatter={(l) => `Date: ${l}`}
          />
          <Line
            type="monotone"
            dataKey="avg"
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
