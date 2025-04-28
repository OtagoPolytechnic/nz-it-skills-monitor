// src/components/Home.jsx
import React from 'react';
import Navbar from '../Navbar';
import ITJobsByCountryCard from './ITJobsByCountryCard';
import SkillsChart from './SkillsChart';
import '../App.css';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="stacked-dashboard">
        <ITJobsByCountryCard />

        <SkillsChart title="Core Skills" dataKey="skill" barKey="count" data={[
          { skill: 'Communication', count: 80 },
          { skill: 'Problem-solving', count: 70 },
          { skill: 'Teamwork', count: 65 },
          { skill: 'Time Management', count: 55 },
          { skill: 'Adaptability', count: 50 }
        ]} />

        <SkillsChart title="Languages" dataKey="skill" barKey="count" data={[
          { skill: 'JavaScript', count: 120 },
          { skill: 'Python', count: 95 },
          { skill: 'Java', count: 85 },
          { skill: 'C#', count: 70 },
          { skill: 'TypeScript', count: 65 }
        ]} />

        <SkillsChart title="Frameworks & Libraries" dataKey="skill" barKey="count" data={[
          { skill: 'React', count: 110 },
          { skill: 'Angular', count: 70 },
          { skill: 'Vue', count: 50 },
          { skill: '.NET', count: 40 },
          { skill: 'Django', count: 30 }
        ]} />

        <SkillsChart title="DevOps & Tools" dataKey="skill" barKey="count" data={[
          { skill: 'Git', count: 100 },
          { skill: 'Docker', count: 85 },
          { skill: 'Kubernetes', count: 60 },
          { skill: 'CI/CD', count: 55 },
          { skill: 'Jenkins', count: 45 }
        ]} />

        <SkillsChart title="Databases" dataKey="skill" barKey="count" data={[
          { skill: 'MySQL', count: 75 },
          { skill: 'PostgreSQL', count: 70 },
          { skill: 'MongoDB', count: 65 },
          { skill: 'Redis', count: 50 },
          { skill: 'Oracle', count: 40 }
        ]} />

        <SkillsChart title="Testing & QA" dataKey="skill" barKey="count" data={[
          { skill: 'Jest', count: 60 },
          { skill: 'Selenium', count: 50 },
          { skill: 'Cypress', count: 45 },
          { skill: 'Mocha', count: 30 },
          { skill: 'JUnit', count: 25 }
        ]} />
      </div>
    </div>
  );
};

export default Home;
