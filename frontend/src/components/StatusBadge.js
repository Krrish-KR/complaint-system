// ============================================================
// components/StatusBadge.js - Color-coded Status Indicator
// ============================================================

import React from "react";

const StatusBadge = ({ status }) => {
  // Color mapping for each status
  const statusConfig = {
    "Pending": {
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      border: "border-amber-500/30",
      dot: "bg-amber-400",
    },
    "In Progress": {
      bg: "bg-blue-500/15",
      text: "text-blue-400",
      border: "border-blue-500/30",
      dot: "bg-blue-400",
    },
    "Resolved": {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      dot: "bg-emerald-400",
    },
  };

  const config = statusConfig[status] || statusConfig["Pending"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
        ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
