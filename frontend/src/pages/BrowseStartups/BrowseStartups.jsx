import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  ArrowRight,
  X,
  MapPin,
  Target,
  AlertCircle,
  Loader2,
  Send,
  CheckCircle2,
} from "lucide-react";
import { SECTORS } from "../../constants/data.js";
import "./BrowseStartups.css";

/* =========================================================
   FILTER SIDEBAR COMPONENT
   IMPORTANT:
   This is outside BrowseStartups so it does not get
   recreated every time search/location state changes.
========================================================= */

function FilterSidebarContent({
  handleClearFilters,
  search,
  setSearch,
  selectedSectors,
  handleSectorToggle,
  allSkills,
  selectedSkills,
  handleSkillToggle,
  selectedStage,
  setSelectedStage,
  locationQuery,
  setLocationQuery,
}) {
  return (
    <div className="space-y-6 text-left">
      {/* Filter Header */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm font-mono uppercase tracking-widest">
          Filter Matrix
        </h3>

        <button
          onClick={handleClearFilters}
          className="text-xs text-gray-400 hover:text-black font-semibold transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* =====================================================
          Keywords Search
      ===================================================== */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
          Search Keyword
        </label>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

          <input
            type="text"
            placeholder="AI, blockchain, ledger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-xs transition-colors bg-gray-50/50"
          />
        </div>
      </div>

      {/* =====================================================
          Sector Categories
      ===================================================== */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
          Sectors
        </label>

        <div className="space-y-2">
          {SECTORS.map((sec) => (
            <label
              key={sec.id}
              className="flex items-center gap-2.5 text-xs text-gray-600 font-medium select-none cursor-pointer hover:text-black"
            >
              <input
                type="radio"
                name="sector"
                value={sec.name}
                checked={selectedSectors.includes(sec.name)}
                onChange={() => handleSectorToggle(sec.name)}
                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
              />

              <span>{sec.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function BrowseStartups() {
  const {
    startups = [],
    bookmarks = [],
    toggleBookmark,
    loading,
    submitJoinRequest,
    joinRequests = [],
  } = useApp();

  /* =======================================================
     Filter States
  ======================================================= */

  const [search, setSearch] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedStage, setSelectedStage] = useState("All");
  const [locationQuery, setLocationQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [pitchingId, setPitchingId] = useState(null);

  /* =======================================================
     Modal States
  ======================================================= */

  const [activeModalStartup, setActiveModalStartup] = useState(null);
  const [roleRequested, setRoleRequested] = useState("");
  const [pitchMessage, setPitchMessage] = useState("");

  const [notification, setNotification] = useState(null);

  /* =======================================================
     Safely Ensure Startups Is An Array
  ======================================================= */

  const startupList = useMemo(() => {
    if (Array.isArray(startups)) return startups;

    if (Array.isArray(startups?.startups)) {
      return startups.startups;
    }

    if (Array.isArray(startups?.data)) {
      return startups.data;
    }

    return [];
  }, [startups]);

  /* =======================================================
     Safely Ensure Join Requests Is An Array
  ======================================================= */

  const safeRequestsList = useMemo(() => {
    if (Array.isArray(joinRequests)) return joinRequests;

    if (Array.isArray(joinRequests?.data)) {
      return joinRequests.data;
    }

    return [];
  }, [joinRequests]);

  /* =======================================================
     All Skills
  ======================================================= */

  const allSkills = useMemo(() => {
    const list = new Set();

    startupList.forEach((s) => {
      if (Array.isArray(s.skills)) {
        s.skills.forEach((skill) => list.add(skill));
      }
    });

    return Array.from(list);
  }, [startupList]);

  /* =======================================================
     Handle Sector Toggle
  ======================================================= */

  const handleSectorToggle = (sectorName) => {
    setSelectedSectors([sectorName]);
  };

  /* =======================================================
     Handle Skill Toggle
  ======================================================= */

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      }

      return [...prev, skill];
    });
  };

  /* =======================================================
     Clear Filters
  ======================================================= */

  const handleClearFilters = () => {
    setSearch("");
    setSelectedSectors([]);
    setSelectedSkills([]);
    setSelectedStage("All");
    setLocationQuery("");
  };

  /* =======================================================
     Check If Pitch Was Already Sent
  ======================================================= */

  const isPitchSent = (startupId) => {
    return safeRequestsList.some(
      (req) =>
        req.startupId === startupId ||
        req.startup?._id === startupId ||
        req.ventureId === startupId,
    );
  };

  /* =======================================================
     Open Pitch Modal
  ======================================================= */

  const handleOpenPitchModal = (startup) => {
    const startupId = startup._id || startup.id;

    // Prevent pitching if startup is full
    if (Number(startup.seatsNeeded) <= 0) {
      setNotification({
        title: "Startup Full",
        message: "This startup has no available seats.",
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);

      return;
    }

    if (isPitchSent(startupId)) return;

    setActiveModalStartup(startup);
    setRoleRequested("");
    setPitchMessage("");
  };

  /* =======================================================
     Submit Pitch
  ======================================================= */

  const handleSubmitPitch = async (e) => {
    e.preventDefault();

    if (!activeModalStartup) return;

    const startupId = activeModalStartup._id || activeModalStartup.id;

    // Extra frontend protection
    if (Number(activeModalStartup.seatsNeeded) <= 0) {
      setActiveModalStartup(null);

      setNotification({
        title: "Startup Full",
        message: "This startup has no available seats.",
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);

      return;
    }

    try {
      setPitchingId(startupId);

      if (submitJoinRequest) {
        const result = await submitJoinRequest(
          startupId,
          "general_role",
          roleRequested,
          pitchMessage,
        );

        if (!result.success) {
          if (
            result.message ===
            "You have already submitted a join request for this startup"
          ) {
            setNotification({
              title: "Already Joined",
              message:
                "You have already submitted a join request for this startup",
            });
          } else {
            setNotification({
              title: "Unable to Submit",
              message: result.message || "Failed to submit pitch.",
            });
          }

          setActiveModalStartup(null);

          setTimeout(() => {
            setNotification(null);
          }, 4000);

          return;
        }
      }

      setActiveModalStartup(null);
    } catch (err) {
      console.error("Failed to send pitch:", err);

      setNotification({
        title: "Something Went Wrong",
        message: "An error occurred while sending your pitch.",
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } finally {
      setPitchingId(null);
    }
  };

  /* =======================================================
     Main Filtering Logic
  ======================================================= */

  const filteredStartups = useMemo(() => {
    return startupList.filter((startup) => {
      const startupName = startup.name || startup.startupName || "";

      const startupTagline = startup.tagline || "";

      const startupDesc = startup.description || "";

      const startupLocation = startup.location || "";

      const startupSkills = startup.skills || [];

      const startupCategory = startup.category?.name || startup.category || "";

      /* ---------------------------------------------------
         1. Text Search
      --------------------------------------------------- */

      const text = search.toLowerCase();

      const matchesSearch =
        !search ||
        startupName.toLowerCase().includes(text) ||
        startupTagline.toLowerCase().includes(text) ||
        startupDesc.toLowerCase().includes(text);

      /* ---------------------------------------------------
         2. Sector Matching
      --------------------------------------------------- */

      const matchesSector =
        selectedSectors.length === 0 ||
        selectedSectors.some(
          (sector) =>
            sector.trim().toLowerCase() ===
            String(startupCategory).trim().toLowerCase(),
        );

      /* ---------------------------------------------------
         3. Skills Matching
      --------------------------------------------------- */

      const matchesSkills =
        selectedSkills.length === 0 ||
        startupSkills.some((skill) =>
          selectedSkills.some(
            (selectedSkill) =>
              String(selectedSkill).trim().toLowerCase() ===
              String(skill).trim().toLowerCase(),
          ),
        );

      /* ---------------------------------------------------
         4. Funding Stage
      --------------------------------------------------- */

      const matchesStage =
        selectedStage === "All" || startup.stage === selectedStage;

      /* ---------------------------------------------------
         5. Location
      --------------------------------------------------- */

      const matchesLocation =
        !locationQuery ||
        startupLocation.toLowerCase().includes(locationQuery.toLowerCase());

      return (
        matchesSearch &&
        matchesSector &&
        matchesSkills &&
        matchesStage &&
        matchesLocation
      );
    });
  }, [
    startupList,
    search,
    selectedSectors,
    selectedSkills,
    selectedStage,
    locationQuery,
  ]);

  /* =======================================================
     Displayed Startups
  ======================================================= */

  const displayedStartups = filteredStartups.slice(0, visibleCount);

  /* =======================================================
     Load More
  ======================================================= */

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[420px] max-w-[calc(100%-2rem)]">
          <div className="bg-white border border-red-200 rounded-2xl shadow-lg px-5 py-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-red-200 bg-red-50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900">
                {notification.title}
              </p>

              <p className="text-[11px] text-gray-400 mt-0.5">
                {notification.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-gray-300 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          Page Header
      =================================================== */}

      <div className="text-left space-y-4 mb-10 pb-8 border-b border-gray-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600">
          <Target className="w-3 h-3 text-indigo-500" />

          <span>Ecosystem Directory</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Browse Active Ventures
        </h1>

        <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
          Search open co-founding contracts by structural segment, coding
          capability requirements, funding stages, or physical parameters.
        </p>
      </div>

      {/* ===================================================
          Main Grid
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =================================================
            Desktop Filter Sidebar
        ================================================= */}

        <aside className="hidden lg:block lg:col-span-3 bg-white border border-gray-100 p-6 rounded-2xl sticky top-24 shadow-xs">
          <FilterSidebarContent
            handleClearFilters={handleClearFilters}
            search={search}
            setSearch={setSearch}
            selectedSectors={selectedSectors}
            handleSectorToggle={handleSectorToggle}
            allSkills={allSkills}
            selectedSkills={selectedSkills}
            handleSkillToggle={handleSkillToggle}
            selectedStage={selectedStage}
            setSelectedStage={setSelectedStage}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
          />
        </aside>

        {/* =================================================
            Dynamic Listings
        ================================================= */}

        <main className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}

          <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-semibold text-gray-500 font-mono">
              Found {filteredStartups.length} matching ventures
            </span>

            {/* Mobile Filter Trigger */}

            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-gray-200 hover:border-black rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* =================================================
              Loading Spinner
          ================================================= */}

          {loading && (
            <div className="bg-gray-50 border border-gray-100 p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-black animate-spin" />

              <p className="text-xs font-mono text-gray-500">
                Fetching active listings from backend...
              </p>
            </div>
          )}

          {/* =================================================
              Empty State
          ================================================= */}

          {!loading && filteredStartups.length === 0 && (
            <div className="bg-gray-50 border border-gray-100 p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full inline-block">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>

              <h4 className="font-bold text-gray-900 text-lg">
                No Ventures Match Filters
              </h4>

              <p className="text-xs text-gray-500 leading-relaxed">
                We couldn't find any startups matching your criteria. Try
                loosening your sector, skills selection, or location filters.
              </p>

              <button
                onClick={handleClearFilters}
                className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs hover:bg-gray-900 transition-all cursor-pointer"
              >
                Clear Filter Matrix
              </button>
            </div>
          )}

          {/* =================================================
              Startups List
          ================================================= */}

          {!loading && (
            <div className="space-y-4">
              {displayedStartups.map((startup) => {
                const startupId = startup._id || startup.id;

                const isBookmarked = bookmarks.includes(startupId);

                const hasPitched = isPitchSent(startupId);

                const isCurrentlyPitching = pitchingId === startupId;

                // =================================================
                // NEW: CHECK IF STARTUP IS FULL
                // =================================================
                const isStartupFull = Number(startup.seatsNeeded) <= 0;

                const skills = startup.skills || [];

                const startupCategory =
                  startup.category?.name || startup.category || "";

                return (
                  <motion.div
                    key={startupId}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs hover:border-gray-200 transition-all text-left flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden group"
                  >
                    <div className="flex items-start gap-5 flex-1">
                      <div className="space-y-2 flex-1">
                        {/* Name and Badges */}

                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                            {startup.name || startup.startupName}
                          </h3>

                          {startup.stage && (
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              {startup.stage}
                            </span>
                          )}

                          {startupCategory && (
                            <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              {startupCategory}
                            </span>
                          )}
                        </div>

                        {/* Tagline */}

                        <p className="text-xs text-gray-400 font-mono font-medium line-clamp-1">
                          {startup.tagline}
                        </p>

                        {/* Description */}

                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 max-w-2xl">
                          {startup.description}
                        </p>

                        {/* Skills */}

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[9px] font-bold font-mono rounded-md text-gray-400 uppercase"
                            >
                              {skill}
                            </span>
                          ))}

                          {skills.length > 4 && (
                            <span className="px-2 py-0.5 bg-indigo-50/50 text-[9px] font-bold font-mono rounded-md text-indigo-500 uppercase">
                              +{skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        Actions Column
                    ================================================= */}

                    <div className="flex sm:flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto shrink-0 border-t border-gray-50 md:border-0 pt-4 md:pt-0">
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium font-mono mb-0.5">
                        <MapPin className="w-3.5 h-3.5" />

                        <span>{startup.location || "Remote"}</span>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        {/* =================================================
                            SEND PITCH / STARTUP FULL
                        ================================================= */}

                        <button
                          type="button"
                          onClick={() => handleOpenPitchModal(startup)}
                          disabled={
                            hasPitched || isCurrentlyPitching || isStartupFull
                          }
                          className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                            isStartupFull
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : hasPitched
                                ? "bg-amber-50 text-amber-700 border-amber-200 cursor-default"
                                : "bg-black text-white border-black hover:bg-gray-800 cursor-pointer"
                          }`}
                        >
                          {isStartupFull ? (
                            <>
                              <span className="text-sm">👥</span>
                              Startup Full
                            </>
                          ) : isCurrentlyPitching ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Pitching...
                            </>
                          ) : hasPitched ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                              Pitch Sent
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Send Pitch
                            </>
                          )}
                        </button>

                        {/* View */}

                        <Link
                          to={`/startup/${startupId}`}
                          className="bg-gray-50 hover:bg-black hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 group/btn text-gray-700 border border-gray-100"
                        >
                          View
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* =================================================
              Load More
          ================================================= */}

          {!loading && filteredStartups.length > visibleCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4 text-center"
            >
              <button
                onClick={handleLoadMore}
                className="bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black font-semibold px-6 py-3 rounded-full text-xs shadow-xs transition-colors cursor-pointer"
              >
                Load more startups
              </button>
            </motion.div>
          )}
        </main>
      </div>

      {/* =====================================================
          Send Pitch Modal
      ===================================================== */}

      <AnimatePresence>
        {activeModalStartup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-100 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative text-left"
            >
              {/* Close Button */}

              <button
                onClick={() => setActiveModalStartup(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-extrabold text-gray-900">
                Pitch to{" "}
                {activeModalStartup.name || activeModalStartup.startupName}
              </h3>

              <p className="text-xs text-gray-500">
                Specify your desired role and introduce yourself to the founder.
              </p>

              <form onSubmit={handleSubmitPitch} className="space-y-3">
                {/* Role */}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Role You Are Requesting
                  </label>

                  <input
                    type="text"
                    required
                    value={roleRequested}
                    onChange={(e) => setRoleRequested(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                {/* Message */}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Introduction Message
                  </label>

                  <textarea
                    rows="4"
                    required
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    placeholder="Share your experience and why you want to join..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                {/* Buttons */}

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalStartup(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={Number(activeModalStartup.seatsNeeded) <= 0}
                    className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold ${
                      Number(activeModalStartup.seatsNeeded) <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800 cursor-pointer"
                    }`}
                  >
                    Submit Pitch
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          Mobile Filter Drawer
      ===================================================== */}

      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />

            {/* Panel */}

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 220,
              }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-white rounded-t-[2rem] z-50 p-6 shadow-2xl lg:hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="font-extrabold text-gray-900 text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                    Filter Matrix
                  </h3>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="mb-6">
                  <FilterSidebarContent
                    handleClearFilters={handleClearFilters}
                    search={search}
                    setSearch={setSearch}
                    selectedSectors={selectedSectors}
                    handleSectorToggle={handleSectorToggle}
                    allSkills={allSkills}
                    selectedSkills={selectedSkills}
                    handleSkillToggle={handleSkillToggle}
                    selectedStage={selectedStage}
                    setSelectedStage={setSelectedStage}
                    locationQuery={locationQuery}
                    setLocationQuery={setLocationQuery}
                  />
                </div>
              </div>

              {/* Mobile Buttons */}

              <div className="border-t border-gray-100 pt-4 flex gap-3">
                <button
                  onClick={() => {
                    handleClearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-xs text-gray-500 bg-white cursor-pointer"
                >
                  Clear All
                </button>

                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold text-xs cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
