import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const Home = () => {
  const data1 = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 500, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page E", uv: 630, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 455, pv: 2400, amt: 2400 },
    { name: "Page G", uv: 125, pv: 2400, amt: 2400 },
    { name: "Page H", uv: 400, pv: 2400, amt: 2400 },
  ];
  const data2 = [
    { name: "Page E", uv: 630, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 455, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page G", uv: 125, pv: 2400, amt: 2400 },
    { name: "Page H", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 500, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 400, pv: 2400, amt: 2400 },
  ];
  const data3 = [
    { name: "Page B", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 500, pv: 2400, amt: 2400 },
    { name: "Page G", uv: 125, pv: 2400, amt: 2400 },
    { name: "Page H", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page E", uv: 630, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 455, pv: 2400, amt: 2400 },
  ];
  
  return (
    <>
      <p>Home</p>
      <view>
        <LineChart width={400} height={400} data={data1}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>
        <LineChart width={400} height={400} data={data2}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>
        <LineChart width={400} height={400} data={data3}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>
      </view>
    </>
  );
};

export default Home;
