import React, { useState } from 'react';
import { typography } from '../../shared/design-system';

export const AppCard = ({ title, subtitle, action, children, style }) => {
  const [hovered, setHovered] = useState(false);

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
          ? '0 12px 36px rgba(184, 124, 76, 0.15)'
          : '0 4px 20px rgba(140, 100, 70, 0.05)',
        padding: '1.5rem 1.75rem',
        marginBottom: '1.25rem',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: subtitle ? '0.25rem' : '1.1rem',
          }}
        >
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: '#2c1e16',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {subtitle && (
        <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginBottom: '1rem' }}>
          {subtitle}
        </div>
      )}
      {children}
    </div>
  );
};

export default AppCard;
