import React, { useState } from 'react';
import {
  UserPlus,
  Clock,
  CheckCircle,
  FileText,
  Mail,
  XCircle,
  MessageSquare,
  Search,
  Filter,
  Check,
  X,
  Plus,
} from 'lucide-react';
import './ManageJoinRequests.css';

export default function ManageJoinRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const stats = [
    { title: 'Total Pending', value: '124', trend: '+12%', type: 'error' },
    { title: 'Approved Today', value: '42', trend: 'Stable', type: 'success' },
    { title: 'Avg. Response Time', value: '4.2h', trend: '-15m', type: 'info' },
    { title: 'Success Rate', value: '68%', trend: '+2.4%', type: 'success' },
  ];

  const requestsData = [
    {
      id: 1,
      startup: 'EcoTrack AI',
      applicantName: 'Sarah Jenkins',
      applicantEmail: 'sarah.j@example.com',
      role: 'Senior ML Engineer',
      message: 'Excited to apply my experience in climate-tech data modeling to help optimize your live carbon dashboards.',
      date: 'Oct 24, 2023',
      status: 'Pending',
      bgLetter: '#004ac6',
    },
    {
      id: 2,
      startup: 'PulseHealth',
      applicantName: 'David Chen',
      applicantEmail: 'd.chen@design.co',
      role: 'Product Designer',
      message: 'Huge fan of your patient dashboard concept. I have designed three healthtech portals in the past and would love to collaborate.',
      date: 'Oct 23, 2023',
      status: 'Pending',
      bgLetter: '#10b981',
    },
    {
      id: 3,
      startup: 'FinFlow',
      applicantName: 'Elena Rodriguez',
      applicantEmail: 'elena@finflow.io',
      role: 'Marketing Lead',
      message: '10 years of experience in FinTech growth. Successfully launched two SaaS products that grew to $10M ARR.',
      date: 'Oct 23, 2023',
      status: 'Approved',
      bgLetter: '#f59e0b',
    },
    {
      id: 4,
      startup: 'RoboScale',
      applicantName: 'Marcus Aurelius',
      applicantEmail: 'marcus@techmail.com',
      role: 'QA Analyst',
      message: 'I specialize in automated testing environments for hardware/software integrated robotics lines.',
      date: 'Oct 22, 2023',
      status: 'Pending',
      bgLetter: '#505f76',
    },
  ];

  const filteredRequests = requestsData.filter((req) => {
    const matchesSearch =
      req.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="join-requests-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h2 className="admin-page-title">Join Requests</h2>
          <p className="admin-page-subtitle">Review and manage pending collaboration requests across all startups.</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-secondary" onClick={() => alert('Filtering options shown!')}>
            <Filter size={16} /> Filters
          </button>
          <button className="btn-primary" onClick={() => alert('Exporting list...')}>
            <FileText size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="requests-stats-grid">
        {stats.map((stat, idx) => (
          <div className="request-stat-card" key={idx}>
            <span className="request-stat-title">{stat.title}</span>
            <div className="request-stat-row">
              <span className="request-stat-value">{stat.value}</span>
              <span className={`request-stat-trend-chip ${stat.type}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Request Database Block */}
      <div className="requests-table-card">
        {/* Search Header */}
        <div className="requests-search-header">
          <div className="requests-search-box">
            <Search size={16} className="requests-search-icon" />
            <input
              type="text"
              placeholder="Search by startup, applicant name, or requested role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="requests-filter-wrapper">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="requests-table-overflow">
          <table className="requests-datatable">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Applicant</th>
                <th>Role Requested</th>
                <th style={{ width: '35%' }}>Introduction Message</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-row">
                    No join requests match your parameters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className={`status-row-${req.status.toLowerCase()}`}>
                    <td>
                      <div className="startup-badge-cell">
                        <div className="startup-letter" style={{ backgroundColor: req.bgLetter }}>
                          {req.startup[0]}
                        </div>
                        <span className="startup-title-text">{req.startup}</span>
                      </div>
                    </td>
                    <td>
                      <div className="applicant-cell">
                        <span className="applicant-name">{req.applicantName}</span>
                        <span className="applicant-email">{req.applicantEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span className="role-request-badge">{req.role}</span>
                    </td>
                    <td>
                      <p className="introduction-message" title={req.message}>
                        {req.message}
                      </p>
                    </td>
                    <td className="request-date">{req.date}</td>
                    <td>
                      <div className="row-action-buttons">
                        <button className="row-icon-btn msg" title="Send Message" onClick={() => alert(`Opening chat with ${req.applicantName}`)}>
                          <MessageSquare size={14} />
                        </button>
                        {req.status === 'Pending' && (
                          <>
                            <button className="row-icon-btn approve" title="Approve Join Request" onClick={() => alert(`Approved ${req.applicantName} for ${req.startup}`)}>
                              <Check size={14} />
                            </button>
                            <button className="row-icon-btn reject" title="Reject Request" onClick={() => alert(`Rejected ${req.applicantName}'s request`)}>
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <span className="verified-join-label">Approved</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="table-footer-pagination">
          <span className="pagination-summary">
            Showing 1-{filteredRequests.length} of 124 requests
          </span>
          <div className="pagination-pages-list">
            <button className="page-nav-btn" disabled>&lt;</button>
            <button className="page-num-btn active">1</button>
            <button className="page-num-btn">2</button>
            <button className="page-num-btn">3</button>
            <button className="page-nav-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="tips-grid">
        <div className="tips-card">
          <div className="tips-icon-wrapper">
            <UserPlus size={24} />
          </div>
          <div className="tips-content">
            <h4 className="tips-title">Collaboration Guidelines</h4>
            <p className="tips-description">
              Ensure all accepted candidates are matched with founders who are actively looking for skills matching their CVs. Rejections should trigger an email offer to join other open startups.
            </p>
          </div>
        </div>

        <div className="tips-card secondary-tip">
          <div className="tips-icon-wrapper">
            <Clock size={24} />
          </div>
          <div className="tips-content">
            <h4 className="tips-title">Auto-Approve Active</h4>
            <p className="tips-description">
              Requests left inactive for over 14 days are automatically archived to maintain feed freshness. Please review requests within 48 hours for the best developer retention rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
