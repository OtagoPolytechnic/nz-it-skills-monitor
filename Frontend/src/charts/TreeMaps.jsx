import React from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { TrendingUp } from "lucide-react"; // Adjust icon import
import filterData from '../utils/filterSkills';

const TreeMaps = () => {
  // Filtering and structuring data
  let filteredSkills = filterData();
  let skills = Object.values(filteredSkills);

  // Use some fallback for data if it's undefined or empty
  const dataForTreemap = skills.length > 0 ? skills[0] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap Chart</CardTitle>
        <CardDescription>Data Distribution</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <Treemap
            data={dataForTreemap}  // Make sure data is passed correctly
            dataKey="size" // Ensure the correct key is provided in the data
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          />
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data from Mon 19 Aug 2024
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing data distribution by size on 19-8-24
        </div>
      </CardFooter>
    </Card>
  );
};

export default TreeMaps;
