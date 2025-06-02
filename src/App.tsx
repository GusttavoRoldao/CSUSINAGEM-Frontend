import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomersList from "./pages/CustomersList";
import Register from "./pages/Register";
import CategoryPage from "./pages/CategoryPage";
import UnderConstruction from "./components/UnderConstruction";

export default function App() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/customers" element={isLoggedIn ? <CustomersList /> : <Navigate to="/login" />} />
        <Route path="/category/:id" element={isLoggedIn ?<CategoryPage />: <Navigate to="/login" />} />
        <Route path="/feature" element={isLoggedIn ?<UnderConstruction />: <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        
        
      </Routes>
    </Router>
  );
}
