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

// Updated filterByLocation function to filter out locations with quantity <= 1
const filterByLocation = (data: JobData[]): { name: string; quantity: number }[] => {
  const locationCount: Record<string, number> = {};

  data
    .filter(item => item.location && item.location.toLowerCase() !== "none")
    .forEach(item => {
      const location = item.location!.trim();
      locationCount[location] = (locationCount[location] || 0) + 1;
    });

  // Filter out locations with quantity <= 1
  const filteredLocationCount = Object.entries(locationCount)
    .filter(([_, quantity]) => quantity > 1) // Keep only locations with more than 1 job listing
    .map(([name, quantity]) => ({ name, quantity }));

  return filteredLocationCount;
};

export default filterByLocation;
