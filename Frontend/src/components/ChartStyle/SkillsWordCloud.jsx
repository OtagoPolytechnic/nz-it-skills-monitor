// import React from 'react';
// import ReactWordcloud from 'react-wordcloud';
// import 'tippy.js/dist/tippy.css';
// import 'tippy.js/animations/scale.css';

// const SkillsWordCloud = ({ title = '', data = [], chartMode, currentMode }) => {
//   if (chartMode !== currentMode) return null;

//   console.log('[SkillsWordCloud] Incoming props:', { title, data, chartMode, currentMode });

//   if (!Array.isArray(data)) {
//     console.warn('[SkillsWordCloud] data is NOT an array:', data);
//     return (
//       <div className="chart-card">
//         <h3>{title}</h3>
//         <p style={{ padding: '1rem' }}>No data (invalid type).</p>
//       </div>
//     );
//   }

//   const words = data
//     .filter(item => item && typeof item.skill === 'string' && typeof item.count === 'number')
//     .map(item => ({ text: item.skill, value: item.count }));

//   console.log('[SkillsWordCloud] words array:', words);

//   if (words.length === 0) {
//     return (
//       <div className="chart-card">
//         <h3>{title}</h3>
//         <p style={{ padding: '1rem' }}>No valid word cloud data available.</p>
//       </div>
//     );
//   }

//   const options = {
//     rotations: 2,
//     rotationAngles: [-90, 0],
//     fontSizes: [14, 50],
//   };

//   return (
//     <div className="chart-card">
//       <h3>{title}</h3>
//       <div style={{ width: '100%', height: '400px' }}>
//         <ReactWordcloud words={words} options={options} />
//       </div>
//     </div>
//   );
// };

// export default SkillsWordCloud;
