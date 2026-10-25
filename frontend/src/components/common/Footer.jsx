import React from 'react';

export const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', background: '#0f172a', color: '#64748b', fontSize: '0.875rem' }}>
      &copy; {new Date().getFullYear()} Bank Management System. Phase 1 Architecture Foundation.
    </footer>
  );
};

export default Footer;
