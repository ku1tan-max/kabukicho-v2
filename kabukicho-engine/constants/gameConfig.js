// kabukicho-engine/constants/gameConfig.js

export const GRID_SIZE = 15;

export const TILE_TYPES = {
    STREET: 'STREET',   // 일반 바닥
    ROAD: 'ROAD',       // 도로
    HOME: 'HOME',       // 주거 시설 (빌라, 맨션 등)
    OFFICE: 'OFFICE',   // 사무소 및 관공서
    SHOP: 'SHOP',       // 상점 및 유흥업소
    PARK: 'PARK',       // 공원 구역
    OBJECT: 'OBJECT',   // 자판기, 벤치 등
    WALL: 'WALL'        // 감옥 및 장애물
};

export const BUILDINGS = [
    // 1. 사무소 및 서비스 시설
    { id: 'yorozuya', name: '사무소', type: TILE_TYPES.OFFICE, x: 1, y: 1, w: 2, h: 2, entrance: {x: 2, y: 2}, color: '#FFB7B7' },
    { id: 'otose', name: '스낵바', type: TILE_TYPES.SHOP, x: 1, y: 4, w: 2, h: 2, entrance: {x: 2, y: 5}, color: '#A288E3' },
    { id: 'shinsengumi', name: '진선조', type: TILE_TYPES.OFFICE, x: 12, y: 1, w: 2, h: 3, entrance: {x: 13, y: 3}, color: '#B2C8DF' },
    { id: 'jail', name: '감옥', type: TILE_TYPES.WALL, x: 14, y: 1, w: 1, h: 1, entrance: {x: 14, y: 1}, color: '#444' },

    // 2. 주거 구역 (빌라, 맨션, 고시원)
    { id: 'home_a', name: '빌라', type: TILE_TYPES.HOME, x: 5, y: 1, w: 2, h: 2, entrance: {x: 6, y: 2}, color: '#F9F7CF' },
    { id: 'home_b', name: '맨션', type: TILE_TYPES.HOME, x: 8, y: 1, w: 2, h: 2, entrance: {x: 9, y: 2}, color: '#F9F7CF' },
    { id: 'home_c', name: '고시원', type: TILE_TYPES.HOME, x: 6, y: 3, w: 2, h: 2, entrance: {x: 7, y: 4}, color: '#F9F7CF' },

    // 3. 유흥 및 기타 시설
    { id: 'pachinko', name: '파친코', type: TILE_TYPES.SHOP, x: 1, y: 11, w: 1, h: 1, entrance: {x: 1, y: 11}, color: '#FFA500' },
    { id: 'cabaret', name: '카바레', type: TILE_TYPES.SHOP, x: 4, y: 11, w: 1, h: 1, entrance: {x: 4, y: 11}, color: '#FF0000' }
];

export const SPECIAL_AREAS = {
    PARK: { 
        name: '중앙공원', 
        x: 6, y: 7, w: 4, h: 3, 
        color: '#90EE90',
        objects: [
            { x: 7, y: 7, name: '자판기', type: TILE_TYPES.OBJECT },
            { x: 8, y: 8, name: '벤치', type: TILE_TYPES.OBJECT }
        ]
    }
};