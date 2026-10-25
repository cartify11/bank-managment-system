import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

export const Home = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', fontFamily: 'sans-serif' }}>
      <Card title="Bank Management System - Phase 1 Architecture Foundation">
        <p style={{ color: '#475569', lineHeight: '1.6' }}>
          Welcome to the foundation of the Bank Management System. Phase 1 establishes the clean layered backend architecture, database normalization, Spring Security JWT authentication, RESTful APIs, and React.js app structure.
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
            Go to Login
          </Link>
          <Link to="/dashboard" style={{ padding: '0.6rem 1.2rem', background: '#0284c7', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
            Go to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;

