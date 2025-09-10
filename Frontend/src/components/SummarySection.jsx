import React, { useEffect, useMemo, useState } from "react";
import SummaryCard from "./SummaryCard";

const API_BASE = import.meta.env.VITE_API_URL;
const titleCase = (s) => (s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : s);

export default function SummarySection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/summary-metrics?ts=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) { setStats(json); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setErr(e); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const ui = useMemo(() => {
    if (!stats) return {};
    return {
      total: stats.total ?? null,
      avgSalary: stats.avgSalary ?? null,
      location: stats.location ?? null,
      category: stats.category ?? null,
      topSkill: stats.topSkill ?? null,
      topTitle: stats.topTitle ?? null,
      topCompany: stats.topCompany ?? null,
    };
  }, [stats]);

  if (loading) {
    // simple skeletons (keeps layout stable)
    return (
      <section className="summary-grid">
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="summary-card" key={i} style={{opacity: 0.6}}>
            <div className="summary-title">Loading…</div>
            <div className="summary-value">—</div>
            <div className="summary-helper">—</div>
          </div>
        ))}
      </section>
    );
  }

  if (err) {
    return <p style={{textAlign:"center", color:"crimson"}}>Failed to load summary.</p>;
  }

  return (
    <section className="summary-grid">
      <SummaryCard
        title="Total Available Jobs"
        value={ui.total ? ui.total.toLocaleString() : "N/A"}
        helper={stats?.scrapeDate ? `Latest scrape: ${stats.scrapeDate}` : "Current dataset"}
      />
      <SummaryCard
        title="Average Listed Salary"
        value={ui.avgSalary ? `NZ$ ${ui.avgSalary.toLocaleString()}` : "N/A"}
        helper={ui.avgSalary ? "From available listings" : "No salary data"}
      />
      <SummaryCard
        title="Top Hiring Location"
        value={ui.location ? titleCase(ui.location.value) : "N/A"}
        helper={ui.location ? `${ui.location.count} listings` : "—"}
      />
      <SummaryCard
        title="Most In-Demand Skills"
        value={ui.topSkill ? titleCase(ui.topSkill.value) : "N/A"}
        helper={ui.topSkill ? `${ui.topSkill.count} mentions` : "—"}
      />
      <SummaryCard
        title="Most Listed Category"
        value={ui.category ? titleCase(ui.category.value) : "N/A"}
        helper={ui.category ? `${ui.category.count} listings` : "—"}
      />
      <SummaryCard
        title="Top Hiring Company"
        value={ui.topCompany ? titleCase(ui.topCompany.value) : "N/A"}
        helper={ui.topCompany ? `${ui.topCompany.count} listings` : "—"}
      />
      <SummaryCard
        title="Most Common Title"
        value={ui.topTitle ? titleCase(ui.topTitle.value) : "N/A"}
        helper={ui.topTitle ? `${ui.topTitle.count} listings` : "—"}
      />
    </section>
  );
}
