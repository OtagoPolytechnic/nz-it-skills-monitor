import React from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { TrendingUp } from "lucide-react"; // Adjust icon import
import filterData from '../utils/filterSkills';

const TreeMaps = ({ dataKeyIndex, title, data, selectedCategory }: BarChartProps) => {
  // Filtering and structuring data
  let filter = filterData(data, selectedCategory);
  let skills = Object.values(filter);
  // Use some fallback for data if it's undefined or empty
  const dataForTreemap = skills.length > 0 ? skills[0] : [];
  console.log("Data for Treemap: ", dataForTreemap);
   
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treemap Chart</CardTitle>
        <CardDescription>Data Distribution</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width={530} height={625}>
          <Treemap
            width={400}
            height={400}
            data={dataForTreemap}
            dataKey="quantity"
            ratio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TreeMaps;
