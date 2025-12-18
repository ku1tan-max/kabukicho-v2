// kabukicho-engine/systems/AIBehaviorSystem.js
import { VIRTUE_TYPES } from '../constants/Virtues.js';

export class AIBehaviorSystem {
    constructor(worldManager, relationSystem, aiSystem) {
        this.wm = worldManager;
        this.relSys = relationSystem;
        this.aiSys = aiSystem;
    }

    /**
     * NPC 행동 트리 실행 ($ac 기반)
     */
    executeAction(npc, logs) {
        // 1. 적극도($ac) 체크: 행동할 확률 (0~100)
        const activeChance = npc.instincts.proactivity;
        if (Math.random() * 100 > activeChance) {
            // 농땡이: 성실도 하락 및 휴식
            npc.sincerityScore -= 0.5;
            npc.currentMsg = "귀찮구만.. 🚬";
            return;
        }

        // 2. 주변 탐색 (반경 2칸 내 캐릭터 탐색)
        const target = this._searchTarget(npc);

        if (target) {
            // 3. 상호작용 결정 (관계 및 본능 수치 기반)
            this._interact(npc, target, logs);
        } else {
            // 4. 이동 (주변에 아무도 없으면 랜덤 이동)
            this._move(npc);
        }
    }

    _searchTarget(npc) {
        return this.wm.allCharacters.find(other => {
            if (other.id === npc.id) return false;
            const dist = Math.abs(npc.x - other.x) + Math.abs(npc.y - other.y);
            return dist <= 2;
        });
    }


// kabukicho-engine/systems/AIBehaviorSystem.js

        _interact(npc, target, logs) {
    const rel = npc.initRelation(target.id);
    const rand = Math.random();

    if (rand < 0.2 && npc.instincts.affair >= 3) {
        const success = this.relSys.tryProgressRelation(npc, target);
        // aiSys가 없거나 generateEventLog가 터질 경우를 대비해라
        const logMsg = this.aiSys?.generateEventLog 
            ? this.aiSys.generateEventLog(npc, target, 'scandal')
            : `${npc.name}이(가) ${target.name}에게 끈적한 시선을 보냅니다.`;
        logs.push(`[AI] ${logMsg}`);
        npc.currentMsg = success ? "오늘부터 1일이다. 🚬" : "우리 사귈래? 헤헤..";
    } else if (npc.money < 1000) {
        npc.currentMsg = "미안한데.. 1000엔만 빌려주면 안 될까?";
        logs.push(`[AI] ${npc.name}이(가) ${target.name}에게 구걸을 시도합니다.`);
    } else {
        npc.currentMsg = "오늘 마요네즈 상태가 좋군.";
        this.relSys.cheer(npc, target); // 이제 이 함수가 존재하니 안 터질 거다
    }
        }

    _move(npc) {
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.floor(Math.random() * 3) - 1;
        
        const nextX = Math.max(0, Math.min(this.wm.gridSize - 1, npc.x + dx));
        const nextY = Math.max(0, Math.min(this.wm.gridSize - 1, npc.y + dy));

        if (!this.wm.getCell(nextX, nextY)) {
            this.wm.gridMap[npc.y][npc.x] = null;
            npc.x = nextX;
            npc.y = nextY;
            this.wm.gridMap[npc.y][npc.x] = npc;
        }
    }
}