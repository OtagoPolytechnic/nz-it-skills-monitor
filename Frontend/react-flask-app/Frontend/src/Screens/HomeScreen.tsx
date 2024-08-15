import {
  Area,
  AreaChart,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { BarChart, Bar, ResponsiveContainer, Rectangle } from "recharts";
import React, { PureComponent } from "react";

const Home = () => {
  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];
  const data1 = [
    { name: "Page A", uv: 30, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 20, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 40, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 3, pv: 2400, amt: 2400 },
    { name: "Page E", uv: 43, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 35, pv: 2400, amt: 2400 },
    { name: "Page G", uv: 75, pv: 2400, amt: 2400 },
    { name: "Page H", uv: 30, pv: 2400, amt: 2400 },
  ];
  const data2 = [
    { name: "Page A", uv: 530, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 455, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 125, pv: 2400, amt: 2400 },
    { name: "Page E", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 500, pv: 2400, amt: 2400 },
    { name: "Page G", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page H", uv: 400, pv: 2400, amt: 2400 },
  ];
  const data3 = [
    { name: "Page A", uv: 13, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 4, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 5, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 15, pv: 2400, amt: 2400 },
    { name: "Page E", uv: 19, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 7, pv: 2400, amt: 2400 },
    { name: "Page G", uv: 3, pv: 2400, amt: 2400 },
    { name: "Page H", uv: 1, pv: 2400, amt: 2400 },
  ];

  return (
    <>
      <p>Home</p>
      <view>
        <LineChart width={400} height={400} data={data1}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>

        <LineChart
          width={600}
          height={300}
          data={data2}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#0096C7" fill="#0096C7" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>

        <LineChart
          width={600}
          height={300}
          data={data3}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>

        <BarChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="uv"
            fill="#B3CDAD"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="pv"
            fill="#FF5F5E"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </view>
    </>
  );
};

export default Home;
