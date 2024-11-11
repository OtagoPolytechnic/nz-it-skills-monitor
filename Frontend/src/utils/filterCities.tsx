interface JobData {
    category: string;
    company: string | null;
    date: string;
    duration: string | null;
    id: number;
    location: string | null;
    salary: number;
    skills: Array<object>;
    title: string | null;
    type: string | null;
  }
  // Updated filterByLocation function
const filterByLocation = (data: JobData[]): { name: string; quantity: number }[] => {
    const locationCount: Record<string, number> = {};
  
    data
      .filter(item => item.location && item.location.toLowerCase() !== "none")
      .forEach(item => {
        const location = item.location!.trim();
        locationCount[location] = (locationCount[location] || 0) + 1;
      });
  
    // Convert the result to an array format compatible with the PieChart
    return Object.entries(locationCount).map(([name, quantity]) => ({ name, quantity }));
  };
  
  export default filterByLocation;
  