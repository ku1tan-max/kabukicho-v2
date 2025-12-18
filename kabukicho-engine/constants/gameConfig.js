// kabukicho-engine/constants/gameConfig.js

// 1. 세력 정의
export const Faction = {
    ORDER: 'ORDER',     // 진선조 등
    CHAOS: 'CHAOS',     // 귀병대 등
    NEUTRAL: 'NEUTRAL'  // 해결사 등
};

// 2. 주요 장소 좌표
export const LOCATIONS = {
    HOME: { x: 0, y: 0 },
    COMPANY: { x: 2, y: 3 },
    HOSPITAL: { x: 7, y: 3 },
    STORE: { x: 8, y: 0 },
    PACHINKO: { x: 8, y: 6 },
    IZAKAYA: { x: 8, y: 8 }
};

// 3. 게임 규칙 및 밸런스 수치
export const GAME_RULES = {
    GRID_SIZE: 10,
    RENT_CYCLE: 10,        // 월세 징수 주기
    NEWS_CYCLE: 20,        // 뉴스 발생 주기
    YOROZUYA_RENT: 500,    // 해결사 월세
    BASE_RENT: 1000,       // 일반 월세
    SALARY: 1000,          // 월급
    BASE_COST: 500,        // 기본 물가
    INFLATION_COST: 1000,  // 폭등한 물가
    MAX_HP: 100            // 최대 체력
};

// 4. 뉴스 타이틀
export const NEWS_TITLES = [
    "평화로운 하루",
    "📉 물가 폭등!",
    "👮 치안 강화!",
    "🌸 벚꽃 축제!"
];