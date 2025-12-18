// frontend/src/StatusPanel.jsx
import React from 'react';

function StatusPanel({ player, selectedNpc, logs, news }) {
  // --- 호감도 텍스트 변환 로직 [자바의 affectionMap 기반] 🚬 ---
  const getAffectionText = (score) => {
    if (score >= 50) return "💕 죽고 못 사는 사이";
    if (score >= 20) return "😊 꽤나 친밀함";
    if (score <= -20) return "💢 보면 칼 뽑음";
    if (score <= -50) return "💀 철천지원수";
    return "😐 그냥 저냥";
  };

  return (
    <aside className="status-panel">
      {/* 1. 뉴스 전광판 (Small) 🚬 */}
      <div className="status-section news-box">
        <h4>📢 카부키초 브리핑</h4>
        <p className="news-content">{news}</p>
      </div>

      {/* 2. 플레이어(긴토키) 상태 🚬 */}
      {player && (
        <div className="status-section player-card">
          <h3>🍓 {player.name} <small>[{player.job}]</small></h3>
          <div className="stat-grid">
            <span>❤️ HP: {player.hp}</span>
            <span>💰 {player.money}엔</span>
            <span>🍙 허기: {player.hunger}</span>
            <span>🍭 당분: {player.sugar}</span>
          </div>
          <p className="inventory">🎒 가방: {player.inventory.length > 0 ? player.inventory.join(', ') : '비어있음'}</p>
        </div>
      )}

      {/* 3. 선택된 NPC 상세 정보 & 관계도 🚬 */}
      {selectedNpc ? (
        <div className="status-section npc-card selected">
          <h3>👤 {selectedNpc.name}</h3>
          <p className="relation-text">
            관계: <strong>{getAffectionText(selectedNpc.affectionMap[player.id] || 0)}</strong>
          </p>
          <p>특징: {selectedNpc.trait}</p>
          <div className="action-buttons">
            <button className="btn-money">💸 1000엔 송금</button>
            <button className="btn-item">🥄 아이템 선물</button>
          </div>
        </div>
      ) : (
        <div className="status-section npc-card placeholder">
          <p>주민을 클릭하면 상세 정보를 볼 수 있다. 🚬</p>
        </div>
      )}

      {/* 4. 게임 로그 🚬 */}
      <div className="status-section log-window">
        <h4>📜 카부키초 24시</h4>
        <div className="log-list">
          {logs.map((log, i) => (
            <div key={i} className="log-item">{log}</div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default StatusPanel;