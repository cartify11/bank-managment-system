import React, { useState, useRef, useEffect } from 'react';
import { typography } from '../../shared/design-system';
import { Search, ChevronDown, X, Check, User } from 'lucide-react';

export const AppSearchableSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Search by name, account number, or email...',
  required = false,
  disabled = false,
  allowCustom = false,
  icon: IconComponent = User,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const labelMatch = (opt.label || '').toLowerCase().includes(q);
    const valueMatch = (opt.value || '').toLowerCase().includes(q);
    const sublabelMatch = (opt.sublabel || '').toLowerCase().includes(q);
    return labelMatch || valueMatch || sublabelMatch;
  });

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFocusedIndex(0);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (opt) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { name, value: opt.value } });
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onChange) {
      onChange({ target: { name, value: '' } });
    }
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[focusedIndex]) {
        handleSelect(filteredOptions[focusedIndex]);
      } else if (allowCustom && searchQuery.trim()) {
        if (onChange) {
          onChange({ target: { name, value: searchQuery.trim() } });
        }
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        marginBottom: '1rem',
        position: 'relative',
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: isOpen ? '#b87c4c' : '#7a6658',
            transition: 'color 0.2s ease',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {label} {required && <span style={{ color: '#a83e2a' }}>*</span>}
        </label>
      )}

      {/* Main Trigger Box */}
      <div
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          minHeight: '42px',
          padding: '0.55rem 0.85rem',
          borderRadius: '10px',
          border: isOpen ? '1.5px solid #b87c4c' : '1.5px solid #e4d7c8',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          fontSize: typography.fontSize.sm,
          color: selectedOption ? '#2c1e16' : '#94a3b8',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(184,124,76,0.18)'
            : 'inset 0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, overflow: 'hidden' }}>
          <IconComponent size={16} style={{ color: (selectedOption || value) ? '#b87c4c' : '#94a3b8', flexShrink: 0 }} />
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: (selectedOption || value) ? 500 : 400,
              color: (selectedOption || value) ? '#2c1e16' : '#94a3b8',
            }}
          >
            {selectedOption ? selectedOption.label : (value || placeholder)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {(selectedOption || value) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear selection"
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: '#94a3b8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            style={{
              color: '#b87c4c',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Floating Popover Search Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#ffffff',
            borderRadius: '10px',
            border: '1.5px solid #ebdccb',
            boxShadow: '0 12px 28px rgba(44,30,22,0.14), 0 2px 8px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {/* Live Search Input Box */}
          <div
            style={{
              padding: '0.65rem 0.75rem',
              borderBottom: '1px solid #f1f5f9',
              background: '#faf5ee',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Search size={16} style={{ color: '#b87c4c', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFocusedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type to search name, account or email..."
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.85rem',
                color: '#2c1e16',
                fontFamily: typography.fontFamily,
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results Summary Subtitle */}
          <div
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.72rem',
              color: '#7a6658',
              background: '#fdfbf7',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Available Options</span>
            <span>
              {filteredOptions.length} of {options.length}
            </span>
          </div>

          {/* Filtered Options List */}
          <div
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              padding: '0.35rem',
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHovered = idx === focusedIndex;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected
                        ? '#faf5ee'
                        : isHovered
                        ? '#fcf9f5'
                        : 'transparent',
                      color: isSelected ? '#87532a' : '#2c1e16',
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.86rem',
                      transition: 'background 0.15s ease',
                      borderLeft: isSelected ? '3px solid #b87c4c' : '3px solid transparent',
                      marginBottom: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                      <span style={{ color: '#2c1e16', fontWeight: 500 }}>{opt.label}</span>
                      {opt.sublabel && (
                        <span style={{ fontSize: '0.72rem', color: '#7a6658' }}>{opt.sublabel}</span>
                      )}
                    </div>

                    {isSelected && (
                      <Check size={16} style={{ color: '#16a34a', flexShrink: 0, marginLeft: '0.5rem' }} />
                    )}
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                }}
              >
                No matches found for <strong style={{ color: '#2c1e16' }}>"{searchQuery}"</strong>
              </div>
            )}

            {/* Allow typing custom / unregistered entry */}
            {allowCustom && searchQuery.trim() && !options.some(o => o.value?.toLowerCase() === searchQuery.trim().toLowerCase() || o.label?.toLowerCase() === searchQuery.trim().toLowerCase()) && (
              <div
                onClick={() => {
                  if (onChange) {
                    onChange({ target: { name, value: searchQuery.trim() } });
                  }
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.65rem 0.75rem',
                  marginTop: '0.4rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  border: '1px dashed #b87c4c',
                  color: '#87532a',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#faf5ee')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <span>+ Use custom entry: <strong style={{ color: '#2c1e16' }}>"{searchQuery.trim()}"</strong></span>
                <span style={{ fontSize: '0.72rem', color: '#7a6658', background: '#ebdccb', padding: '2px 6px', borderRadius: '4px' }}>Custom</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSearchableSelect;
