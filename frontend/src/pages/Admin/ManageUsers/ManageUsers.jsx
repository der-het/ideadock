import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserMinus,
  UserX,
  Filter,
  Plus,
  Download,
  Printer,
  Eye,
  Edit,
  Trash,
  Search,
  CheckCircle,
} from 'lucide-react';
import './ManageUsers.css';

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const stats = [
    { title: 'Total Users', value: '1,284', trend: '+12%', type: 'success' },
    { title: 'Active Now', value: '432', trend: 'Pulse', type: 'pulse' },
    { title: 'Founders', value: '856', trend: '67%', type: 'info' },
    { title: 'Suspended', value: '14', trend: '1.1%', type: 'error' },
  ];

  const usersData = [
    {
      id: 1,
      name: 'Jordan Peterson',
      email: 'jordan.p@techflow.io',
      role: 'Founder',
      joinedDate: 'Oct 12, 2023',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      email: 'schen.dev@gmail.com',
      role: 'Developer',
      joinedDate: 'Nov 04, 2023',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Marcus Thorne',
      email: 'm.thorne@designhub.co',
      role: 'Designer',
      joinedDate: 'Aug 22, 2023',
      status: 'Suspended',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Priya Sharma',
      email: 'priya.sharma@invest.io',
      role: 'Investor',
      joinedDate: 'Jan 15, 2024',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      name: 'David Okafor',
      email: 'david.o@scaleup.net',
      role: 'Developer',
      joinedDate: 'Feb 02, 2024',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(usersData.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="manage-users-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h2 className="admin-page-title">Manage Users</h2>
          <p className="admin-page-subtitle">Oversee community members, adjust roles, and manage account statuses.</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={() => alert('Add User Form Opened!')}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Stats Widgets Bar */}
      <div className="users-stats-grid">
        {stats.map((stat, idx) => (
          <div className="user-stat-card" key={idx}>
            <span className="user-stat-title">{stat.title}</span>
            <div className="user-stat-value-row">
              <span className="user-stat-value">{stat.value}</span>
              {stat.type === 'pulse' ? (
                <span className="pulse-indicator-dot" />
              ) : (
                <span className={`user-stat-trend ${stat.type}`}>{stat.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Block */}
      <div className="users-table-card">
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="toolbar-search-box">
              <Search size={16} className="toolbar-search-icon" />
              <input
                type="text"
                placeholder="Search users by name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="toolbar-filter">
              <Filter size={14} className="filter-icon" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="All">All Roles</option>
                <option value="Founder">Founders</option>
                <option value="Developer">Developers</option>
                <option value="Designer">Designers</option>
                <option value="Investor">Investors</option>
              </select>
            </div>
          </div>

          <div className="toolbar-right">
            <button className="icon-toolbar-btn" title="Download Export">
              <Download size={16} />
            </button>
            <button className="icon-toolbar-btn" title="Print List">
              <Printer size={16} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="users-table-overflow">
          <table className="users-datatable">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    className="users-checkbox"
                    checked={selectedUsers.length === usersData.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>User</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-row">
                    No users found matching filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={user.status === 'Suspended' ? 'suspended-row' : ''}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        className="users-checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td>
                      <div className="user-profile-cell">
                        <img src={user.avatarUrl} alt={user.name} className="user-table-avatar" />
                        <div className="user-name-box">
                          <span className="user-table-name">{user.name}</span>
                          <span className="user-table-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-chip ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="joined-date-cell">{user.joinedDate}</td>
                    <td>
                      <span className={`status-pill ${user.status.toLowerCase()}`}>
                        <span className="status-dot" />
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-action-buttons">
                        <button className="row-icon-btn" title="View Profile" onClick={() => alert(`Viewing profile for ${user.name}`)}>
                          <Eye size={14} />
                        </button>
                        <button className="row-icon-btn" title="Edit User" onClick={() => alert(`Editing user ${user.name}`)}>
                          <Edit size={14} />
                        </button>
                        {user.status === 'Suspended' ? (
                          <button className="row-icon-btn approve" title="Activate" onClick={() => alert(`Activating user ${user.name}`)}>
                            <CheckCircle size={14} />
                          </button>
                        ) : (
                          <button className="row-icon-btn suspend" title="Suspend" onClick={() => alert(`Suspending user ${user.name}`)}>
                            <UserMinus size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="table-footer-pagination">
          <span className="pagination-summary">
            Showing 1-{filteredUsers.length} of 1,284 users
          </span>
          <div className="pagination-pages-list">
            <button className="page-nav-btn" disabled>&lt;</button>
            <button className="page-num-btn active">1</button>
            <button className="page-num-btn">2</button>
            <button className="page-num-btn">3</button>
            <span className="page-ellipsis">...</span>
            <button className="page-num-btn">257</button>
            <button className="page-nav-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* Floating bulk actions box */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions-floating-bar">
          <span className="selected-count-label">{selectedUsers.length} users selected</span>
          <div className="bulk-actions-group">
            <button className="bulk-btn" onClick={() => alert('Batch edit triggered!')}>Batch Edit</button>
            <button className="bulk-btn suspend" onClick={() => alert('Bulk suspend triggered!')}>Suspend All</button>
            <button className="bulk-btn" onClick={() => alert('Bulk message triggered!')}>Message</button>
          </div>
        </div>
      )}
    </div>
  );
}
