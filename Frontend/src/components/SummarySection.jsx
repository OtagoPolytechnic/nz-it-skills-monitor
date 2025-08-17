import React, { useMemo } from "react";
import SummaryCard from "./SummaryCard";

// ----- helpers -----
function pickSalary(job) {
  const m = Number(job?.salary_min);
  const x = Number(job?.salary_max);
  const s = Number(job?.salary);
  if (!Number.isNaN(m) && !Number.isNaN(x) && x > 0) return (m + x) / 2;
  if (!Number.isNaN(s) && s > 0) return s;

  const text = String(
    job?.compensation || job?.salary_text || job?.salaryRange || job?.salaryStr || ""
  );
  const nums = (text.match(/\d+(?:[.,]?\d+)?/g) || []).map(n =>
    Number(n.replace(/,/g, ""))
  );
  if (nums.length === 2) return (nums[0] + nums[1]) / 2;
  if (nums.length === 1) return nums[0];
  return null;
}

function mostCommon(list) {
  const map = new Map();
  for (const raw of list) {
    if (!raw) continue;
    const key = String(raw).trim().toLowerCase();
    if (!key || key === "none") continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  let best = null,
    max = 0;
  map.forEach((v, k) => {
    if (v > max) {
      max = v;
      best = k;
    }
  });
  return best ? { value: best, count: max } : null;
}

function topSkillFromJobs(jobs) {
  const bag = new Map();
  for (const job of jobs) {
    if (!Array.isArray(job?.skills)) continue;
    for (const s of job.skills) {
      const nm = s?.name?.toLowerCase?.();
      if (!nm) continue;
      bag.set(nm, (bag.get(nm) || 0) + 1);
    }
  }
  let best = null,
    max = 0;
  bag.forEach((v, k) => {
    if (v > max) {
      max = v;
      best = k;
    }
  });
  return best ? { value: best, count: max } : null;
}

const titleCase = (s) => (s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : s);

// ----- component -----
const SummarySection = ({ jobs = [] }) => {
  const stats = useMemo(() => {
    const total = jobs.length;

    // Average salary
    const salaries = [];
    for (const j of jobs) {
      const v = pickSalary(j);
      if (Number.isFinite(v)) salaries.push(v);
    }
    const avgSalary = salaries.length
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
      : null;

    // Other key stats
    const location = mostCommon(jobs.map((j) => j.location));
    const category = mostCommon(jobs.map((j) => j.category));
    const topSkill = topSkillFromJobs(jobs);

    return { total, avgSalary, location, category, topSkill };
  }, [jobs]);

  return (
    <section className="summary-grid">
      <SummaryCard
        title="Total Jobs"
        value={stats.total.toLocaleString()}
        helper="Current dataset"
      />
      <SummaryCard
        title="Average Salary"
        value={stats.avgSalary ? `NZ$ ${stats.avgSalary.toLocaleString()}` : "N/A"}
        helper={stats.avgSalary ? "From available listings" : "No salary data"}
      />
      <SummaryCard
        title="Most Common Location"
        value={stats.location ? titleCase(stats.location.value) : "N/A"}
        helper={stats.location ? `${stats.location.count} listings` : "—"}
      />
      <SummaryCard
        title="Top Skill"
        value={stats.topSkill ? titleCase(stats.topSkill.value) : "N/A"}
        helper={stats.topSkill ? `${stats.topSkill.count} mentions` : "—"}
      />
      <SummaryCard
        title="Top Category"
        value={stats.category ? titleCase(stats.category.value) : "N/A"}
        helper={stats.category ? `${stats.category.count} listings` : "—"}
      />
    </section>
  );
};

export default SummarySection;
