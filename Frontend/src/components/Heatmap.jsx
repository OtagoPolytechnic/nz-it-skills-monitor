import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import axios from "axios";

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heat = window.L.heatLayer(points, {
      radius: 40,
      blur: 25,
      maxZoom: 12,
      gradient: {
        0.1: "blue",
        0.3: "lime",
        0.6: "orange",
        1.0: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

const LeafletHeatmap = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    axios
      axios.get(`${import.meta.env.VITE_API_URL}/job-locations`)
      .then((res) => {
        console.log("Loaded heatmap points:", res.data);
        setPoints(res.data);
      })
      .catch((err) => console.error("Heatmap load error", err));
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer
        center={[-41.2865, 174.7762]}
        zoom={2}
        minZoom={5}
        maxZoom={15}
        maxBounds={[
          [-50, 165],
          [-33, 180],
        ]}
        maxBoundsViscosity={1.0}
         style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <HeatLayer points={points} />
      </MapContainer>
    </div>
  );
};

export default LeafletHeatmap;
