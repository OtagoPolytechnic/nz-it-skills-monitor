import { useLocation } from "react-router-dom";
import filterData from "../utils/filterSkills";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "../components/ui/chart";

// Define seven different shades of blue
const blueShades = [
  "#2563eb",
  "#1d4ed8",
  "#1e40af",
  "#1e3a8a",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

const FullGraphScreen = () => {
  const location = useLocation();
  const { data, dataKeyIndex, selectedCategory, title } = location.state;

  let filter = filterData(data, selectedCategory);
  let skills = Object.values(filter);

  // Prepare data and assign colors
  const processedData = skills[dataKeyIndex].map((item, index) => ({
    ...item,
    fill: blueShades[index % blueShades.length], // Cycle through the blue shades
  }));

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart - {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer height={1200}>
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
              <Bar
                dataKey="quantity"
                strokeWidth={2}
                radius={8}
                // Removed `fill` prop here
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullGraphScreen;
