// kabukicho-engine/models/Character.js
import { VIRTUE_TYPES } from '../constants/Virtues.js';

/**
 * 은혼 피플: 카부키초 - '인간 실격' 완전 통합 모델
 */
export class Character {
    constructor(name, isPlayer, faction, gender = 'M', x = 0, y = 0) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.isPlayer = isPlayer;
        this.faction = faction;
        this.gender = gender; // 'M' 또는 'F'
        this.x = x;
        this.y = y;

        // --- 1. 8대 가치관 시스템 (@VT) ---
        // 각 캐릭터는 8개 덕목에 대해 1~8순위의 우선순위를 가짐
        this.virtues = this._generateVirtuePriorities();

        // --- 2. 3대 핵심 사회적 본능 변수 ---
        this.instincts = {
            affair: Math.floor(Math.random() * 6),        // @AF ($def_af): 바람기 (0~5)
            proactivity: Math.floor(Math.random() * 101), // $ac: 적극도 (0~100%)
            orientation: Math.floor(Math.random() * 101)  // $bs: 성 지향성 (0~100%)
        };

        // --- 3. 심층 인간관계 시스템 ---
        // Key: targetId, Value: { level, score, isBlocked, breakCount }
        // 관계 단계: bl(관심) -> lv(연인) -> hw(배우자) -> cd(자식)
        this.relations = new Map();

        // --- 4. 경제 및 사회적 신분 시스템 ---
        this.jobTier = 1;            // @JL: 계급 (1:신입 ~ 6:카리스마)
        this.sincerityScore = 0;     // 매 턴 체크되는 성실도 누적치
        this.money = isPlayer ? 3000 : 5000;
        this.assets = 0;             // 부동산 및 자산 (이혼 시 뺏길 것들)

        // --- 5. 생물학적 사이클 및 상태 수치 ---
        this.hp = 100;
        this.maxHp = 100;
        this.hunger = 80;
        this.mood = 50;
        this.isBlue = false;         // $blue: 우울 상태 (가스라이팅 결과)
        this.isPregnant = false;     // pg: 임신 여부
        this.age = isPlayer ? 25 : Math.floor(Math.random() * 40) + 15;

        // UI/시스템용 부가 정보
        this.currentMsg = "";        // 머리 위 말풍선 대사
        this.currentEmoji = isPlayer ? "🍓" : null;
        this.msgDuration = 0;
    }

    /**
     * 8대 덕목에 1~8순위의 우선순위를 랜덤으로 부여한다.
     * @private
     */
    _generateVirtuePriorities() {
        const types = Object.values(VIRTUE_TYPES);
        // 무작위로 섞어서 순위를 매김
        const shuffled = types.sort(() => Math.random() - 0.5);
        const virtueMap = {};
        shuffled.forEach((type, index) => {
            virtueMap[type] = index + 1; // 1위부터 8위까지
        });
        return virtueMap;
    }

    /**
     * 특정 대상과의 관계 데이터가 없으면 초기화(관심 단계)한다.
     */
    initRelation(targetId) {
        if (!this.relations.has(targetId)) {
            this.relations.set(targetId, {
                level: 'bl',      // 관심(bl)으로 시작
                score: 0,         // 호감도 0
                isBlocked: false, // $urr: 차단 여부
                breakCount: 0     // $def_lo: 거절 횟수
            });
        }
        return this.relations.get(targetId);
    }
}