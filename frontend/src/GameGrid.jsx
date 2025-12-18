// frontend/src/GameGrid.jsx
import React from 'react';
import { GRID_SIZE, TILE_TYPES, BUILDINGS, MAP_OBJECTS } from '../../kabukicho-engine/constants/gameConfig';
import './GameGrid.css';

const GameGrid = ({ characters, onCellClick, onCharClick }) => {
  const getCellData = (x, y) => {
    // 1. 오브젝트 체크
    const obj = MAP_OBJECTS.find(o => o.x === x && o.y === y);
    if (obj) return { type: obj.type, name: obj.name, color: obj.color || '#333' };

    // 2. 건물 체크
    const b = BUILDINGS.find(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
    if (b) {
      const isEntrance = b.entrance?.x === x && b.entrance?.y === y;
      return { ...b, type: b.type || TILE_TYPES.STREET, isEntrance };
    }

    // 3. 중앙 공원 영역 (6,7 ~ 9,9)
    if (x >= 6 && x <= 9 && y >= 7 && y <= 9) return { type: TILE_TYPES.PARK, color: '#C1E1C1' };

    // 4. ㄹ자 도로 동선
    const isRoad = (y === 3 && x < 6) || (x === 4 && y >= 3 && y <= 10) || (y === 10 && x >= 4);
    if (isRoad) return { type: TILE_TYPES.ROAD, color: '#444' };

    // 5. 기본 바닥 (안전장치)
    return { type: TILE_TYPES.STREET, color: '#1a1a1a' };
  };

  return (
    <div className="game-grid-15">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);
        const data = getCellData(x, y);
        const char = characters?.find(c => Math.floor(c.x) === x && Math.floor(c.y) === y);

        return (
          <div 
            key={`${x}-${y}`} 
            className={`grid-tile ${(data.type || 'street').toLowerCase()}`}
            style={{ backgroundColor: data.color }}
            onClick={() => data.type !== TILE_TYPES.WALL && onCellClick(x, y)}
          >
            {data.isEntrance && <span className="entrance-marker">▲</span>}
            {data.name && data.x === x && data.y === y && <span className="label">{data.name}</span>}
            
            {char && (
              <div 
                className="char-dot-wrapper"
                onClick={(e) => { e.stopPropagation(); onCharClick(char.id); }}
              >
                <div className={`char-dot ${char.isPlayer ? 'player' : ''}`} />
                <span className="char-mini-name">{char.name}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GameGrid;