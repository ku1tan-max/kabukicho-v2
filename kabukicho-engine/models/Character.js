import { VIRTUE_TYPES } from '../constants/Virtues.js';

export class Character {
    // 1. 생성자 파라미터 맨 끝에 homeId = null을 추가하여 에러를 방지합니다. 🚬
    constructor(name, isPlayer, faction, gender = 'M', x = 0, y = 0, homeId = null) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.isPlayer = isPlayer;
        this.faction = faction;
        this.gender = gender;
        this.x = x;
        this.y = y;
        this.homeId = homeId; // 이제 WorldManager에서 homeId를 안 보내줘도 null로 처리되어 에러가 안 납니다.

        // --- 생활 패턴 및 상태 ---
        this.schedule = 'WORK'; 
        this.hp = 100;
        this.maxHp = 100;
        this.hunger = 80;
        this.mood = 50;
        this.isBlue = false;         // $blue: 우울 상태 (가스라이팅 결과)
        this.isPregnant = false;     // pg: 임신 여부
        this.age = isPlayer ? 25 : Math.floor(Math.random() * 40) + 15;

        // --- 1. 8대 가치관 시스템 (@VT) ---
        this.virtues = this._generateVirtuePriorities();

        // --- 2. 3대 핵심 사회적 본능 변수 ---
        this.instincts = {
            affair: Math.floor(Math.random() * 6),        // @AF: 바람기
            proactivity: Math.floor(Math.random() * 101), // $ac: 적극도
            orientation: Math.floor(Math.random() * 101)  // $bs: 성 지향성
        };

        // --- 3. 심층 인간관계 시스템 ---
        this.relations = new Map();

        // --- 4. 경제 및 사회적 신분 시스템 ---
        this.jobTier = 1;            
        this.sincerityScore = 0;     
        this.money = isPlayer ? 3000 : 5000;
        this.assets = 0;             

        // UI용 부가 정보
        this.currentMsg = "";        
        this.currentEmoji = isPlayer ? "🍓" : null;
        this.msgDuration = 0;
    }

    /**
     * 8대 덕목 우선순위 생성 (기존 로직 유지)
     */
    _generateVirtuePriorities() {
        const types = Object.values(VIRTUE_TYPES);
        const shuffled = [...types].sort(() => Math.random() - 0.5);
        const virtueMap = {};
        shuffled.forEach((type, index) => {
            virtueMap[type] = index + 1;
        });
        return virtueMap;
    }

    /**
     * 관계 초기화 (기존 로직 유지)
     */
    initRelation(targetId) {
        if (!this.relations.has(targetId)) {
            this.relations.set(targetId, {
                level: 'bl',      
                score: 0,         
                isBlocked: false, 
                breakCount: 0     
            });
        }
        return this.relations.get(targetId);
    }
}