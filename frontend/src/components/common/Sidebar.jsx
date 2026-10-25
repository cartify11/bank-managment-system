import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside style={{ width: '240px', background: '#0f172a', color: '#94a3b8', padding: '1.5rem', minHeight: 'calc(100vh - 60px)' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/dashboard" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>
          Dashboard
        </Link>
        {user?.role === 'ROLE_ADMIN' && (
          <Link to="/admin/users" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>
            User Management
          </Link>
        )}
        {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_EMPLOYEE') && (
          <Link to="/customers" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>
            Customers
          </Link>
        )}
        <Link to="/accounts" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>
          Accounts
        </Link>
        <Link to="/transactions" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>
          Transactions
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
