// ============================================================
// pages/UserDashboard.js - View complaints submitted by logged-in user
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import StatusBadge from "../components/StatusBadge";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" = all

  // Fetch complaints whenever filter changes
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const params = statusFilter ? { status: statusFilter } : {};
        const res = await api.get("/complaints", { params });
        setComplaints(res.data.complaints);
      } catch (err) {
        setError("Failed to load complaints. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [statusFilter]);

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Count complaints by status for summary cards
  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Complaints</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-violet-400">{user?.email}</span>
            </p>
          </div>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-violet-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Complaint
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.total, color: "text-slate-300", bg: "bg-slate-800/60" },
            { label: "Pending", value: counts.pending, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "In Progress", value: counts.inProgress, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Resolved", value: counts.resolved, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border border-slate-700/50 rounded-xl p-4`}>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-slate-400 text-sm">Filter:</span>
          {["", "Pending", "In Progress", "Resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No complaints found</p>
            <p className="text-slate-600 text-sm mt-1">
              {statusFilter ? `No ${statusFilter} complaints` : "Submit your first complaint to get started"}
            </p>
            <Link
              to="/submit"
              className="inline-flex mt-4 items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
            >
              Submit a complaint →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-white font-semibold text-base truncate">{complaint.title}</h3>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed line-clamp-2">
                      {complaint.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-800">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-500 text-xs">Submitted {formatDate(complaint.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
