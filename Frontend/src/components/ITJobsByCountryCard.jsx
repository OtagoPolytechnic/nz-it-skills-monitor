// import React, { useState } from 'react';
// import {
//   PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer
// } from 'recharts';

// const COLORS = [
//   '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
//   '#a4de6c', '#d0ed57', '#ffbb28', '#d291bc', '#ff9999',
//   '#c2c2f0', '#ffb6b9', '#e6ee9c', '#ffcc80', '#bcaaa4'
// ];

// const ITJobsByCountryCard = ({ jobData }) => {
//   const [expanded, setExpanded] = useState(false);

//   // Count locations
//   const locationCounts = jobData.reduce((acc, job) => {
//     const loc = job.location?.trim();
//     if (loc && loc.toLowerCase() !== 'none') {
//       acc[loc] = (acc[loc] || 0) + 1;
//     } else {
//       acc['__MISSING__'] = (acc['__MISSING__'] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   // Separate real locations and missing
//   const realLocations = Object.entries(locationCounts).filter(([name]) => name !== '__MISSING__');
//   const missing = locationCounts['__MISSING__'];

//   // Sort real locations by value
//   const sortedReal = realLocations.sort((a, b) => b[1] - a[1]);
//   const top10 = sortedReal.slice(0, 10);

//   // Build chart data
//   const data = expanded
//     ? [
//         ...sortedReal.map(([name, value]) => ({ name, value })),
//         ...(missing ? [{ name: 'None', value: missing }] : [])
//       ]
//     : top10.map(([name, value]) => ({ name, value }));

//   return (
//     <div className="card">
//       <h3>Locations</h3>
//       <ResponsiveContainer width="100%" height={500}>
//         <PieChart>
//           <Pie
//             data={data}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={220}
//             fill="#8884d8"
//             label
//           >
//             {data.map((_, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend layout="vertical" align="right" verticalAlign="middle" />
//         </PieChart>
//       </ResponsiveContainer>
//       <div className="button-wrapper">
//         <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
//           {expanded ? 'Collapse' : 'Expand'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ITJobsByCountryCard;
