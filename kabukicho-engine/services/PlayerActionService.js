// kabukicho-engine/services/PlayerActionService.js

export class PlayerActionService {
    // 플레이어의 직접적인 상호작용 처리
    processAction(player, npc, type, logs) {
        if (!player || !npc) return;

        if (type === "MONEY") {
            if (player.money >= 1000) {
                player.money -= 1000;
                npc.money += 1000;
                // 호감도 상승
                npc.affectionMap[player.id] = (npc.affectionMap[player.id] || 0) + 20;
                npc.currentEmoji = "😍";
                logs.push(`💸 ${npc.name}에게 1000엔 송금! (호감도 급상승)`);
            } else {
                logs.push("🚫 잔고가 부족합니다. 파친코라도 다녀와라.");
            }
        } else if (type === "ITEM") {
            if (player.inventory.length > 0) {
                const item = player.inventory.shift(); // 첫 번째 아이템 소모
                npc.hunger = 100; // 배부름
                npc.affectionMap[player.id] = (npc.affectionMap[player.id] || 0) + 10;
                npc.currentEmoji = "😋";
                logs.push(`🥄 ${npc.name}에게 [${item}]을(를) 먹여줬습니다.`);
            } else {
                logs.push("🚫 줄 수 있는 아이템이 없습니다. 편의점 가라.");
            }
        }
    }
}