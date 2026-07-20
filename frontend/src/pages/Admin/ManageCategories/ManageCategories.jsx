import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  FolderOpen,
  Edit,
  Trash,
  Tag,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import './ManageCategories.css';

export default function ManageCategories() {
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { title: 'Total Categories', value: '18', type: 'primary' },
    { title: 'Subcategories', value: '74', type: 'secondary' },
    { title: 'Most Popular', value: 'Fintech (34%)', type: 'accent' },
    { title: 'Growth Rate', value: '+14% MoM', type: 'success' },
  ];

  const categoriesData = [
    { id: 1, name: 'Fintech', slug: 'fintech', startupsCount: 436, status: 'Active', color: '#004ac6' },
    { id: 2, name: 'Healthtech', slug: 'healthtech', startupsCount: 359, status: 'Active', color: '#943700' },
    { id: 3, name: 'SaaS', slug: 'saas', startupsCount: 282, status: 'Active', color: '#505f76' },
    { id: 4, name: 'Sustainability', slug: 'sustainability', startupsCount: 147, status: 'Active', color: '#10b981' },
    { id: 5, name: 'AI/ML', slug: 'ai-ml', startupsCount: 94, status: 'Active', color: '#f59e0b' },
    { id: 6, name: 'Edtech', slug: 'edtech', startupsCount: 61, status: 'Inactive', color: '#eceef0' },
  ];

  const filteredCategories = categoriesData.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-categories-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h2 className="admin-page-title">Manage Categories</h2>
          <p className="admin-page-subtitle">Organize and map global sectors for startups, investor feeds, and user profiles.</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={() => alert('New Category Modal Opened!')}>
            <Plus size={16} /> New Category
          </button>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="categories-stats-grid">
        {stats.map((stat, idx) => (
          <div className="category-stat-card" key={idx}>
            <span className="category-stat-title">{stat.title}</span>
            <span className={`category-stat-value ${stat.type}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Column Split */}
      <div className="categories-split-layout">
        {/* Left Column: List table */}
        <div className="categories-table-card">
          <div className="categories-toolbar">
            <div className="toolbar-search-box">
              <Search size={16} className="toolbar-search-icon" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="categories-table-overflow">
            <table className="categories-datatable">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug Identifier</th>
                  <th style={{ textAlign: 'center' }}>Active Startups</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-empty-row">
                      No categories found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <div className="category-cell">
                          <div className="category-color-dot" style={{ backgroundColor: cat.color }} />
                          <span className="category-name-text">{cat.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-slug-code">/{cat.slug}</span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700' }}>
                        {cat.startupsCount}
                      </td>
                      <td>
                        <span className={`category-status-pill ${cat.status.toLowerCase()}`}>
                          {cat.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-action-buttons">
                          <button className="row-icon-btn" title="Edit Category" onClick={() => alert(`Editing category ${cat.name}`)}>
                            <Edit size={14} />
                          </button>
                          <button className="row-icon-btn delete" title="Delete Category" onClick={() => alert(`Deleting category ${cat.name}`)}>
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Add Category Form Mini-Widget */}
        <div className="categories-form-card">
          <h4 className="card-heading">Quick Add Category</h4>
          <form className="quick-category-form" onSubmit={(e) => { e.preventDefault(); alert('Category added!'); }}>
            <div className="form-field">
              <label>Category Title</label>
              <input type="text" placeholder="e.g. Cleantech" required />
            </div>

            <div className="form-field">
              <label>Slug Identifier</label>
              <input type="text" placeholder="e.g. cleantech" required />
            </div>

            <div className="form-field">
              <label>Theme Color Tag</label>
              <div className="color-selectors-group">
                {['#004ac6', '#943700', '#505f76', '#10b981', '#f59e0b', '#ba1a1a'].map((col) => (
                  <button
                    type="button"
                    key={col}
                    className="color-picker-btn"
                    style={{ backgroundColor: col }}
                    onClick={() => alert(`Picked color: ${col}`)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
