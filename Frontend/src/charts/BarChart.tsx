import { BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import filterData from "../utils/filterSkills";
import { useEffect, useState } from "react";
import { ChartTooltip } from "../components/ui/chart";

// Default chart configuration
const chartConfig = {} satisfies ChartConfig;

interface BarChartProps {
  dataKeyIndex: number; // Index of the skills data to display
  title: string; // Title of the chart
}

const BarChart = ({ dataKeyIndex, title }: BarChartProps) => {
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
        <ChartContainer config={chartConfig} >
          <RechartsBarChart  width={window.innerWidth -40 } data={skills[dataKeyIndex]} >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} angle={45} />
            <YAxis dataKey="quantity" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} trigger="hover"/>
            <Bar dataKey="quantity" fill="#2563eb" strokeWidth={2} radius={8} />
          </RechartsBarChart>
        </ChartContainer>
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

export default BarChart;
