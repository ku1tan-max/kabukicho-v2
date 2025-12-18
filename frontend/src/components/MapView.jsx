// frontend/src/components/MapView.jsx
import React, { useState, useEffect } from 'react';
import './MapView.css';
import { WorldManager } from '../../../kabukicho-engine/managers/WorldManager';
import { GRID_SIZE } from '../../../kabukicho-engine/constants/gameConfig';

const MapView = () => {
    // 엔진 인스턴스 초기화
    const [world, setWorld] = useState(new WorldManager());
    const [selectedChar, setSelectedChar] = useState(null);
    const [publicLogs, setPublicLogs] = useState(["카부키초에 어서와라. 🚬"]);

    // 초기 로드 시 플레이어(긴토키)를 기본 선택
    useEffect(() => {
        const player = world.allCharacters.find(c => c.isPlayer);
        if (player) setSelectedChar(player);
    }, [world]);

    return (
        <div className="kabukicho-layout">
            {/* 1. 메인 맵 렌더링 영역 (15x15 격자) */}
            <main className="map-area">
                <div 
                    className="grid-board" 
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                >
                    {world.gridMap.flat().map((tile, idx) => {
                        // 해당 타일에 캐릭터가 있는지 확인
                        const charOnTile = world.allCharacters.find(
                            c => Math.floor(c.x) === tile.x && Math.floor(c.y) === tile.y
                        );

                        return (
                            <div 
                                key={`tile-${idx}`} 
                                className="tile" 
                                style={{ backgroundColor: tile.color || '#1a1a1a' }}
                            >
                                {/* 출입구 표시 (흰색 삼각형) */}
                                {tile.isEntrance && <span className="entrance-marker">▲</span>}

                                {/* 캐릭터 도트 표시 */}
                                {charOnTile && (
                                    <div 
                                        className={`char-unit ${charOnTile.isPlayer ? 'player' : ''}`}
                                        onClick={() => setSelectedChar(charOnTile)}
                                    >
                                        <div className="dot"></div>
                                        <span className="char-name">{charOnTile.name}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* 2. 로그 및 상태 사이드바 */}
            <aside className="sidebar">
                {/* 마을 공용 브리핑 영역 */}
                <section className="log-panel public-briefing">
                    <h3>📢 카부키초 브리핑</h3>
                    <div className="log-list">
                        {publicLogs.map((log, i) => (
                            <div key={i} className="log-item">{log}</div>
                        ))}
                    </div>
                </section>

                {/* 선택된 캐릭터의 개인 사생활 로그 (@VT, $af 반영) */}
                <section className="log-panel private-logs">
                    <h3>📜 개인 로그: {selectedChar?.name || '---'}</h3>
                    <div className="log-list">
                        {selectedChar?.blogLogs && selectedChar.blogLogs.length > 0 ? (
                            selectedChar.blogLogs.map((log, i) => (
                                <div key={i} className="log-item">
                                    <span className="log-time">[{log.time}]</span> {log.content}
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">기록된 활동이 없습니다. 🚬</p>
                        )}
                    </div>
                    
                    {/* 캐릭터 상세 스탯 요약 */}
                    {selectedChar && (
                        <div className="char-mini-stats">
                            <p>💰 소지금: {selectedChar.money}엔</p>
                            <p>🧩 적극도: {selectedChar.instincts.proactivity}%</p>
                        </div>
                    )}
                </section>
            </aside>
        </div>
    );
};

export default MapView;