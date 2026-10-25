import React from 'react';

export const Card = ({ title, children }) => {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      border: '1px solid #e2e8f0'
    }}>
      {title && <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e293b', fontSize: '1.1rem' }}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
