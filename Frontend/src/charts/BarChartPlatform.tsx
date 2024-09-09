import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import filterData from "../utils/filterSkills";
import { ChartTooltip, ChartTooltipContent } from "../components/ui/chart";

// Log the filterData function to the console (useful for debugging or verification)
console.log(filterData);

// Default configuration for the chart, can be customized as needed
const chartConfig = {} satisfies ChartConfig;

const BarChart2 = () => {
  // Call filterData function to get the filtered and structured skill data
  let filter = filterData();

  // Convert the filter object to an array of skill data arrays
  let skills = Object.values(filter);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart - {Object.keys(filter)[2]}</CardTitle>
          <CardDescription>Asked quantity's</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={skills[2]}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name" // Key to access data for X-axis labels
                tickLine={false} // Hide tick lines on X-axis
                tickMargin={10} // Margin for ticks on X-axis
                axisLine={false} // Hide axis line
              />
              <YAxis
                dataKey="quantity" // Key to access data for Y-axis labels
                tickLine={false} // Hide tick lines on Y-axis
                tickMargin={10} // Margin for ticks on Y-axis
                axisLine={false} // Hide axis line
              />
              <ChartTooltip
                cursor={false}
                trigger="hover"
                template="#name#  -  #quantity#"
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="quantity" // Key to access data for bar heights
                fill="#2563eb" // Color of the bars
                strokeWidth={2} // Width of the bar borders
                radius={8} // Radius for rounded corners of bars
                activeIndex={2} // Optional: Index of the bar to highlight (can be adjusted or removed)
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* Footer with additional information */}
          <div className="flex gap-2 font-medium leading-none">
            Data from mon 19 aug 2024
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing the quantity of asked technologies from 19-8-24
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default BarChart2;
