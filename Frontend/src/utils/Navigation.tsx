import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Screens/HomeScreen"
import Admin from "../Screens/AdminScreen";

const Navigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default Navigation;