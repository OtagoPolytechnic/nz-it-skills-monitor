import jobs from '../mockdata/trademedata 3.json';

interface Skill {
    name: string;
    type: string; // Added type field for categorization
}

interface Job {
    skills: Skill[];
}

// Function to count skills by type
const filterSkills = () => {
    // Initialize maps to store skill counts by type
    const skillCountsByType = {
        language: new Map<string, number>(),
        framework: new Map<string, number>(),
        platform: new Map<string, number>(),
        certification: new Map<string, number>(),
        tool: new Map<string, number>(),
        protocol: new Map<string, number>(),
    };

    // Process each job and its skills
    jobs.forEach((job: Job) => {
        job.skills.forEach((skill: Skill) => {
            // Get the appropriate map based on skill type
            const skillMap = skillCountsByType[skill.type as keyof typeof skillCountsByType];
            if (skillMap) {
                // Increment the count for this skill
                if (skillMap.has(skill.name)) {
                    skillMap.set(skill.name, skillMap.get(skill.name)! + 1);
                } else {
                    skillMap.set(skill.name, 1);
                }
            }
        });
    });

    // Convert Maps to plain objects for easier display
    const sortedAndStructuredResult = Object.entries(skillCountsByType).reduce((acc, [type, skillMap]) => {
        // Convert Map to array and sort by quantity in descending order
        const sortedSkills = Array.from(skillMap.entries()).sort((a, b) => b[1] - a[1]).map(([name, quantity]) => ({
            name,
            quantity
        }));

        // Add sorted skills to the result object
        acc[type] = sortedSkills;

        return acc;
    }, {} as Record<string, { name: string; quantity: number }[]>);

    console.log(sortedAndStructuredResult);
    return sortedAndStructuredResult;
}
/*
    const result1 = Object.fromEntries(
        Object.entries(skillCountsByType).map(([type, skillMap]) => [
            type,
            Object.fromEntries(skillMap.entries())
        ])
    );

    const result = Object.entries(skillCountsByType).flatMap(([type, skillMap]) => 
        Array.from(skillMap.entries()).map(([name, quantity]) => ({
            name,
            quantity
        }))
    );

    console.log("result 1",result1);
    console.log("result 2",result);
    return result;
}*/

export default filterSkills;
