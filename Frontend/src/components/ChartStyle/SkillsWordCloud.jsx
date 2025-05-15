// src/components/ChartStyle/SkillsWordCloud.jsx
import React, { useRef, useState, useEffect } from 'react';
import WordCloud from 'react-d3-cloud';

const SkillsWordCloud = ({ title = '', data = [], chartMode, currentMode }) => {
  if (chartMode !== currentMode) return null;

  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height: height > 0 ? height : 400 });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const isValidArray = Array.isArray(data) && data.length > 0;
  if (!isValidArray) {
    return (
      <div className="chart-card">
        <h3>{title}</h3>
        <p>No valid data for word cloud.</p>
      </div>
    );
  }

  const words = data.map(item => ({
    text: item.skill,
    value: item.count,
  }));

  const fontSizeMapper = word => Math.max(14, Math.min(50, word.value * 3));
  const rotate = () => 0; // keep all text horizontal

  return (
    <div className="chart-card">
      <div ref={containerRef} style={{ width: '100%', height: 400 }}>
        <WordCloud
          data={words}
          font="Impact"
          fontSize={fontSizeMapper}
          spiral="archimedean"
          rotate={rotate}
          padding={2}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </div>
  );
};

export default SkillsWordCloud;
