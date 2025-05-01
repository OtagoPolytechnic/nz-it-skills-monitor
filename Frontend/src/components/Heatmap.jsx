import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

// Replace with a proper GeoJSON URL for New Zealand
const geoUrl = "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/new-zealand-regions.geojson";

// Job counts for each city
const cityJobCounts = {
  Auckland: 33,
  Wellington: 51,
  Christchurch: 52,
  Hamilton: 6,
  Dunedin: 3,
  Tauranga: 3,
  Napier: 0,
  Nelson: 0,
  Rotorua: 0,
  Queenstown: 0
};

const cities = [
  { name: 'Auckland', coordinates: [174.7633, -36.8485] },
  { name: 'Wellington', coordinates: [174.7762, -41.2865] },
  { name: 'Christchurch', coordinates: [172.6306, -43.5321] },
  { name: 'Dunedin', coordinates: [170.5036, -45.8788] },
  { name: 'Hamilton', coordinates: [175.2793, -37.7870] },
  { name: 'Tauranga', coordinates: [176.1674, -37.6860] },
  { name: 'Napier', coordinates: [176.9120, -39.4928] },
  { name: 'Nelson', coordinates: [173.2839, -41.2706] },
  { name: 'Rotorua', coordinates: [176.2497, -38.1368] },
  { name: 'Queenstown', coordinates: [168.6626, -45.0312] }
];

const colorScale = scaleLinear()
  .domain([0, Math.max(...Object.values(cityJobCounts))])
  .range(['#ffcccc', '#b30000']);

const Heatmap = () => (
  <div className="card" style={{ maxWidth: '1000px', margin: '2rem auto', background: '#fff' }}>
    <h3 style={{ textAlign: 'center' }}>Job Density Heatmap (New Zealand)</h3>
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 2200, center: [172.5, -41.5] }}
      style={{ width: "100%", height: "600px" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey || geo.properties.name}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"
            />
          ))
        }
      </Geographies>

      {cities.map((city) => {
        const count = cityJobCounts[city.name] || 0;
        return (
          <Annotation
            key={city.name}
            subject={city.coordinates}
            dx={-10}
            dy={-5}
            connectorProps={{ stroke: "#999", strokeWidth: 1 }}
          >
            <circle r={6} fill={colorScale(count)} />
            <text x={12} fontSize={10} fill="#333">
              {city.name} ({count})
            </text>
          </Annotation>
        );
      })}
    </ComposableMap>
  </div>
);

export default Heatmap;
