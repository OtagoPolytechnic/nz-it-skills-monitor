import { PieChart, Pie } from "recharts";

const PieChart1 = () => {  
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
          <PieChart width={650} height={300}>
            <Pie data={outerdata} dataKey="value" outerRadius={90} fill="#82ca9d" label />
          </PieChart>
        </view>
      </>
    );
  };
  
export default PieChart1;