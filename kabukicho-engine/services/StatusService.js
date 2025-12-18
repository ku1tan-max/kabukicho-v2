// kabukicho-engine/services/StatusService.js
export class StatusService {
    // 매 턴 상태 업데이트
    processStatus(c, logs) {
        c.hunger = Math.max(0, c.hunger - 1);
        c.fun = Math.max(0, c.fun - 2);
        
        // 아이템 부패 로직 (5% 확률)
        c.inventory = c.inventory.map(item => {
            if ((item === "딸기우유" || item === "도시락") && Math.random() < 0.05) {
                if (c.isPlayer) logs.push(`⚠️ ${item}이(가) 상해서 쓰레기가 됨.`);
                return "쓰레기";
            }
            return item;
        });

        // 전직 체크
        if (c.sugar >= 50) c.job = "해결사";
        else if (c.tsukkomi >= 50) c.job = "경찰";
        else if (c.wild >= 50) c.job = "야쿠자";
    }
}