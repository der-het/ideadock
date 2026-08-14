import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { motion, AnimatePresence } from "motion/react";

import {
  MapPin,
  Landmark,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  CheckCircle2,
  ArrowLeft,
  Send,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

import "./StartupDetails.css";

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { joinRequests = [], submitJoinRequest, currentUser } = useApp();

  // =====================================================
  // STARTUP API STATE
  // =====================================================

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH STARTUP BY ID
  // =====================================================

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Startup ID is missing.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/startups/${id}`,
        );

        const data = await response.json();

        console.log("Startup API Response:", data);

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch startup");
        }

        setStartup(data.startup);
      } catch (err) {
        console.error("Error fetching startup:", err);

        setError(err.message || "Unable to load startup details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [id]);

  // =====================================================
  // SAFE ARRAYS
  // =====================================================

  const skills = Array.isArray(startup?.requiredSkills)
    ? startup.requiredSkills
    : [];

  const stack = Array.isArray(startup?.stack) ? startup.stack : [];

  const roles = Array.isArray(startup?.roles) ? startup.roles : [];

  // =====================================================
  // STARTUP ID
  // =====================================================

  const startupId = startup?._id || startup?.id;
  const noSeatsAvailable =
    startup?.seatsNeeded !== undefined &&
    startup?.seatsNeeded !== null &&
    Number(startup.seatsNeeded) <= 0;

  // =====================================================
  // PITCH MODAL STATES
  // =====================================================

  const [showJoinModal, setShowJoinModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");

  const [selectedRoleId, setSelectedRoleId] = useState("general_role");

  const [pitchNote, setPitchNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [showErrorNotification, setShowErrorNotification] = useState("");

  // =====================================================
  // CHECK IF USER ALREADY PITCHED
  // =====================================================

  const isPitchSent = (idToCheck) => {
    if (!idToCheck) {
      return false;
    }

    const safeRequests = Array.isArray(joinRequests) ? joinRequests : [];

    return safeRequests.some((req) => {
      const requestStartupId =
        req.startupId ||
        req.ventureId ||
        req.startup?._id ||
        req.startup?.id ||
        req.startup;

      return requestStartupId?.toString() === idToCheck.toString();
    });
  };

  const hasPitched = isPitchSent(startupId);

  // =====================================================
  // STARTUP REQUESTS
  // =====================================================

  const startupRequests = useMemo(() => {
    const safeRequests = Array.isArray(joinRequests) ? joinRequests : [];

    return safeRequests.filter((req) => {
      const requestStartupId =
        req.startupId ||
        req.ventureId ||
        req.startup?._id ||
        req.startup?.id ||
        req.startup;

      return requestStartupId?.toString() === startupId?.toString();
    });
  }, [joinRequests, startupId]);

  // =====================================================
  // SHOW ALREADY JOINED MESSAGE
  // =====================================================

  const showAlreadyJoinedMessage = () => {
    setShowErrorNotification(
      "You have already submitted a pitch for this startup.",
    );

    setTimeout(() => {
      setShowErrorNotification("");
    }, 5000);
  };

  // =====================================================
  // OPEN MAIN SEND PITCH MODAL
  // =====================================================

  const handleOpenPitchModal = (startupData) => {
    if (Number(startupData?.seatsNeeded) <= 0) {
      setShowErrorNotification("This startup is currently full.");
      return;
    }

    const targetStartupId = startupData?._id || startupData?.id;

    if (isPitchSent(targetStartupId)) {
      showAlreadyJoinedMessage();
      return;
    }

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSelectedRole("");
    setSelectedRoleId("general_role");
    setPitchNote("");

    setShowJoinModal(true);
  };

  // =====================================================
  // OPEN ROLE-SPECIFIC PITCH MODAL
  // =====================================================

  const handleOpenJoinModal = (role) => {
    if (noSeatsAvailable) {
      setShowErrorNotification("This startup is currently full.");

      setTimeout(() => {
        setShowErrorNotification("");
      }, 5000);

      return;
    }

    if (hasPitched) {
      showAlreadyJoinedMessage();
      return;
    }

    // rest of your existing code...
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClosePitchModal = () => {
    if (isSubmitting) {
      return;
    }

    setShowJoinModal(false);
    setSelectedRole("");
    setSelectedRoleId("general_role");
    setPitchNote("");
  };

  // =====================================================
  // SEND PITCH
  // =====================================================

  const handleSendRequest = async (e) => {
    e.preventDefault();

    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    if (!currentUser) {
      navigate("/login");
      return;
    }

    // -------------------------------------------------
    // ALREADY JOINED CHECK
    // -------------------------------------------------

    if (hasPitched) {
      showAlreadyJoinedMessage();
      return;
    }

    // -------------------------------------------------
    // STARTUP ID CHECK
    // -------------------------------------------------

    if (!startupId) {
      console.error("Startup ID is missing.");
      return;
    }

    // -------------------------------------------------
    // ROLE CHECK
    // -------------------------------------------------

    if (!selectedRole.trim()) {
      return;
    }

    // -------------------------------------------------
    // MESSAGE CHECK
    // -------------------------------------------------

    if (!pitchNote.trim()) {
      return;
    }

    // -------------------------------------------------
    // CONTEXT FUNCTION CHECK
    // -------------------------------------------------

    if (typeof submitJoinRequest !== "function") {
      console.error("submitJoinRequest is not available in AppContext.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitJoinRequest(
        startupId,
        selectedRoleId,
        selectedRole.trim(),
        pitchNote.trim(),
      );

      // -------------------------------------------------
      // BACKEND ERROR
      // -------------------------------------------------

      if (!result?.success) {
        const message =
          result?.message ||
          "You have already submitted a pitch for this startup.";

        setShowJoinModal(false);

        setShowErrorNotification(message);

        setTimeout(() => {
          setShowErrorNotification("");
        }, 5000);

        return;
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setShowJoinModal(false);

      setSelectedRole("");

      setSelectedRoleId("general_role");

      setPitchNote("");

      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting pitch:", err);

      const backendMessage = err?.response?.data?.message;

      setShowErrorNotification(
        backendMessage ||
          "You have already submitted a pitch for this startup.",
      );

      setTimeout(() => {
        setShowErrorNotification("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />

          <p className="text-sm text-gray-500 font-mono">
            Loading startup details...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error || !startup) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <div className="bg-white border border-red-100 rounded-[2rem] p-10 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />

          <h2 className="text-lg font-bold text-gray-900">
            Unable to load startup
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {error || "Startup not found."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen relative">
      {/* =====================================================
          BACK TO DIRECTORY
      ===================================================== */}

      <Link
        to="/browse"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </Link>

      {/* =====================================================
          SUCCESS NOTIFICATION
      ===================================================== */}

      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 max-w-md w-full"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

            <div className="text-left">
              <h5 className="font-bold text-xs">Pitch Sent Successfully!</h5>

              <p className="text-[10px] text-gray-400">
                Your pitch has been sent to the startup founder.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessNotification(false)}
              className="ml-auto p-1 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          ERROR NOTIFICATION
      ===================================================== */}

      <AnimatePresence>
        {showErrorNotification && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-200 max-w-md w-full"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />

            <div className="text-left">
              <h5 className="font-bold text-xs">Already Joined</h5>

              <p className="text-[10px] text-gray-500">
                {showErrorNotification}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowErrorNotification("")}
              className="ml-auto p-1 text-gray-400 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div className="bg-white border border-gray-100 p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl pointer-events-none" />

        {/* STARTUP INFORMATION */}

        <div className="flex items-start gap-6 relative z-10">
          <div className="text-left space-y-2">
            {/* NAME + CATEGORY */}

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                {startup.startupName || startup.name || "Venture Details"}
              </h1>

              {startup.status && (
                <span className="bg-black text-white text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {startup.status}
                </span>
              )}

              {(startup.category?.name || startup.category) && (
                <span className="bg-gray-100 text-gray-700 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {startup.category?.name || startup.category}
                </span>
              )}
            </div>

            {/* DESCRIPTION / TAGLINE */}

            <p className="text-gray-500 font-medium font-mono text-xs max-w-xl">
              {startup.tagline ||
                startup.shortDescription ||
                "Build something meaningful with the right people."}
            </p>

            {/* STARTUP METADATA */}

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-400 font-medium font-mono">
              {startup.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-300" />

                  <span>{startup.location}</span>
                </div>
              )}

              {startup.funding && (
                <div className="flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-gray-300" />

                  <span>{startup.funding}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEND PITCH BUTTON */}

        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto border-t border-gray-50 md:border-0 pt-4 md:pt-0">
          <button
            type="button"
            onClick={() => handleOpenPitchModal(startup)}
            disabled={hasPitched || noSeatsAvailable}
            className={`w-full md:w-auto px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
              hasPitched
                ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-default"
                : noSeatsAvailable
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 hover:shadow-md cursor-pointer"
            }`}
          >
            {hasPitched ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Pitch Sent
              </>
            ) : noSeatsAvailable ? (
              <>
                <Users className="w-4 h-4" />
                Startup Full
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Pitch
              </>
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          GRID
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =====================================================
            MAIN COLUMN
        ===================================================== */}

        <div className="lg:col-span-8 space-y-6">
          {/* =====================================================
              ABOUT
          ===================================================== */}

          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-4">
            <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Vision & Description
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {startup.description || "No full description provided."}
            </p>
          </div>

          {/* =====================================================
              REQUIRED SKILLS
          ===================================================== */}

          {skills.length > 0 && (
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-5">
              <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider">
                Required Capabilities
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-900 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================
              TECH STACK
          ===================================================== */}

          {stack.length > 0 && (
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-5">
              <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider">
                Active Tech Stack
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {stack.map((tech, index) => (
                  <span
                    key={`${tech}-${index}`}
                    className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-500 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================
              OPEN ROLES
          ===================================================== */}

          {roles.length > 0 && (
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider">
                  Open Co-Founding Roles
                </h3>

                <span className="text-xs text-gray-400 font-mono font-bold uppercase">
                  {roles.length} available
                </span>
              </div>

              <div className="space-y-4">
                {roles.map((role, idx) => {
                  const isRoleRequested = startupRequests.some(
                    (r) =>
                      r.roleTitle === role.title ||
                      r.roleId === role.id ||
                      r.roleId === role._id,
                  );

                  return (
                    <div
                      key={role.id || role._id || idx}
                      className="p-5 border border-gray-100 hover:border-gray-200 bg-gray-50/50 rounded-2xl transition-all flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {role.title}
                          </h4>

                          {role.type && (
                            <span className="bg-white px-2 py-0.5 border border-gray-100 rounded-md text-[9px] font-bold font-mono text-gray-400 uppercase">
                              {role.type}
                            </span>
                          )}
                        </div>

                        {role.salary && (
                          <p className="text-xs text-indigo-600 font-bold font-mono">
                            {role.salary}
                          </p>
                        )}

                        {role.description && (
                          <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                            {role.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenJoinModal(role)}
                        disabled={
                          isRoleRequested || hasPitched || noSeatsAvailable
                        }
                        className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isRoleRequested || hasPitched
                            ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed"
                            : noSeatsAvailable
                              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-900 cursor-pointer"
                        }`}
                      >
                        {isRoleRequested || hasPitched ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pitch Sent
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Submit Pitch
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <div className="lg:col-span-4 space-y-6 text-left">
          {/* =====================================================
              QUICK METRICS
          ===================================================== */}

          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">
              Venture Parameters
            </h4>

            <div className="space-y-3.5">
              {/* FOUNDED */}

              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-gray-50">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-300" />
                  Founded
                </span>

                <span className="font-bold text-gray-900 font-mono">
                  {startup.founded || "Not specified"}
                </span>
              </div>

              {/* SIZE */}

              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-gray-50">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-300" />
                  Size
                </span>

                <span className="font-bold text-gray-900 font-mono">
                  {startup.size || "Not specified"}
                </span>
              </div>

              {/* FUNDING */}

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-gray-300" />
                  Capital Pool
                </span>

                <span className="font-bold text-indigo-600 font-mono">
                  {startup.funding || "Not specified"}
                </span>
              </div>

              {/* SEATS */}

              <div className="flex justify-between items-center text-xs pt-2.5 border-t border-gray-50">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-300" />
                  Available Seats
                </span>

                <span className="font-bold text-gray-900 font-mono">
                  {startup.seatsNeeded ?? "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================
              FOUNDER INFORMATION
          ===================================================== */}
        </div>
      </div>

      {/* =====================================================
          PITCH MODAL
      ===================================================== */}

      <AnimatePresence>
        {showJoinModal && (
          <>
            {/* BACKDROP */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 0.45,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={handleClosePitchModal}
              className="fixed inset-0 bg-black z-50"
            />

            {/* MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:right-auto md:inset-x-auto bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 z-50 shadow-2xl border border-gray-100 text-left"
            >
              {/* MODAL HEADER */}

              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">
                    Pitch to {startup.startupName || startup.name || "Startup"}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2">
                    Specify your desired role and introduce yourself to the
                    founder.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClosePitchModal}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM */}

              <form onSubmit={handleSendRequest} className="space-y-4">
                {/* ROLE */}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Role You Are Requesting
                  </label>

                  <input
                    type="text"
                    required
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full h-11 px-4 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-700 outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* INTRODUCTION */}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Introduction Message
                  </label>

                  <textarea
                    rows={5}
                    required
                    value={pitchNote}
                    onChange={(e) => setPitchNote(e.target.value)}
                    placeholder="Share your experience and why you want to join..."
                    className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 text-xs text-gray-700 outline-none focus:border-black focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* INFO */}

                <div className="flex items-start gap-2 text-[10px] text-gray-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />

                  <p>
                    Your profile information will be shared with the startup
                    founder along with your pitch.
                  </p>
                </div>

                {/* ACTION BUTTONS */}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleClosePitchModal}
                    disabled={isSubmitting}
                    className="flex-1 h-11 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:border-gray-400 hover:text-black transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !selectedRole.trim() || !pitchNote.trim()
                    }
                    className="flex-1 h-11 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>Submit Pitch</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
