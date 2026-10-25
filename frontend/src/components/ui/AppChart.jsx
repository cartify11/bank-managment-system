import React from 'react';
import { colors } from '../../shared/design-system';

export const AppChart = ({ type = 'line', data = [], height = 220 }) => {
  if (type === 'line') {
    // Spline curve simulation matching reference photo's gold/bronze curve
    return (
      <div style={{ width: '100%', height: `${height}px`, position: 'relative' }}>
        <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b87c4c" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#b87c4c" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="#eee4d8" strokeDasharray="3 3" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#eee4d8" strokeDasharray="3 3" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#eee4d8" strokeDasharray="3 3" />
          <line x1="0" y1="165" x2="500" y2="165" stroke="#e4d7c8" />

          {/* Area fill under curve */}
          <path
            d="M 0,140 Q 80,160 160,80 T 320,110 T 500,40 L 500,165 L 0,165 Z"
            fill="url(#chartGradient)"
          />

          {/* Spline line */}
          <path
            d="M 0,140 Q 80,160 160,80 T 320,110 T 500,40"
            fill="none"
            stroke="#b87c4c"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data point tooltip highlights matching photo */}
          <circle cx="160" cy="80" r="5" fill="#f7ebd9" stroke="#b87c4c" strokeWidth="2.5" />
          <circle cx="320" cy="110" r="5" fill="#f7ebd9" stroke="#b87c4c" strokeWidth="2.5" />
          <circle cx="500" cy="40" r="5" fill="#f7ebd9" stroke="#b87c4c" strokeWidth="2.5" />
        </svg>

        {/* X Axis Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', color: '#7a6658', fontSize: '0.75rem' }}>
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
        </div>
      </div>
    );
  }

  // Bar Chart Representation for Reports
  return (
    <div style={{ width: '100%', height: `${height}px`, display: 'flex', alignItems: 'flex-end', gap: '0.75rem', padding: '1rem 0' }}>
      {[45, 65, 30, 85, 55, 90, 70, 60, 75, 95].map((val, idx) => (
        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: '100%',
              maxHeight: `${val}%`,
              height: `${val}%`,
              backgroundColor: idx % 2 === 0 ? '#b87c4c' : '#d8a070',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s ease',
            }}
          />
          <span style={{ fontSize: '0.7rem', color: '#7a6658', marginTop: '0.35rem' }}>
            M{idx + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AppChart;
