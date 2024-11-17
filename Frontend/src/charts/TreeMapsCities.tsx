import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import filterByLocation from "../utils/filterCities";

const CustomTreemapContent = (props) => {
  const { x, y, width, height, name, fill } = props;
  if (width <= 0 || height <= 0) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="#000000"
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#000000"
        fontSize={Math.min(width, height) / 8}
      >
        {name}
      </text>
    </g>
  );
};

const TreeMapCities = ({ name, data }) => {
  // Filter and structure data using filterByLocation
  const dataForTreemap = filterByLocation(data);

  if (dataForTreemap.length === 0) {
    return <div>No data available for the selected locations.</div>;
  }

  const COLORS = [
    "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d",
    "#a4de6c", "#d0ed57", "#ffc658", "#ff8042",
    "#ffbb28", "#00C49F", "#FFBB28", "#FF8042"
  ];

  const coloredData = dataForTreemap.map((item, index) => ({
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
    <Card>
      <CardHeader>
        <CardTitle style={{ color: 'black' }}>{name}</CardTitle>
        <CardDescription style={{ color: 'black' }}>Jobs Distribution by Location</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={750}>
          <Treemap
            data={coloredData}
            dataKey="quantity"
            stroke="#000000"
            content={<CustomTreemapContent />} // Use renderCustomContent as the custom content renderer
          >
            <Tooltip content={renderTooltip} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TreeMapCities;
