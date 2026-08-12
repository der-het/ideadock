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
  Radar,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const { currentUser, user, bookmarks = [], startups = [] } = useApp();

  // =====================================================
  // ACTIVE USER
  // =====================================================

  const activeUser = currentUser || user;
  const userId = activeUser?._id || activeUser?.id;

  // =====================================================
  // USER REQUESTS
  // Keep the old working backend connection
  // =====================================================

  const [userRequests, setUserRequests] = useState([]);

  // =====================================================
  // STARTUPS FOR RADAR
  // =====================================================

  const [radarStartups, setRadarStartups] = useState([]);
  const [radarLoading, setRadarLoading] = useState(true);

  // =====================================================
  // ADMIN REDIRECT
  // =====================================================

  useEffect(() => {
    if (activeUser?.role === "admin") {
      navigate("/admin/startups", {
        replace: true,
      });
    }
  }, [activeUser, navigate]);

  // =====================================================
  // FETCH USER REQUESTS
  // OLD BACKEND CONNECTION PRESERVED
  // =====================================================

  useEffect(() => {
    if (!userId) return;

    const fetchUserRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/requests/user/${userId}`);

        const reqs = res.data.requests || res.data.data || res.data;

        setUserRequests(Array.isArray(reqs) ? reqs : []);
      } catch (err) {
        console.error(
          "Error fetching user requests:",
          err.response?.data || err,
        );

        setUserRequests([]);
      }
    };

    fetchUserRequests();

    // Refresh request status periodically.
    // This allows Approved / Rejected changes
    // to appear without manually refreshing.
    const interval = setInterval(fetchUserRequests, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  // =====================================================
  // FETCH APPROVED STARTUPS FOR RADAR
  // BACKEND:
  // GET /api/startups
  // =====================================================

  useEffect(() => {
    const fetchRadarStartups = async () => {
      try {
        setRadarLoading(true);

        const res = await axios.get(`${API_URL}/startups`);

        const data = res.data.startups || res.data.data || res.data;

        if (Array.isArray(data)) {
          setRadarStartups(data);
        } else {
          setRadarStartups([]);
        }
      } catch (err) {
        console.error(
          "Error fetching radar startups:",
          err.response?.data || err,
        );

        setRadarStartups([]);
      } finally {
        setRadarLoading(false);
      }
    };

    fetchRadarStartups();

    // Keep radar synchronized with approved startups.
    const interval = setInterval(fetchRadarStartups, 10000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  useEffect(() => {
    if (!activeUser) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [activeUser, navigate]);

  // =====================================================
  // RECOMMENDATIONS
  // Existing data kept from old Dashboard
  // =====================================================

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

  // =====================================================
  // RADAR POSITIONS
  // =====================================================

  const radarPositions = [
    {
      top: "10%",
      left: "50%",
    },
    {
      top: "24%",
      left: "77%",
    },
    {
      top: "52%",
      left: "88%",
    },
    {
      top: "78%",
      left: "73%",
    },
    {
      top: "88%",
      left: "50%",
    },
    {
      top: "73%",
      left: "23%",
    },
    {
      top: "48%",
      left: "12%",
    },
    {
      top: "24%",
      left: "25%",
    },
  ];

  // =====================================================
  // OPEN STARTUP
  // =====================================================

  const handleRadarStartupClick = (startup) => {
    const startupId = startup?._id || startup?.id;

    if (!startupId) return;

    /*
      Change this route ONLY if your existing
      startup-details route uses another path.
    */
    navigate(`/startup/${startupId}`);
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!activeUser) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Terminal Panel</p>

            <h1 className="dashboard-title">
              Welcome back, <span>{userName.split(" ")[0]}</span>
            </h1>

            <p className="dashboard-subtitle">
              Your co-founder matching matrix is fully synchronized. Review
              recommendations and pitch logs.
            </p>
          </div>

          <Link to="/profile" className="dashboard-profile-button">
            <FileEdit className="w-4 h-4" />
            Edit Identity Card
          </Link>
        </div>

        {/* =================================================
            VENTURE RADAR
        ================================================= */}

        <section className="venture-radar-card">
          <div className="venture-radar-header">
            <div>
              <div className="venture-radar-label">
                <Radar className="w-4 h-4" />
                Venture Radar
              </div>

              <h2>Find your next orbit.</h2>

              <p>Live approved ventures from the venture directory.</p>
            </div>

            <div className="venture-radar-counter">
              <strong>{radarStartups.length}</strong>

              <span>ventures</span>
            </div>
          </div>

          {/* =================================================
              RADAR
          ================================================= */}

          <div className="radar-stage">
            {/* Orbit rings */}

            <div className="radar-ring radar-ring-large" />

            <div className="radar-ring radar-ring-small" />

            {/* Cross */}

            <div className="radar-cross radar-cross-horizontal" />

            <div className="radar-cross radar-cross-vertical" />

            {/* Decorative dots */}

            <span className="radar-decoration radar-dot-one" />
            <span className="radar-decoration radar-dot-two" />
            <span className="radar-decoration radar-dot-three" />
            <span className="radar-decoration radar-dot-four" />

            {/* =================================================
                USER
            ================================================= */}

            <div className="radar-user">
              <div className="radar-user-pulse" />

              <div className="radar-user-core">
                {userName.charAt(0).toUpperCase()}
              </div>

              <span>YOU</span>
            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {radarLoading && (
              <div className="radar-center-message">Scanning ventures...</div>
            )}

            {/* =================================================
                STARTUP NODES
            ================================================= */}

            {!radarLoading &&
              radarStartups.slice(0, 8).map((startup, index) => {
                const position = radarPositions[index];

                if (!position) {
                  return null;
                }

                const startupId = startup?._id || startup?.id || index;

                const startupName =
                  startup?.startupName || startup?.name || "Venture";

                const category =
                  startup?.category?.name || startup?.category || "Startup";

                return (
                  <button
                    key={startupId}
                    type="button"
                    className="radar-node"
                    style={{
                      top: position.top,
                      left: position.left,
                    }}
                    onClick={() => handleRadarStartupClick(startup)}
                    aria-label={`Open ${startupName}`}
                  >
                    <span className="radar-node-pulse" />

                    <span className="radar-node-core">
                      {startupName.charAt(0).toUpperCase()}
                    </span>

                    <span className="radar-node-tooltip">
                      <strong>{startupName}</strong>

                      <small>{category}</small>

                      <span>
                        View venture
                        <ArrowUpRight />
                      </span>
                    </span>
                  </button>
                );
              })}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!radarLoading && radarStartups.length === 0 && (
              <div className="radar-empty">
                <span>No approved ventures detected</span>

                <Link to="/browse">Explore ventures →</Link>
              </div>
            )}
          </div>

          {/* =================================================
              RADAR FOOTER
          ================================================= */}

          <div className="venture-radar-footer">
            <div className="radar-legend">
              <span className="legend-live-dot" />

              <span>Live from venture directory</span>
            </div>

            <Link to="/browse" className="radar-explore-link">
              Explore all ventures
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* =================================================
            ACTIVE PITCH LOGS
        ================================================= */}

        <div className="pitch-logs-section">
          <div className="pitch-logs-card">
            <div className="pitch-logs-header">
              <h3>Active Pitch Logs</h3>

              <span>{userRequests.length} Logged</span>
            </div>

            <div className="pitch-table-wrapper">
              <table className="pitch-table">
                <thead>
                  <tr>
                    <th>Venture</th>

                    <th>Role Requested</th>

                    <th>Status</th>

                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
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
                        ? `https://wa.me/${whatsappNumber.replace(
                            /[^0-9]/g,
                            "",
                          )}`
                        : null;

                      return (
                        <tr key={request._id || request.id || index}>
                          {/* Venture */}

                          <td className="venture-name-cell">{ventureName}</td>

                          {/* Role */}

                          <td className="role-cell">
                            {request.roleRequested || "General"}
                          </td>

                          {/* Status */}

                          <td>
                            {status === "approved" && (
                              <span className="status-badge status-approved">
                                Approved
                              </span>
                            )}

                            {status === "rejected" && (
                              <span className="status-badge status-rejected">
                                Rejected
                              </span>
                            )}

                            {status === "pending" && (
                              <span className="status-badge status-pending">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Action */}

                          <td className="action-cell">
                            {status === "approved" ? (
                              whatsappLink ? (
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="whatsapp-button"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Connect on WhatsApp
                                </a>
                              ) : (
                                <span className="approved-text">Approved</span>
                              )
                            ) : status === "rejected" ? (
                              <span className="closed-text">Closed</span>
                            ) : (
                              <span className="awaiting-text">
                                Awaiting Review
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty-pitches">
                        <div>
                          <Inbox className="empty-icon" />

                          <p>No pitch requests sent yet</p>

                          <span>
                            Browse active venture opportunities and send your
                            first co-founder pitch.
                          </span>

                          <Link to="/browse" className="explore-button">
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
