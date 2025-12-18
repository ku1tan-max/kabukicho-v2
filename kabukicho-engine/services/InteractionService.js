// kabukicho-engine/services/InteractionService.js
import { Faction } from '../constants/gameConfig.js';

export class InteractionService {
    // 상호작용 실행
    handleInteraction(a, b, logs) {
        // 1. 성격 특수기
        if (a.trait === "#폭력녀") {
            logs.push(`🍳 ${a.name}: '먹어라!!' (강제 급식)`);
            b.hp = Math.max(0, b.hp - 15); b.hunger = 100; b.currentEmoji = "🤮";
            return;
        }
        if (a.trait === "#태클걸기" && b.isDrunken) {
            logs.push(`💢 ${a.name}: '정신 차려!'`);
            if (a.tsukkomi > 30) { b.isDrunken = false; logs.push(`✨ ${b.name}의 술이 깼습니다.`); }
            return;
        }

        // 2. 야성 대결 및 복수
        if (this.isEnemy(a, b)) {
            if (a.wild > b.wild) { logs.push(`👊 ${a.name}의 제압!`); b.hp = Math.max(0, b.hp - 15); }
            else { logs.push(`⚔️ ${a.name} vs ${b.name} 대치`); a.hp -= 5; b.hp -= 5; }
            return;
        }

        // 3. 아이템 사용/투척
        if (a.inventory.includes("쓰레기")) {
            a.inventory = a.inventory.filter(i => i !== "쓰레기");
            logs.push(`🤮 ${a.name}: 쓰레기 투척!`); a.affectionMap[b.id] = -50;
            return;
        }

        a.affectionMap[b.id] = (a.affectionMap[b.id] || 0) + 2;
    }

    // 세력/상태 기반 적대 여부
    isEnemy(a, b) {
        if (a.isDrunken) return true;
        if (a.faction === Faction.ORDER && (b.faction === Faction.CHAOS || b.wantedLevel > 0)) return true;
        return a.faction === Faction.CHAOS && b.faction === Faction.ORDER;
    }
}