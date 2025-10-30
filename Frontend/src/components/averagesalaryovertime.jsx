// src/components/AverageSalaryOverTimeChart.jsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import DownloadCSVButton from "./downloadcsvbutton";

const nzMoney = (n) =>
  n == null
    ? ""
    : n.toLocaleString("en-NZ", {
        style: "currency",
        currency: "NZD",
        maximumFractionDigits: 0,
      });

export default function AverageSalaryOverTimeChart() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/average-salary-over-time`
        );
        if (!res.ok) throw new Error("Failed to fetch average salary data"); //it keeps failing here, bcs render has the older version of it
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <p>Loading average salary data…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ height: 360 }}>
      <div className="card-title" style={{ marginBottom: 8 }}>
        <span>Average Salary per Scrape</span>
        <DownloadCSVButton
          title="Average Salary per Scrape"
          filename="avg_salary_over_time.csv"
          rows={data}
          columns={[
            ["Date", "date"],
            ["Average Salary (NZD)", "avg"],
          ]}
        />
      </div>
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
            tickFormatter={(v) =>
              v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
            }
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
