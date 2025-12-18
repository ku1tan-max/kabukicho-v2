// kabukicho-engine/managers/WorldManager.js
import { Character } from '../models/Character.js';
import { City } from '../models/City.js';
import { GRID_SIZE } from '../constants/gameConfig.js'; // 15x15 연동

export class WorldManager {
    constructor() {
        this.gridSize = GRID_SIZE; 
        this.gridMap = []; 
        this.allCharacters = [];
        this.city = new City();
        this.initializeGame();
    }

    initializeGame() {
        // 1. 15x15 그리드 생성
        this.gridMap = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null));
        this.allCharacters = [];

        // 2. 기획 좌표에 따른 정밀 스폰 (이름, 플레이어여부, 세력, 성별, x, y, homeId)
        this.spawnCharacter("긴토키", true, "NEUTRAL", "M", 1, 1, "yorozuya"); 
        this.spawnCharacter("히지카타", false, "ORDER", "M", 12, 1, "home_b"); 
        this.spawnCharacter("오키타", false, "ORDER", "M", 13, 1, "home_b");
        this.spawnCharacter("카구라", false, "NEUTRAL", "F", 5, 1, "home_a");
        this.spawnCharacter("오토세", false, "NEUTRAL", "F", 1, 4, null);
    }

    spawnCharacter(name, isPlayer, faction, gender, x, y, homeId) {
        // Character 생성자에 homeId까지 확실히 넘겨준다. 🚬
        const char = new Character(name, isPlayer, faction, gender, x, y, homeId);
        this.allCharacters.push(char);
        this.gridMap[y][x] = char;
        return char;
    }

    getCell(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return null;
        return this.gridMap[y][x];
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