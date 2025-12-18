// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import GameGrid from './GameGrid';
import { engine } from '../../kabukicho-engine';
import './App.css';

function App() {
  const [world, setWorld] = useState(engine.world);
  const [selectedChar, setSelectedChar] = useState(null);
  const [globalLogs, setGlobalLogs] = useState(["카부키초에 오신 것을 환영합니다."]);

  const handleNextTurn = (tx, ty) => {
    const result = engine.nextTurn(tx, ty);
    setWorld({ ...engine.world });
    if (result.logs) setGlobalLogs(prev => [...result.logs, ...prev].slice(0, 50));
    
    // 선택된 캐릭터가 있다면 로그 업데이트
    if (selectedChar) {
      const updated = engine.world.allCharacters.find(c => c.id === selectedChar.id);
      setSelectedChar(updated);
    }
  };

  return (
    <div className="kabukicho-retro-app">
      <header className="game-header">
        <h1>KABUKICHO SHIM-Z V2.0</h1>
        <div className="status-bar">TURN: {engine.turn?.currentTurn || 0} | 🚬 마요네즈 잔량: MAX</div>
      </header>

      <div className="main-layout">
        <section className="grid-section">
          <GameGrid 
            characters={world.allCharacters} 
            onCellClick={(x, y) => handleNextTurn(x, y)}
            onCharClick={(id) => setSelectedChar(world.allCharacters.find(c => c.id === id))}
          />
        </section>

        <aside className="log-sidebar">
          <div className="briefing-panel">
            <h3>📰 카부키초 브리핑</h3>
            <div className="scroll-box">
              {globalLogs.map((log, i) => <p key={i} className="log-item">{log}</p>)}
            </div>
          </div>

          <div className="personal-panel">
            <h3>📝 개인 블로그: {selectedChar?.name || "---"}</h3>
            <div className="scroll-box">
              {selectedChar?.blog.length > 0 ? (
                selectedChar.blog.map((post, i) => <p key={i} className="blog-post">{post}</p>)
              ) : (
                <p className="empty-msg">기록된 사건이 없습니다.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;