import {  CartesianGrid,  XAxis,  YAxis, Tooltip, Area, AreaChart, ResponsiveContainer} from "recharts";

const LineChart1 = () => {
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
            <AreaChart
              width={600}
              height={300}
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 0}}
            >
              <Area type="monotone" dataKey="uv" stroke="#0096C7" fill="#0096C7" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </AreaChart>
        </div>
      </view>
    </>
  );
};

export default LineChart1;
