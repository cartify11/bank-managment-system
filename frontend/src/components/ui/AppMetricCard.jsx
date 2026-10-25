import React, { useState } from 'react';
import { typography, radius } from '../../shared/design-system';

export const AppMetricCard = ({ title, value, badgeText, badgeVariant = 'success', icon: Icon }) => {
  const [hovered, setHovered] = useState(false);

  const getBadgeColors = () => {
    switch (badgeVariant) {
      case 'danger':
        return { bg: '#f5d5cb', text: '#a83e2a', border: '#e8b2a2' };
      case 'warning':
        return { bg: '#faebd7', text: '#a0522d', border: '#e8cbb0' };
      case 'info':
        return { bg: '#eddcc9', text: '#7c4d30', border: '#d8ba9e' };
      case 'success':
      default:
        return { bg: '#eddcc9', text: '#87532a', border: '#d8ba9e' };
    }
  };

  const badgeStyle = getBadgeColors();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: hovered
          ? '1px solid #cfa075'
          : '1px solid #eee4d8',
        boxShadow: hovered
          ? '0 12px 30px rgba(184, 124, 76, 0.15)'
          : '0 4px 18px rgba(140, 100, 70, 0.05)',
        padding: '1.25rem 1.5rem',
        flex: 1,
        minWidth: '200px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      {/* Top warm gold accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #d8a070, #b87c4c, #9c6439)',
          opacity: hovered ? 1 : 0.8,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#7a6658', fontWeight: typography.fontWeight.semibold, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
        </span>
        {badgeText && (
          <span
            style={{
              padding: '0.2rem 0.65rem',
              borderRadius: radius.full,
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              fontSize: '0.70rem',
              fontWeight: typography.fontWeight.bold,
              border: `1px solid ${badgeStyle.border}`,
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div
          style={{
            fontSize: '2rem',
            fontWeight: typography.fontWeight.bold,
            color: '#2c1e16',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
        >
          {value}
        </div>
        {Icon && (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f7ebd9 0%, #eddcc9 100%)',
              border: '1px solid #d8ba9e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#87532a',
              boxShadow: '0 2px 8px rgba(135, 83, 42, 0.12)',
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppMetricCard;
