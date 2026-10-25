import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

export const Unauthorized = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <Card title="403 - Access Denied">
        <p style={{ color: '#ef4444' }}>
          You do not have the required permissions to access this page.
        </p>
        <Link to="/dashboard" style={{ color: '#2563eb', fontWeight: 'bold' }}>
          Return to Dashboard
        </Link>
      </Card>
    </div>
  );
};

export default Unauthorized;

