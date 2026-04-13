// ============================================================
// components/PrivateRoute.js - Protect Routes by Auth & Role
// ============================================================

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protects a route - redirects to login if not authenticated
// If `adminOnly` prop is true, also checks for admin role
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // Wait until auth state is loaded from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route but user is not admin, redirect to dashboard
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
