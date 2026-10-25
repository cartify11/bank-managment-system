import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

export const NotFound = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <Card title="404 - Page Not Found">
        <p style={{ color: '#7a6658' }}>
          The requested page does not exist.
        </p>
        <Link to="/dashboard" style={{ color: '#2563eb', fontWeight: 'bold' }}>
          Return to Dashboard
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;


