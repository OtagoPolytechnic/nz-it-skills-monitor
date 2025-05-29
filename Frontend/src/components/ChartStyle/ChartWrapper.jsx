// src/components/ChartStyle/ChartWrapper.jsx
import React from 'react';
import SkillsBarChart from './SkillsBarChart';
import SkillsPieChart from './SkillsPieChart';
import SkillsWordCloud from './SkillsWordCloud';

const ChartWrapper = ({ chartType, title, data, dataKey, barKey, expanded, onToggleExpand }) => {
  let ChartComponent;

  switch (chartType) {
    case 'pie':
      ChartComponent = (
        <SkillsPieChart
          title={title}
          data={data}
          chartMode="pie"
          currentMode={chartType}
          expanded={expanded}
          onToggleExpand={onToggleExpand}
        />
      );
      break;
    case 'wordcloud':
      ChartComponent = (
        <SkillsWordCloud
          title={title}
          data={data}
          chartMode="wordcloud"
          currentMode={chartType}
          expanded={expanded}
          onToggleExpand={onToggleExpand}
        />
      );
      break;
    case 'bar':
    default:
      ChartComponent = (
        <SkillsBarChart
          title={title}
          data={data}
          dataKey={dataKey}
          barKey={barKey}
          chartMode="bar"
          currentMode={chartType}
          expanded={expanded}
          onToggleExpand={onToggleExpand}
        />
      );
  }

  return <>{ChartComponent}</>;
};

export default ChartWrapper;
