// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import ChartWrapper from "./ChartStyle/ChartWrapper";
import LeafletHeatmap from "./Heatmap";
import "../App.css";

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
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const [globalChartType, setGlobalChartType] = useState("bar");
  const [chartTypes, setChartTypes] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [locationChartType, setLocationChartType] = useState("bar");
  const [locationExpanded, setLocationExpanded] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);
  useEffect(() => {
    extractSkills(filteredJobs);
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
    setLocationChartType(globalChartType);
    setLocationExpanded(false);
  }, [globalChartType]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
      const data = await res.json();

      console.log(`✅ Total jobs fetched: ${data.length}`);
      if (data.length > 0) {
        console.log(`🕒 Latest job date: ${data[0].date}`);
      }

      setAllJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    const filtered = value
      ? allJobs.filter(
        (job) => job.category?.toLowerCase() === value.toLowerCase()
      )
      : allJobs;
    setFilteredJobs(filtered);
  };

  const categories = [...new Set(allJobs.map((j) => j.category))]
    .filter(Boolean)
    .sort();

  const extractSkills = (jobs) => {
    const grouped = {
      "programming language": [],
      framework: [],
      tool: [],
      platform: [],
      methodology: [],
      database: [],
      "soft skill": [],
    };

    jobs.forEach((job) => {
      if (Array.isArray(job.skills)) {
        job.skills.forEach((skill) => {
          const type = skill?.type?.toLowerCase();
          const name = skill?.name?.toLowerCase();
          if (type && name && grouped[type]) {
            grouped[type].push(name);
          }
        });
      }
    });

    const result = {};
    let hasAny = false;
    for (const [type, skillList] of Object.entries(grouped)) {
      const countMap = {};
      skillList.forEach((skill) => {
        if (typeof skill === "string" && skill.trim()) {
          countMap[skill] = (countMap[skill] || 0) + 1;
        }
      });
      const sorted = Object.entries(countMap)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count);
      result[type] = sorted;
      if (sorted.length > 0) hasAny = true;
    }

    setSkillsData(result);
    setHasData(hasAny);
    setIsLoading(false);
  };

  const getLocationData = () => {
    const locationCounts = filteredJobs.reduce((acc, job) => {
      const loc = job.location?.trim();
      if (loc && loc.toLowerCase() !== "none") {
        acc[loc] = (acc[loc] || 0) + 1;
      } else {
        acc["None"] = (acc["None"] || 0) + 1;
      }
      return acc;
    }, {});
    const realLocations = Object.entries(locationCounts).filter(
      ([name]) => name !== "None"
    );
    const missing = locationCounts["None"];
    const sorted = realLocations.sort((a, b) => b[1] - a[1]);

    const data = locationExpanded
      ? [
        ...sorted.map(([name, value]) => ({ name, value })),
        ...(missing ? [{ name: "None", value: missing }] : []),
      ]
      : sorted.slice(0, 10).map(([name, value]) => ({ name, value }));

    return data;
  };

  const renderLocationChart = () => {
    const data = getLocationData();

    const handleLocationChartChange = (type) => {
      setLocationChartType(type);
    };

    const chartData = data.map((item) => ({
      skill: item.name,
      count: item.value,
    }));

    return (
      <div
        className="chart-card"
        style={{
          padding: "1rem",
          borderRadius: "0.375rem",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: "#333" }}>Locations</h3>
        <div className="chart-type-toggle">
          <span className="chart-type-label">Chart Type:</span>
          {["bar", "pie", "wordcloud"].map((type) => (
            <button
              key={type}
              onClick={() => handleLocationChartChange(type)}
              className={`chart-type-btn ${locationChartType === type ? "active" : ""}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <ChartWrapper
          chartType={locationChartType}
          title="Locations"
          data={chartData}
          dataKey="skill"
          barKey="count"
          expanded={locationExpanded}
          onToggleExpand={() => setLocationExpanded(!locationExpanded)}
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
      <div
        className="chart-card"
        key={`${typeKey}-${currentType}`}
      >
        <h3 style={{ marginBottom: "1rem", color: "#333" }}>{title}</h3>

        {/* Local chart type toggle for this chart */}
        <div className="chart-type-toggle">
          <span className="chart-type-label">Chart Type:</span>
          {["bar", "pie", "wordcloud"].map((type) => (
            <button
              key={type}
              onClick={() => setLocalChartType(type)}
              className={`chart-type-btn ${currentType === type ? "active" : ""}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Chart component */}
        <ChartWrapper
          chartType={currentType}
          title={title}
          data={data}
          dataKey="skill"
          barKey="count"
          expanded={isExpanded}
          onToggleExpand={toggleExpand}
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

      <div className="stacked-dashboard">
        {/* Charts Section */}
        {hasData && (
          <div style={{ width: "100%" }}>
            {/* Location + Heatmap Split */}
            <div className="chart-card" style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>

              {/* Left Column: Chart */}
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "1rem", color: "#333" }}>
                  Job Locations
                </h3>
                <ChartWrapper
                  chartType={locationChartType}
                  title="Locations"
                  data={getLocationData().map((item) => ({
                    skill: item.name,
                    count: item.value,
                  }))}
                  dataKey="skill"
                  barKey="count"
                  expanded={locationExpanded}
                  onToggleExpand={() =>
                    setLocationExpanded(!locationExpanded)
                  }
                />
              </div>

              {/* Right Column: Heatmap */}
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "1rem", color: "#333" }}>
                  Job Heatmap
                </h3>
                <div
                  style={{
                    height: "400px",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "0.375rem",
                  }}
                >
                  <LeafletHeatmap />
                </div>
              </div>
            </div>

            {/* Skill Charts */}
            {Object.entries(skillsData).map(([type, list]) =>
              renderSkillChart(
                type.charAt(0).toUpperCase() + type.slice(1),
                list,
                type
              )
            )}
          </div>
        )}

        {/* No Data Fallback */}
        {!hasData && !isLoading && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No job data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;