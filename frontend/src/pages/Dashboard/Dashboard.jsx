import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import {
  Sparkles,
  ArrowRight,
  FileEdit,
  Send,
  Inbox,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, user, bookmarks = [], startups = [] } = useApp();

  // Active user reference
  const activeUser = currentUser || user;
  const userId = activeUser?._id || activeUser?.id;

  // Local user requests state to guarantee direct fetching
  const [userRequests, setUserRequests] = useState([]);

  // Auto-redirect admin users immediately to the Admin Panel
  useEffect(() => {
    if (activeUser?.role === "admin") {
      navigate("/admin/startups", { replace: true });
    }
  }, [activeUser, navigate]);

  // Fetch user requests directly on mount
  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_URL}/requests/user/${userId}`)
        .then((res) => {
          const reqs = res.data.requests || res.data.data || res.data;
          setUserRequests(Array.isArray(reqs) ? reqs : []);
        })
        .catch((err) => console.error("Error fetching user requests:", err));
    }
  }, [userId]);

  // If not logged in, redirect to login
  if (!activeUser) {
    setTimeout(() => {
      navigate("/login");
    }, 0);
    return null;
  }

  // Recommended ideas matching user skills
  const recommendations = useMemo(() => {
    return [
      {
        id: "eco-logistics",
        title: "Eco-conscious Logistics",
        category: "Green Energy",
        match: "94% Match",
        description:
          "Multi-modal green freight matching ledger using real-time solar tracking nodes.",
        tag: "Recommended Vector",
      },
      {
        id: "safecloud-ai",
        title: "SafeCloud AI",
        category: "Cyber Security",
        match: "88% Match",
        description:
          "Autonomous zero-knowledge threat containment pipelines for medical servers.",
        tag: "Fresh Opportunity",
      },
      {
        id: "neuralflow-work",
        title: "NeuralFlow Workplace",
        category: "AI & Neural Networks",
        match: "81% Match",
        description:
          "Decentralized spatial audio channels mapped with live collaboration canvases.",
        tag: "Fast Scaling",
      },
    ];
  }, []);

  const userName = activeUser?.name || activeUser?.fullName || "Builder";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen text-left">
      {/* Header greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-gray-100 mb-8">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">
            Terminal Panel
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-black via-indigo-950 to-gray-800 bg-clip-text text-transparent">
              {userName.split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Your co-founder matching matrix is fully synchronized. Review
            recommendations and pitch logs.
          </p>
        </div>

        <Link
          to="/profile"
          className="bg-white border border-gray-200 hover:border-black font-semibold text-xs text-gray-700 hover:text-black px-4.5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-2xs"
        >
          <FileEdit className="w-4 h-4 text-gray-400" />
          Edit Identity Card
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Top-Left: Recommended Vectors (8 cols) */}

        {/* Bottom Full Row: Active Pitch Logs Table (12 cols) */}
        <div className="lg:col-span-12 mt-2">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-gray-900">
                Active Pitch Logs
              </h3>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase">
                {userRequests.length} Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase font-mono">
                    <th className="py-3 px-2">Venture</th>
                    <th className="py-3 px-2">Role Requested</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-900 font-medium">
                  {userRequests && userRequests.length > 0 ? (
                    userRequests.map((request, index) => {
                      const status = request.status?.toLowerCase() || "pending";
                      const ventureName =
                        request.startup?.startupName ||
                        request.startup?.name ||
                        request.ventureName ||
                        "Venture Project";

                      const whatsappNumber = request.startup?.whatsappNumber;
                      const whatsappLink = whatsappNumber
                        ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`
                        : null;

                      return (
                        <tr
                          key={request._id || request.id || index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          {/* Venture Name */}
                          <td className="py-4 px-2 font-bold text-gray-900">
                            {ventureName}
                          </td>

                          {/* Role Requested */}
                          <td className="py-4 px-2 text-gray-600 font-mono text-xs">
                            {request.roleRequested || "General"}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-2">
                            {status === "approved" && (
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Approved
                              </span>
                            )}
                            {status === "rejected" && (
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                                Rejected
                              </span>
                            )}
                            {status === "pending" && (
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Action Column */}
                          <td className="py-4 px-2 text-right">
                            {status === "approved" ? (
                              whatsappLink ? (
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Connect on WhatsApp
                                </a>
                              ) : (
                                <span className="text-xs font-semibold text-emerald-600">
                                  Approved
                                </span>
                              )
                            ) : status === "rejected" ? (
                              <span className="text-xs font-semibold text-gray-400">
                                Closed
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-amber-600">
                                Awaiting Review
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <Inbox className="w-8 h-8 text-gray-300 mx-auto" />
                          <p className="text-sm font-bold text-gray-800">
                            No pitch requests sent yet
                          </p>
                          <p className="text-xs text-gray-400">
                            Browse active venture opportunities and send your
                            first co-founder pitch.
                          </p>
                          <Link
                            to="/browse"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-black px-4 py-2 rounded-xl shadow-xs hover:bg-gray-800 transition-all"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Explore Opportunities
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
