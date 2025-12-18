import React from 'react';
import './GameGrid.css';

function GameGrid({ grid, onCellClick }) {
  // 그리드가 없으면 대기 화면 🚬
  if (!grid || grid.length === 0) return <div className="loading">카부키초 로딩 중...</div>;

  const getJobColor = (job) => {
    if (job === '경찰') return '#3498db';
    if (job === '야쿠자') return '#e74c3c';
    if (job === '해결사') return '#f1c40f';
    return '#95a5a6';
  };

  const getCharIcon = (cell) => {
    if (cell.isPlayer || cell.name.includes("긴토키")) return "🍓";
    if (cell.name.includes("히지카타")) return "🚬";
    if (cell.name.includes("오키타")) return "🎯";
    if (cell.name.includes("카구라")) return "🌂";
    if (cell.name.includes("신파치")) return "👓";
    return cell.currentEmoji || "👤";
  };

  const getLandmark = (x, y) => {
    if (x === 2 && y === 3) return "🏢"; // 회사
    if (x === 8 && y === 0) return "🏪"; // 상점
    if (x === 8 && y === 6) return "🎰"; // 파친코
    return null;
  };

  return (
    <div className="grid-map">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className="grid-cell"
            onClick={() => onCellClick(x, y)}
          >
            {/* 바닥 건물 🚬 */}
            <span className="landmark">{getLandmark(x, y)}</span>

            {/* 캐릭터 레이어 (여기 안에 cell 관련 로직을 다 넣어야 에러 안 난다 🚬) */}
            {cell && (
              <div 
                className={`character ${cell.isPlayer ? 'player' : 'npc'}`}
                style={{ border: `2px solid ${getJobColor(cell.job)}`, position: 'relative' }}
              >
                <span className="char-icon">{getCharIcon(cell)}</span>
                <div className="name-label">{cell.name}</div>
                
                {/* 말풍선 시스템 (추가!) 🚬 */}
                {cell.currentMsg && (
                  <div className="speech-bubble">{cell.currentMsg}</div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default GameGrid;