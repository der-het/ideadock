import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  FileText,
  CheckCircle,
  X,
  Save,
  Bookmark,
  Edit3,
  Sparkles,
  Compass,
  Loader2,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const {
    currentUser,
    user,
    updateProfile,
    bookmarks = [],
    startups = [],
    joinRequests = [],
  } = useApp();

  // Handle active user reference
  const activeUser = currentUser || user;

  // Edit Drawer state
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedSkillsString, setEditedSkillsString] = useState("");

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [showNotification, setShowNotification] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic calculations for stats
  const dynamicTeamsJoined = useMemo(() => {
    if (!Array.isArray(joinRequests)) return 0;
    return joinRequests.filter(
      (req) => req.status === "accepted" || req.status === "approved",
    ).length;
  }, [joinRequests]);

  const dynamicEndorsements =
    activeUser?.endorsements ?? activeUser?.stats?.endorsements ?? 0;

  // Redirect or default if no user is signed in
  if (!activeUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <Compass className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
        <h3 className="font-extrabold text-gray-900 text-lg">
          No Session Active
        </h3>
        <p className="text-xs text-gray-500">
          Please sign in to view your candidate identity card.
        </p>
        <Link
          to="/login"
          className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-block shadow-xs"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Safely extract startup array
  const startupList = Array.isArray(startups)
    ? startups
    : startups?.startups || [];

  // Bookmarked startups
  const bookmarkedStartups = useMemo(() => {
    return startupList.filter((s) => bookmarks.includes(s._id || s.id));
  }, [startupList, bookmarks]);

  const handleOpenEditModal = () => {
    setEditedName(activeUser?.name || activeUser?.fullName || "");
    setEditedTitle(activeUser?.title || "");
    setEditedLocation(activeUser?.location || "");
    setEditedBio(activeUser?.bio || "");
    setEditedSkillsString(
      Array.isArray(activeUser?.skills) ? activeUser.skills.join(", ") : "",
    );
    setAvatarPreview("");
    setAvatarFile(null);
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const skillsArray = editedSkillsString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const userId = activeUser._id || activeUser.id;

    try {
      setIsSaving(true);
      if (updateProfile) {
        if (avatarFile) {
          // Construct FormData for multipart submission
          const formData = new FormData();
          formData.append("userId", userId);
          formData.append("name", editedName);
          formData.append("title", editedTitle);
          formData.append("location", editedLocation);
          formData.append("bio", editedBio);
          formData.append("skills", JSON.stringify(skillsArray));
          formData.append("avatar", avatarFile);

          await updateProfile(formData);
        } else {
          // Construct regular JS object
          await updateProfile({
            userId,
            name: editedName,
            title: editedTitle,
            location: editedLocation,
            bio: editedBio,
            skills: skillsArray,
          });
        }
      }

      setShowEditModal(false);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const userName = activeUser.name || activeUser.fullName || "Collaborator";

  // Formats relative image paths stored on backend to full URLs
  const getAvatarUrl = (path) => {
    if (!path) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        userName,
      )}`;
    }
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `http://localhost:5000${path}`;
  };

  const avatarUrl = getAvatarUrl(activeUser.avatar);

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
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold text-xs">
              Credentials updated successfully!
            </span>
            <button
              type="button"
              onClick={() => setShowNotification(false)}
              className="p-1 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section (Clean Card View) */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={avatarUrl}
            alt={userName}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-100 shadow-sm object-cover bg-gray-50 shrink-0"
          />

          <div className="text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
              {userName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 font-mono">
              {activeUser.title || "No Title Set"}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium font-mono pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-gray-300" />
              <span>{activeUser.location || "No Location Set"}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenEditModal}
          className="w-full sm:w-auto px-4.5 py-3 border border-gray-200 hover:border-black rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-gray-700 bg-white cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-gray-400" />
          Customize Identity
        </button>
      </div>

      {/* Quick Statistics Strip (Fully Dynamic) */}

      {/* Tabs Layout */}
      <div className=" gap-8 items-start">
        {/* Main tabs view */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Tab Content */}
          <div className="pt-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Bio card */}
                <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-4">
                  <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-wider">
                    Candidate Bio
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {activeUser.bio ||
                      "Please customize your co-founder card to write a personalized bio."}
                  </p>
                </div>

                {/* Tech Skills Box */}
                <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xs text-left space-y-4">
                  <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-wider">
                    Technical Capability Lattice
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(activeUser.skills) &&
                    activeUser.skills.length > 0 ? (
                      activeUser.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-bold text-gray-900 rounded-lg shadow-2xs font-mono uppercase"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">
                        No specific technical capabilities selected. Customize
                        your profile to add skills.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div className="space-y-4">
                {bookmarkedStartups.length === 0 ? (
                  <div className="bg-white border border-gray-100 p-12 rounded-[2rem] text-center space-y-3">
                    <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
                    <h4 className="font-bold text-gray-900 text-sm">
                      No bookmarks active
                    </h4>
                    <p className="text-xs text-gray-400">
                      Save active listings to monitor co-founding opportunities
                      here.
                    </p>
                    <Link
                      to="/browse"
                      className="text-xs font-bold text-black underline block"
                    >
                      Browse directory
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedStartups.map((s) => {
                      const startupId = s._id || s.id;
                      return (
                        <div
                          key={startupId}
                          className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center gap-4 text-left shadow-2xs hover:border-black transition-all group relative"
                        >
                          {s.image && (
                            <div className="w-12 h-12 rounded-xl border p-1 shrink-0 bg-gray-50 flex items-center justify-center">
                              <img
                                src={s.image}
                                alt={s.startupName || s.name}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                          )}
                          <div className="min-w-0 pr-4">
                            <Link
                              to={`/startup/${startupId}`}
                              className="font-bold text-gray-900 text-sm hover:underline block truncate"
                            >
                              {s.startupName || s.name}
                            </Link>
                            <p className="text-[10px] text-gray-400 font-mono truncate">
                              {s.category?.name || s.category}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {s.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Drawer Modal */}
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-50 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-500 fill-indigo-500/10" />
                    Customize Identity Card
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5 text-gray-500" />
                  </button>
                </div>

                <form
                  id="profileForm"
                  onSubmit={handleSaveProfile}
                  className="space-y-5 text-left"
                >
                  {/* Profile Avatar Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Profile Avatar
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                        <img
                          src={avatarPreview || avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="cursor-pointer px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-black transition-colors flex items-center gap-2 bg-white">
                        <Camera className="w-4 h-4 text-gray-500" />
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Your name"
                      disabled={isSaving}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-sm transition-colors bg-gray-50/50 disabled:opacity-50"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Professional Subtitle
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="e.g. Product Architect & Engineer"
                      disabled={isSaving}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-sm transition-colors bg-gray-50/50 disabled:opacity-50"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Location Headquarters
                    </label>
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      disabled={isSaving}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-sm transition-colors bg-gray-50/50 disabled:opacity-50"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Personal Vision Statement
                    </label>
                    <textarea
                      rows={4}
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      placeholder="Tell prospective co-founders about your background and vision..."
                      disabled={isSaving}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-black outline-hidden text-xs transition-colors bg-gray-50/50 leading-relaxed font-sans disabled:opacity-50"
                    />
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                      Capabilities Lattice (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="React, Figma, Next.js, Rust, CUDA"
                      value={editedSkillsString}
                      onChange={(e) => setEditedSkillsString(e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-xs transition-colors bg-gray-50/50 font-mono disabled:opacity-50"
                    />
                  </div>
                </form>
              </div>

              <div className="border-t border-gray-100 pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSaving}
                  className="flex-1 py-3 border border-gray-200 hover:border-black rounded-xl font-bold text-xs text-gray-500 hover:text-black bg-white transition-all cursor-pointer text-center disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  form="profileForm"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-black hover:bg-gray-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Identity
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
