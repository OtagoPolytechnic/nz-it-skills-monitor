import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import filterData from "../utils/filterSkills";
import { ChartTooltip, ChartTooltipContent } from "../components/ui/chart";

// Log the filterData function to the console (for debugging or verification purposes)
console.log(filterData);

// Default chart configuration, can be customized further if needed
const chartConfig = {} satisfies ChartConfig;

const BarChart1 = () => {
  // Call filterData function to get the filtered and structured skill data
  let filter = filterData();

  // Convert the filter object to an array of skill data arrays
  let skills = Object.values(filter);

  return (
    <>
      <Card>
        <CardHeader>
          {/* Title of the card, dynamically displaying the name of the filter category */}
          <CardTitle>Bar Chart - {Object.keys(filter)[1]}</CardTitle>
          {/* Description of the card content */}
          <CardDescription>Asked quantity's</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            {/* Render the BarChart component from Recharts */}
            <BarChart accessibilityLayer data={skills[1]}>
              {/* Cartesian grid for the chart, with vertical lines disabled */}
              <CartesianGrid vertical={false} />
              {/* X-axis configuration */}
              <XAxis
                dataKey="name" // Key to access data for X-axis labels
                tickLine={false} // Hide tick lines on X-axis
                tickMargin={10} // Margin for ticks
                axisLine={false} // Hide axis line
              />
              {/* Y-axis configuration */}
              <YAxis
                dataKey="quantity" // Key to access data for Y-axis labels
                tickLine={false} // Hide tick lines on Y-axis
                tickMargin={10} // Margin for ticks
                axisLine={false} // Hide axis line
              />
              <ChartTooltip
                cursor={false}
                trigger="hover"
              />
              <Bar
                dataKey="quantity" // Key to access data for bar heights
                fill="#2563eb" // Color of the bars
                strokeWidth={2} // Width of the bar borders
                radius={8} // Radius for rounded corners of bars
                activeIndex={2} // Index of the bar to highlight (optional, can be adjusted or removed)
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* Footer content */}
          <div className="flex gap-2 font-medium leading-none">
            {/* Static text and icon indicating the data source and date */}
            Data from mon 19 aug 2024
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {/* Additional description of the data displayed */}
            Showing the quantity of asked technologies from 19-8-24
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default BarChart1;
