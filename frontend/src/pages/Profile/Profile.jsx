import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Briefcase, Code, Award, FileText, CheckCircle, X, Save,
  Users, Bookmark, FolderGit, Edit3, Sparkles, MessageSquare, Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { currentUser, updateProfile, bookmarks, startups } = useApp();

  // Redirect or default if no user is signed in
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <Compass className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
        <h3 className="font-extrabold text-gray-900 text-lg">No Session Active</h3>
        <p className="text-xs text-gray-500">Please sign in to view your candidate identity card.</p>
        <Link to="/login" className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-block shadow-xs">
          Sign In
        </Link>
      </div>
    );
  }

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Edit Drawer state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.name);
  const [editedTitle, setEditedTitle] = useState(currentUser.title || '');
  const [editedLocation, setEditedLocation] = useState(currentUser.location || '');
  const [editedBio, setEditedBio] = useState(currentUser.bio || '');
  const [editedSkillsString, setEditedSkillsString] = useState(
    currentUser.skills ? currentUser.skills.join(', ') : ''
  );
  const [showNotification, setShowNotification] = useState(false);

  // Bookmarked startups
  const bookmarkedStartups = useMemo(() => {
    return startups.filter(s => bookmarks.includes(s.id));
  }, [startups, bookmarks]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    const skillsArray = editedSkillsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    updateProfile({
      name: editedName,
      title: editedTitle,
      location: editedLocation,
      bio: editedBio,
      skills: skillsArray,
    });

    setShowEditModal(false);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen relative text-left">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-bold text-xs">Credentials updated successfully!</span>
            <button onClick={() => setShowNotification(false)} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover / Header section */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 mb-8 shadow-xs">
        {/* Cover Photo */}
        <div className="h-44 md:h-60 relative w-full overflow-hidden bg-indigo-950">
          <img
            src={currentUser.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'}
            alt="Profile cover banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
        </div>

        {/* User profile overlapping header */}
        <div className="p-6 md:p-8 pt-0 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-10 sm:-mt-16 md:-mt-20 relative z-10">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
            
            <div className="text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 font-mono">
                {currentUser.title || 'Product Architect & Engineer'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium font-mono pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-gray-300" />
                <span>{currentUser.location || 'San Francisco, CA'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto self-stretch md:self-auto shrink-0 pb-1">
            <button
              onClick={() => {
                setEditedName(currentUser.name);
                setEditedTitle(currentUser.title || '');
                setEditedLocation(currentUser.location || '');
                setEditedBio(currentUser.bio || '');
                setEditedSkillsString(currentUser.skills ? currentUser.skills.join(', ') : '');
                setShowEditModal(true);
              }}
              className="flex-1 sm:flex-none px-4.5 py-3 border border-gray-200 hover:border-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-gray-700 bg-white cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-gray-400" />
              Customize Identity
            </button>
          </div>
        </div>
      </div>

      {/* Quick Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Endorsements</p>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-1">{currentUser.stats?.endorsements || 42}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Teams Joined</p>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-1">{currentUser.stats?.teamsJoined || 4}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Saved Leads</p>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-1">{bookmarks.length}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-2xs text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Connections</p>
          <p className="text-2xl font-extrabold text-gray-900 font-mono mt-1">{currentUser.connections || 184}</p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main tabs view (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab buttons */}
          <div className="flex border-b border-gray-100 overflow-x-auto gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
              { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'projects', label: 'Projects Log', icon: <FolderGit className="w-4 h-4" /> },
              { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-black text-black font-extrabold'
                    : 'border-transparent text-gray-400 hover:text-black hover:border-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="pt-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Bio card */}
                <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-4">
                  <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-wider">Candidate Bio</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {currentUser.bio || 'Please customize your co-founder card to write a personalized bio.'}
                  </p>
                </div>

                {/* Tech Skills Box */}
                <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-4">
                  <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-wider">Technical Capability Lattice</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills && currentUser.skills.length > 0 ? (
                      currentUser.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-900 rounded-lg shadow-2xs font-mono uppercase">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No specific technical capabilities selected. Customize your profile to select skills.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-6">
                <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-wider">Corporate Timeline</h3>
                
                {currentUser.experience && currentUser.experience.length > 0 ? (
                  <div className="space-y-6 relative border-l-2 border-gray-50 pl-6 ml-3">
                    {currentUser.experience.map((exp, idx) => (
                      <div key={idx} className="relative space-y-2">
                        {/* Timeline node */}
                        <div className="absolute -left-[31px] top-1 w-4.5 h-4.5 bg-white border-2 border-black rounded-full" />
                        
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm leading-snug">{exp.role}</h4>
                          <p className="text-xs text-indigo-600 font-bold font-mono">{exp.company} &bull; {exp.period}</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-xl">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-xs text-gray-400">No professional experience entries mapped.</p>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="text-xs font-bold text-black underline hover:text-indigo-600"
                    >
                      Update professional timeline
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-6">
                <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-wider">Systems & Portfolio Log</h3>

                {currentUser.projects && currentUser.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentUser.projects.map((proj, idx) => (
                      <div key={idx} className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl text-left space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-gray-900 text-sm leading-snug">{proj.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{proj.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-white border border-gray-100 text-[10px] font-semibold text-gray-500 font-mono rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-xs text-gray-400">No portfolio projects logged.</p>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="text-xs font-bold text-black underline"
                    >
                      Log first portfolio project
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-4">
                {bookmarkedStartups.length === 0 ? (
                  <div className="bg-white border border-gray-100 p-12 rounded-[2rem] text-center space-y-3">
                    <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
                    <h4 className="font-bold text-gray-900 text-sm">No bookmarks active</h4>
                    <p className="text-xs text-gray-400">Save active listings to monitor co-founding contracts here.</p>
                    <Link to="/browse" className="text-xs font-bold text-black underline block">Browse directory</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedStartups.map((s) => (
                      <div key={s.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center gap-4 text-left shadow-2xs hover:border-black transition-all group relative">
                        <div className="w-12 h-12 rounded-xl border p-1 shrink-0 bg-gray-50">
                          <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0 pr-4">
                          <Link to={`/startup/${s.id}`} className="font-bold text-gray-900 text-sm hover:underline block truncate">
                            {s.name}
                          </Link>
                          <p className="text-[10px] text-gray-400 font-mono truncate">{s.category} &bull; {s.stage}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{s.tagline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar credentials review rail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.2rem] p-6 shadow-xs text-left space-y-5">
            <h3 className="font-extrabold text-gray-900 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2.5">
              <Users className="w-4 h-4 text-indigo-500" />
              Ecosystem Status
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Availability</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-mono">Available to Co-found</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Verification</span>
                <span className="font-bold text-gray-900 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/10" /> Vetted Tier 1
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Response Rate</span>
                <span className="font-bold text-gray-900 font-mono">100% Instant</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-left space-y-4">
            <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest font-mono">Candidate Endorsement</h4>
            
            <div className="space-y-3">
              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-gray-200/50">
                <p className="text-xs text-gray-500 italic">"Sarah possesses rare, dense product design capabilities. She singlehandedly spearheaded Airbnb's internal UI framework upgrade."</p>
                <p className="text-[10px] font-bold text-gray-900 font-mono mt-1">&mdash; Marcus Zhang, VP Airbnb</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide out / Overlay modal for profile customizing */}
      <AnimatePresence>
        {showEditModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Customize panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-50 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-500 fill-indigo-500/10" />
                    Customize Identity Card
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-4.5 h-4.5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5 text-left">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Candidate Name</label>
                    <input
                      type="text"
                      required
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-sm transition-colors bg-gray-50/50"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Professional Subtitle</label>
                    <input
                      type="text"
                      required
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-sm transition-colors bg-gray-50/50"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono font-mono">Location Headquarters</label>
                    <input
                      type="text"
                      required
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-sm transition-colors bg-gray-50/50"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Personal Vision Statement</label>
                    <textarea
                      rows={4}
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-black outline-hidden text-xs transition-colors bg-gray-50/50 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Capabilities Lattice (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Figma, Next.js, Rust, CUDA"
                      value={editedSkillsString}
                      onChange={(e) => setEditedSkillsString(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-xs transition-colors bg-gray-50/50 font-mono"
                    />
                  </div>
                </form>
              </div>

              <div className="border-t border-gray-100 pt-6 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 border border-gray-200 hover:border-black rounded-xl font-bold text-xs text-gray-500 hover:text-black bg-white transition-all cursor-pointer text-center"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 bg-black hover:bg-gray-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Identity
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
