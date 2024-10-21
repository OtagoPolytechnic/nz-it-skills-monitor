import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import filterData from "../utils/filterSkills";
import { ChartTooltip } from "../components/ui/chart";

// Define seven different shades of blue
const blueShades = [
  "#2563eb", // Blue 1
  "#1d4ed8", // Blue 2
  "#1e40af", // Blue 3
  "#1e3a8a", // Blue 4
  "#3b82f6", // Blue 5
  "#60a5fa", // Blue 6
  "#93c5fd", // Blue 7
];

// Default chart configuration
interface BarChartProps {
  dataKeyIndex: number; // Index of the skills data to display
  title: string; // Title of the chart
  data: any[];  // Data passed from parent component (Home)
  selectedCategory: string;
}

const BarChartHorizontal = ({ dataKeyIndex, title, data, selectedCategory }: BarChartProps) => {
  // Filtering and structuring data
  let filter = filterData(data, selectedCategory);
  let skills = Object.values(filter);

  // Add a fill color for each bar based on its index
  const processedData = skills[dataKeyIndex].map((item, index) => ({
    ...item,
    fill: blueShades[index % blueShades.length], // Cycle through the blue shades
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - {title}</CardTitle>
        <CardDescription>Asked quantity's</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={900}>
          <BarChart
            accessibilityLayer
            data={processedData}
            layout="vertical"
            margin={{
              left: 40,
            }}
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
            <ChartTooltip
              cursor={false}
              trigger="hover"
            />
            <Bar
              dataKey="quantity"
              strokeWidth={2}
              radius={8}
              fill={({ fill }) => fill} // Use the fill property from the processed data
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartHorizontal;
