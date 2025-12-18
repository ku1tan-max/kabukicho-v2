// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import GameGrid from './GameGrid';
import StatusPanel from './StatusPanel';
import { engine } from '../../kabukicho-engine'; // 우리가 만든 엔진 싱글톤
import './App.css';

function App() {
  const [gameState, setGameState] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);

  // 초기 로딩
  useEffect(() => {
    // 엔진 초기 상태 가져오기
    const initialState = {
      characters: engine.world.allCharacters,
      city: engine.world.city,
      turn: 0,
      logs: []
    };
    setGameState(initialState);
  }, []);

  // 턴 진행 함수
  const handleNextTurn = (targetX, targetY) => {
    const result = engine.nextTurn(targetX, targetY);
    setGameState(result);
  };

  // 캐릭터 클릭 시 상세 정보 조회
  const handleCharClick = (id) => {
    const detail = engine.getCharacterDetail(id);
    setSelectedChar(detail);
  };

  if (!gameState) return <div className="loading">카부키초 로딩 중... 🚬</div>;

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>은혼 피플: 카부키초 - 인간 실격</h1>
        <div className="city-info">
          <span>예산: {gameState.city.budget}엔</span>
          <span>세율: {gameState.city.taxRate}%</span>
        </div>
      </header>

      <main className="game-main">
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
  );
}

export default App;