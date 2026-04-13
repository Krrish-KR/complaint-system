// ============================================================
// pages/AdminDashboard.js - Admin view: all complaints + status update
// ============================================================

import React, { useState, useEffect } from "react";
import api from "../utils/api";
import StatusBadge from "../components/StatusBadge";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null); // ID of complaint being updated

  // Fetch all complaints (admin endpoint)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const params = statusFilter ? { status: statusFilter } : {};
        const res = await api.get("/complaints/all", { params });
        setComplaints(res.data.complaints);
      } catch (err) {
        setError("Failed to fetch complaints.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [statusFilter]);

  // Handle status update from dropdown
  const handleStatusChange = async (complaintId, newStatus) => {
    setUpdating(complaintId);
    try {
      const res = await api.put(`/complaints/${complaintId}`, { status: newStatus });
      // Update the local state so UI updates immediately without refetch
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId ? { ...c, status: res.data.complaint.status } : c
        )
      );
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Summary counts
  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400 text-sm pl-11">
            Manage all user complaints and update their status.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.total, color: "text-slate-300", bg: "bg-slate-800/60", border: "border-slate-700/50" },
            { label: "Pending", value: counts.pending, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { label: "In Progress", value: counts.inProgress, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Resolved", value: counts.resolved, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-4`}>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-slate-400 text-sm">Filter by status:</span>
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

        {/* Complaints Table */}
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
              {statusFilter ? `No ${statusFilter} complaints at this time` : "No complaints have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className={`bg-slate-900 border border-slate-700/50 rounded-xl p-5 transition-all ${
                  updating === complaint._id ? "opacity-60" : "hover:border-slate-600/50"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-white font-semibold text-base">{complaint.title}</h3>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                      {complaint.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {complaint.userId?.email || "Unknown user"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(complaint.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status Updater */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <label className="text-slate-500 text-xs font-medium whitespace-nowrap">
                      Update status:
                    </label>
                    <div className="relative">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                        disabled={updating === complaint._id}
                        className="appearance-none bg-slate-800 border border-slate-600 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      {/* Dropdown chevron */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        {updating === complaint._id ? (
                          <svg className="animate-spin w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
