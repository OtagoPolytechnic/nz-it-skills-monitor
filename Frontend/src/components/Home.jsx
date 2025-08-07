// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import ChartWrapper from "./ChartStyle/ChartWrapper";
import SkillsChart from "./SkillsChart";
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
        <div style={{ marginBottom: "0.5rem" }}>
          <button
            onClick={() => handleLocationChartChange("bar")}
            style={{
              backgroundColor: "#3b82f6", // Blue base color
              color: "white",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")} // Darker blue on hover
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")} // Revert to original color
          >
            Bar
          </button>
          <button
            onClick={() => handleLocationChartChange("pie")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Pie
          </button>
          <button
            onClick={() => handleLocationChartChange("wordcloud")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Word Cloud
          </button>
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
        style={{
          padding: "1rem",
          borderRadius: "0.375rem",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: "#333" }}>{title}</h3>
        <div style={{ marginBottom: "0.5rem" }}>
          <button
            onClick={() => setLocalChartType("bar")}
            style={{
              backgroundColor: "#3b82f6", // Blue base color
              color: "white",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Bar
          </button>
          <button
            onClick={() => setLocalChartType("pie")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Pie
          </button>
          <button
            onClick={() => setLocalChartType("wordcloud")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Word Cloud
          </button>
        </div>
        <ChartWrapper
          key={typeKey}
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
      <Navbar />
      <div className="stacked-dashboard">
      <div
  className="category-dropdown"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem", // Add margin to separate it from other elements
    width: "100%", // Full width to ensure it stays centered
    position: "relative", // For positioning relative to other elements
  }}
>
  <div
    style={{
      padding: "1rem",
      borderRadius: "0.375rem",
      border: "1px solid #e5e7eb",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
      width: "300px", // Fixed width for the dropdown
      textAlign: "center", // Center text
    }}
  >
    <label style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}>
      Category:
    </label>
    <select
      value={categoryFilter}
      onChange={(e) => {
        setCategoryFilter(e.target.value);
        setFilteredJobs(
          e.target.value
            ? allJobs.filter(
                (job) =>
                  job.category?.toLowerCase() === e.target.value.toLowerCase()
              )
            : allJobs
        );
      }}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem",
        border: "1px solid #d1d5db",
        width: "100%",
        fontSize: "1rem",
        backgroundColor: "#f9fafb", // Light background
        color: "#333",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      <option value="">All</option>
      {[...new Set(allJobs.map((job) => job.category))].filter(Boolean).sort().map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>
</div>


        <div style={{ margin: "1rem 0" }}>
          <strong style={{ marginRight: "1rem" }}>Global Chart Type: </strong>
          <button
            onClick={() => setGlobalChartType("bar")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Bar
          </button>
          <button
            onClick={() => setGlobalChartType("pie")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Pie
          </button>
          <button
            onClick={() => setGlobalChartType("wordcloud")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Word Cloud
          </button>
        </div>

        {!hasData && !isLoading && <p>No job data available.</p>}
        {hasData && (
          <>
            {renderLocationChart()}
            {Object.entries(skillsData).map(([type, list]) =>
              renderSkillChart(
                type.charAt(0).toUpperCase() + type.slice(1),
                list,
                type
              )
            )}
            <LeafletHeatmap />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
