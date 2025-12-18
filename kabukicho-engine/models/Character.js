// kabukicho-engine/models/Character.js
import { VIRTUE_TYPES } from '../constants/Virtues.js';

export class Character {
    constructor(name, isPlayer, faction, gender = 'M', x = 0, y = 0, homeId = null) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.isPlayer = isPlayer;
        this.faction = faction;
        this.gender = gender;
        this.x = x;
        this.y = y;
        this.homeId = homeId; // 거주지 ID 주입

        // --- 핵심 상태 및 일상 ---
        this.hp = 100;
        this.money = isPlayer ? 3000 : 5000;
        this.blogLogs = []; // 상태 기록용 블로그

        // --- 1. 8대 가치관 시스템 (@VT: 1~8위 순위 지정) ---
        this.virtues = this._generateVirtuePriorities();

        // --- 2. 3대 핵심 사회적 본능 변수 ---
        this.instincts = {
            affair: Math.floor(Math.random() * 6),        // $af: 바람기 (0~5)
            proactivity: Math.floor(Math.random() * 101), // $ac: 적극도 (0~100%)
            orientation: Math.floor(Math.random() * 101)  // $bs: 성 지향성 (0~100%)
        };

        this.relations = new Map();
    }

    /**
     * 8대 덕목의 우선순위를 무작위로 생성한다. (1위가 가장 중요)
     */
    _generateVirtuePriorities() {
        const types = Object.values(VIRTUE_TYPES);
        const shuffled = [...types].sort(() => Math.random() - 0.5);
        const virtueMap = {};
        shuffled.forEach((type, index) => {
            virtueMap[type] = index + 1;
        });
        return virtueMap;
    }

    /**
     * 캐릭터의 현재 상태나 사건을 블로그에 기록한다.
     */
    writeBlog(content) {
        const entry = {
            time: new Date().toLocaleTimeString(),
            content: content
        };
        this.blogLogs.unshift(entry);
        if (this.blogLogs.length > 20) this.blogLogs.pop();
    }
}