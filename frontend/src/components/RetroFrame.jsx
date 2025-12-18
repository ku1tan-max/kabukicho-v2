// frontend/src/components/RetroFrame.jsx
import React from 'react';
import '../styles/Retro95.css';

const RetroFrame = ({ title, children, width }) => {
  return (
    <div className="retro-window" style={{ width: width || 'auto' }}>
      <div className="retro-title-bar">
        <span>{title} - [Apartment X: Kabukicho]</span>
        <div className="retro-window-controls">
          <button className="retro-button" style={{padding: '0 3px'}}>_</button>
          <button className="retro-button" style={{padding: '0 3px'}}>X</button>
        </div>
      </div>
      <div className="retro-window-content" style={{ padding: '10px' }}>
        {children}
      </div>
    </div>
  );
};

export default RetroFrame;