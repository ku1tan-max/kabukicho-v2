// kabukicho-engine/services/StorageManager.js

/**
 * 카부키초 데이터 매니저: 저장, 불러오기 및 '파산 소거' 담당
 */
export class StorageManager {
    static SAVE_KEY = 'KABUKICHO_V2_DATA';

    /**
     * 세이브 데이터 파괴 (파산 로직)
     */
    static nukeData() {
        console.warn("🚨 [SYSTEM] 파산 발생: 모든 데이터를 소거합니다.");
        localStorage.removeItem(this.SAVE_KEY);
        // 필요하다면 세션 종료나 리로드를 강제함
        window.location.reload();
    }

    static saveGame(data) {
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    }

    static loadGame() {
        const data = localStorage.getItem(this.SAVE_KEY);
        return data ? JSON.parse(data) : null;
    }
}