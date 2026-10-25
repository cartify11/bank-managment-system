import React from 'react';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #cbd5e1',
        borderTop: '3px solid #0284c7',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <span style={{ color: '#64748b' }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
