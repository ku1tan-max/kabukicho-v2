// kabukicho-engine/models/Character.js
import { Faction } from '../constants/gameConfig.js';

export class Character {
    constructor(name, isPlayer, faction, x, y) {
        this.id = crypto.randomUUID(); // 자바의 UUID 대체
        this.name = name;
        this.isPlayer = isPlayer;
        this.faction = faction;
        this.x = x;
        this.y = y;

        // --- 자바 원본 스탯 이식 ---
        this.hp = 100;
        this.maxHp = 100;
        this.mood = 50;
        this.sugar = 10;
        this.tsukkomi = 10;
        this.wild = 10;
        this.hunger = 80;
        this.fun = 80;
        
        // kabukicho-engine/models/Character.js 수정
        this.currentMsg = "";      // 머리 위에 뜰 대사
        this.msgDuration = 0;     // 대사가 노출될 남은 시간
        this.relationStatus = ""; // 플레이어와의 관계 한 줄 평
        
        // 플레이어는 3000엔(조정됨), NPC는 5000엔 시작
        this.money = isPlayer ? 3000 : 5000; 
        this.inventory = [];
        
        this.wantedLevel = 0;
        this.isDrunken = false;
        this.isSleeping = false;
        this.isChatting = false;

        this.affectionMap = {}; // { targetId: score }
        this.job = "백수";
        
        // 성격 설정
        const traits = ["#마요러", "#엘리자베스", "#폭력녀", "#노말"];
        this.trait = isPlayer ? "#노말" : traits[Math.floor(Math.random() * traits.length)];
        
        this.currentEmoji = null;
    }
}