// kabukicho-engine/services/GameService.js
import { MovementService } from './MovementService.js';
import { InteractionService } from './InteractionService.js';
import { StatusService } from './StatusService.js';
import { GAME_RULES, NEWS_TITLES, LOCATIONS } from '../constants/gameConfig.js';

export class GameService {
    constructor() {
        this.moveSvc = new MovementService();
        this.interSvc = new InteractionService();
        this.statSvc = new StatusService();
        this.globalTurn = 0;
        this.news = "평화로운 하루";
    }

    runTurn(map, player, tx, ty, allCharacters) {
        const logs = [];
        this.globalTurn++;

        // 1. 전역 이벤트 및 초기화
        if (this.globalTurn % 20 === 0) this.news = NEWS_TITLES[Math.floor(Math.random() * 4)];
        if (this.globalTurn % 10 === 0) this.collectRent(player, logs);

        allCharacters.forEach(c => { c.currentEmoji = null; c.isChatting = false; });

        // 2. 플레이어 이동 및 거부권
        if (!player.isSleeping) {
            if (player.mood < 50 && Math.random() * 100 > player.sugar * 10) {
                player.currentEmoji = "🙅"; logs.push(`${player.name}: 싫어. (명령 거부)`);
            } else {
                this.executeMove(map, player, tx, ty, logs);
                this.applyZoneEffect(player, logs);
            }
        }

        // 3. NPC 턴 처리
        allCharacters.filter(c => !c.isPlayer && c.hp > 0).forEach(npc => {
            this.statSvc.processStatus(npc, logs);
            const move = this.moveSvc.decideNextMove(map, npc, player, allCharacters);
            this.executeMove(map, npc, move.tx, move.ty, logs);
        });

        logs.unshift(`📢 ${this.news}`);
        return { logs };
    }

    executeMove(map, mover, tx, ty, logs) {
        const target = map[ty][tx];
        if (!target) {
            map[mover.y][mover.x] = null; mover.x = tx; mover.y = ty; map[ty][tx] = mover;
        } else if (target.id !== mover.id && !target.isSleeping) {
            this.interSvc.handleInteraction(mover, target, logs);
            // 위치 스와프
            map[mover.y][mover.x] = target; 
            [target.x, target.y, mover.x, mover.y] = [mover.x, mover.y, tx, ty];
            map[ty][tx] = mover;
        }
    }

    // 생략된 지역 효과 로직 포함...
// kabukicho-engine/services/GameService.js 내부 🚬

applyZoneEffect(p, logs) {
    const { x, y } = p;

    // 1. 편의점 (8, 0)
    if (x === 8 && y === 0) {
        if (p.money >= 500) {
            p.money -= 500;
            p.inventory.push("딸기우유");
            logs.push("🛒 편의점에서 딸기우유를 구매했습니다. (-500엔)");
        } else {
            logs.push("🚫 돈이 없어서 편의점에서 쫓겨났습니다.");
        }
    }

    // 2. 파친코 (8, 6)
    else if (x === 8 && y === 6) {
        if (p.money >= 500) {
            p.money -= 500;
            const win = Math.random() < 0.3; // 30% 확률 잭팟
            if (win) {
                p.money += 5000;
                logs.push("🎰 대박!! 파친코에서 5000엔을 땄습니다!");
            } else {
                logs.push("💸 파친코에서 500엔을 날렸습니다...");
            }
        }
    }

    // 3. 회사 (2, 3) - 월급 🚬
    else if (x === 2 && y === 3) {
        p.money += 1000;
        logs.push("🏢 회사에서 일당 1000엔을 받았습니다.");
    }
}
    collectRent(p, logs) { 
        const rent = p.job === "해결사" ? GAME_RULES.YOROZUYA_RENT : GAME_RULES.BASE_RENT;
        p.money -= rent; logs.push(`💰 월세 징수 (-${rent})`);
    }
}