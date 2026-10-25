import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2rem',
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
