// ============================================================
// components/Navbar.js - Top Navigation Bar
// ============================================================

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to={user?.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              ComplaintDesk
            </span>
          </Link>

          {/* Navigation Links & User Info */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Admin Links */}
              {user.role === "admin" ? (
                <Link
                  to="/admin"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    My Complaints
                  </Link>
                  <Link
                    to="/submit"
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Submit
                  </Link>
                </>
              )}

              {/* User Badge */}
              <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-slate-300 text-xs truncate max-w-[120px]">
                  {user.email}
                </span>
                {user.role === "admin" && (
                  <span className="text-xs bg-violet-600 text-white px-1.5 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
