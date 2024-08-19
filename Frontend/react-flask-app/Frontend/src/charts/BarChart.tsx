import {  BarChart, Bar, Rectangle, CartesianGrid,  XAxis,  YAxis,  Tooltip, ResponsiveContainer,} from "recharts";

const BarChart1 = () => {
  const data = [
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
  ];

  return (
    <>
      <view>
        <div style={{ width: '100%', height: 300 }}>
            <BarChart width={600 } height={300} data={data} margin={{ top: 5, right: 30, left: 0, bottom: 0}}>
            <XAxis dataKey="name" />
            <YAxis dataKey="quantity" />
            <Tooltip />
            <Bar
              dataKey="quantity"
              fill="#B3CDAD"
              barSize={40}
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            </BarChart>
        </div>
      </view>
    </>
  );
};

export default BarChart1;
