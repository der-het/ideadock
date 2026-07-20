import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Landmark, Calendar, Users, Bookmark, FileText, ChevronRight,
  Sparkles, CheckCircle, ArrowLeft, Send, X, AlertCircle, Share2
} from 'lucide-react';
import { SIMILAR_OPPORTUNITIES, IMAGES } from '../../constants/data.js';
import './StartupDetails.css';

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startups, bookmarks, joinRequests, toggleBookmark, submitJoinRequest, currentUser } = useApp();

  // Find startup based on ID (defaults to solarisgrid if not specified or not found)
  const startup = useMemo(() => {
    const found = startups.find(s => s.id === (id || '').toLowerCase());
    return found || startups.find(s => s.id === 'solarisgrid') || startups[0];
  }, [startups, id]);

  const isBookmarked = bookmarks.includes(startup.id);

  // Join Request states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [pitchNote, setPitchNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Check if user has already requested any roles for this startup
  const startupRequests = useMemo(() => {
    return joinRequests.filter(req => req.startupId === startup.id);
  }, [joinRequests, startup.id]);

  const handleOpenJoinModal = (role) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setSelectedRole(role);
    setShowJoinModal(true);
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitJoinRequest(startup.id, selectedRole.id, selectedRole.title, pitchNote);
      setIsSubmitting(false);
      setShowJoinModal(false);
      setPitchNote('');
      setShowSuccessNotification(true);
      
      // Auto dismiss success bar
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen relative">
      
      {/* Back to Browse */}
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
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <div className="text-left">
              <h5 className="font-bold text-xs">Join Request Dispatched!</h5>
              <p className="text-[10px] text-gray-400">Your co-founder brief has been logged in Elena's dashboard pipeline.</p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="ml-auto p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Block */}
      <div className="bg-white border border-gray-100 p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Subtle accent light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-6">
          {/* Logo container */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center p-2 shrink-0">
            <img
              src={startup.image}
              alt={startup.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="text-left space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                {startup.name}
              </h1>
              <span className="bg-black text-white text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {startup.stage}
              </span>
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {startup.category}
              </span>
            </div>

            <p className="text-gray-500 font-medium font-mono text-xs max-w-xl">
              {startup.tagline}
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-400 font-medium font-mono">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-300" />
                <span>{startup.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Landmark className="w-4 h-4 text-gray-300" />
                <span>{startup.funding} raised</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Action items */}
        <div className="flex items-center gap-3 w-full md:w-auto border-t border-gray-50 md:border-0 pt-4 md:pt-0">
          <button
            onClick={() => toggleBookmark(startup.id)}
            className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              isBookmarked
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:text-black hover:border-black'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Venture Bookmarked' : 'Bookmark Venture'}
          </button>

          <button
            onClick={() => handleOpenJoinModal(startup.roles[0] || { id: 'generic', title: 'Co-founder/Collaborator' })}
            disabled={startupRequests.length > 0}
            className={`flex-grow md:flex-none px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
              startupRequests.length > 0
                ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                : 'bg-black hover:bg-gray-900 text-white'
            }`}
          >
            {startupRequests.length > 0 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Request Pending
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

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Bento Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* About Card */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-4">
            <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Vision & Deep Mechanics
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {startup.description}
            </p>
          </div>

          {/* Tech Stack & Required Skills Bento Card */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-5">
            <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider">
              Engineering Matrix & Stack
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target capabilities */}
              <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-gray-700 font-mono uppercase tracking-wider">Required Capabilities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {startup.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-900 shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies deployed */}
              <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-gray-700 font-mono uppercase tracking-wider">Active Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {startup.stack.map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-500 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Open Positions Card */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-base font-mono uppercase tracking-wider">
                Open Co-Founding Roles
              </h3>
              <span className="text-xs text-gray-400 font-mono font-bold uppercase">{startup.roles.length} roles available</span>
            </div>

            <div className="space-y-4">
              {startup.roles.map((role) => {
                const isRequested = joinRequests.some(r => r.roleId === role.id);
                return (
                  <div
                    key={role.id}
                    className="p-5 border border-gray-100 hover:border-gray-200 bg-gray-50/50 rounded-2xl transition-all flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{role.title}</h4>
                        <span className="bg-white px-2 py-0.5 border border-gray-100 rounded-md text-[9px] font-bold font-mono text-gray-400 uppercase">
                          {role.type}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 font-bold font-mono">{role.salary}</p>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-xl">{role.description}</p>
                    </div>

                    <button
                      onClick={() => handleOpenJoinModal(role)}
                      disabled={isRequested}
                      className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isRequested
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      {isRequested ? 'Request Logged' : 'Submit Pitch'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          {/* Founder Bio Card */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Founding Captain</h4>
            
            <div className="flex items-center gap-4">
              <img
                src={startup.founder.avatar}
                alt={startup.founder.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div>
                <h5 className="font-extrabold text-gray-900 text-sm">{startup.founder.name}</h5>
                <p className="text-xs text-gray-500 font-mono font-medium">{startup.founder.title}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed italic bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              "{startup.founder.bio}"
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Venture Parameters</h4>
            
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-gray-50">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-300" /> Founded
                </span>
                <span className="font-bold text-gray-900 font-mono">{startup.founded}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-gray-50">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-300" /> Size
                </span>
                <span className="font-bold text-gray-900 font-mono">{startup.size}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-gray-300" /> Capital Pool
                </span>
                <span className="font-bold text-indigo-600 font-mono">{startup.funding}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Opportunities Section */}
      <section className="mt-16 pt-12 border-t border-gray-100 text-left">
        <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Similar Opportunities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SIMILAR_OPPORTUNITIES.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              to={`/startup/${item.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs hover:border-black transition-all flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border bg-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                  <span className="bg-gray-100 px-1.5 py-0.2 rounded-md text-[8px] font-bold font-mono text-gray-400 uppercase">{item.stage}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono truncate">{item.category} &bull; {item.location}</p>
                <p className="text-[11px] text-gray-500 truncate">{item.tagline}</p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Join Request Pitch Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinModal(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Modal Box */}
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
                    Apply for {selectedRole?.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{startup.name} &bull; {selectedRole?.salary}</p>
                </div>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
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
                    <p className="text-xs font-bold text-indigo-950">Identity Sync Active</p>
                    <p className="text-[10px] text-indigo-700 leading-normal">
                      Submitting will securely attach your full profile metrics, projects log, and skills catalog to the founding dashboard of {startup.name}.
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
                    className="flex-1 py-3 bg-black hover:bg-gray-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Encrypting...
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
