import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Bookmark,
  Menu,
  X,
  LogOut,
  User,
  FolderGit2,
  Plus,
} from "lucide-react";

export default function Navbar() {
  const { currentUser, bookmarks, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full hover:text-black ${
      isActive
        ? "text-black bg-gray-100 font-semibold shadow-xs"
        : "text-gray-500 hover:bg-gray-50/80"
    }`;

  const mobileNavItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
      isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-black text-white p-2 rounded-xl transition-transform group-hover:scale-105 duration-300">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Startup
              <span className="text-gray-900 font-medium font-mono">
                Connect
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/browse" className={navItemClass}>
              Browse Ventures
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/dashboard" className={navItemClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/profile" className={navItemClass}>
                  My Profile
                </NavLink>
              </>
            )}
          </div>

          {/* User/Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                {/* <Link
                  to="/dashboard"
                  className="relative p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-50"
                  title="Bookmarks"
                >
                  <Bookmark className="w-5 h-5" />
                  {bookmarks.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white leading-none">
                      {bookmarks.length}
                    </span>
                  )}
                </Link> */}

                <div className="h-6 w-[1px] bg-gray-200"></div>

                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-gray-200 object-cover group-hover:ring-2 group-hover:ring-black transition-all duration-200"
                    />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1 max-w-[120px]">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 font-mono">
                        {currentUser.title ? "Founder" : "Collaborator"}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white hover:bg-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-xs transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-150"
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {currentUser && (
              <Link
                to="/dashboard"
                className="relative p-2 text-gray-500 hover:text-black"
              >
                <Bookmark className="w-5 h-5" />
                {bookmarks.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white leading-none">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-colors focus:outline-hidden"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-black" />
                    <span className="font-extrabold text-base">
                      StartupConnect
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {currentUser && (
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-gray-100">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {currentUser.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium font-mono truncate max-w-[180px]">
                        {currentUser.title || "Collaborator"}
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className="flex flex-col gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <NavLink to="/" className={mobileNavItemClass}>
                    Home Base
                  </NavLink>
                  <NavLink to="/browse" className={mobileNavItemClass}>
                    Browse Ventures
                  </NavLink>
                  {currentUser && (
                    <>
                      <NavLink to="/dashboard" className={mobileNavItemClass}>
                        Dashboard
                      </NavLink>
                      <NavLink to="/profile" className={mobileNavItemClass}>
                        My Profile
                      </NavLink>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                {currentUser ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <div
                    className="flex flex-col gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link
                      to="/login"
                      className="w-full text-center border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
                    >
                      Join Community
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
