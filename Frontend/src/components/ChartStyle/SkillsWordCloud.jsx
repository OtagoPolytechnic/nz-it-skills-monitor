// src/components/ChartStyle/SkillsWordCloud.jsx
import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const SkillsWordCloud = ({ title, data, chartMode, currentMode }) => {
  if (chartMode !== currentMode) return null;

  const words = data.map(item => ({
    text: item.skill,
    value: item.count,
  }));

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [14, 50],
  };

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <ReactWordcloud words={words} options={options} />
      </div>
    </div>
  );
};

export default SkillsWordCloud;
