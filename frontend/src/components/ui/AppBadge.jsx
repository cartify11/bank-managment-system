import React from 'react';
import { typography } from '../../shared/design-system';

export const AppBadge = ({ children, variant = 'success' }) => {
  const getColors = () => {
    switch (variant) {
      case 'warning':
        return { bg: '#faebd7', text: '#a0522d', border: '#e8cbb0', dot: '#a0522d' };
      case 'danger':
        return { bg: '#f5d5cb', text: '#a83e2a', border: '#e8b2a2', dot: '#a83e2a' };
      case 'info':
        return { bg: '#eddcc9', text: '#7c4d30', border: '#d8ba9e', dot: '#7c4d30' };
      case 'success':
      default:
        return { bg: '#eddcc9', text: '#87532a', border: '#d8ba9e', dot: '#87532a' };
    }
  };

  const style = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.22rem 0.7rem',
        borderRadius: '999px',
        backgroundColor: style.bg,
        color: style.text,
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        border: `1px solid ${style.border}`,
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: style.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
};

export default AppBadge;
