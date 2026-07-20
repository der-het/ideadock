import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Lightbulb,
  Users,
  FolderTree,
  UserPlus,
  FileBarChart,
  Rocket,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({
  currentPage = "dashboard",
  onPageChange,
  currentUser = {},
}) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      label: "Manage Startup Ideas",
      icon: Lightbulb,
      path: "/admin/startups",
    },
    {
      label: "Manage Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Manage Categories",
      icon: FolderTree,
      path: "/admin/categories",
    },
    {
      label: "Join Requests",
      icon: UserPlus,
      path: "/admin/requests",
    },
    {
      label: "Reports",
      icon: FileBarChart,
      path: "/admin/reports",
    },
  ];

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand Logo Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Rocket size={20} className="brand-logo-icon" />
        </div>
        <div className="brand-text-container">
          <h1 className="brand-title">StartupConnect</h1>
          <span className="brand-subtitle">Admin Console</span>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Profile Card */}
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {getInitials(currentUser.name)}
            </div>
          )}
          <div className="user-info">
            <p className="user-name">{currentUser.name || "Admin User"}</p>
            <p className="user-role">{currentUser.role || "Super Admin"}</p>
          </div>
          <button
            className="logout-btn"
            title="Logout"
            onClick={() => alert("Logout clicked!")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
