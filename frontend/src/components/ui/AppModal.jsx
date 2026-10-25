import React, { useEffect } from 'react';
import { typography } from '../../shared/design-system';
import { X } from 'lucide-react';

export const AppModal = ({ isOpen, onClose, title, children, maxWidth = '520px' }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(44, 30, 22, 0.60)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeInOverlay 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInModal {
          from { opacity: 0; transform: scale(0.94) translateY(-16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1px solid #cfa075',
          boxShadow: '0 24px 60px rgba(78, 41, 18, 0.25)',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          animation: 'slideInModal 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Top gold accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '3px',
            borderRadius: '22px 22px 0 0',
            background: 'linear-gradient(90deg, #d8a070 0%, #b87c4c 50%, #9c6439 100%)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingTop: '0.2rem',
            position: 'relative',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: '#2c1e16',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#f7ebd9',
              border: '1px solid #d8c2ad',
              cursor: 'pointer',
              color: '#7c4d30',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <X size={17} />
          </button>
        </div>

        <div style={{ position: 'relative' }}>{children}</div>
      </div>
    </div>
  );
};

export default AppModal;
