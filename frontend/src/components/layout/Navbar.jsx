// src/components/layout/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { LogOut, Rocket, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { currentUser, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const activeUser = currentUser || user;
  const userName = activeUser?.name || activeUser?.fullName || "Collaborator";
  const isAdmin = activeUser?.role === "admin";
  const isAdminPath = location.pathname.startsWith("/admin");

  const getAvatarUrl = (path) => {
    if (!path || path.trim() === "") {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        userName,
      )}`;
    }
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    return `http://localhost:5000${path}`;
  };

  const avatarUrl = getAvatarUrl(activeUser?.avatar);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="../../../public/logo.svg"
              alt="IDEADOCK Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <span className="font-extrabold text-lg text-gray-900 tracking-tight">
            IDEADOCK
          </span>
        </Link>

        {/* Dynamic Navigation Links based on Login & Route Status */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {!activeUser ? (
            <>
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive("/")
                    ? "bg-gray-100 text-black font-extrabold"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive("/about")
                    ? "bg-gray-100 text-black font-extrabold"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                About
              </Link>
            </>
          ) : isAdminPath ? (
            /* Inside Admin Route: Show Admin Mode Badge */
            <span className="bg-black text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Admin Console Mode
            </span>
          ) : isAdmin ? (
            /* Admin User Links */
            <>
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            </>
          ) : (
            /* Standard Logged In User Links */
            <>
              <Link
                to="/browse"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive("/browse")
                    ? "bg-gray-100 text-black font-extrabold"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                Browse Ventures
              </Link>

              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive("/dashboard")
                    ? "bg-gray-100 text-black font-extrabold"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive("/deshboard")
                    ? "bg-gray-100 text-black font-extrabold"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                My Profile
              </Link>
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {activeUser ? (
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div
                className={`flex items-center gap-2.5 ${
                  !isAdmin ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (!isAdmin) {
                    navigate("/profile");
                  }
                }}
              >
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover bg-gray-50 shrink-0"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">
                    {userName}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    {activeUser.role || "Collaborator"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
