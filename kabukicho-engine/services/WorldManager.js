// kabukicho-engine/services/WorldManager.js
import { Character } from '../models/Character.js';
import { Faction } from '../constants/gameConfig.js';

export class WorldManager {
    constructor() {
        this.gridMap = []; // 10x10 2차원 배열
        this.allCharacters = [];
        this.initializeGame();
    }

    // 게임 초기화 (WorldMapService.java의 initializeGame 이식)
    initializeGame() {
        // 1. 10x10 빈 그리드 생성
        this.gridMap = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.allCharacters = [];

        // 2. 플레이어 및 NPC 스폰 (자바 좌표 및 세력 데이터 완벽 이식)
        // spawn(이름, 플레이어여부, 세력, x, y)
        this.spawnCharacter("긴토키(유저)", true, Faction.NEUTRAL, 0, 0); //
        
        // 주요 NPC 배치
        this.spawnCharacter("히지카타", false, Faction.ORDER, 3, 2); // 회사 근처
        this.spawnCharacter("오키타", false, Faction.ORDER, 3, 3);    //
        this.spawnCharacter("가츠라", false, Faction.CHAOS, 6, 8);   // 파친코 근처
        this.spawnCharacter("신스케", false, Faction.CHAOS, 7, 8);   //
        this.spawnCharacter("신파치", false, Faction.NEUTRAL, 8, 8); // 이자카야
        this.spawnCharacter("카구라", false, Faction.NEUTRAL, 8, 9); //
        this.spawnCharacter("엘리자베스", false, Faction.NEUTRAL, 4, 4); // 광장
        this.spawnCharacter("마다오", false, Faction.NEUTRAL, 5, 5);  // 광장
        this.spawnCharacter("오토세", false, Faction.NEUTRAL, 1, 1);   //
    }

    spawnCharacter(name, isPlayer, faction, x, y) {
        const char = new Character(name, isPlayer, faction, x, y);
        
        // 자바 로직: 플레이어 초기 자금 상향 조정 (3000엔)
        if (isPlayer) {
            char.money = 3000;
            char.currentEmoji = "🍓"; // 해결사 아이콘
        }

        this.allCharacters.push(char);
        this.gridMap[y][x] = char; // [y][x] 구조 주의해라
    }

    // 현재 맵 상태 반환
    getGridMap() {
        return this.gridMap;
    }

    // ID로 캐릭터 찾기 (GameEngine.java의 findCharacterById 이식)
    findCharacterById(id) {
        return this.allCharacters.find(c => c.id === id);
    }
}