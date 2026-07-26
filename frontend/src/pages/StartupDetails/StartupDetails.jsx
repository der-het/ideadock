import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Landmark,
  Calendar,
  Users,
  FileText,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Send,
  X,
  AlertCircle,
} from "lucide-react";
import "./StartupDetails.css";

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    startups = [],
    bookmarks = [],
    joinRequests = [],
    sendPitch,
    currentUser,
  } = useApp();

  // Normalize startups array
  const startupList = useMemo(() => {
    if (Array.isArray(startups)) return startups;
    if (Array.isArray(startups?.startups)) return startups.startups;
    if (Array.isArray(startups?.data)) return startups.data;
    return [];
  }, [startups]);

  // Find startup based on ID (handles both MongoDB _id and string id)
  const startup = useMemo(() => {
    const targetId = (id || "").toLowerCase();
    const found = startupList.find(
      (s) => (s._id || s.id || "").toString().toLowerCase() === targetId,
    );
    return found || startupList[0] || {};
  }, [startupList, id]);

  const startupId = startup._id || startup.id;

  // Safe array guards
  const skills = Array.isArray(startup.skills) ? startup.skills : [];
  const stack = Array.isArray(startup.stack) ? startup.stack : [];
  const roles = Array.isArray(startup.roles) ? startup.roles : [];

  // Join Request states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [pitchNote, setPitchNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Check if user has already requested any roles for this startup
  const startupRequests = useMemo(() => {
    const safeRequests = Array.isArray(joinRequests) ? joinRequests : [];
    return safeRequests.filter(
      (req) =>
        req.startupId === startupId ||
        req.startup?._id === startupId ||
        req.ventureId === startupId,
    );
  }, [joinRequests, startupId]);

  const handleOpenJoinModal = (role) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSelectedRole(role);
    setShowJoinModal(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (sendPitch) {
        await sendPitch({
          startupId: startupId,
          ventureName: startup.name || startup.startupName,
          founderName: startup.founderName || "Venture Owner",
          roleTitle: selectedRole?.title || "Co-Founder / Partner",
          pitchNote,
        });
      }

      setShowJoinModal(false);
      setPitchNote("");
      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting pitch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen relative">
      {/* Back to Directory */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </Link>

      {/* Dynamic Success Toast */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 max-w-md w-full"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <h5 className="font-bold text-xs">Join Request Dispatched!</h5>
              <p className="text-[10px] text-gray-400">
                Your pitch note and profile card have been logged in the
                founder's pitch pipeline.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="ml-auto p-1 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Block */}
      <div className="bg-white border border-gray-100 p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-6">
          <div className="text-left space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                {startup.name || startup.startupName || "Venture Details"}
              </h1>
              {startup.stage && (
                <span className="bg-black text-white text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {startup.stage}
                </span>
              )}
              {(startup.category?.name || startup.category) && (
                <span className="bg-gray-100 text-gray-700 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {startup.category?.name || startup.category}
                </span>
              )}
            </div>

            <p className="text-gray-500 font-medium font-mono text-xs max-w-xl">
              {startup.tagline}
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-400 font-medium font-mono">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-300" />
                <span>{startup.location || "Remote"}</span>
              </div>
              {startup.funding && (
                <div className="flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-gray-300" />
                  <span>{startup.funding} raised</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto border-t border-gray-50 md:border-0 pt-4 md:pt-0">
          <button
            onClick={() =>
              handleOpenJoinModal(
                roles[0] || {
                  id: "generic",
                  title: "Co-Founder / Partner",
                  salary: "Equity-based",
                },
              )
            }
            disabled={startupRequests.length > 0}
            className={`flex-grow md:flex-none px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
              startupRequests.length > 0
                ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            {startupRequests.length > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-amber-600" />
                Pitch Sent
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                Join Venture
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* About Card */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-4">
            <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Vision & Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {startup.description || "No full description provided."}
            </p>
          </div>

          {/* Tech Stack & Required Skills Card */}
          {(skills.length > 0 || stack.length > 0) && (
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-5">
              <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider">
                Capabilities & Stack
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.length > 0 && (
                  <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
                    <h4 className="font-bold text-xs text-gray-700 font-mono uppercase tracking-wider">
                      Required Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-900 shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {stack.length > 0 && (
                  <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
                    <h4 className="font-bold text-xs text-gray-700 font-mono uppercase tracking-wider">
                      Active Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-500 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Open Roles Card */}
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
                    (r) => r.roleTitle === role.title || r.roleId === role.id,
                  );

                  return (
                    <div
                      key={role.id || idx}
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
                        onClick={() => handleOpenJoinModal(role)}
                        disabled={isRoleRequested}
                        className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isRoleRequested
                            ? "bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-900"
                        }`}
                      >
                        {isRoleRequested ? "Pitch Sent" : "Submit Pitch"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 text-left">
          {/* Quick Metrics */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">
              Venture Parameters
            </h4>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-gray-50">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-300" /> Founded
                </span>
                <span className="font-bold text-gray-900 font-mono">
                  {startup.founded || "2024"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-gray-50">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-300" /> Size
                </span>
                <span className="font-bold text-gray-900 font-mono">
                  {startup.size || "2-5 members"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-gray-300" /> Capital Pool
                </span>
                <span className="font-bold text-indigo-600 font-mono">
                  {startup.funding || "Bootstrapped"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pitch Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinModal(false)}
              className="fixed inset-0 bg-black z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 z-50 shadow-2xl overflow-hidden border border-gray-100 text-left"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Co-Founder Syndicate Pitch
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-lg mt-1.5">
                    Apply for {selectedRole?.title || "Co-Founder"}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {startup.name || startup.startupName} &bull;{" "}
                    {selectedRole?.salary || "Equity"}
                  </p>
                </div>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                    Introduce Yourself & Pitch Note
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your matching capabilities, related projects you have scaled, and why you are excited to build with this venture captain..."
                    value={pitchNote}
                    onChange={(e) => setPitchNote(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-black outline-hidden text-xs transition-colors bg-gray-50/50 leading-relaxed font-sans"
                  />
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
                  <AlertCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-indigo-950">
                      Identity Sync Active
                    </p>
                    <p className="text-[10px] text-indigo-700 leading-normal">
                      Submitting will securely attach your profile metrics to
                      the founding dashboard of{" "}
                      {startup.name || startup.startupName}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 py-3 border border-gray-200 hover:border-black rounded-xl text-xs font-bold transition-all text-gray-500 hover:text-black cursor-pointer text-center bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-black hover:bg-gray-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Pitch
                      </>
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
