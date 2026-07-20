import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, SlidersHorizontal, Bookmark, ArrowRight, X, MapPin, Target, Sparkles, AlertCircle
} from 'lucide-react';
import { SECTORS } from '../../constants/data.js';
import './BrowseStartups.css';

export default function BrowseStartups() {
  const { startups, bookmarks, toggleBookmark } = useApp();

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedStage, setSelectedStage] = useState('All');
  const [locationQuery, setLocationQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4); // Simulates load more

  // Standard skills list aggregated for filter pills
  const allSkills = useMemo(() => {
    const list = new Set();
    startups.forEach(s => s.skills.forEach(skill => list.add(skill)));
    return Array.from(list);
  }, [startups]);

  // Handle category checkboxes
  const handleSectorToggle = (sectorName) => {
    setSelectedSectors(prev => {
      if (prev.includes(sectorName)) {
        return prev.filter(s => s !== sectorName);
      } else {
        return [...prev, sectorName];
      }
    });
  };

  // Handle skill tag selection
  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedSectors([]);
    setSelectedSkills([]);
    setSelectedStage('All');
    setLocationQuery('');
  };

  // Main Filtering Logic
  const filteredStartups = useMemo(() => {
    return startups.filter(startup => {
      // 1. Text Search (Matches title, description, tagline)
      const text = search.toLowerCase();
      const matchesSearch = !search || 
        startup.name.toLowerCase().includes(text) ||
        startup.tagline.toLowerCase().includes(text) ||
        startup.description.toLowerCase().includes(text);

      // 2. Sector / Category Matching
      const matchesSector = selectedSectors.length === 0 || 
        selectedSectors.includes(startup.category);

      // 3. Required Skills Matching (Startup must have at least one of the selected skills, or all, let's say at least one is fine for discovery)
      const matchesSkills = selectedSkills.length === 0 ||
        startup.skills.some(skill => selectedSkills.includes(skill));

      // 4. Funding Stage Matching
      const matchesStage = selectedStage === 'All' || startup.stage === selectedStage;

      // 5. Location Matching
      const matchesLocation = !locationQuery || 
        startup.location.toLowerCase().includes(locationQuery.toLowerCase());

      return matchesSearch && matchesSector && matchesSkills && matchesStage && matchesLocation;
    });
  }, [startups, search, selectedSectors, selectedSkills, selectedStage, locationQuery]);

  const displayedStartups = filteredStartups.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 2);
  };

  const FilterSidebarContent = () => (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm font-mono uppercase tracking-widest">Filter Matrix</h3>
        <button
          onClick={handleClearFilters}
          className="text-xs text-gray-400 hover:text-black font-semibold transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Keywords Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Search Keyword</label>
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

      {/* Sector Categories checkboxes */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Sectors</label>
        <div className="space-y-2">
          {SECTORS.map(sec => (
            <label key={sec.id} className="flex items-center gap-2.5 text-xs text-gray-600 font-medium select-none cursor-pointer hover:text-black">
              <input
                type="checkbox"
                checked={selectedSectors.includes(sec.name)}
                onChange={() => handleSectorToggle(sec.name)}
                className="h-4 w-4 rounded-xs border-gray-300 text-black focus:ring-black"
              />
              <span>{sec.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Required Skill Pills */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Required Skills</label>
        <div className="flex flex-wrap gap-1.5">
          {allSkills.map(skill => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-black'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Funding Stage Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Funding Stage</label>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-black outline-hidden text-xs transition-colors bg-gray-50/50"
        >
          <option value="All">All Stages</option>
          <option value="Pre-seed">Pre-seed</option>
          <option value="Seed">Seed</option>
          <option value="Series A">Series A</option>
        </select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">Headquarters Location</label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="San Francisco, Austin..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-hidden text-xs transition-colors bg-gray-50/50"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      {/* Page Header */}
      <div className="text-left space-y-4 mb-10 pb-8 border-b border-gray-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600">
          <Target className="w-3 h-3 text-indigo-500" />
          <span>Ecosystem Directory</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Browse Active Ventures
        </h1>
        <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
          Search open co-founding contracts by structural segment, coding capability requirements, funding stages, or physical parameters.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-gray-100 p-6 rounded-2xl sticky top-24 shadow-xs">
          <FilterSidebarContent />
        </aside>

        {/* Dynamic Listings Box */}
        <main className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <span className="text-xs font-semibold text-gray-500 font-mono">
              Found {filteredStartups.length} matching ventures
            </span>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-gray-200 hover:border-black rounded-xl text-xs font-semibold text-gray-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Empty State */}
          {filteredStartups.length === 0 && (
            <div className="bg-gray-50 border border-gray-100 p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full inline-block">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">No Ventures Match Filters</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                We couldn't find any startups matching your criteria. Try loosening your sector, skills selection, or location filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs hover:bg-gray-900 transition-all"
              >
                Clear Filter Matrix
              </button>
            </div>
          )}

          {/* Startups List */}
          <div className="space-y-4">
            {displayedStartups.map((startup) => {
              const isBookmarked = bookmarks.includes(startup.id);
              return (
                <motion.div
                  key={startup.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs hover:border-gray-200 transition-all text-left flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden group"
                >
                  <div className="flex items-start gap-5 flex-1">
                    {/* Startup Logo Graphic */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50 p-1 relative flex items-center justify-center">
                      <img
                        src={startup.image}
                        alt={startup.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Name and Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-indigo-600 transition-colors">
                          {startup.name}
                        </h3>
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          {startup.stage}
                        </span>
                        <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          {startup.category}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-gray-400 font-mono font-medium line-clamp-1">
                        {startup.tagline}
                      </p>

                      {/* Description snippet */}
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 max-w-2xl">
                        {startup.description}
                      </p>

                      {/* Skills Tags pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {startup.skills.slice(0, 4).map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[9px] font-bold font-mono rounded-md text-gray-400 uppercase">
                            {skill}
                          </span>
                        ))}
                        {startup.skills.length > 4 && (
                          <span className="px-2 py-0.5 bg-indigo-50/50 text-[9px] font-bold font-mono rounded-md text-indigo-500 uppercase">
                            +{startup.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex sm:flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto shrink-0 border-t border-gray-50 md:border-0 pt-4 md:pt-0">
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium font-mono mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{startup.location}</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* Bookmark Toggle */}
                      <button
                        onClick={() => toggleBookmark(startup.id)}
                        className={`p-3 rounded-full border transition-all cursor-pointer ${
                          isBookmarked
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-400 border-gray-200 hover:text-black hover:border-black'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <Link
                        to={`/startup/${startup.id}`}
                        className="bg-gray-50 hover:bg-black hover:text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 group/btn text-gray-700 flex-1 sm:flex-none text-center justify-center border border-gray-100"
                      >
                        View Venture
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Load More */}
          {filteredStartups.length > visibleCount && (
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

      {/* Mobile Drawer Slide for filters */}
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
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
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
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="mb-6">
                  <FilterSidebarContent />
                </div>
              </div>

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
