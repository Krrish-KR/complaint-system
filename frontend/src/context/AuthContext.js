// ============================================================
// context/AuthContext.js - Global Auth State Management
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// ---- AuthProvider Component ----
// Wrap the entire app with this to provide auth state everywhere
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Stores user info
  const [token, setToken] = useState(null); // Stores JWT token
  const [loading, setLoading] = useState(true); // Loading state while checking localStorage

  // ---- On App Load: Restore Session from localStorage ----
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ---- Login: Save to state and localStorage ----
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ---- Logout: Clear state and localStorage ----
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);
