import React, { useState } from 'react';
import { typography } from '../../shared/design-system';

export const AppSelect = ({ label, name, value, onChange, options = [], required = false, disabled = false }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
      {label && (
        <label
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: focused ? '#b87c4c' : '#7a6658',
            transition: 'color 0.2s ease',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {label} {required && <span style={{ color: '#a83e2a' }}>*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '0.65rem 2.2rem 0.65rem 0.9rem',
          borderRadius: '10px',
          border: focused
            ? '1.5px solid #b87c4c'
            : '1.5px solid #e4d7c8',
          backgroundColor: '#ffffff',
          fontSize: typography.fontSize.sm,
          color: '#2c1e16',
          outline: 'none',
          fontFamily: typography.fontFamily,
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: focused
            ? '0 0 0 3px rgba(184,124,76,0.18)'
            : 'inset 0 1px 3px rgba(0,0,0,0.03)',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23b87c4c' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} style={{ background: '#ffffff', color: '#2c1e16' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AppSelect;
