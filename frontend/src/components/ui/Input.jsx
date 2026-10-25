import React from 'react';

export const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          padding: '0.6rem 0.8rem',
          borderRadius: '6px',
          border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
          outline: 'none',
          fontSize: '0.95rem',
        }}
      />
      {error && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</span>}
    </div>
  );
};

export default Input;
