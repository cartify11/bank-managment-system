import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { colors, typography, radius } from '../shared/design-system';
import AppInput from '../components/ui/AppInput';
import AppButton from '../components/ui/AppButton';
import { Building2, Lock, User } from 'lucide-react';

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f6f1ea',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(230, 200, 170, 0.25) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(210, 170, 135, 0.25) 0%, transparent 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: typography.fontFamily,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 16px 48px rgba(140, 100, 70, 0.12)',
          padding: '2.5rem 2rem',
          border: '1px solid #eee4d8',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top gold accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #d8a070 0%, #b87c4c 50%, #9c6439 100%)',
          }}
        />

        {/* Brand Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '0.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: radius.md,
              background: 'linear-gradient(135deg, #d8a070 0%, #b87c4c 100%)',
              color: '#2c1e16',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(184, 124, 76, 0.35)',
            }}
          >
            <Building2 size={32} />
          </div>
          <h2 style={{ margin: '0 0 0.4rem 0', color: '#2c1e16', fontSize: typography.fontSize.xl, fontWeight: 700 }}>
            Bank Management System
          </h2>
          <p style={{ margin: 0, color: '#7a6658', fontSize: typography.fontSize.sm }}>
            Sign in to access your enterprise banking portal
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#f5d5cb',
              color: '#a83e2a',
              borderRadius: radius.md,
              marginBottom: '1.25rem',
              fontSize: typography.fontSize.xs,
              fontWeight: 600,
              border: '1px solid #e8b2a2',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AppInput
            label="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="admin / employee / customer"
            required
            icon={User}
          />
          <AppInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: typography.fontSize.xs, color: '#3e2e24', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#b87c4c', width: '16px', height: '16px', cursor: 'pointer' }} /> Remember me
            </label>
            <a href="#forgot" style={{ fontSize: typography.fontSize.xs, color: '#b87c4c', textDecoration: 'none', fontWeight: 600 }}>
              Forgot password?
            </a>
          </div>

          <AppButton type="submit" fullWidth disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </AppButton>
        </form>
      </div>
    </div>
  );
};

export default Login;

