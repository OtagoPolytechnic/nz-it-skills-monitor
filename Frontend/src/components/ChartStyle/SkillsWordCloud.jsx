// src/components/ChartStyle/SkillsWordCloud.jsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import WordCloud from 'react-d3-cloud';

const SkillsWordCloud = ({ title = '', data = [], chartMode, currentMode, expanded, onToggleExpand }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Persist layout so it doesn’t regenerate randomly
  const memoizedWords = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const displayed = expanded ? sorted : sorted.slice(0, 10);
    return displayed.map(item => ({
      text: item.skill,
      value: item.count,
    }));
  }, [data, expanded]);

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

  if (chartMode !== currentMode) return null;

  if (!Array.isArray(memoizedWords) || memoizedWords.length === 0) {
    return (
      <div className="chart-card">
        <h3>{title}</h3>
        <p>No valid data for word cloud.</p>
      </div>
    );
  }

  const fontSizeMapper = word => Math.max(14, Math.min(50, word.value * 3));
  const rotate = () => 0; // fix all text horizontal

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div ref={containerRef} style={{ width: '100%', height: 400 }}>
        <WordCloud
          data={memoizedWords}
          font="Impact"
          fontSize={fontSizeMapper}
          spiral="archimedean"
          rotate={rotate}
          padding={2}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
      <button className="expand-btn" onClick={onToggleExpand}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

export default SkillsWordCloud;
