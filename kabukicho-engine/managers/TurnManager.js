// kabukicho-engine/managers/TurnManager.js
import { RelationSystem } from '../systems/RelationSystem.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { LifeCycleSystem } from '../systems/LifeCycleSystem.js';

/**
 * 턴 관리자: 모든 시스템의 실행 순서를 조율함
 */
export class TurnManager {
    constructor(worldManager) {
        this.wm = worldManager;
        this.relSys = new RelationSystem();
        this.ecoSys = new EconomySystem();
        this.lifeSys = new LifeCycleSystem();
        this.globalTurn = 0;
    }

    /**
     * 한 턴을 진행시킨다.
     * @param {number} playerTargetX - 플레이어 이동 목표 X
     * @param {number} playerTargetY - 플레이어 이동 목표 Y
     */
    runTurn(playerTargetX, playerTargetY) {
        const logs = [];
        this.globalTurn++;

        // 1. 도시 경제 처리 (세금, 정책 심의)
        this.ecoSys.processPolicyDeliberation(this.wm.city, logs);
        this.ecoSys.processCityEconomy(this.wm.city, this.wm.allCharacters, logs);

        // 2. 월급 지급 (10턴마다 한 번씩)
        if (this.globalTurn % 10 === 0) {
            this.ecoSys.distributeSalaries(this.wm.allCharacters, logs);
        }

        // 3. 모든 캐릭터의 상태 업데이트 및 생물학적 사이클
        for (let i = this.wm.allCharacters.length - 1; i >= 0; i--) {
            const char = this.wm.allCharacters[i];
            
            // 나이 먹기 및 사망 체크 (dead_check)
            if (this.globalTurn % 100 === 0) char.age++; 
            if (this.lifeSys.checkDeath(char, logs)) {
                this.wm.removeCharacter(char);
                continue;
            }

            // 직업 승진/강등 체크 (@JL)
            this.ecoSys.updateJobStatus(char, logs);

            // 임신 및 출산 로직 (가까이 있는 연인 체크 등은 상호작용 시스템에서 수행)
        }

        // 4. 플레이어 및 NPC 이동/상호작용 로직 호출 (기존 GameService 로직 통합)
        // ... (이 부분은 나중에 InteractionSystem과 연결할 거다)

        return {
            turn: this.globalTurn,
            logs: logs,
            city: this.wm.city,
            characters: this.wm.allCharacters
        };
    }
}