// kabukicho-engine/systems/RelationSystem.js

export class RelationSystem {
    constructor() {
        this.DEFS = {
            AF_MAX: 5,        // $def_af: 바람기 최대치
            LO_LIMIT: 3,      // $def_lo: 고백 거절 한계 (단념 트리거)
            PB_BONUS: 20,     // $def_pb: 선물 공세 보너스
            GASLIGHT_THRESHOLD: 80 // 가스라이팅을 시작하기 위한 최소 호감도
        };
    }

    /**
     * 3.2. 매칭 알고리즘 (sub love_match)
     * 8대 덕목(@VT) 우선순위 일치도 + $bs(성 지향성) 연산
     */
    calculateLoveMatch(a, b, itemBonus = 0) {
        let score = 0;

        // 1. 8대 덕목 우선순위 비교 (1위에 가까울수록 가중치 상승)
        // 서로가 중시하는 덕목이 일치하는지 확인
        Object.keys(a.virtues).forEach(vKey => {
            const aRank = a.virtues[vKey]; // 1~8
            const bRank = b.virtues[vKey];
            
            // 두 캐릭터 모두 해당 덕목을 상위권(1~3위)으로 여길 때 보너스
            if (aRank <= 3 && bRank <= 3) {
                score += (4 - aRank) * 15;
            }
        });

        // 2. 성 지향성($bs) 및 성별 체크
        // 성별이 같을 경우, 양쪽의 $bs 수치를 평균내어 확률 보정
        if (a.gender === b.gender) {
            const orientationFactor = (a.instincts.orientation + b.instincts.orientation) / 200;
            score *= orientationFactor;
        }

        // 3. 기분 및 아이템 보너스 ($def_pb)
        score += (a.mood / 10) + itemBonus;

        return Math.min(100, Math.max(0, score));
    }
/**
     * 가스라이팅 실행 ($urr & $blue 연동)
     */
    executeGaslighting(perpetrator, victim, logs) {
        const rel = perpetrator.initRelation(victim.id);
        
        // 호감도가 80 이상일 때만 정서적 지배 가능
        if (rel.score < 80) {
            return { success: false, msg: "상대가 아직 네놈에게 충분히 미치지 않았어. 🚬" };
        }

        rel.isBlocked = true; // $urr: 메일 수신 거부 설정
        victim.isBlue = true;  // $blue: 우울 상태 돌입
        victim.mood = 0;
        
        logs.push(`⚠️ [가스라이팅] ${perpetrator.name}이(가) ${victim.name}을 정서적으로 고립시켰다.`);
        return { success: true, msg: "상대는 이제 네놈의 노예다." };
    }

    /**
     * 메일 송신 가능 여부 체크
     */
    canSendMail(sender, receiver) {
        const rel = receiver.relations.get(sender.id);
        // 상대방이 나를 차단($urr)했다면 메일 전송 불가
        if (rel && rel.isBlocked) return false;
        return true;
    }
}