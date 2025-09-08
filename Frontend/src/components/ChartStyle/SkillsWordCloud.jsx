import React, { useRef, useState, useEffect, useMemo } from 'react';
import WordCloud from 'react-d3-cloud';

const SkillsWordCloud = ({ title = '', data = [], chartMode, currentMode, expanded, onToggleExpand }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // 🔒 Keep layout cached by chart title and expanded/collapsed state
  const layoutCache = useRef({});

  const getCachedLayout = () => {
    const key = `${title}-${expanded ? 'expanded' : 'collapsed'}`;
    if (layoutCache.current[key]) {
      return layoutCache.current[key];
    }

    const sorted = [...data].sort((a, b) => b.count - a.count);
    const displayed = expanded ? sorted : sorted.slice(0, 35);
    const layout = displayed.map(item => ({
      text: item.skill,
      value: item.count,
    }));

    layoutCache.current[key] = layout;
    return layout;
  };

  const memoizedWords = useMemo(() => getCachedLayout(), [expanded, title]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height: height > 0 ? height : 400 });
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  if (chartMode !== currentMode) return null;

  const fontSizeMapper = word => Math.max(14, Math.min(50, word.value * 3));
  const rotate = () => 0;

  return (
    <div className="chart-card">
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
