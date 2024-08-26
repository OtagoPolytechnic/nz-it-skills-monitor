import { TrendingUp } from "lucide-react"
import { PieChart, Pie } from "recharts";
import MockData from "../mockdata/mockdata.json"
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card"
import {  ChartConfig,  ChartContainer,  ChartTooltip,  ChartTooltipContent,} from "@/components/ui/chart"


const chartData = [
  {
    "name": "Python",
    "quantity": 16,
    "type": "Language"
  },
  {
    "name": "Django",
    "quantity": 12,
    "type": "Framework"
  },
  {
    "name": "Flask",
    "quantity": 7,
    "type": "Framework"
  },
  {
    "name": "FastAPI",
    "quantity": 5,
    "type": "Framework"
  },
  {
    "name": "JavaScript",
    "quantity": 18,
    "type": "Language"
  },
  {
    "name": "React",
    "quantity": 14,
    "type": "Framework"
  }
]

const chartConfig = {
} satisfies ChartConfig

const PieChart1 = () => {  
  return (
    <>      
      <Card className="flex flex-col max-w-lg mx-auto shadow-lg rounded-lg pb-6">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-lg font-semibold">Pie Chart - Technologies</CardTitle>
          <CardDescription className="text-sm text-gray-600">Asked quantity's</CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="w-full"
          >
            <PieChart width={700} height={700}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie 
                data={MockData.technologies} 
                fill="#2563eb"
                dataKey="quantity" 
                nameKey="name" />
            </PieChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Data from mon 19 aug 2024 <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing the quantity of asked technologies from 19-8-24
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

/* 

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Technologies</CardTitle>
          <CardDescription>Asked quantity's</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="w-full h-full"
          >
            <PieChart width={300} height={300}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={MockData.technologies} dataKey="name"/>
            </PieChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Data from mon 19 aug 2024 <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing the quantity of asked technologies from 19-8-24
          </div>
        </CardFooter>
      </Card>
*/
  
export default PieChart1;