import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import filterData from '../utils/filterSkills';

const TreeMaps = ({ dataKeyIndex, title, data, selectedCategory }) => {
  // Filtering and structuring data
  let filter = filterData(data, selectedCategory);
  let skills = Object.values(filter);
  // Use some fallback for data if it's undefined or empty
  const dataForTreemap = skills.length > 0 ? skills[8] : [];
  console.log(dataForTreemap);

  const COLORS = [
    "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d",
    "#a4de6c", "#d0ed57", "#ffc658", "#ff8042",
    "#ffbb28", "#00C49F", "#FFBB28", "#FF8042"
  ];

  // Add color to each item
  const coloredData = dataForTreemap.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  // Custom content renderer for Treemap
  const renderCustomContent = (props) => {
    const { x, y, width, height, name, quantity } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={props.fill}
          stroke="#000000"
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#000000"
          fontSize={width /8}
        >
          {name}
        </text>
      </g>
    );
  };

const TreeMaps = ({ name, data, selectedCategory }) => {
  let filter = filterData(data, selectedCategory);
  let skills = Object.values(filter);
  const dataForTreemap = skills.length > 0 ? skills[8] : [];

  // Only render the TreeMap if dataForTreemap has data
  if (dataForTreemap.length === 0) {
    return <div>No data available for the selected category.</div>; // Optionally display a message
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
        <CardDescription style={{ color: 'black' }}>Data Distribution</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width={1170} height={825}>
          <Treemap
            data={coloredData}
            dataKey="quantity"
            stroke="#000000"
            content={<CustomTreemapContent />}
          >
            <Tooltip content={renderTooltip} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TreeMaps;
