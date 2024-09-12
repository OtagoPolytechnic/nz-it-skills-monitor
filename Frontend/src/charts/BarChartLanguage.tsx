import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import filterData from "../utils/filterSkills";
import { ChartTooltip, ChartTooltipContent } from "../components/ui/chart";

// Log the filterData function to the console for debugging or verification
console.log(filterData);

// Default chart configuration, which can be customized if needed
const chartConfig = {} satisfies ChartConfig;

const BarChart0 = () => {
  // Call the filterData function to get the filtered and structured skill data
  let filter = filterData();

  // Convert the filter object to an array of skill data arrays
  let skills = Object.values(filter);

  return (
    <>
      <Card>
        <CardHeader>
          {/* Title of the card, displaying the name of the filter category based on its index */}
          <CardTitle>Bar Chart - {Object.keys(filter)[0]}</CardTitle>
          {/* Description of the card content */}
          <CardDescription>Asked quantity's</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            {/* Render the BarChart component from Recharts */}
            <BarChart accessibilityLayer data={skills[0]}>
              {/* Cartesian grid configuration with vertical lines disabled for a cleaner look */}
              <CartesianGrid vertical={false} />
              {/* X-axis configuration */}
              <XAxis
                dataKey="name" // Key to access data for X-axis labels
                tickLine={false} // Hide tick lines on X-axis
                tickMargin={10} // Margin for ticks on X-axis
                axisLine={false} // Hide the axis line
              />
              {/* Y-axis configuration */}
              <YAxis
                dataKey="quantity" // Key to access data for Y-axis labels
                tickLine={false} // Hide tick lines on Y-axis
                tickMargin={10} // Margin for ticks on Y-axis
                axisLine={false} // Hide the axis line
              />
              <ChartTooltip
                cursor={false}
                trigger="hover"
              />
              <Bar
                dataKey="quantity" // Key to access data for bar heights
                fill="#2563eb" // Fill color of the bars
                strokeWidth={2} // Width of the bar borders
                radius={8} // Radius for rounded corners of bars
                activeIndex={2} // Optional: Index of the bar to highlight (can be adjusted or removed)
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* Footer content */}
          <div className="flex gap-2 font-medium leading-none">
            {/* Static text indicating the data source and date */}
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

export default BarChart0;
