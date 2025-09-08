import React, { useMemo, useId, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
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

function nzCurrency(n) {
  return n == null ? "" : n.toLocaleString("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 0 });
}

// Simple moving average for smoothing (3 points)
function movingAverage(arr, key = "avg_salary", window = 3) {
  if (arr.length === 0) return [];
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const s = Math.max(0, i - window + 1);
    const slice = arr.slice(s, i + 1);
    const mean =
      slice.reduce((acc, d) => acc + (Number(d[key]) || 0), 0) / slice.length;
    out.push({ ...arr[i], ma: mean });
  }
  return out;
}

export default function AverageSalaryOverTimeChart({
  jobs = [],
  expanded = false,
  onToggleExpand = () => {},
  maxCollapsedPoints = 12, // show last 12 scrapes by default
}) {
  const uid = useId();
  const [hovered, setHovered] = useState(null);

  // Group jobs by a scrape key: prefer scrape_id; fallback to day bucket of scraped_at/created_at
  const grouped = useMemo(() => {
    const map = new Map();
    for (const job of jobs) {
      const key =
        job?.scrape_id ??
        (job?.scraped_at
          ? new Date(job.scraped_at).toISOString().slice(0, 10)
          : job?.created_at
          ? new Date(job.created_at).toISOString().slice(0, 10)
          : "unknown");

      const avg = pickAverage(job);
      if (!Number.isFinite(avg) || avg <= 0) continue;

      if (!map.has(key)) {
        map.set(key, { sum: 0, count: 0, when: key });
      }
      const rec = map.get(key);
      rec.sum += avg;
      rec.count += 1;
    }

    // Build array
    const rows = Array.from(map.entries()).map(([key, rec]) => {
      const avg = rec.sum / rec.count;
      // label: use scrape_id as-is; if a date, display dd Mon
      let label = key;
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        const d = new Date(key + "T00:00:00Z");
        label = d.toLocaleDateString("en-NZ", { day: "2-digit", month: "short" });
      }
      return {
        key,
        label,
        avg_salary: Math.round(avg),
        jobs: rec.count,
      };
    });

    // Sort by chronological-ish key: if scrape_id is numeric, sort numeric; else keep insertion order but try date sort
    rows.sort((a, b) => {
      const na = Number(a.key), nb = Number(b.key);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      // fallback: try date
      const da = Date.parse(a.key), db = Date.parse(b.key);
      if (!Number.isNaN(da) && !Number.isNaN(db)) return da - db;
      return String(a.key).localeCompare(String(b.key));
    });

    return rows;
  }, [jobs]);

  const capped = useMemo(() => {
    const base = grouped;
    const data = expanded ? base : base.slice(-maxCollapsedPoints);
    return movingAverage(data, "avg_salary", 3); // add 'ma'
  }, [grouped, expanded, maxCollapsedPoints]);

  // Gradient direction: vertical layout (bars horizontal) -> left→right
  const gradientId = `avgSalaryBlue-${uid}`;
  const shadowId = `avgSalaryShadow-${uid}`;

  return (
    <div className="chart-card">
      <h3 style={{ marginBottom: 8, color: "#333" }}>Average Salary per Scrape</h3>
      <ResponsiveContainer width="100%" height={360}>
        {/* Bar chart for histogram look */}
        <BarChart
          data={capped}
          margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
          onMouseMove={(s) => setHovered(s?.activeTooltipIndex ?? null)}
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          <CartesianGrid vertical={false} stroke="#e5e7eb" />

          <XAxis
            dataKey="label"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `\$${(v/1000).toFixed(0)}k` : `\$${v}`)}
          />

          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.08)" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
            formatter={(v, name) => {
              if (name === "avg_salary") return [nzCurrency(v), "Average"];
              if (name === "ma") return [nzCurrency(v), "3-pt Avg"];
              if (name === "jobs") return [v, "Jobs in scrape"];
              return [v, name];
            }}
          />

          <Bar
            dataKey="avg_salary"
            barSize={22}
            radius={[8, 8, 8, 8]}
            isAnimationActive
            animationDuration={500}
            style={{ filter: `url(#${shadowId})` }}
          >
            {capped.map((_, i) => (
              <Cell key={i} fill={hovered === i ? "#60a5fa" : `url(#${gradientId})`} />
            ))}
          </Bar>

          {/* Overlay a moving-average line for trend readability */}
          <Line
            type="monotone"
            dataKey="ma"
            stroke="#1d4ed8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 8 }}>
        <button className="expand-btn" onClick={onToggleExpand}>
          {expanded ? "Show Fewer" : "Show All"}
        </button>
      </div>
    </div>
  );
}
