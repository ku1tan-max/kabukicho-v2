// kabukicho-engine/types/index.d.ts

/** 8대 덕목 우선순위 (1~8위) */
export interface Virtues {
    kindness: number;   // 상냥함
    courage: number;    // 용기
    appearance: number; // 용모
    intellect: number;  // 지성
    wealth: number;     // 재력
    health: number;     // 건강
    stamina: number;    // 정력
    sincerity: number;  // 성실
}

/** 3대 사회적 본능 */
export interface Instincts {
    affair: number;      // $def_af: 바람기 (0~5)
    proactivity: number; // $ac: 적극도 (0~100%)
    orientation: number; // $bs: 성 지향성 (0~100%)
}

/** 관계 데이터 */
export interface RelationData {
    targetId: string;
    level: 'bl' | 'lv' | 'hw' | 'cd'; // 관심, 연인, 배우자, 자식
    score: number;       // 호감도 수치
    isBlocked: boolean;  // $urr: 가스라이팅/차단 상태
    breakCount: number;  // $def_lo: 고백 거절 횟수
}

/** 캐릭터 모델 */
export interface Character {
    id: string;
    name: string;
    isPlayer: boolean;
    gender: 'M' | 'F';
    x: number;
    y: number;
    virtues: Virtues;    // @VT: 8대 덕목
    instincts: Instincts; // 본능 수치
    relations: Map<string, RelationData>;
    jobTier: number;     // @JL: 직업 계급 (1~6)
    sincerityScore: number; // 승진용 성실 점수
    money: number;       // 소지금
    assets: number;      // 부동산 등 자산
    hp: number;
    hunger: number;
    isBlue: boolean;     // $blue: 우울 상태 (가스라이팅 결과)
    isPregnant: boolean; // pg: 임신 여부
    age: number;
}

/** 도시 데이터 */
export interface City {
    budget: number;      // gp: 도시 예산
    taxRate: number;     // tx_nm: 세율
    maintenance: number; // cs: 유지비
    news: string[];      // 전광판 뉴스 로그
}