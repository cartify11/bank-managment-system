import React from 'react';

export const Button = ({ children, type = 'button', onClick, disabled = false, variant = 'primary' }) => {
  const styles = {
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    border: 'none',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    background: variant === 'primary' ? '#2563eb' : variant === 'secondary' ? '#64748b' : '#dc2626',
    color: '#ffffff',
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={styles}>
      {children}
    </button>
  );
};

export default Button;
