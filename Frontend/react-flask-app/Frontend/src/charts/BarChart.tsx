import {  BarChart, Bar, Rectangle, CartesianGrid,  XAxis,  YAxis,  Tooltip, ResponsiveContainer,} from "recharts";

const BarChart1 = () => {
  const data = [
    { name: "Page A", uv: 30, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 20, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 40, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 3, pv: 2400, amt: 2400 },
    { name: "Page E", uv: 43, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 35, pv: 2400, amt: 2400 },
    { name: "Page G", uv: 75, pv: 2400, amt: 2400 },
    { name: "Page H", uv: 30, pv: 2400, amt: 2400 },
  ];

  return (
    <>
      <view>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
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
          </ResponsiveContainer>
        </div>
      </view>
    </>
  );
};

export default BarChart1;
