import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { motion } from 'motion/react';
import {
  Sparkles, Bookmark, Send, ShieldAlert, CheckCircle, ArrowRight, X, Clock,
  User, LayoutDashboard, Brain, FileEdit, Award, Zap
} from 'lucide-react';
import { IMAGES } from '../../constants/data.js';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, bookmarks, joinRequests, startups, toggleBookmark } = useApp();

  // If not logged in, redirect to login
  if (!currentUser) {
    setTimeout(() => {
      navigate('/login');
    }, 0);
    return null;
  }

  // Calculate Profile Completeness Score
  const completeness = useMemo(() => {
    let score = 25; // Base score for having an account
    if (currentUser.bio) score += 20;
    if (currentUser.skills && currentUser.skills.length > 0) score += 20;
    if (currentUser.experience && currentUser.experience.length > 0) score += 15;
    if (currentUser.projects && currentUser.projects.length > 0) score += 20;
    return score;
  }, [currentUser]);

  // Find bookmarked startups from listing list
  const bookmarkedStartups = useMemo(() => {
    return startups.filter(s => bookmarks.includes(s.id));
  }, [startups, bookmarks]);

  // Recommended ideas matching user skills
  const recommendations = useMemo(() => {
    // Return custom recommended cards matching aesthetic
    return [
      {
        id: 'eco-logistics',
        title: 'Eco-conscious Logistics',
        category: 'Green Energy',
        match: '94% Match',
        description: 'Multi-modal green freight matching ledger using real-time solar tracking nodes.',
        tag: 'Recommended Vector'
      },
      {
        id: 'safecloud-ai',
        title: 'SafeCloud AI',
        category: 'Cyber Security',
        match: '88% Match',
        description: 'Autonomous zero-knowledge threat containment pipelines for medical servers.',
        tag: 'Fresh Opportunity'
      },
      {
        id: 'neuralflow-work',
        title: 'NeuralFlow Workplace',
        category: 'AI & Neural Networks',
        match: '81% Match',
        description: 'Decentralized spatial audio channels mapped with live collaboration canvases.',
        tag: 'Fast Scaling'
      }
    ];
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen text-left">
      {/* Header greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-gray-100 mb-8">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">Terminal Panel</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Welcome back, <span className="bg-linear-to-r from-black via-indigo-950 to-gray-800 bg-clip-text text-transparent">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Your co-founder matching matrix is fully synchronized. Review recommendations and pitch logs.
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
        {/* Left Side: Diagnostics and Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Profile authenticity progress box */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-2 flex-1 text-left">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded-md text-[9px] font-bold text-indigo-700 uppercase tracking-wider font-mono">
                <Award className="w-3 h-3" /> Profile Authenticity
              </span>
              <h3 className="font-extrabold text-gray-900 text-base">Your Syndicate Identity is {completeness}% Completed</h3>
              <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                Adding professional experience items, tech stack details, and co-founder pitches increases your credential authority score.
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>Candidate Verified</span>
                  <span>Goal 100%</span>
                </div>
              </div>
            </div>

            <Link
              to="/profile"
              className="bg-black hover:bg-gray-900 text-white text-xs font-semibold px-4.5 py-3 rounded-xl shadow-xs shrink-0 shrink-0 text-center"
            >
              Complete Profile
            </Link>
          </div>

          {/* Recommended vectors list */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Recommended Vectors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs hover:border-indigo-200 transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase font-mono">
                      <span className="text-indigo-600">{item.tag}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-md">{item.match}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h4>
                    <p className="text-[11px] text-gray-400 font-mono font-medium">{item.category}</p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.description}</p>
                  </div>

                  <Link
                    to="/browse"
                    className="mt-4 text-xs font-bold text-black flex items-center gap-1 hover:underline pt-2 border-t border-gray-50"
                  >
                    Investigate Venture
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Active Join Pitch Logs */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs text-left space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-500" />
                Outgoing Co-Founder Pitches
              </h3>
              <span className="text-xs text-gray-400 font-mono font-bold uppercase">{joinRequests.length} filed</span>
            </div>

            {joinRequests.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-gray-400">No pitch requests currently in transmission.</p>
                <Link to="/browse" className="text-xs font-bold text-black underline">Browse listings and submit a pitch &rarr;</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {joinRequests.map((req) => {
                  const startupObj = startups.find(s => s.id === req.startupId);
                  return (
                    <div key={req.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link to={`/startup/${req.startupId}`} className="font-bold text-gray-900 hover:underline text-sm">
                            {startupObj?.name || req.startupId}
                          </Link>
                          <span className="bg-gray-100 text-gray-400 font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                            {req.roleTitle}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 italic line-clamp-1">"{req.note || 'No pitch brief written.'}"</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Saved Bookmarks Rail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.2rem] p-6 shadow-xs text-left space-y-5">
            <h3 className="font-extrabold text-gray-900 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-500 fill-indigo-500/10" />
              Bookmarked Listings ({bookmarks.length})
            </h3>

            {bookmarkedStartups.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-400">Save listing cards to monitor changes.</p>
                <Link to="/browse" className="text-xs font-bold text-black underline block">Explore Directory</Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {bookmarkedStartups.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 border border-gray-100 hover:border-gray-300 bg-gray-50/50 rounded-2xl transition-all flex items-center gap-3 group relative"
                  >
                    <div className="w-11 h-11 rounded-lg border overflow-hidden shrink-0 bg-white p-1">
                      <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="min-w-0 text-left pr-4">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/startup/${s.id}`} className="font-bold text-gray-900 hover:underline text-xs truncate">
                          {s.name}
                        </Link>
                        <span className="bg-indigo-50 text-indigo-600 font-mono text-[8px] font-bold px-1.5 py-0.2 rounded-md uppercase">
                          {s.stage}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{s.category}</p>
                      <p className="text-[11px] text-gray-500 truncate">{s.tagline}</p>
                    </div>

                    {/* Quick remove bookmark */}
                    <button
                      onClick={() => toggleBookmark(s.id)}
                      className="absolute top-1/2 -translate-y-1/2 right-2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove bookmark"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Platform stats / tips */}
          <div className="bg-black text-white rounded-[2rem] p-6 text-left space-y-3 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="bg-white/10 p-2.5 rounded-xl inline-block">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            </div>
            <h4 className="font-extrabold text-sm leading-tight">Pro co-founder tip</h4>
            <p className="text-[11px] text-gray-400 leading-normal">
              Keep your professional experience block detailed. Founders rely on real portfolio credentials when responding to co-founder requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
