// kabukicho-engine/constants/MapData.js
import { TILE_TYPES } from './gameConfig.js';

/**
 * 초기 캐릭터 스폰 데이터 (기존 WorldManager 로직 보존)
 * 형식: [이름, 플레이어여부, 세력, 성별, x, y, homeId]
 */
export const INITIAL_CHARACTERS = [
    ["긴토키", true, "NEUTRAL", "M", 1, 1, "yorozuya"],
    ["히지카타", false, "ORDER", "M", 12, 1, "home_b"],
    ["오키타", false, "ORDER", "M", 13, 1, "home_b"],
    ["카구라", false, "NEUTRAL", "F", 5, 1, "home_a"],
    ["오토세", false, "NEUTRAL", "F", 1, 4, null]
];

/**
 * 도로(Road) 데이터 정의
 * 기존 ㄹ자 동선 및 주요 시설 연결 통로
 */
export const INITIAL_ROADS = [
    // 가로 도로
    { startX: 0, endX: 14, y: 3 },
    { startX: 4, endX: 14, y: 10 },
    // 세로 도로
    { x: 4, startY: 3, endY: 10 },
    { x: 11, startY: 0, endY: 3 }
];

/**
 * 맵 객체 배치 데이터
 */
export const INITIAL_OBJECTS = [
    { x: 5, y: 3, name: '전신주', type: TILE_TYPES.OBJECT },
    { x: 8, y: 3, name: '쓰레기통', type: TILE_TYPES.OBJECT },
    { x: 7, y: 7, name: '자판기', type: TILE_TYPES.OBJECT },
    { x: 8, y: 8, name: '벤치', type: TILE_TYPES.OBJECT }
];