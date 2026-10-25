import React, { useState } from 'react';
import { typography } from '../../shared/design-system';

export const AppTabs = ({ tabs = [], activeTab, onTabChange }) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.3rem',
        padding: '0.3rem',
        background: '#faf5ee',
        borderRadius: '14px',
        marginBottom: '1.5rem',
        width: 'fit-content',
        border: '1px solid #eee4d8',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id && !isActive;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              padding: '0.5rem 1.15rem',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: isActive
                ? '#b87c4c'
                : isHovered
                ? '#f0e3d2'
                : 'transparent',
              color: isActive ? '#ffffff' : isHovered ? '#7c4d30' : '#7a6658',
              fontWeight: isActive ? 700 : 500,
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive
                ? '0 4px 12px rgba(184, 124, 76, 0.35)'
                : 'none',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              fontFamily: typography.fontFamily,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default AppTabs;
