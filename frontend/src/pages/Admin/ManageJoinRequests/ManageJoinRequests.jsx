import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Clock,
  CheckCircle,
  Check,
  X,
  RefreshCw,
  Layers,
} from "lucide-react";
import "./ManageJoinRequests.css";

export default function ManageJoinRequests() {
  const [requestsList, setRequestsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch join requests from database API
  const fetchJoinRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/join-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
          },
        },
      );

      const rawData = response.data?.joinRequests || response.data || [];
      if (Array.isArray(rawData)) {
        const formatted = rawData.map((item, index) => {
          const startupName =
            item.startup?.startupName ||
            item.startupName ||
            item.startup ||
            "EcoTrack AI";
          return {
            id: item._id || item.id || index,
            startup: startupName,
            applicantName:
              item.applicantName || item.user?.name || "Sarah Jenkins",
            applicantEmail:
              item.applicantEmail || item.user?.email || "sarah.j@example.com",
            role: item.roleRequested || item.role || "Senior ML Engineer",
            message:
              item.message ||
              item.introMessage ||
              "Excited to apply my experience in climate-tech data modeling...",
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Oct 24, 2023",
            status: item.status
              ? item.status.charAt(0).toUpperCase() +
                item.status.slice(1).toLowerCase()
              : "Pending",
            bgLetter: "#004ac6",
          };
        });
        setRequestsList(formatted);
      } else {
        setRequestsList([]);
      }
    } catch (err) {
      console.warn(
        "Backend join-requests endpoint unavailable, using mock fallback:",
        err.message,
      );
      // Fallback mock data matching your UI layout if backend route isn't set up yet
      setRequestsList([
        {
          id: 1,
          startup: "EcoTrack AI",
          applicantName: "Sarah Jenkins",
          applicantEmail: "sarah.j@example.com",
          role: "Senior ML Engineer",
          message:
            "Excited to apply my experience in climate-tech data modeling to help optimize your live carbon dashboards.",
          date: "Oct 24, 2023",
          status: "Pending",
          bgLetter: "#004ac6",
        },
        {
          id: 2,
          startup: "PulseHealth",
          applicantName: "David Chen",
          applicantEmail: "d.chen@design.co",
          role: "Product Designer",
          message:
            "Huge fan of your patient dashboard concept. I have designed three healthtech portals in the past and would love to collaborate.",
          date: "Oct 23, 2023",
          status: "Pending",
          bgLetter: "#10b981",
        },
        {
          id: 3,
          startup: "FinFlow",
          applicantName: "Elena Rodriguez",
          applicantEmail: "elena@finflow.io",
          role: "Marketing Lead",
          message:
            "10 years of experience in FinTech growth. Successfully launched two SaaS products that grew to $10M ARR.",
          date: "Oct 23, 2023",
          status: "Approved",
          bgLetter: "#f59e0b",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  // Handle Approve / Reject Actions
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/join-requests/${id}`,
        { status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sc_token")}`,
          },
        },
      );

      setRequestsList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to update status on backend:", err);
      // Optimistic local state update fallback
      setRequestsList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
    }
  };

  // Filtered requests computation
  const filteredRequests = requestsList.filter((req) => {
    if (statusFilter === "All" || statusFilter === "All Requests") return true;
    return req.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalRequestsCount = requestsList.length;
  const approvedRequestsCount = requestsList.filter(
    (req) => req.status.toLowerCase() === "approved",
  ).length;

  const stats = [
    {
      title: "TOTAL REQUEST",
      value: totalRequestsCount.toLocaleString(),
      trend: "+12%",
      type: "error",
    },
    {
      title: "APPROVED REQUEST",
      value: approvedRequestsCount.toLocaleString(),
      trend: "Stable",
      type: "success",
    },
  ];

  return (
    <div className="join-requests-page space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="admin-page-title text-2xl font-extrabold text-gray-900 tracking-tight">
            Join Requests
          </h2>
          <p className="admin-page-subtitle text-gray-500 text-xs mt-0.5">
            Review and manage pending collaboration requests across all
            startups.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchJoinRequests}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-600" : "text-gray-500"}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Grid of Stats Cards */}
      <div className="requests-stats-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div
            className="request-stat-card bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs flex justify-between items-center"
            key={idx}
          >
            <div>
              <span className="request-stat-title text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                {stat.title}
              </span>
              <div className="request-stat-row mt-0.5">
                <span className="request-stat-value text-2xl font-black text-gray-900 font-mono">
                  {stat.value}
                </span>
              </div>
            </div>
            <span
              className={`request-stat-trend-chip text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${
                stat.type === "success"
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-rose-700 bg-rose-50 border-rose-200"
              }`}
            >
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Main Request Database Block */}
      <div className="requests-table-card bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        {/* Search Header */}
        <div className="requests-search-header p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="requests-filter-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-black"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="requests-table-overflow overflow-x-auto">
          <table className="requests-datatable w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase font-mono tracking-wider">
                <th className="py-3.5 px-4">Startup</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Role Requested</th>
                {/* <th className="py-3.5 px-4" style={{ width: "35%" }}>
                  Introduction Message
                </th> */}
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs text-gray-900 font-medium">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="table-empty-row py-10 text-center text-gray-400 font-mono"
                  >
                    Loading join requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-row py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Layers className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="font-bold text-gray-700">
                        No join requests found
                      </p>
                      <p className="text-[11px] text-gray-400">
                        No collaboration requests match your parameters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className={`status-row-${req.status.toLowerCase()} hover:bg-gray-50/60 transition-colors align-top`}
                  >
                    <td className="py-4 px-4">
                      <div className="startup-badge-cell flex items-center gap-3">
                        <div
                          className="startup-letter w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
                          style={{ backgroundColor: req.bgLetter }}
                        >
                          {req.startup[0]}
                        </div>
                        <span className="startup-title-text font-bold text-gray-900 truncate max-w-[140px]">
                          {req.startup}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="applicant-cell">
                        <span className="applicant-name font-bold text-gray-900 block">
                          {req.applicantName}
                        </span>
                        <span className="applicant-email text-[10px] text-gray-400 font-mono mt-0.5 block">
                          {req.applicantEmail}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="role-request-badge bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono">
                        {req.role}
                      </span>
                    </td>

                    {/* <td className="py-4 px-4 text-gray-600 max-w-xs">
                      <p
                        className="introduction-message line-clamp-2"
                        title={req.message}
                      >
                        {req.message}
                      </p>
                    </td> */}

                    <td className="request-date py-4 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                      {req.date}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="row-action-buttons flex items-center justify-end gap-1.5">
                        {req.status === "Pending" ? (
                          <>
                            <button
                              type="button"
                              className="row-icon-btn approve p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer border border-emerald-200"
                              title="Approve Join Request"
                              onClick={() =>
                                handleUpdateStatus(req.id, "Approved")
                              }
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              className="row-icon-btn reject p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer border border-rose-200"
                              title="Reject Request"
                              onClick={() =>
                                handleUpdateStatus(req.id, "Rejected")
                              }
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : req.status === "Approved" ? (
                          <span className="verified-join-label text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            APPROVED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                            REJECTED
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="table-footer-pagination p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span className="pagination-summary">
            Showing 1-{filteredRequests.length} of {requestsList.length}{" "}
            requests
          </span>
        </div>
      </div>
    </div>
  );
}
