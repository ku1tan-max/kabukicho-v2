// kabukicho-engine/managers/WorldManager.js
import { GRID_SIZE, BUILDINGS, SPECIAL_AREAS, TILE_TYPES } from '../constants/gameConfig.js';
import { INITIAL_CHARACTERS, INITIAL_ROADS, INITIAL_OBJECTS } from '../constants/MapData.js';
import { Character } from '../models/Character.js';

export class WorldManager {
    constructor() {
        this.gridSize = GRID_SIZE; // 15x15
        this.gridMap = []; 
        this.allCharacters = [];
        this.initializeGame();
    }

    /**
     * 맵 타일 초기화 및 캐릭터 스폰
     */
    initializeGame() {
        // 1. 15x15 빈 그리드 생성 (Street 기본값)
        this.gridMap = Array.from({ length: this.gridSize }, (_, y) => 
            Array.from({ length: this.gridSize }, (_, x) => ({
                x, y, 
                type: TILE_TYPES.STREET,
                buildingId: null,
                isEntrance: false
            }))
        );

        // 2. 건물 데이터 주입 {x, y, w, h}
        BUILDINGS.forEach(b => {
            for (let i = b.y; i < b.y + b.h; i++) {
                for (let j = b.x; j < b.x + b.w; j++) {
                    if (this.gridMap[i] && this.gridMap[i][j]) {
                        this.gridMap[i][j].type = TILE_TYPES.BUILDING;
                        this.gridMap[i][j].buildingId = b.id;
                        this.gridMap[i][j].color = b.color;
                    }
                }
            }
            // 출입구 설정
            if (b.entrance) {
                this.gridMap[b.entrance.y][b.entrance.x].isEntrance = true;
            }
        });

        // 3. 도로 데이터 주입
        INITIAL_ROADS.forEach(road => {
            if (road.y !== undefined) { // 가로 도로
                for (let x = road.startX; x <= road.endX; x++) {
                    this.gridMap[road.y][x].type = TILE_TYPES.ROAD;
                }
            } else if (road.x !== undefined) { // 세로 도로
                for (let y = road.startY; y <= road.endY; y++) {
                    this.gridMap[y][road.x].type = TILE_TYPES.ROAD;
                }
            }
        });

        // 4. 캐릭터 정밀 스폰
        this.allCharacters = [];
        INITIAL_CHARACTERS.forEach(data => {
            const [name, isPlayer, faction, gender, x, y, homeId] = data;
            this.spawnCharacter(name, isPlayer, faction, gender, x, y, homeId);
        });
    }

    /**
     * 캐릭터 생성 및 맵 배치
     */
    spawnCharacter(name, isPlayer, faction, gender, x, y, homeId) {
        const char = new Character(name, isPlayer, faction, gender, x, y, homeId);
        this.allCharacters.push(char);
        return char;
    }

    /**
     * 특정 좌표의 타일 정보 반환
     */
    getCell(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return null;
        return this.gridMap[y][x];
    }
}