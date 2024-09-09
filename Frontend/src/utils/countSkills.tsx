import jobs from '../mockdata/trademedata 3.json';
interface Skill {
    name: string;
}

interface Job {
    skills: Skill[];
}

// Assuming `jobs` is defined somewhere and is an array of `Job`
const countSkills = () => {
    const skillCount = new Map<string, number>(); // Map to store skill counts

    jobs.forEach((job: Job) => {
        job.skills.forEach((skill: Skill) => {
        // Increment the count for this skill
        if (skillCount.has(skill.name)) {
            skillCount.set(skill.name, skillCount.get(skill.name)! + 1);
        } else {
            skillCount.set(skill.name, 1);
        }
        });
    });

    // Convert Map to a plain object for easier display
    const result: Record<string, number> = {};
    skillCount.forEach((count, skill) => {
        result[skill] = count;
    });

    console.log(result);
    return result;
}

export default countSkills;