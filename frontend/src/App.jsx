import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
