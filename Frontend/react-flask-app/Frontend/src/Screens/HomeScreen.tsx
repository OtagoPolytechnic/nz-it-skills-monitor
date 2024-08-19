import BarChart1 from "../charts/BarChart";
import LineChart1 from "../charts/linechart1";
import LineChart2 from "../charts/linechart2";
import LineChart3 from "../charts/linechart3";
import PieChart1 from "../charts/PieChart";

const Home = () => {
  return (
    <>
      <p>Home</p>
      <div className="grid grid-cols-2 gap-40">
        <LineChart1></LineChart1>
        <LineChart2></LineChart2>
      </div>
      
      <div className="grid grid-cols-2 gap-40">
        <BarChart1></BarChart1>
        <LineChart3></LineChart3>
      </div>
        <PieChart1></PieChart1>
    </>
  );
};

export default Home;
