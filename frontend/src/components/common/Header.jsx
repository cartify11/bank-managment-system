import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', color: '#fff' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
        Bank Management System Foundation
      </div>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} /> {user.username} ({user.role})
          </span>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.4rem 0.8rem',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
