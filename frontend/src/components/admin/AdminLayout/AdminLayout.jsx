import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout-root">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="admin-layout-main">
        {/* Topbar */}
        <Topbar searchPlaceholder="Search startups, users, or reports..." />

        {/* Page Content */}
        <main className="admin-content-canvas">
          <div className="admin-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
