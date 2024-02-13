import React, { useState } from 'react';
import { getIcon } from './TagManager';
export const TageComponent = ({ title, alreadySelected, selectCurrent, deselectCurrent }) => {
  const [selected, setSelected] = useState(alreadySelected);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
    width: '200px',
    borderRadius: '10px',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.2)',
    padding: '10px',
  }

  const selectedStyle = {
    ...baseStyle,
    backgroundColor: '#007bff',
    color: 'white',
    boxShadow: '0px 4px 8px rgba(255, 255, 255, 0.5)'
  };

  const unselectedStyle = {
    ...baseStyle,
    backgroundColor: 'white',
    border: '#007bff solid 1px',
    color: '#007bff',
    ':hover': {
      backgroundColor: '#3a3f4b'
    }
  };

  const handleSelect = () => {
    if (selected) deselectCurrent(title);
    else selectCurrent(title);
    setSelected(!selected);
  }

  return (
    <div onClick={handleSelect} style={selected ? selectedStyle : unselectedStyle}>
      {getIcon(title)}
      <div style={{ marginLeft: '10px' }}>{title}</div>
    </div>
  );
}
