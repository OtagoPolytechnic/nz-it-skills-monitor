import React from "react";
import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import filterByLocation from "../utils/filterCities";

const COLORS = [
  "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d",
  "#a4de6c", "#d0ed57", "#ffc658", "#ff8042",
  "#ffbb28", "#00C49F", "#FFBB28", "#FF8042"
];

const PieChart = ({ data }) => {
  const dataForPieChart = filterByLocation(data);

  const coloredData = dataForPieChart.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, quantity } = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '5px',
          borderRadius: '3px'
        }}>
          <p><strong>{name}</strong></p>
          <p>Quantity: {quantity}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col w-full mx-auto shadow-lg rounded-lg pb-6">
      <CardHeader className="text-center pb-0">
        <CardTitle className="text-lg font-semibold">Pie Chart - Locations</CardTitle>
        <CardDescription className="text-sm text-gray-600">Number of Listings by Location</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center pb-0">
        <ResponsiveContainer width="100%" height={750}>
          <RechartsPieChart>
            <Pie
              data={coloredData}
              dataKey="quantity"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%" // Adjust this value if needed for better fit
              fill="#2563eb"
            />
            <Tooltip content={renderTooltip} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChart;
