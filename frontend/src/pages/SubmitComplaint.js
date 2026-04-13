// ============================================================
// pages/SubmitComplaint.js - Submit a new complaint form
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

const SubmitComplaint = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim()) {
      return setError("Both title and description are required.");
    }
    if (formData.description.trim().length < 10) {
      return setError("Description must be at least 10 characters.");
    }

    setLoading(true);
    try {
      await api.post("/complaints", formData);
      setSuccess(true);
      // Redirect to dashboard after short delay
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
            My Complaints
          </Link>
          <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-300">New Complaint</span>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">Submit a Complaint</h1>
            <p className="text-slate-400 text-sm mt-1">
              Describe your issue in detail and we'll get back to you.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">Complaint submitted successfully!</p>
                <p className="text-emerald-500 text-xs mt-0.5">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Complaint Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of your issue"
                maxLength={100}
                required
                disabled={success}
                className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all disabled:opacity-50"
              />
              <p className="text-slate-600 text-xs mt-1 text-right">
                {formData.title.length}/100
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your complaint in detail. Include any relevant context or supporting information..."
                rows={6}
                maxLength={1000}
                required
                disabled={success}
                className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
              />
              <p className="text-slate-600 text-xs mt-1 text-right">
                {formData.description.length}/1000
              </p>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
              <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-500 text-xs leading-relaxed">
                Your complaint will be assigned <span className="text-amber-400">Pending</span> status initially.
                An admin will review and update the status as it progresses.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link
                to="/dashboard"
                className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-lg text-sm transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
