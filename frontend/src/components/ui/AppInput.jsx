import React, { useState } from 'react';
import { typography } from '../../shared/design-system';

export const AppInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
}) => {
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
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <Icon
            size={17}
            style={{
              position: 'absolute',
              left: '13px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: focused ? '#b87c4c' : '#a39082',
              transition: 'color 0.2s ease',
              pointerEvents: 'none',
            }}
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: Icon ? '0.65rem 0.9rem 0.65rem 2.6rem' : '0.65rem 0.9rem',
            borderRadius: '10px',
            border: error
              ? '1.5px solid #a83e2a'
              : focused
              ? '1.5px solid #b87c4c'
              : '1.5px solid #e4d7c8',
            backgroundColor: disabled
              ? '#f0e6da'
              : focused
              ? '#ffffff'
              : '#ffffff',
            fontSize: typography.fontSize.sm,
            color: '#2c1e16',
            outline: 'none',
            fontFamily: typography.fontFamily,
            boxSizing: 'border-box',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: error
              ? '0 0 0 3px rgba(168,62,42,0.15)'
              : focused
              ? '0 0 0 3px rgba(184,124,76,0.18)'
              : 'inset 0 1px 3px rgba(0,0,0,0.03)',
          }}
        />
      </div>
      {error && (
        <span style={{ color: '#a83e2a', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
};

export default AppInput;
