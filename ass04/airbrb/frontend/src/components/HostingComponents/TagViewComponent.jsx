import React from 'react';
import { getIcon } from './TagManager';

export const TageViewComponent = ({ title }) => {
  const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
    width: '180px',
    borderRadius: '10px',
    backgroundColor: '#f5f5f5',
    color: 'black',
    border: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    margin: '5px',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  };

  return (
    <div style={baseStyle}>
      <div style={contentStyle}>
        {getIcon(title)}
        <div style={{ fontWeight: 'bold' }}>{title}</div> {/* 加粗字体 */}
      </div>
    </div>
  );
}
