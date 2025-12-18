// frontend/src/GameGrid.jsx
import React from 'react';
import './GameGrid.css';

const GameGrid = ({ characters, gridSize, onCellClick, onCharClick }) => {
  const renderGrid = () => {
    const cells = [];
    // 20x20 그리드 생성
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // 해당 좌표에 캐릭터가 있는지 확인
        const char = characters.find(c => c.x === x && c.y === y);
        
        cells.push(
          <div 
            key={`${x}-${y}`} 
            className="grid-cell"
            onClick={() => onCellClick(x, y)}
          >
            {char && (
              <div 
                className={`character-unit ${char.isPlayer ? 'player' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCharClick(char.id);
                }}
              >
                <span className="char-emoji">{char.currentEmoji || (char.gender === 'M' ? '🚬' : '🌸')}</span>
                {char.isBlue && <span className="status-effect">💧</span>}
                <div className="char-name">{char.name}</div>
                {char.currentMsg && <div className="bubble">{char.currentMsg}</div>}
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div 
      className="game-grid" 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)` 
      }}
    >
      {renderGrid()}
    </div>
  );
};

export default GameGrid;