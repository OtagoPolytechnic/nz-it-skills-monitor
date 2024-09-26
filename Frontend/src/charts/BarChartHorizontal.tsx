import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ChartConfig, ChartContainer } from "../components/ui/chart";
import filterData from "../utils/filterSkills";
import { useEffect, useState } from "react";
import { ChartTooltip } from "../components/ui/chart";

// Default chart configuration

interface BarChartProps {
  dataKeyIndex: number; // Index of the skills data to display
  title: string; // Title of the chart
}

const BarChartHorizontal = ({ dataKeyIndex, title }: BarChartProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch job data from API
    fetch('https://nz-it-skills-monitor.onrender.com/jobs')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // Filtering and structuring data
  let filter = filterData();
  let skills = Object.values(filter);

  return (
    <Card >
      <CardHeader>
        <CardTitle>Bar Chart - {title}</CardTitle>
        <CardDescription>Asked quantity's</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={650}>
          <BarChart
            accessibilityLayer
            data={skills[dataKeyIndex]}
            layout="vertical"
            margin={{
              left: 40,
            }}
          >
            <XAxis type="number" dataKey="quantity"  />
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
            <Bar dataKey="quantity" fill="#2563eb" strokeWidth={2} radius={8} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data from mon 19 aug 2024
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the quantity of asked technologies from 19-8-24
        </div>
      </CardFooter>
    </Card>
  );
};

export default BarChartHorizontal;
