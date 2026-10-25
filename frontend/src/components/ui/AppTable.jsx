import React, { useState } from 'react';
import { typography, radius } from '../../shared/design-system';

export const AppTable = ({ columns = [], data = [], keyField = 'id', emptyMessage = 'No records found' }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: '14px',
        border: '1px solid #eee4d8',
        boxShadow: '0 2px 10px rgba(140, 100, 70, 0.04)',
        background: '#ffffff',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontFamily: typography.fontFamily,
        }}
      >
        <thead>
          <tr
            style={{
              background: 'linear-gradient(135deg, #f7ebd9 0%, #eddcc9 100%)',
              borderBottom: '1.5px solid #e4d7c8',
            }}
          >
            {columns.map((col, index) => (
              <th
                key={index}
                style={{
                  padding: '0.85rem 1.1rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#7c4d30',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#7a6658',
                  fontSize: typography.fontSize.sm,
                  background: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>📋</span>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const isHovered = hoveredRow === rowIndex;
              return (
                <tr
                  key={row[keyField] || rowIndex}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid #eee4d8',
                    transition: 'all 0.18s ease',
                    backgroundColor: isHovered
                      ? '#f7edde'
                      : rowIndex % 2 === 0
                      ? '#ffffff'
                      : '#faf5ee',
                    boxShadow: isHovered ? 'inset 3px 0 0 #b87c4c' : 'inset 3px 0 0 transparent',
                    cursor: 'default',
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        padding: '0.85rem 1.1rem',
                        fontSize: typography.fontSize.sm,
                        color: isHovered ? '#2c1e16' : '#4a382c',
                        verticalAlign: 'middle',
                        transition: 'color 0.18s ease',
                      }}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppTable;
