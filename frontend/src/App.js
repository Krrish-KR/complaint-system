// ============================================================
// App.js - Root component with React Router setup
// ============================================================

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected user routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <PrivateRoute>
                <SubmitComplaint />
              </PrivateRoute>
            }
          />

          {/* Protected admin route */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all: redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
