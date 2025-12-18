// kabukicho-engine/services/WorldManager.js
import { Character } from '../models/Character.js';
import { City } from '../models/City.js';

export class WorldManager {
    constructor() {
        this.gridSize = 20; // 20x20 격자 확장
        this.gridMap = []; 
        this.allCharacters = [];
        this.city = new City();
        this.initializeGame();
    }

    initializeGame() {
        // 20x20 빈 그리드 생성
        this.gridMap = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null));
        this.allCharacters = [];

        // 주요 캐릭터 배치 (긴토키는 플레이어)
        this.spawnCharacter("긴토키", true, "NEUTRAL", "M", 0, 0);
        this.spawnCharacter("히지카타", false, "ORDER", "M", 5, 5);
        this.spawnCharacter("오키타", false, "ORDER", "M", 7, 5);
        this.spawnCharacter("카구라", false, "NEUTRAL", "F", 15, 15);
        this.spawnCharacter("마다오", false, "NEUTRAL", "M", 10, 10);
    }

    spawnCharacter(name, isPlayer, faction, gender, x, y) {
        const char = new Character(name, isPlayer, faction, gender, x, y);
        this.allCharacters.push(char);
        this.gridMap[y][x] = char;
        return char;
    }

    /**
     * NPC 자율 이동 로직 ($ac 수치 기반)
     */
    processNPCMovement() {
        this.allCharacters.forEach(char => {
            if (char.isPlayer) return; // 플레이어는 제외

            // 적극도($ac)에 따라 이동할지 결정 (0~100)
            const moveChance = char.instincts.proactivity; 
            if (Math.random() * 100 < moveChance) {
                this._moveRandomly(char);
            }
        });
    }

    _moveRandomly(char) {
        const directions = [
            { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }
        ];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        
        const nextX = Math.max(0, Math.min(this.gridSize - 1, char.x + dir.x));
        const nextY = Math.max(0, Math.min(this.gridSize - 1, char.y + dir.y));

        // 이동하려는 칸이 비어있는 경우에만 이동
        if (!this.gridMap[nextY][nextX]) {
            this.gridMap[char.y][char.x] = null;
            char.x = nextX;
            char.y = nextY;
            this.gridMap[char.y][char.x] = char;
        }
    }

    getCell(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return null;
        return this.gridMap[y][x];
    }
}