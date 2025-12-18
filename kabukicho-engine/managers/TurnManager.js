// kabukicho-engine/managers/TurnManager.js
import { RelationSystem } from '../systems/RelationSystem.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { LifeCycleSystem } from '../systems/LifeCycleSystem.js';
import { AIBehaviorSystem } from '../systems/AIBehaviorSystem.js'; // 신규 추가
export class TurnManager {
    constructor(worldManager) {
        this.wm = worldManager;
        this.relSys = new RelationSystem();
        this.ecoSys = new EconomySystem();
        this.lifeSys = new LifeCycleSystem();
        this.aiBehavior = new AIBehaviorSystem(this.wm, this.relSys);
        this.globalTurn = 0;
    }

    runTurn(playerTargetX, playerTargetY) {
        const logs = [];
        this.globalTurn++;

        // 1. 플레이어 이동
        const player = this.wm.allCharacters.find(c => c.isPlayer);
        if (player && playerTargetX !== undefined) {
            this._moveCharacter(player, playerTargetX, playerTargetY);
        }

        // 2. 경제 시스템 (EconomySystem의 함수명과 정확히 일치시킴)
        this.ecoSys.processPolicyDeliberation(this.wm.city, logs);
        this.ecoSys.processCityEconomy(this.wm.city, this.wm.allCharacters, logs);

        // 3. NPC 자율 행동
        this.wm.allCharacters.forEach(char => {
            if (!char.isPlayer) {
                this.aiBehavior.executeAction(char, logs);
            }
        });

        // 4. 사후 처리
        for (let i = this.wm.allCharacters.length - 1; i >= 0; i--) {
            const char = this.wm.allCharacters[i];
            this.ecoSys.updateJobStatus(char, logs);
            if (this.lifeSys.checkDeath(char, logs)) {
                this.wm.removeCharacter(char);
            }
        }

        return {
            turn: this.globalTurn,
            logs,
            city: this.wm.city,
            characters: [...this.wm.allCharacters]
        };
    }

    _moveCharacter(char, tx, ty) {
        if (tx < 0 || tx >= 20 || ty < 0 || ty >= 20) return; // 경계 체크 추가
        this.wm.gridMap[char.y][char.x] = null;
        char.x = tx;
        char.y = ty;
        this.wm.gridMap[char.y][char.x] = char;
    }
}