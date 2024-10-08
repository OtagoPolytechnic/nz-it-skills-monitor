interface Skill {
  name: string;
  type: string; // Added type field for categorization
}

interface Job {
  skills: Skill[];
  category: string; // Assuming each Job has a category field
}

// Function to count skills by type, filtered by selected category
const filterSkills = (data: Job[], selectedCategory: string) => {
  // Initialize maps to store skill counts by type
  const skillCountsByType = {
    language: new Map<string, number>(),
    framework: new Map<string, number>(),
    platform: new Map<string, number>(),
    certification: new Map<string, number>(),
    tool: new Map<string, number>(),
    protocol: new Map<string, number>(),
    database: new Map<string, number>(),
    methodology: new Map<string, number>(),
    "soft skill": new Map<string, number>(),
  };

  // Process each job and its skills from the fetched data
  data.forEach((job: Job) => {
    // Check if the job matches the selected category or if "All" is selected
    if (selectedCategory === "All" || job.category === selectedCategory) {
      job.skills.forEach((skill: Skill) => {
        // Get the appropriate map based on skill type
        const skillMap =
          skillCountsByType[skill.type as keyof typeof skillCountsByType];
        if (skillMap) {
          // Increment the count for this skill
          if (skillMap.has(skill.name)) {
            skillMap.set(skill.name, skillMap.get(skill.name)! + 1);
          } else {
            skillMap.set(skill.name, 1);
          }
        }
      });
    }
  });

  // Convert Maps to plain objects for easier display
  const sortedAndStructuredResult = Object.entries(skillCountsByType).reduce(
    (acc, [type, skillMap]) => {
      // Filter out skills with counts less than 2
      const filteredSkills = Array.from(skillMap.entries())
        .filter(([_, quantity]) => quantity >= 2) // Filter here
        .sort((a, b) => b[1] - a[1]) // Sort by quantity in descending order
        .map(([name, quantity]) => ({
          name,
          quantity,
        }));

      // Add filtered and sorted skills to the result object
      acc[type] = filteredSkills;

      return acc;
    },
    {} as Record<string, { name: string; quantity: number }[]>
  );

  console.log(sortedAndStructuredResult);
  return sortedAndStructuredResult;
};

export default filterSkills;
