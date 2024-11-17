import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Screens/HomeScreen"
import Admin from "../Screens/AdminScreen";
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../Screens/LoginScreen';
import FullGraphScreen from "../charts/FullGraphScreen";


const Navigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/full-graph" element={<FullGraphScreen />} />
      </Routes>
    </Router>
  );
};

export default Navigation;