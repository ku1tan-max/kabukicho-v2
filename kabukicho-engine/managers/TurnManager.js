// kabukicho-engine/managers/TurnManager.js
import { RelationSystem } from '../systems/RelationSystem.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { LifeCycleSystem } from '../systems/LifeCycleSystem.js';
import { AIBehaviorSystem } from '../systems/AIBehaviorSystem.js';
import { AISystem } from '../systems/AISystem.js';

export class TurnManager {
    constructor(worldManager) {
        this.wm = worldManager;
        this.aiSys = new AISystem();
        this.relSys = new RelationSystem();
        this.ecoSys = new EconomySystem(); // 정상 초기화 확인
        this.lifeSys = new LifeCycleSystem();
        this.aiBehavior = new AIBehaviorSystem(this.wm, this.relSys, this.aiSys);
        this.globalTurn = 0;
    }

    /**
     * 게임 턴 통합 실행
     */
    runTurn(playerTargetX, playerTargetY) {
        const logs = [];
        this.globalTurn++;

        // 1. 플레이어 이동 처리
        const player = this.wm.allCharacters.find(c => c.isPlayer);
        if (player && playerTargetX !== undefined) {
            this._moveCharacter(player, playerTargetX, playerTargetY);
        }

        // 2. 경제 시스템 호출 (EconomySystem 동기화 지점)
        this.ecoSys.processPolicyDeliberation(this.wm.city, logs);
        this.ecoSys.processCityEconomy(this.wm.city, this.wm.allCharacters, logs);

        // 3. NPC 자율 행동 처리
        this.wm.allCharacters.forEach(char => {
            if (!char.isPlayer) {
                this.aiBehavior.executeAction(char, logs);
            }
        });

        // 4. 상태 업데이트 및 직업 승진 체크
        for (let i = this.wm.allCharacters.length - 1; i >= 0; i--) {
            const char = this.wm.allCharacters[i];
            
            // 직업 승진 로직 호출 (EconomySystem 동기화 지점)
            this.ecoSys.updateJobStatus(char, logs);

            // 사망 체크
            if (this.lifeSys.checkDeath(char, logs)) {
                this.wm.removeCharacter(char);
            }
        }

        return {
            turn: this.globalTurn,
            logs: logs,
            city: this.wm.city,
            characters: [...this.wm.allCharacters]
        };
    }

    _moveCharacter(char, tx, ty) {
        if (tx < 0 || tx >= this.wm.gridSize || ty < 0 || ty >= this.wm.gridSize) return;
        if (this.wm.gridMap[ty][tx]) return; // 대상 위치에 이미 누가 있으면 이동 불가

        this.wm.gridMap[char.y][char.x] = null;
        char.x = tx;
        char.y = ty;
        this.wm.gridMap[char.y][char.x] = char;
    }
}