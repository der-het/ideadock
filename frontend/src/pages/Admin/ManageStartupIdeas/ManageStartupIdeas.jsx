import React, { useState } from 'react';
import {
  Lightbulb,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash,
  Rocket,
  Shield,
  Activity,
  Award,
  BookOpen,
} from 'lucide-react';
import './ManageStartupIdeas.css';

export default function ManageStartupIdeas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const stats = [
    { title: 'Total Ideas', value: '1,284', trend: '+12%', trendType: 'success', icon: Lightbulb },
    { title: 'Pending Review', value: '43', trend: 'Neutral', trendType: 'neutral', icon: Clock },
    { title: 'Approved', value: '912', trend: 'Stable', trendType: 'success', icon: CheckCircle },
    { title: 'Flagged', value: '12', trend: 'Urgent', trendType: 'error', icon: AlertTriangle },
  ];

  const ideasData = [
    {
      id: 1,
      name: 'EcoStream AI',
      founder: 'Marcus Chen',
      email: 'marcus@ecostream.ai',
      category: 'Sustainability',
      datePosted: 'Oct 24, 2023',
      status: 'Active',
      icon: Rocket,
      iconColor: '#004ac6',
    },
    {
      id: 2,
      name: 'PulseVerify',
      founder: 'Sarah Jenkins',
      email: 's.jenkins@pulse.io',
      category: 'Healthtech',
      datePosted: 'Oct 22, 2023',
      status: 'Under Review',
      icon: Activity,
      iconColor: '#505f76',
    },
    {
      id: 3,
      name: 'CryptoShieldX',
      founder: 'Alex Rivera',
      email: 'rivera.a@web3.com',
      category: 'Fintech',
      datePosted: 'Oct 20, 2023',
      status: 'Flagged',
      icon: Shield,
      iconColor: '#ba1a1a',
    },
    {
      id: 4,
      name: 'LearnSphere',
      founder: 'Dr. Lisa M.',
      email: 'lisa@learnsphere.edu',
      category: 'Edtech',
      datePosted: 'Oct 19, 2023',
      status: 'Active',
      icon: BookOpen,
      iconColor: '#943700',
    },
    {
      id: 5,
      name: 'Nexus Robotics',
      founder: 'James Wilson',
      email: 'jw@nexus.io',
      category: 'AI/ML',
      datePosted: 'Oct 18, 2023',
      status: 'Active',
      icon: Award,
      iconColor: '#004ac6',
    },
  ];

  const filteredIdeas = ideasData.filter((idea) => {
    const matchesSearch =
      idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.founder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || idea.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || idea.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="manage-ideas-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h2 className="admin-page-title">Manage Startup Ideas</h2>
          <p className="admin-page-subtitle">Review, approve, and moderate submitted startup concepts.</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={() => alert('New Idea Dialog Opened!')}>
            <Plus size={16} /> New Idea
          </button>
          <button className="btn-secondary" onClick={() => alert('Exporting CSV...')}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Bento Stats Summary */}
      <div className="ideas-stats-grid">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div className="idea-stat-card" key={idx}>
              <div className="idea-stat-header">
                <div className={`stat-icon-box ${stat.trendType}`}>
                  <IconComponent size={20} />
                </div>
                {stat.trend && (
                  <span className={`idea-stat-trend-badge ${stat.trendType}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="idea-stat-title">{stat.title}</p>
              <h3 className="idea-stat-value">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="ideas-table-card">
        {/* Filter / Search Bar */}
        <div className="table-filter-toolbar">
          <div className="toolbar-search-field">
            <Search size={16} className="search-field-icon" />
            <input
              type="text"
              placeholder="Search startup ideas or founders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-select-filters">
            <div className="select-wrapper">
              <Filter size={14} className="select-icon" />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Healthtech">Healthtech</option>
                <option value="Fintech">Fintech</option>
                <option value="Edtech">Edtech</option>
                <option value="AI/ML">AI/ML</option>
              </select>
            </div>

            <div className="select-wrapper">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="ideas-table-overflow">
          <table className="ideas-datatable">
            <thead>
              <tr>
                <th>Startup Name</th>
                <th>Founder</th>
                <th>Category</th>
                <th>Date Posted</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdeas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-row">
                    No startup ideas match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredIdeas.map((idea) => {
                  const StartupIcon = idea.icon;
                  return (
                    <tr key={idea.id} className={`status-row-${idea.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      <td>
                        <div className="startup-cell">
                          <div className="startup-icon-box" style={{ color: idea.iconColor, backgroundColor: `${idea.iconColor}12` }}>
                            <StartupIcon size={18} />
                          </div>
                          <span className="startup-name">{idea.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="founder-info-box">
                          <span className="founder-name">{idea.founder}</span>
                          <span className="founder-email">{idea.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-pill">{idea.category}</span>
                      </td>
                      <td className="posted-date-cell">{idea.datePosted}</td>
                      <td>
                        <span className={`status-badge-chip ${idea.status.replace(/\s+/g, '-').toLowerCase()}`}>
                          <span className="status-badge-dot" />
                          {idea.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-action-buttons">
                          <button className="row-icon-btn" title="View Details" onClick={() => alert(`Viewing detailed overview for ${idea.name}`)}>
                            <Eye size={14} />
                          </button>
                          <button className="row-icon-btn" title="Edit Concept" onClick={() => alert(`Editing startup concept ${idea.name}`)}>
                            <Edit size={14} />
                          </button>
                          <button className="row-icon-btn delete" title="Delete Concept" onClick={() => alert(`Deleting startup concept ${idea.name}`)}>
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="table-footer-pagination">
          <span className="pagination-summary">
            Showing 1-{filteredIdeas.length} of 1,284 entries
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

      {/* Pro Tips Section */}
      <div className="tips-grid">
        <div className="tips-card">
          <div className="tips-icon-wrapper">
            <CheckCircle size={24} />
          </div>
          <div className="tips-content">
            <h4 className="tips-title">Pro Tip: Bulk Actions</h4>
            <p className="tips-description">
              You can select multiple ideas by clicking checkboxes (upcoming in release 2.4) to approve or reject items in batches, saving significant moderation time.
            </p>
          </div>
        </div>

        <div className="tips-card secondary-tip">
          <div className="tips-icon-wrapper">
            <Shield size={24} />
          </div>
          <div className="tips-content">
            <h4 className="tips-title">Moderation Rules</h4>
            <p className="tips-description">
              Flagged ideas are automatically hidden from the public feed until an administrator verifies compliance with the community guidelines. Always provide a clear reason for rejections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
