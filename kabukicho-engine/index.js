// kabukicho-engine/index.js
import { WorldManager } from './managers/WorldManager.js';
import { TurnManager } from './managers/TurnManager.js';
import { AISystem } from './systems/AISystem.js';

/**
 * 은혼 피플: 카부키초 - '인간 실격' 완전 통합 엔진 메인 클래스
 */
export class KabukichoEngine {
    constructor() {
        this.world = new WorldManager();
        this.turn = new TurnManager(this.world);
        this.ai = new AISystem();
    }

    /**
     * 프론트엔드에서 턴을 실행할 때 호출
     */
    nextTurn(targetX, targetY) {
        const result = this.turn.runTurn(targetX, targetY);
        
        // 턴 결과에 AI 메시지나 추가 로그를 덧붙일 수 있음
        return result;
    }

    /**
     * 특정 캐릭터의 상세 정보 및 관계도 조회
     */
    getCharacterDetail(id) {
        const char = this.world.allCharacters.find(c => c.id === id);
        if (!char) return null;

        // 관계 정보를 사람이 읽기 쉬운 텍스트로 변환 (AI 활용)
        const details = {
            ...char,
            relationSummary: Array.from(char.relations.entries()).map(([tid, data]) => {
                const target = this.world.allCharacters.find(c => c.id === tid);
                return `${target?.name || '누군가'}: ${data.level} (${data.score})`;
            })
        };
        return details;
    }
}

// 싱글톤으로 수출하여 어디서든 하나의 엔진 상태를 유지함
export const engine = new KabukichoEngine();