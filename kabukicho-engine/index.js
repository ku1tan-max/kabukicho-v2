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
     * 프론트엔드에서 턴을 실행할 때 호출 (targetX, targetY는 클릭 위치)
     */
    nextTurn(targetX, targetY) {
        // 턴 매니저를 통해 턴 진행 (NPC 자율 행동 및 플레이어 이동 포함)
        const result = this.turn.runTurn(targetX, targetY);
        return result;
    }

    /**
     * 특정 캐릭터의 상세 정보 및 관계도 조회
     */
    getCharacterDetail(id) {
        const char = this.world.allCharacters.find(c => c.id === id);
        if (!char) return null;

        return {
            ...char,
            relationSummary: Array.from(char.relations.entries()).map(([tid, data]) => {
                const target = this.world.allCharacters.find(c => c.id === tid);
                return `${target?.name || '누군가'}: ${data.level} (${data.score})`;
            })
        };
    }

    /**
     * 시장 권한: 세율 조정 제안 ($lg 반영)
     */
    proposeTaxChange(newValue) {
        if (!this.world.city) return "도시 시스템이 로드되지 않았습니다.";
        this.world.city.proposePolicy('taxRate', newValue);
        return `세율을 ${newValue}%로 변경하는 안건이 심의에 부쳐졌다. 1시간($lg) 뒤에 확인해라.`;
    }

    /**
     * 특정 캐릭터 가스라이팅 시도
     */
    attemptGaslight(targetId) {
        const player = this.world.allCharacters.find(c => c.isPlayer);
        const victim = this.world.allCharacters.find(c => c.id === targetId);
        
        if (!player || !victim) return "대상이 없다.";
        
        const logs = [];
        // RelationSystem을 통한 실제 로직 반영
        const result = this.turn.relSys.applyGaslighting(player, victim, logs);
        return { result, logs };
    }
}

// [핵심] 싱글톤 인스턴스 단 하나만 수출 (중복 선언 방지)
export const engine = new KabukichoEngine();