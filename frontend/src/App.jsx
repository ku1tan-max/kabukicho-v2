import React, { useState, useEffect } from 'react';
import GameGrid from './GameGrid';
import StatusPanel from './StatusPanel';

function App() {
  const [grid, setGrid] = useState([]);
  const [player, setPlayer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedNpc, setSelectedNpc] = useState(null);

  // 턴 처리 핸들러 (이게 함수 안에 있어야 함! 🚬)
  const handleTurn = async (tx, ty) => {
    try {
      const response = await fetch('http://localhost:8080/api/game/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetX: tx, targetY: ty })
      });
      const data = await response.json();
      // 데이터 업데이트 로직...
    } catch (err) {
      console.error("카부키초 엔진 정지: ", err);
    }
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <GameGrid grid={grid} onCellClick={handleTurn} />
      <StatusPanel player={player} selectedNpc={selectedNpc} logs={logs} />
    </div>
  );
}

export default App;