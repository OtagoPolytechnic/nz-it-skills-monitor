import CategoryDropdown from "../components/categoryFilter";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import { useState, useEffect } from "react";

const Home = () => {
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]); // Use Record for category count
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  interface Skill {
    name: string;
    type: string; // type of skill category
  }

  interface Job {
    category: string;
    company: string;
    date: string;
    duration: string;
    id: number;
    location: string;
    salary: number;
    skills: Skill[];
    title: string;
    type: string;
  }

  useEffect(() => {
    console.log("GETTING DATA");
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(
        "https://nz-it-skills-monitor.onrender.com/jobs"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setFetchedData(data);
      console.log("FETCHED DATA: ", data);

      // Call getUniqueCategoriesWithCount after setting fetchedData
      getUniqueCategoriesWithCount(data);
    } catch (error: any) {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueCategoriesWithCount = (jobs: Job[]) => {
    const categoryCount: Record<string, number> = {};
  
    jobs.forEach((job) => {
      // Increment the count for each job category
      if (categoryCount[job.category]) {
        categoryCount[job.category]++;
      } else {
        categoryCount[job.category] = 1;
      }
    });
  
    console.log("CATEGORIES: ", categoryCount);
  
    // Add "All" category
    setCategories(["All", ...Object.keys(categoryCount)]);
  };

  const chartTitles = [
    "Languages",
    "Frameworks",
    "Platforms",
    "Certifications",
    "Tools",
    "Protocols",
    "Databases",
    "Methodologies",
    "Soft Skills",
  ];

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <>
        {isLoading ? (
          <h1 className="text-center text-2xl font-bold p-4">Loading...</h1>
        ) : (
          <div>
            <div className="flex justify-between p-4">
              <div>
                <CategoryDropdown categories={categories} setSelectedCategory={setSelectedCategory}/>
              </div>
              <div className="text-right">
                Data collected: {fetchedData[0]?.date || "Unknown Date"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
              {chartTitles.map((title, index) => (
                <BarChartHorizontal
                  key={index}
                  dataKeyIndex={index}
                  title={title}
                  data={fetchedData.length > 0 ? fetchedData : []}
                  selectedCategory={selectedCategory}      
                />
              ))}
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Home;
