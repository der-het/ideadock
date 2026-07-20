import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import './Topbar.css';

export default function Topbar({
  searchPlaceholder = 'Search startups, users, or reports...',
  onSearch,
  searchValue,
  currentUser = {},
}) {
  return (
    <header className="admin-topbar">
      {/* Left Search Bar Area */}
      <div className="topbar-search-container">
        <div className="topbar-search-box">
          <Search size={18} className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right User Controls & Meta */}
      <div className="topbar-controls">
        <button className="topbar-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>
        <button className="topbar-btn" title="Settings">
          <Settings size={20} />
        </button>
        <div className="topbar-divider" />
        <div className="topbar-avatar-container">
          {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="topbar-avatar" />
          ) : (
            <div className="topbar-avatar-placeholder">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'A'}
            </div>
          )}
          <span className="topbar-console-badge">Admin Console</span>
        </div>
      </div>
    </header>
  );
}
