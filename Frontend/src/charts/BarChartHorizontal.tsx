import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import filterData from "../utils/filterSkills";
import { ChartTooltip } from "../components/ui/chart";
import { useNavigate } from "react-router-dom";

// Define seven different shades of blue
const blueShades = [
  "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd",
];

// Default chart configuration
interface BarChartProps {
  dataKeyIndex: number;
  title: string;
  data: any[];
  selectedCategory: string;
}

const BarChartHorizontal = ({ dataKeyIndex, title, data, selectedCategory }: BarChartProps) => {
  const navigate = useNavigate();

  // Filtering and structuring data
  let filter = filterData(data, selectedCategory);
  let skills = Object.values(filter);

  // Slice data to show only top 15 items on the HomeScreen
  const processedData = skills[dataKeyIndex]
    .slice(0, 15) // Show only the top 15 items
    .map((item, index) => ({
      ...item,
      fill: blueShades[index % blueShades.length], // Cycle through the blue shades
    }));

  // Handle button click to navigate to FullGraphScreen
  const handleShowFullGraph = () => {
    navigate("/full-graph", { state: { data, dataKeyIndex, selectedCategory, title } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - {title}</CardTitle>
        <CardDescription>Top 15 Items</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={650}>
          <BarChart
            accessibilityLayer
            data={processedData}
            layout="vertical"
            margin={{ left: 40 }}
          >
            <XAxis type="number" dataKey="quantity" />
            <YAxis
              dataKey="name"
              type="category"
              height={50}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip cursor={false} trigger="hover" />
            <Bar dataKey="quantity" strokeWidth={2} radius={8} fill={({ fill }) => fill} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <button className="btn btn-primary" onClick={handleShowFullGraph}>
          <TrendingUp size={16} />
          Show Full Graph
        </button>
      </CardFooter>
    </Card>
  );
};

export default BarChartHorizontal;
