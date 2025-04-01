import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const skillData = [
  { skill: 'JavaScript', count: 120 },
  { skill: 'React', count: 95 },
  { skill: 'SQL', count: 80 },
  { skill: 'Python', count: 70 },
  { skill: 'AWS', count: 60 },
  { skill: 'Node.js', count: 55 }
];

const SkillsChart = () => {
  return (
    <div className="card">
      <h3>Skills</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={skillData}>
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;