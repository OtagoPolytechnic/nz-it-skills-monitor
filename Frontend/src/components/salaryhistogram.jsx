import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0"];

const bands = [
  { label: "0-50k", min: 0, max: 50000 },
  { label: "50k-75k", min: 50001, max: 75000 },
  { label: "75k-100k", min: 75001, max: 100000 },
  { label: "100k-125k", min: 100001, max: 125000 },
  { label: "125k-150k", min: 125001, max: 150000 },
  { label: "150k-200k", min: 150001, max: 200000 },
  { label: "200k+", min: 200001, max: Infinity },
];

const SalaryHistogram = ({ jobs }) => {
  const data = useMemo(() => {
    const counts = bands.map(b => ({ range: b.label, count: 0 }));

    jobs.forEach(job => {
      const sMin = Number(job.salary_min) || 0;
      const sMax = Number(job.salary_max) || 0;
      const avg = sMax > 0 ? (sMin + sMax) / 2 : sMin;

      for (let i = 0; i < bands.length; i++) {
        const b = bands[i];
        if (avg >= b.min && avg <= b.max) {
          counts[i].count++;
          break;
        }
      }
    });

    return counts;
  }, [jobs]);

  return (
    <div className="chart-card">
      <h3>Salary Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryHistogram;
