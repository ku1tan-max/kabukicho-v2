// kabukicho-engine/managers/WorldManager.js
import { Character } from '../models/Character.js';
import { City } from '../models/City.js';

/**
 * 카부키초 세계 관리자: 20x20 맵 및 거주민 관리
 */
export class WorldManager {
    constructor() {
        this.gridSize = 20; // 20x20 격자 확장
        this.gridMap = []; 
        this.allCharacters = [];
        this.city = new City(); // 도시 경제 상태
        this.initializeGame();
    }

    /**
     * 게임 초기화: 맵 생성 및 주요 인물 배치
     */
    initializeGame() {
        // 1. 20x20 빈 그리드 생성
        this.gridMap = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null));
        this.allCharacters = [];

        // 2. 주요 캐릭터 스폰 (성별 및 덕목 랜덤 생성 포함)
        this.spawnCharacter("긴토키", true, "NEUTRAL", "M", 0, 0); // 플레이어
        
        // NPC들 (기획에 따라 좌표 분산)
        this.spawnCharacter("히지카타", false, "ORDER", "M", 5, 5);
        this.spawnCharacter("오키타", false, "ORDER", "M", 5, 6);
        this.spawnCharacter("카구라", false, "NEUTRAL", "F", 15, 15);
        this.spawnCharacter("신파치", false, "NEUTRAL", "M", 15, 14);
        this.spawnCharacter("오토세", false, "NEUTRAL", "F", 1, 1);
        this.spawnCharacter("마다오", false, "NEUTRAL", "M", 10, 10);
    }

    /**
     * 캐릭터 생성 및 맵 배치
     */
    spawnCharacter(name, isPlayer, faction, gender, x, y) {
        const char = new Character(name, isPlayer, faction, gender, x, y);
        this.allCharacters.push(char);
        this.gridMap[y][x] = char;
        return char;
    }

    /**
     * 캐릭터 제거 (사망 시 처리)
     */
    removeCharacter(character) {
        this.gridMap[character.y][character.x] = null;
        this.allCharacters = this.allCharacters.filter(c => c.id !== character.id);
    }

    /**
     * 맵의 특정 좌표에 있는 객체 반환
     */
    getCell(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return null;
        return this.gridMap[y][x];
    }
}