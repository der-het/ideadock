import React, { useState } from 'react';
import {
  FileBarChart,
  Calendar,
  Download,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  Users,
  Briefcase,
  Layers,
} from 'lucide-react';
import './Reports.css';

export default function Reports() {
  const [timeframe, setTimeframe] = useState('This Month');

  const cards = [
    { title: 'System Health', value: '99.98%', desc: 'Platform operational state', trend: 'Optimal', type: 'success' },
    { title: 'Active Connections', value: '14,842', desc: 'Active peer interactions', trend: '+15.2%', type: 'success' },
    { title: 'Investor Meetings', value: '438', desc: 'Scheduled matchmaking pitches', trend: '+8.4%', type: 'success' },
    { title: 'Platform Flagged Rate', value: '0.8%', desc: 'Moderated community content', trend: '-2.4%', type: 'error' },
  ];

  // Helper to generate coordinates for a SVG Line chart
  const lineData = [10, 45, 30, 85, 45, 90, 110, 80, 140, 130, 180, 195];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const width = 800;
  const height = 280;
  const maxVal = Math.max(...lineData);
  const minVal = Math.min(...lineData);
  const range = maxVal - minVal || 1;

  const points = lineData
    .map((val, index) => {
      const x = (index / (lineData.length - 1)) * (width - 80) + 40;
      const y = height - ((val - minVal) / range) * (height - 80) - 40;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="reports-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h2 className="admin-page-title">Reports & Analytics</h2>
          <p className="admin-page-subtitle">Track platform engagements, user acquisition curves, and server health logs.</p>
        </div>
        <div className="admin-header-actions">
          <div className="timeframe-selector">
            <Calendar size={14} className="timeframe-icon" />
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          <button className="btn-primary" onClick={() => alert('Downloading Analytical Report...')}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="reports-stats-grid">
        {cards.map((card, idx) => (
          <div className="report-stat-card" key={idx}>
            <div className="stat-card-row">
              <span className="stat-card-title">{card.title}</span>
              <span className={`stat-card-trend-pill ${card.type === 'error' ? 'red' : 'green'}`}>
                {card.trend}
              </span>
            </div>
            <h3 className="stat-card-val">{card.value}</h3>
            <p className="stat-card-desc">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Analytical Chart & Progress */}
      <div className="reports-dashboard-grid">
        {/* Main Growth Curve Chart */}
        <div className="chart-panel-card">
          <div className="panel-header">
            <h4 className="panel-title">User Growth Curve (Annual)</h4>
            <span className="panel-subtitle">Acquisitions across entrepreneurs and venture capitals</span>
          </div>

          <div className="chart-canvas-wrapper">
            <svg className="custom-report-chart" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = height - ratio * (height - 80) - 40;
                return (
                  <g key={idx}>
                    <line x1="40" y1={y} x2={width - 40} y2={y} stroke="var(--color-surface-container-high)" strokeDasharray="4 4" />
                    <text x="15" y={y + 4} fill="var(--color-on-surface-variant)" fontSize="10" fontWeight="600" opacity="0.7">
                      {Math.round(ratio * maxVal)}
                    </text>
                  </g>
                );
              })}

              {/* Chart Line Path */}
              <polyline
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Data Interactive circles */}
              {lineData.map((val, idx) => {
                const x = (idx / (lineData.length - 1)) * (width - 80) + 40;
                const y = height - ((val - minVal) / range) * (height - 80) - 40;
                return (
                  <g key={idx} className="chart-dot-group">
                    <circle cx={x} cy={y} r="5" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="3" />
                    <title>{labels[idx]}: {val} Signups</title>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {labels.map((lbl, idx) => {
                const x = (idx / (labels.length - 1)) * (width - 80) + 40;
                return (
                  <text key={idx} x={x} y={height - 10} fill="var(--color-on-surface-variant)" fontSize="11" fontWeight="600" textAnchor="middle" opacity="0.8">
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Category Breakdown Panel */}
        <div className="breakdown-panel-card">
          <div className="panel-header">
            <h4 className="panel-title">Sectors Volume Share</h4>
            <span className="panel-subtitle">Platform submission ratio by sector</span>
          </div>

          <div className="breakdown-progress-list">
            {[
              { name: 'Fintech Platforms', percentage: 34, count: '436', color: 'var(--color-primary)' },
              { name: 'Digital Health / Telehealth', percentage: 28, count: '359', color: 'var(--color-tertiary)' },
              { name: 'Enterprise SaaS Services', percentage: 22, count: '282', color: 'var(--color-secondary)' },
              { name: 'Sustainability & GreenTech', percentage: 11, count: '147', color: 'var(--color-success)' },
              { name: 'Autonomous ML Systems', percentage: 5, count: '61', color: 'var(--color-warning)' },
            ].map((sector, idx) => (
              <div className="breakdown-progress-row" key={idx}>
                <div className="row-labels">
                  <span className="sector-name-label">{sector.name}</span>
                  <span className="sector-count-label">{sector.count} ({sector.percentage}%)</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${sector.percentage}%`, backgroundColor: sector.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
