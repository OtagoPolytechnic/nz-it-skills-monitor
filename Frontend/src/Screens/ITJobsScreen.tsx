import { useState, useEffect } from "react";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import TreeMapCities from "../charts/TreeMapsCities";

const ITJobsScreen = () => {
  const [itJobs, setITJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchITJobs();
  }, []);

  const fetchITJobs = async () => {
    try {
      const response = await fetch("https://nz-it-skills-monitor.onrender.com/jobs?category=IT");
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      setITJobs(data);
    } catch (error) {
      setError("Failed to load IT job data.");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">IT Jobs Across New Zealand</h1>

      {isLoading ? (
        <p className="text-center">Loading IT job data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : itJobs.length === 0 ? (
        <p className="text-center">No IT jobs available yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <TreeMapCities name="IT Jobs by City" data={itJobs} />
          <BarChartHorizontal title="Top IT Skills in Demand" data={itJobs} dataKeyIndex={0} />
        </div>
      )}
    </div>
  );
};

export default ITJobsScreen;
