import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

export default function StatCard({
  title,
  value,
  icon: IconComponent,
  trend,
  trendType = 'neutral', // success, warning, error, neutral
  sparklineData,
}) {
  const getTrendClass = () => {
    switch (trendType) {
      case 'success':
        return 'trend-success';
      case 'warning':
        return 'trend-warning';
      case 'error':
        return 'trend-error';
      default:
        return 'trend-neutral';
    }
  };

  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length === 0) return null;
    
    const width = 100;
    const height = 40;
    const maxVal = Math.max(...sparklineData);
    const minVal = Math.min(...sparklineData);
    const range = maxVal - minVal || 1;

    const points = sparklineData
      .map((val, index) => {
        const x = (index / (sparklineData.length - 1)) * width;
        const y = height - ((val - minVal) / range) * (height - 8) - 4; // Padding
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="stat-card-sparkline" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="stat-card-widget">
      <div className="stat-card-header">
        {IconComponent && (
          <div className="stat-card-icon-wrapper">
            <IconComponent size={20} className="stat-card-icon" />
          </div>
        )}
        {trend && (
          <span className={`stat-card-trend ${getTrendClass()}`}>
            {trendType === 'success' && <TrendingUp size={12} style={{ marginRight: '2px' }} />}
            {trendType === 'error' && <TrendingDown size={12} style={{ marginRight: '2px' }} />}
            {trend}
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <p className="stat-card-title">{title}</p>
        <div className="stat-card-footer">
          <h3 className="stat-card-value">{value}</h3>
          {renderSparkline()}
        </div>
      </div>
    </div>
  );
}
