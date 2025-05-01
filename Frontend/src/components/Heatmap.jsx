import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/new-zealand/nz-counties.json";

const Heatmap = () => {
  return (
    <div className="card">
      <h3>Test NZ Map (No Annotations Yet)</h3>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1200, center: [172.5, -41.5] }}
        width={800}
        height={600}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#C0C0C0"
                stroke="#FFF"
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Heatmap;
