import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ChartConfig, ChartContainer } from "../components/ui/chart";
import filterData from "../utils/filterSkills";
import { ChartTooltip } from "../components/ui/chart";

// Default chart configuration
const chartConfig = {} satisfies ChartConfig;

interface BarChartProps {
  dataKeyIndex: number; // Index of the skills data to display
  title: string; // Title of the chart
  data: any[];  // Data passed from parent component (Home)
  selectedCategory: string;
}

const BarChartHorizontal = ({ dataKeyIndex, title, data, selectedCategory }: BarChartProps) => {

  // Filtering and structuring data
  let filter = filterData(data);
  let skills = Object.values(filter);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - {title}</CardTitle>
        <CardDescription>Asked quantity's</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={skills[dataKeyIndex]}
            layout="vertical"
            margin={{
              left: 40,
            }}
          >
            <XAxis type="number" dataKey="quantity" />
            <YAxis
              dataKey="name"
              type="category"
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartHorizontal;
