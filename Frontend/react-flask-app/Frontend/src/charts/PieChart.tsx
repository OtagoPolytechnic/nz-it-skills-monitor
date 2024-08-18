import { PieChart, Pie } from "recharts";

const PieChart1 = () => {
    const innerdata = [
      { name: 'C1', value: 100 },
      { name: 'C2', value: 20 },
      { name: 'C3', value: 300 },
      { name: 'C4', value: 90 },
    ];
  
    const outerdata = [
      { name: 'P1', value: 10 },
      { name: 'P2', value: 100 },
      { name: 'P3', value: 20 },
      { name: 'P4', value: 30 },
      { name: 'P5', value: 90 }
    ];
  
    return (
      <>
        <p>Home</p>
        <view>        
          <PieChart width={400} height={400}>
            <Pie data={outerdata} dataKey="value" outerRadius={90} fill="#82ca9d" label />
          </PieChart>
        </view>
      </>
    );
  };
  
export default PieChart1;