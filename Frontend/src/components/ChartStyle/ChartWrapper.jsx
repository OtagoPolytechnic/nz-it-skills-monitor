// src/components/ChartStyle/ChartWrapper.jsx
import React from 'react';
import SkillsBarChart from './SkillsBarChart';
import SkillsPieChart from './SkillsPieChart';

const ChartWrapper = ({ chartType, title, data, dataKey, barKey }) => {
  if (chartType === 'pie') {
    return <SkillsPieChart title={title} data={data} dataKey={dataKey} barKey={barKey} chartMode="pie" currentMode="pie" />;
  }
  return <SkillsBarChart title={title} data={data} dataKey={dataKey} barKey={barKey} chartMode="bar" currentMode="bar" />;
};

export default ChartWrapper;
