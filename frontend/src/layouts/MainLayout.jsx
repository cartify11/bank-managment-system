import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f8fafc' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
