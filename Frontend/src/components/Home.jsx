import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../Navbar";
import ChartWrapper from "./ChartStyle/ChartWrapper";
import LeafletHeatmap from "./Heatmap";
import "../App.css";
import JobsOverTimeChart from "./JoboverTimeChart";
import SummarySection from "./SummarySection";
import SalaryHistogram from "./salaryhistogram";
import AverageSalaryOverTimeChart from "./averagesalaryovertime";
import DownloadCSVButton from "./downloadcsvbutton";
import categoriseEntryLevelRole from "./utils/roleUtils";

const Home = () => {
  const [skillsData, setSkillsData] = useState({
    "programming language": [],
    framework: [],
    tool: [],
    platform: [],
    methodology: [],
    database: [],
    "soft skill": [],
  });
  const [allJobs, setAllJobs] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [hasData, setHasData] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [jobTitleChartType, setJobTitleChartType] = useState("bar");
  const [jobTitleExpanded, setJobTitleExpanded] = useState(false);
  const [jobCompanyChartType, setJobCompanyChartType] = useState("bar");
  const [jobCompanyExpanded, setJobCompanyExpanded] = useState(false);

  const [globalChartType, setGlobalChartType] = useState("bar");
  const [chartTypes, setChartTypes] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [locationChartType, setLocationChartType] = useState("bar");
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [avgSalaryExpanded, setAvgSalaryExpanded] = useState(false);
  const [rolesChartType, setRolesChartType] = useState("bar");
  const [rolesExpanded, setRolesExpanded] = useState(false);

  const parseSalary = (job) => {
    const min = Number(job?.min_salary);
    const max = Number(job?.max_salary);
    if (!Number.isNaN(min) && !Number.isNaN(max) && max > 0)
      return (min + max) / 2;

    const txt = String(job?.salary || job?.salary_text || "").replace(/,/g, "");
    if (!txt) return null;

    const nums =
      txt.match(/\$?\s*\d+(?:\.\d+)?\s*[kK]?/g)?.map((raw) => {
        const hasK = /k/i.test(raw);
        const n = Number(raw.replace(/[^\d.]/g, ""));
        return hasK ? n * 1000 : n;
      }) || [];

    if (nums.length === 0) return null;
    if (nums.length === 1) return nums[0];
    return (nums[0] + nums[nums.length - 1]) / 2;
  };

  const modeOf = (arr) => {
    const counts = {};
    for (const v of arr) {
      if (!v) continue;
      const key = String(v).trim().toLowerCase();
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
    let best = null,
      bestCount = 0;
    for (const [k, c] of Object.entries(counts)) {
      if (c > bestCount) {
        best = k;
        bestCount = c;
      }
    }
    return best ? { value: best, count: bestCount } : { value: null, count: 0 };
  };

  const summary = useMemo(() => {
    const totalJobs = filteredJobs.length;
    const salaries = filteredJobs
      .map(parseSalary)
      .filter((n) => typeof n === "number" && !Number.isNaN(n) && n > 0);
    const averageSalary = salaries.length
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
      : null;
    const topLoc = modeOf(filteredJobs.map((j) => j.location));
    const topCat = modeOf(filteredJobs.map((j) => j.category));

    const allSkills = [];
    filteredJobs.forEach((job) => {
      if (Array.isArray(job.skills)) {
        job.skills.forEach((s) => {
          const name = s?.name?.toLowerCase();
          if (name) allSkills.push(name);
        });
      }
    });
    const topSkill = modeOf(allSkills);

    const titleCase = (s) =>
      s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : null;

    return {
      totalJobs,
      averageSalary,
      topLocation: topLoc.value ? titleCase(topLoc.value) : null,
      topLocationCount: topLoc.count,
      topCategory: topCat.value ? titleCase(topCat.value) : null,
      topCategoryCount: topCat.count,
      topSkill: topSkill.value ? titleCase(topSkill.value) : null,
      topSkillCount: topSkill.count,
    };
  }, [filteredJobs]);

  useEffect(() => {
    const updated = {};
    const expandedMap = {};
    Object.keys(skillsData).forEach((key) => {
      updated[key] = globalChartType;
      expandedMap[key] = false;
    });
    setChartTypes(updated);
    setExpandedSections(expandedMap);
  }, [globalChartType, skillsData]);

  const fetchSkillsSummary = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/skills-summary?ts=${Date.now()}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      const ALLOWED = [
        "programming language",
        "framework",
        "tool",
        "platform",
        "methodology",
        "database",
        "soft skill",
      ];

      const grouped = {};
      data.forEach((item) => {
        const type = item.type?.toLowerCase();
        const skill = item.skill;
        const count = Number(item.count ?? 0);
        if (!type || !skill) return;
        if (!ALLOWED.includes(type)) return;
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push({ skill, count });
      });

      const filteredGrouped = {};
      ALLOWED.forEach((k) => {
        filteredGrouped[k] = (grouped[k] || []).sort(
          (a, b) => b.count - a.count
        );
      });

      setSkillsData(filteredGrouped);
      setHasData(ALLOWED.some((k) => (filteredGrouped[k]?.length || 0) > 0));
    } catch (err) {
      console.error("Error fetching skills summary:", err);
      setHasData(false);
      setErrMsg("Failed to fetch skill summary.");
    }
  };

  const fetchLocationSummary = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/location-summary?ts=${Date.now()}`
      );
      const data = await res.json();

      const mapped = Array.isArray(data)
        ? data.map((item) => ({
            name: item.location ?? item.name ?? "Unknown",
            value: Number(item.count ?? item.value ?? 0),
          }))
        : [];

      setLocationData(mapped);
    } catch (err) {
      console.error("Error fetching location summary:", err);
      setLocationData([]);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/jobs?ts=${Date.now()}`
      );
      const data = await res.json();
      setAllJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSkillsSummary();
    fetchLocationSummary();
  }, []);

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    const filtered = value
      ? allJobs.filter(
          (job) => job.category?.toLowerCase() === value.toLowerCase()
        )
      : allJobs;
    setFilteredJobs(filtered);
  };

  const buildCountsFromField = (jobs, picker) => {
    const counts = {};
    for (const j of jobs) {
      const raw = picker(j);
      if (!raw) continue;
      const key = String(raw).trim();
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
  };

  const jobTitleData = useMemo(() => {
    return buildCountsFromField(
      filteredJobs,
      (j) => j.title ?? j.job_title ?? j.position ?? null
    );
  }, [filteredJobs]);

  const jobCompanyData = useMemo(() => {
    return buildCountsFromField(
      filteredJobs,
      (j) => j.company ?? j.company_name ?? j.employer ?? null
    );
  }, [filteredJobs]);

  const categories = [...new Set(allJobs.map((j) => j.category))]
    .filter(Boolean)
    .sort();

  const getRolesData = () => {
    const counts = {};
    for (const job of filteredJobs) {
      const bucket = categoriseEntryLevelRole(job);
      if (!bucket) continue;
      counts[bucket] = (counts[bucket] || 0) + 1;
    }
    const entries = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const sliced = rolesExpanded ? entries : entries.slice(0, 10);
    return sliced.map(({ name, value }) => ({ skill: name, count: value }));
  };

  const renderRolesChart = () => {
  const data = getRolesData();

  return (
    <div className="chart-card">
      <h3 className="card-title">
        <span>Entry-Level Roles</span>
      </h3>

      {/* Restore Chart Type buttons */}
      <div className="chart-type-toggle">
        <span className="chart-type-label">Chart Type:</span>
        {["bar", "pie", "wordcloud"].map((type) => (
          <button
            key={type}
            onClick={() => setRolesChartType(type)}
            className={`chart-type-btn ${
              rolesChartType === type ? "active" : ""
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <ChartWrapper
        chartType={rolesChartType}
        title="Entry-Level Roles"
        data={data}
        dataKey="skill"
        barKey="count"
        expanded={rolesExpanded}
        onToggleExpand={() => setRolesExpanded(!rolesExpanded)}
        layout="vertical"
      />
    </div>
  );
};



  const renderSkillChart = (title, data, typeKey) => {
    const currentType = chartTypes[typeKey] || globalChartType;
    const isExpanded = expandedSections[typeKey] || false;

    const setLocalChartType = (mode) => {
      setChartTypes((prev) => ({ ...prev, [typeKey]: mode }));
    };

    const toggleExpand = () => {
      setExpandedSections((prev) => ({ ...prev, [typeKey]: !prev[typeKey] }));
    };

    return (
      <div className="chart-card" key={`${typeKey}-${currentType}`}>
        <h3 className="card-title">
          <span>{title}</span>
          <DownloadCSVButton
            title={title}
            filename={`skills_${typeKey.replace(/\s+/g, "-")}.csv`}
            rows={Array.isArray(data) ? data : []}
            columns={[
              ["Skill", "skill"],
              ["Count", "count"],
            ]}
          />
        </h3>

        <div className="chart-type-toggle">
          <span className="chart-type-label">Chart Type:</span>
          {["bar", "pie", "wordcloud"].map((type) => (
            <button
              key={type}
              onClick={() => setLocalChartType(type)}
              className={`chart-type-btn ${
                currentType === type ? "active" : ""
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <ChartWrapper
          chartType={currentType}
          title={title}
          data={data}
          dataKey="skill"
          barKey="count"
          expanded={isExpanded}
          onToggleExpand={toggleExpand}
          layout="vertical"
        />
      </div>
    );
  };

  const renderGenericCountChart = (
    title,
    data,
    chartType,
    setChartType,
    expanded,
    setExpanded
  ) => {
    return (
      <div className="chart-card" key={`${title}-${chartType}`}>
        <h3 className="card-title">
          <span>{title}</span>
          <DownloadCSVButton
            title={title}
            filename={`${title.toLowerCase().replace(/\s+/g, "_")}.csv`}
            rows={data}
            columns={[
              [title.includes("Company") ? "Company" : "Title", "skill"],
              ["Count", "count"],
            ]}
          />
        </h3>

        <div className="chart-type-toggle">
          <span className="chart-type-label">Chart Type:</span>
          {["bar", "pie", "wordcloud"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`chart-type-btn ${chartType === type ? "active" : ""}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <ChartWrapper
          chartType={chartType}
          title={title}
          data={data}
          dataKey="skill"
          barKey="count"
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
          layout="vertical"
        />
      </div>
    );
  };

  return (
    <div>
      <Navbar
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        chartType={globalChartType}
        onChartTypeChange={setGlobalChartType}
      />

      <div className="section page-container">
        <SummarySection summary={summary} />
      </div>

      <div className="section page-container">
        <div className="two-col full-width">
          <div className="chart-card">
            <h2 className="card-title">Jobs Posted Over Time</h2>
            <JobsOverTimeChart />
          </div>

          <div className="chart-card">
            <h2 className="card-title">Salary Distribution</h2>
            <SalaryHistogram />
          </div>
        </div>
      </div>

      <div className="section stacked-dashboard">
        {hasData && !errMsg && (
          <div style={{ width: "100%" }}>
            {/* Row 2 — Entry-Level Roles | Top Job Titles */}
            <div className="two-col full-width">
              {renderRolesChart()}
              {renderGenericCountChart(
                "Top Job Titles",
                jobTitleData,
                jobTitleChartType,
                setJobTitleChartType,
                jobTitleExpanded,
                setJobTitleExpanded
              )}
            </div>

            {/* Row 3 — Job Heatmap | Average Salary per Scrape */}
            <div className="two-col full-width">
              <div className="chart-card heatmap-wrapper">
                <h2 className="card-title">Job Heatmap</h2>
                <div className="heatmap-container">
                  <LeafletHeatmap />
                </div>
              </div>

              <div className="chart-card">
                <h2 className="card-title">Average Salary per Scrape</h2>
                <AverageSalaryOverTimeChart
                  jobs={allJobs}
                  expanded={avgSalaryExpanded}
                  onToggleExpand={() => setAvgSalaryExpanded((v) => !v)}
                  maxCollapsedPoints={12}
                />
              </div>
            </div>

            {/* Row 4 — Top Hiring Companies | (paired with Job Locations) */}
            <div className="two-col full-width">
              {renderGenericCountChart(
                "Top Hiring Companies",
                jobCompanyData,
                jobCompanyChartType,
                setJobCompanyChartType,
                jobCompanyExpanded,
                setJobCompanyExpanded
              )}

              <div className="chart-card">
                <h2 className="card-title">
                  <span>Job Locations</span>
                  <DownloadCSVButton
                    title="Job Locations"
                    filename="locations.csv"
                    rows={locationData}
                    columns={[
                      ["Location", "name"],
                      ["Count", "value"],
                    ]}
                  />
                </h2>
                <ChartWrapper
                  chartType={locationChartType}
                  title="Locations"
                  data={locationData.map(({ name, value }) => ({
                    skill: name,
                    count: value,
                  }))}
                  dataKey="skill"
                  barKey="count"
                  expanded={locationExpanded}
                  onToggleExpand={() => setLocationExpanded(!locationExpanded)}
                  layout="horizontal"
                />
              </div>
            </div>

            {/* Remaining skill rows (pairs) */}
            {[
              "programming language",
              "framework",
              "tool",
              "platform",
              "methodology",
              "database",
            ].reduce((rows, type, idx, arr) => {
              if (idx % 2 === 0) {
                const left = type;
                const right = arr[idx + 1];
                rows.push(
                  <div className="two-col" key={`skills-row-${idx}`}>
                    {renderSkillChart(
                      left.charAt(0).toUpperCase() + left.slice(1),
                      skillsData[left] || [],
                      left
                    )}
                    {right
                      ? renderSkillChart(
                          right.charAt(0).toUpperCase() + right.slice(1),
                          skillsData[right] || [],
                          right
                        )
                      : null}
                  </div>
                );
              }
              return rows;
            }, [])}
          </div>
        )}

        {!hasData && !errMsg && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No job data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
