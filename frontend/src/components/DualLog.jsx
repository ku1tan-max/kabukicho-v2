// frontend/src/components/DualLog.jsx
import React, { useState } from 'react';
import '../styles/Retro95.css';

const DualLog = ({ publicNews, privateLogs, selectedCharName }) => {
    const [activeTab, setActiveTab] = useState('public');

    return (
        <div className="retro-window dual-log-container" style={{ width: '100%', height: '200px' }}>
            <div className="retro-tabs">
                <button 
                    className={`retro-button tab ${activeTab === 'public' ? 'active' : ''}`}
                    onClick={() => setActiveTab('public')}
                >
                    주민 뉴스 (마을 스캔들)
                </button>
                <button 
                    className={`retro-button tab ${activeTab === 'private' ? 'active' : ''}`}
                    onClick={() => setActiveTab('private')}
                >
                    개인 사생활 ({selectedCharName || '미선택'})
                </button>
            </div>
            
            <div className="retro-inset log-content" style={{ height: '140px', overflowY: 'auto', padding: '5px' }}>
                {activeTab === 'public' ? (
                    publicNews.map((news, i) => (
                        <div key={i} className="log-entry">
                            <span className="log-time">[{news.time}]</span> {news.msg}
                        </div>
                    ))
                ) : (
                    privateLogs.map((log, i) => (
                        <div key={i} className="log-entry private">
                            <span className="log-time">[{log.time}]</span> {log.msg}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DualLog;