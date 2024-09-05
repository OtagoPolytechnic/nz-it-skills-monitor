import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import filterData from "../utils/filterSkills";
import countSkills from "../utils/countSkills";
import axios from "axios";
import fs from "fs"; // Import the 'fs' module
import { useEffect, useState } from "react";

const chartConfig = {} satisfies ChartConfig;




const BarChart1 = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    fetch('https://nz-it-skills-monitor.onrender.com/jobs')
    .then(response => response.json())
    .then(data => setData(data));
  }, []);
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

  let filter = filterData();
  let skills = Object.values(filter);
  console.log("DATA: ",data);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart - {Object.keys(filter)[3]}</CardTitle>
          <CardDescription>Asked quantity's</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={skills[3]}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                dataKey="quantity"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <Bar
                dataKey="quantity"
                fill="#2563eb"
                strokeWidth={2}
                radius={8}
                activeIndex={2}
              />
            </BarChart>
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
    </>
  );
};

export default BarChart1;
