// src/components/ChartStyle/ChartWrapper.jsx
import React from 'react';
import SkillsBarChart from './SkillsBarChart';
import SkillsPieChart from './SkillsPieChart';
import SkillsWordCloud from './SkillsWordCloud';

const ChartWrapper = ({ chartType, title, data, dataKey, barKey, expanded, onToggleExpand }) => {
  let ChartComponent;

  if (chartType === 'pie') {
    ChartComponent = (
      <SkillsPieChart title={title} data={data} dataKey={dataKey} barKey={barKey} expanded={expanded} onToggleExpand={onToggleExpand} />
    );
  } else if (chartType === 'wordcloud') {
    ChartComponent = (
      <SkillsWordCloud title={title} data={data} />
    );
  } else {
    // Default to bar
    ChartComponent = (
      <SkillsBarChart title={title} data={data} dataKey={dataKey} barKey={barKey} expanded={expanded} onToggleExpand={onToggleExpand} />
    );
  }

  return <>{ChartComponent}</>;
};

export default ChartWrapper;
