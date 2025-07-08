import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from './pages/Signup';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  return (
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
  );
}

export default App;
