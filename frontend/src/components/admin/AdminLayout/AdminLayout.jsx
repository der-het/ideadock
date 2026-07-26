// src/components/admin/AdminLayout/AdminLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { Lightbulb, Users, UserPlus } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    {
      label: "Manage Startup Ideas",
      path: "/admin/startups",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      label: "Manage Users",
      path: "/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Join Requests",
      path: "/admin/requests",
      icon: <UserPlus className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Admin Navigation Sub-Bar (No Sidebar) */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              ADMIN CONSOLE
            </span>
          </div>

          {/* Top Horizontal Admin Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-blue-50 text-blue-600 font-extrabold shadow-2xs"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <span className={active ? "text-blue-600" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Dynamic View (Full Width, No Left Sidebar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-2xs min-h-[calc(100vh-180px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
