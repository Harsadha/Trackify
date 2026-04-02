// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar     from "./components/Navbar";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Dashboard  from "./pages/Dashboard";
import ReportItem from "./pages/ReportItem";
import MyItems    from "./pages/MyItems";
import ItemDetail from "./pages/ItemDetail";

// Redirects to /login if not authenticated
const Private = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

// Redirects to / if already logged in
const Guest = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return !user ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <div className="page-shell">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/login"     element={<Guest><Login /></Guest>} />
          <Route path="/register"  element={<Guest><Register /></Guest>} />
          <Route path="/report"    element={<Private><ReportItem /></Private>} />
          <Route path="/my-items"  element={<Private><MyItems /></Private>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
