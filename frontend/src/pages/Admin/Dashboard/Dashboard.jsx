import React from 'react';
import {
  Rocket,
  Users,
  Clock,
  TrendingUp,
  UserCheck,
  Check,
  X,
  Plus,
  ArrowRight,
  PieChart,
  Lightbulb,
} from 'lucide-react';
import StatCard from '../../../components/admin/StatCard/StatCard';
import './Dashboard.css';

export default function Dashboard({ onPageChange }) {
  const stats = [
    {
      title: 'Active Startups',
      value: '1,284',
      icon: Rocket,
      trend: '+12%',
      trendType: 'success',
      sparklineData: [10, 35, 12, 30, 20, 35, 10, 25],
    },
    {
      title: 'Total Users',
      value: '45.2k',
      icon: Users,
      trend: '+8.4%',
      trendType: 'success',
      sparklineData: [30, 35, 40, 20, 25, 15, 10, 5],
    },
    {
      title: 'Pending Requests',
      value: '142',
      icon: Clock,
      trend: 'High',
      trendType: 'error',
      sparklineData: [10, 15, 35, 25, 20, 35, 30, 20],
    },
    {
      title: 'Monthly Growth',
      value: '$248.5k',
      icon: TrendingUp,
      trend: '+22%',
      trendType: 'success',
      sparklineData: [38, 35, 25, 20, 15, 10, 5, 2],
    },
  ];

  const recentRequests = [
    { id: 1, name: 'Nexus AI', letter: 'N', bg: '#004ac6', applicant: 'Sarah Jenkins', date: 'Oct 24, 2023', status: 'Pending' },
    { id: 2, name: 'EcoFlow Tech', letter: 'E', bg: '#10b981', applicant: 'Marcus Thorne', date: 'Oct 23, 2023', status: 'Pending' },
    { id: 3, name: 'VeloPay', letter: 'V', bg: '#f59e0b', applicant: 'Elena Rodriguez', date: 'Oct 22, 2023', status: 'Pending' },
    { id: 4, name: 'CloudScale', letter: 'C', bg: '#505f76', applicant: 'David Wu', date: 'Oct 22, 2023', status: 'Pending' },
  ];

  const activities = [
    { id: 1, type: 'registration', title: 'New User Registration', desc: 'Liam Smith joined as an Entrepreneur.', time: '2 minutes ago', icon: Users },
    { id: 2, type: 'idea', title: 'Idea Posted', desc: '"Sustainable Urban Farming" by GreenGrowth.', time: '15 minutes ago', icon: Lightbulb },
    { id: 3, type: 'review', title: 'Review Completed', desc: 'Admin Sarah approved "CryptoVault" Startup.', time: '45 minutes ago', icon: UserCheck },
    { id: 4, type: 'connection', title: 'New Connection', desc: 'Venture X connected with Innovate Labs.', time: '1 hour ago', icon: Rocket },
  ];

  const sectors = [
    { name: 'Fintech', percentage: 34, color: '#004ac6' },
    { name: 'Healthtech', percentage: 28, color: '#943700' },
    { name: 'SaaS', percentage: 22, color: '#505f76' },
    { name: 'Other', percentage: 16, color: '#c3c6d7' },
  ];

  return (
    <div className="admin-dashboard-page">
      {/* Welcome Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h2 className="admin-page-title">Welcome, Admin</h2>
          <p className="admin-page-subtitle">Here is a comprehensive overview of the StartupConnect platform health and activity.</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={() => onPageChange('ideas')}>
            <Plus size={16} /> New Platform Initiative
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="dashboard-stats-grid">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendType={stat.trendType}
            sparklineData={stat.sparklineData}
          />
        ))}
      </div>

      {/* Main Column Grid */}
      <div className="dashboard-columns-grid">
        {/* Left Column: Recent Join Requests */}
        <div className="dashboard-large-card">
          <div className="card-header-bar">
            <h4 className="card-heading">Recent Join Requests</h4>
            <button className="card-header-action-btn" onClick={() => onPageChange('join-requests')}>
              View All <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>

          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Startup Name</th>
                  <th>Applicant Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="startup-cell">
                        <div className="startup-letter" style={{ backgroundColor: req.bg }}>
                          {req.letter}
                        </div>
                        <span className="startup-name">{req.name}</span>
                      </div>
                    </td>
                    <td>{req.applicant}</td>
                    <td>{req.date}</td>
                    <td>
                      <span className="status-badge pending">{req.status}</span>
                    </td>
                    <td>
                      <div className="row-action-buttons">
                        <button className="row-icon-btn approve" title="Approve" onClick={() => alert(`Approved ${req.name}`)}>
                          <Check size={14} />
                        </button>
                        <button className="row-icon-btn reject" title="Reject" onClick={() => alert(`Rejected ${req.name}`)}>
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Platform Activity */}
        <div className="dashboard-small-card">
          <div className="card-header-bar">
            <h4 className="card-heading">Platform Activity</h4>
          </div>

          <div className="activity-timeline">
            {activities.map((act) => {
              const ActIcon = act.icon;
              return (
                <div className="timeline-item" key={act.id}>
                  <div className="timeline-icon-container">
                    <div className="timeline-icon-box">
                      <ActIcon size={16} />
                    </div>
                    {act.id !== activities.length && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <p className="activity-title">{act.title}</p>
                    <p className="activity-desc">{act.desc}</p>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section Bento Widgets */}
      <div className="dashboard-bento-grid">
        {/* Sectors Widget */}
        <div className="bento-widget sectors-widget">
          <div className="bento-header">
            <h5 className="bento-title">Startup Sectors</h5>
            <PieChart size={18} className="bento-header-icon" />
          </div>
          <div className="sectors-list">
            {sectors.map((sec, idx) => (
              <div className="sector-row" key={idx}>
                <div className="sector-indicator" style={{ backgroundColor: sec.color }} />
                <span className="sector-name">{sec.name}</span>
                <span className="sector-percentage">{sec.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Initiative Promo Banner Widget */}
        <div className="bento-widget promo-banner-widget">
          <div className="promo-background-accent" />
          <div className="promo-inner-content">
            <h4 className="promo-title">Launch New Platform Initiatives</h4>
            <p className="promo-desc">
              Manage seasonal startup contests, investor matchmaking events, and global categories from one central command center.
            </p>
            <div className="promo-actions">
              <button className="btn-primary-light" onClick={() => alert('Start Campaign triggered!')}>Start Campaign</button>
              <button className="btn-secondary-light" onClick={() => alert('View Roadmap triggered!')}>View Roadmap</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
