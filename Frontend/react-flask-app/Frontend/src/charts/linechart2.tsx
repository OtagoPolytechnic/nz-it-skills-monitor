import {  LineChart,  Line,  CartesianGrid,  XAxis,  YAxis, Tooltip} from "recharts";

const LineChart2 = () => {
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

  return (
    <>
      <view>
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
        </view>
    </>
  );
};

export default LineChart2;
