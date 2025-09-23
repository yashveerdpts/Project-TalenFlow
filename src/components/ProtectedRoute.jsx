// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If not logged in, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render children routes
  return <Outlet />;
};

export default ProtectedRoute;
