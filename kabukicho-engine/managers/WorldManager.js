// kabukicho-engine/managers/WorldManager.js
import { GRID_SIZE, BUILDINGS, SPECIAL_AREAS, TILE_TYPES } from '../constants/gameConfig.js';
import { Character } from '../models/Character.js';

export class WorldManager {
    constructor() {
        this.gridSize = GRID_SIZE;
        this.gridMap = this.initializeMap();
        this.allCharacters = [];
        this.spawnInitialCharacters();
    }

    initializeMap() {
        const map = Array.from({ length: GRID_SIZE }, (_, y) => 
            Array.from({ length: GRID_SIZE }, (_, x) => ({ x, y, type: TILE_TYPES.STREET }))
        );

        // 건물 및 출입구 주입
        BUILDINGS.forEach(b => {
            for (let i = b.y; i < b.y + b.h; i++) {
                for (let j = b.x; j < b.x + b.w; j++) {
                    map[i][j] = { ...map[i][j], type: TILE_TYPES.BUILDING, buildingId: b.id, color: b.type };
                }
            }
            // 출입구 설정
            map[b.entrance.y][b.entrance.x].isEntrance = true;
        });

        // 공원 구역 주입
        const p = SPECIAL_AREAS.PARK;
        for (let i = p.y; i < p.y + p.h; i++) {
            for (let j = p.x; j < p.x + p.w; j++) {
                map[i][j] = { ...map[i][j], type: TILE_TYPES.PARK, color: p.color };
            }
        }

        return map;
    }

    spawnInitialCharacters() {
        this.spawnCharacter("긴토키", true, "NEUTRAL", "M", 2, 2, "office");
        this.spawnCharacter("히지카타", false, "ORDER", "M", 13, 3, "shinsengumi");
    }

    spawnCharacter(name, isPlayer, faction, gender, x, y, homeId) {
        const char = new Character(name, isPlayer, faction, gender, x, y, homeId);
        this.allCharacters.push(char);
        return char;
    }
}