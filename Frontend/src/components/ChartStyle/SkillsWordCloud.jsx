import React, { useRef, useState, useEffect, useMemo } from "react";
import WordCloud from "react-d3-cloud";

const SkillsWordCloud = ({
  title = "",
  data = [],
  chartMode,
  currentMode,
  expanded,
  onToggleExpand,
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // 🔒 Keep layout cached by chart title and expanded/collapsed state
  const layoutCache = useRef({});

  const getCachedLayout = () => {
    const key = `${title}-${expanded ? "expanded" : "collapsed"}`;
    if (layoutCache.current[key]) {
      return layoutCache.current[key];
    }

    const sorted = [...data].sort((a, b) => b.count - a.count);
    const displayed = expanded ? sorted : sorted.slice(0, 40);
    const layout = displayed.map((item) => ({
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

  const fontSizeMapper = (word) => Math.max(14, Math.min(50, word.value * 3));
  const rotate = () => 0;

  // Fade from light blue (#bfdbfe) to dark blue (#1e40af)
  const colorMapper = (word) => {
    const values = memoizedWords.map((w) => w.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min) return "#3b82f6"; // default blue if all counts equal
    const ratio = (word.value - min) / (max - min);
    const start = [191, 219, 254]; // rgb for #bfdbfe
    const end = [30, 64, 175]; // rgb for #1e40af
    const r = Math.round(start[0] + ratio * (end[0] - start[0]));
    const g = Math.round(start[1] + ratio * (end[1] - start[1]));
    const b = Math.round(start[2] + ratio * (end[2] - start[2]));
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="chart-card">
      <div ref={containerRef} style={{ width: "100%", height: 400 }}>
        <WordCloud
          data={memoizedWords}
          font="Impact"
          fontSize={fontSizeMapper}
          fill={colorMapper}
          spiral="archimedean"
          rotate={rotate}
          padding={2}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
      <button className="expand-btn" onClick={onToggleExpand}>
        {expanded ? "Collapse" : "Expand"}
      </button>
    </div>
  );
};

export default SkillsWordCloud;
