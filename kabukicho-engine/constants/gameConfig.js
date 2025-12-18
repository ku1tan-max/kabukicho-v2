// kabukicho-engine/constants/gameConfig.js

export const GRID_SIZE = 15;

export const TILE_TYPES = {
    STREET: 'STREET',   // 일반 바닥
    ROAD: 'ROAD',       // ㄹ자 도로
    HOME: 'HOME',       // 주택가
    OFFICE: 'OFFICE',   // 해결사/진선조
    SHOP: 'SHOP',       // 스낵바
    PARK: 'PARK',       // 공원
    OBJECT: 'OBJECT',   // 장애물 (전신주 등)
    WALL: 'WALL'        // 감옥/벽
};

export const BUILDINGS = [
    { id: 'yorozuya', name: '해결사', type: TILE_TYPES.OFFICE, x: 1, y: 1, w: 2, h: 2, entrance: {x: 2, y: 2}, color: '#FFB7B7' },
    { id: 'otose', name: '스낵바', type: TILE_TYPES.SHOP, x: 1, y: 4, w: 2, h: 2, entrance: {x: 2, y: 4}, color: '#A288E3' },
    { id: 'home_a', name: '빌라A', type: TILE_TYPES.HOME, x: 5, y: 1, w: 2, h: 2, entrance: {x: 5, y: 2}, color: '#F9F7CF' },
    { id: 'home_b', name: '빌라B', type: TILE_TYPES.HOME, x: 8, y: 1, w: 2, h: 2, entrance: {x: 8, y: 2}, color: '#F9F7CF' },
    { id: 'home_c', name: '빌라C', type: TILE_TYPES.HOME, x: 6, y: 3, w: 2, h: 2, entrance: {x: 7, y: 4}, color: '#F9F7CF' },
    { id: 'shinsengumi', name: '진선조', type: TILE_TYPES.OFFICE, x: 12, y: 1, w: 2, h: 3, entrance: {x: 12, y: 2}, color: '#B2C8DF' },
    { id: 'jail', name: '감옥', type: TILE_TYPES.WALL, x: 14, y: 1, w: 1, h: 1, entrance: {x: 14, y: 1}, color: '#444' } // entrance 추가 완료 🚬
];

export const MAP_OBJECTS = [
    { x: 5, y: 3, name: '전신주', type: TILE_TYPES.OBJECT },
    { x: 8, y: 3, name: '쓰레기통', type: TILE_TYPES.OBJECT },
    { x: 7, y: 7, name: '자판기', type: TILE_TYPES.OBJECT },
    { x: 8, y: 8, name: '벤치', type: TILE_TYPES.OBJECT },
    { x: 14, y: 14, name: '벽', type: TILE_TYPES.WALL }
];