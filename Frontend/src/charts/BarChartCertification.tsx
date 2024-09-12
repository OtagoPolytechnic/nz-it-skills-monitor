import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import filterData from "../utils/filterSkills";
import { useEffect, useState } from "react";
import { ChartTooltip, ChartTooltipContent } from "../components/ui/chart";

// Default configuration for the chart, could be customized further if needed
const chartConfig = {} satisfies ChartConfig;

const BarChart3 = () => {
  // State to store fetched job data
  const [data, setData] = useState([]);

  // Fetch job data from API when the component mounts
  useEffect(() => {
    fetch('https://nz-it-skills-monitor.onrender.com/jobs')
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // Empty dependency array ensures this effect runs only once

/*
  useEffect(() => {
    getData()
  }, []);



  useEffect(() => {
    console.log("AAAAAAAAAAAAAAAA ",data);},[data]); 
  
  const getData = async () => {
    await axios.get('https://nz-it-skills-monitor.onrender.com/jobs')
    .then(function (response) {
      console.log("VVVVVVVVVVVVVVVVVVVVV ", response);
     setData(response);
    });
  }
*/
  // Filter and structure the data using the filterData function
  let filter = filterData();
  let skills = Object.values(filter);
  
  return (
    <>
      <Card>
        <CardHeader>
          {/* Title and description for the card */}
          <CardTitle>Bar Chart - {Object.keys(filter)[3]}</CardTitle>
          <CardDescription>Asked quantity's</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            {/* BarChart component from Recharts library */}
            <BarChart accessibilityLayer data={skills[3]}>
              {/* Add a Cartesian grid for better readability */}
              <CartesianGrid vertical={false} />
              {/* X-axis configuration */}
              <XAxis
                dataKey="name" // Key for data to be displayed on X-axis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              {/* Y-axis configuration */}
              <YAxis
                dataKey="quantity" // Key for data to be displayed on Y-axis
                tickLine={false}
                tickMargin={10}
                tickCount={3} // Custom tick count for Y-axis
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                trigger="hover"
              />
              {/* Bar configuration */}
              <Bar
                dataKey="quantity" // Key for the data to be displayed in the bars
                fill="#2563eb" // Color of the bars
                strokeWidth={5} // Width of the bar borders
                radius={8} // Radius of the bar corners
                activeIndex={8} // Active index to highlight a specific bar, if needed
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

export default BarChart3;
