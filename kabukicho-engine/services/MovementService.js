// kabukicho-engine/services/MovementService.js
import { LOCATIONS, GAME_RULES } from '../constants/gameConfig.js';

export class MovementService {
    // NPC의 다음 목적지 결정
    decideNextMove(map, npc, player, allCharacters) {
        if (npc.isSleeping || npc.isChatting) return { tx: npc.x, ty: npc.y };

        // 1. 성격 기반 특수 AI (#스토커, #마다오)
        if (npc.trait === "#스토커") {
            const target = this.findNearestTarget(npc, allCharacters, 50, false);
            if (target) {
                npc.currentEmoji = "👀";
                return this.calculateMoveTowards(npc, target.x, target.y);
            }
        }
        if (npc.trait === "#마다오" && npc.money >= 2000) {
            npc.currentEmoji = "🎰";
            return this.calculateMoveTowards(npc, LOCATIONS.PACHINKO.x, LOCATIONS.PACHINKO.y);
        }

        // 2. 적대 대상 추격 (호감도 -20 이하)
        const enemy = this.findNearestTarget(npc, allCharacters, -20, true);
        if (enemy) return this.calculateMoveTowards(npc, enemy.x, enemy.y);

        // 3. 생존 본능 (허기 40 미만)
        if (npc.hunger < 40) {
            const dest = npc.money > 500 ? LOCATIONS.STORE : LOCATIONS.COMPANY;
            return this.calculateMoveTowards(npc, dest.x, dest.y);
        }

        // 4. 기본: 랜덤 이동
        const tx = npc.x + Math.floor(Math.random() * 3) - 1;
        const ty = npc.y + Math.floor(Math.random() * 3) - 1;
        return { tx: this.clamp(tx), ty: this.clamp(ty) };
    }

    calculateMoveTowards(mover, tx, ty) {
        let nextX = mover.x;
        let nextY = mover.y;
        if (nextX < tx) nextX++; else if (nextX > tx) nextX--;
        else if (nextY < ty) nextY++; else if (nextY > ty) nextY--;
        return { tx: this.clamp(nextX), ty: this.clamp(nextY) };
    }

    findNearestTarget(seeker, allCharacters, threshold, isUnder) {
        return allCharacters.find(t => {
            if (t.id === seeker.id) return false;
            const dist = Math.abs(seeker.x - t.x) + Math.abs(seeker.y - t.y);
            const aff = seeker.affectionMap[t.id] || 0;
            return dist <= 3 && (isUnder ? aff <= threshold : aff >= threshold);
        });
    }

    clamp(val) { return Math.min(GAME_RULES.GRID_SIZE - 1, Math.max(0, val)); }
}