import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { typography } from '../../shared/design-system';

export const AppLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        /* Soft Luxury Cream Background (Exact reference match) */
        backgroundColor: '#f6f1ea',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(230, 200, 170, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(210, 170, 135, 0.15) 0%, transparent 50%)',
        fontFamily: typography.fontFamily,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Master Warm Wood Sidebar (Fixed) */}
      <AppSidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', minWidth: 0, overflow: 'hidden', zIndex: 1 }}>
        {/* Master Header */}
        <AppHeader />

        {/* Dynamic Screen View Content Container - Only this scrolls */}
        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem',
            minWidth: 0,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
