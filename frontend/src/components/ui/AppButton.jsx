import React, { useState } from 'react';
import { typography, radius } from '../../shared/design-system';

export const AppButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  disabled = false,
  fullWidth = false,
  icon: Icon,
}) => {
  const [hovered, setHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: hovered ? '#f0e3d2' : '#f7ebd9',
          color: '#5c3a21',
          border: '1px solid #d8c2ad',
          boxShadow: hovered ? '0 4px 12px rgba(120, 80, 50, 0.12)' : '0 2px 4px rgba(120, 80, 50, 0.05)',
        };
      case 'outline':
        return {
          background: hovered ? 'rgba(184, 124, 76, 0.08)' : 'transparent',
          color: '#b87c4c',
          border: '1.5px solid #b87c4c',
          boxShadow: hovered ? '0 4px 12px rgba(184, 124, 76, 0.15)' : 'none',
        };
      case 'danger':
        return {
          background: hovered
            ? 'linear-gradient(135deg, #a83e2a 0%, #c44d37 100%)'
            : 'linear-gradient(135deg, #c44d37 0%, #a83e2a 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: hovered ? '0 4px 15px rgba(168, 62, 42, 0.35)' : '0 2px 8px rgba(168, 62, 42, 0.2)',
        };
      case 'ghost':
        return {
          background: hovered ? 'rgba(184, 124, 76, 0.08)' : 'transparent',
          color: hovered ? '#b87c4c' : '#7a6658',
          border: 'none',
          boxShadow: 'none',
        };
      case 'primary':
      default:
        return {
          background: hovered
            ? 'linear-gradient(135deg, #9c6439 0%, #b87c4c 60%, #cfa075 100%)'
            : 'linear-gradient(135deg, #b87c4c 0%, #cfa075 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: hovered
            ? '0 6px 18px rgba(184, 124, 76, 0.45)'
            : '0 4px 12px rgba(184, 124, 76, 0.3)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.38rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px' };
      case 'lg':
        return { padding: '0.8rem 1.75rem', fontSize: '1rem', borderRadius: '12px' };
      case 'md':
      default:
        return { padding: '0.58rem 1.2rem', fontSize: '0.875rem', borderRadius: '10px' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        fontWeight: typography.fontWeight.semibold,
        fontFamily: typography.fontFamily,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
        letterSpacing: '0.01em',
        ...getVariantStyles(),
        ...getSizeStyles(),
      }}
    >
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
};

export default AppButton;
