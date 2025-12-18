// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import GameGrid from './GameGrid';
import StatusPanel from './StatusPanel';
import { engine } from '../../kabukicho-engine'; 
import './App.css';

function App() {
  const [gameState, setGameState] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);

  useEffect(() => {
    // 초기 엔진 데이터 로드
    const initialState = {
      characters: [...engine.world.allCharacters],
      city: engine.world.city,
      turn: 0,
      logs: ["카부키초에 어서와라. 🚬"]
    };
    setGameState(initialState);
  }, []);

  const handleNextTurn = (targetX, targetY) => {
    // 엔진에 턴 진행 요청
    const result = engine.nextTurn(targetX, targetY);
    setGameState({ ...result });
  };

  const handleCharClick = (id) => {
    const detail = engine.getCharacterDetail(id);
    setSelectedChar(detail);
  };

  if (!gameState) return <div className="loading">부팅 중...</div>;

  // 플레이어 우울 상태($blue) 체크
  const player = gameState.characters.find(c => c.isPlayer);
  const isPlayerBlue = player?.isBlue;

  return (
    <div className={`app-container ${isPlayerBlue ? 'blue-mood' : ''}`}>
      <div className="retro-window main-frame">
        <div className="retro-title-bar">
          <span>KABUKICHO_PEOPLE.EXE</span>
          <div className="window-controls">
            <span>_</span><span>X</span>
          </div>
        </div>
        
        <header className="stats-header">
          <div className="stat-item">GP: {gameState.city.budget}</div>
          <div className="stat-item">세율: {gameState.city.taxRate}%</div>
          {gameState.city.policyTimer > 0 && (
            <div className="policy-timer">심의 중: {gameState.city.policyTimer}분</div>
          )}
          <div className="stat-item">Turn: {gameState.turn}</div>
        </header>

        <main className="game-body">
          <GameGrid 
            characters={gameState.characters} 
            gridSize={engine.world.gridSize}
            onCellClick={handleNextTurn}
            onCharClick={handleCharClick}
          />
          <StatusPanel 
            selectedChar={selectedChar} 
            logs={gameState.logs}
            news={gameState.city.news}
          />
        </main>
      </div>
    </div>
  );
}

export default App;