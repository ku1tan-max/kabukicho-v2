// kabukicho-engine/systems/RelationSystem.js

/**
 * 심층 인간관계 시스템: "수치로 박제된 감정" 연산 엔진
 */
export class RelationSystem {
    constructor() {
        // 기본 밸런스 수치 정의
        this.DEFS = {
            AF_MAX: 5,      // $def_af: 바람기 최대치
            LO_LIMIT: 3,    // $def_lo: 고백 거절 한계 (단념 트리거)
            PB_BONUS: 20    // $def_pb: 선물 공세 보너스
        };
    }

    /**
     * 3.2. 매칭 알고리즘 (sub love_match)
     * 덕목 순위, 현재 기분, 아이템 보너스를 복합 연산하여 0~100% 궁합 산출
     */
    calculateLoveMatch(a, b, itemBonus = 0) {
        let compatibility = 0;

        // 1. 8대 가치관(@VT) 일치도 연산
        // 서로가 가장 중시하는(1순위) 덕목이 일치할수록 점수 대폭 상승
        const aTopVirtues = Object.entries(a.virtues).sort(([, v1], [, v2]) => v1 - v2).slice(0, 3);
        const bTopVirtues = Object.entries(b.virtues).sort(([, v1], [, v2]) => v1 - v2).slice(0, 3);

        aTopVirtues.forEach(([vType, rank]) => {
            if (b.virtues[vType] <= 3) { // 상대방도 해당 덕목을 상위권으로 생각한다면
                compatibility += (4 - rank) * 10; 
            }
        });

        // 2. 성 지향성($bs) 반영
        if (a.gender === b.gender) {
            compatibility *= (a.instincts.orientation / 100);
        }

        // 3. 기분 및 아이템 보너스($def_pb)
        compatibility += (a.mood / 10) + itemBonus;

        return Math.min(100, Math.max(0, compatibility));
    }

    /**
     * 고백 및 관계 발전 (bl -> lv -> hw)
     */
    tryProgressRelation(sender, receiver) {
        const relation = sender.initRelation(receiver.id);
        const revRelation = receiver.initRelation(sender.id);

        // 1. 바람도(@AF) 체크: 현재 연인 수가 바람기 수치보다 적어야 함
        const currentLovers = Array.from(sender.relations.values()).filter(r => r.level === 'lv' || r.level === 'hw').length;
        if (currentLovers >= sender.instincts.affair) {
            return { success: false, msg: "바람기 수치가 부족해서 양다리를 못 걸치겠는데? 🚬" };
        }

        // 2. 단념 상태 체크 ($def_lo)
        if (relation.breakCount >= this.DEFS.LO_LIMIT) {
            return { success: false, msg: "이미 너무 많이 차여서 단념 상태다. 접근 불가." };
        }

        // 3. 궁합 기반 성공 확률 계산
        const matchScore = this.calculateLoveMatch(sender, receiver);
        const isSuccess = (Math.random() * 100) < matchScore;

        if (isSuccess) {
            if (relation.level === 'bl') relation.level = 'lv';
            else if (relation.level === 'lv') relation.level = 'hw';
            return { success: true, score: matchScore, msg: "고백 성공! 이제부터 지옥의 시작이다. 🚬" };
        } else {
            relation.breakCount++;
            relation.score -= 10;
            return { success: false, msg: "차였다. 가서 딸기 우유나 마셔라." };
        }
    }

    /**
     * 가스라이팅 (Mail Blocking & $urr)
     * 호감도를 높인 후 갑자기 차단하여 상대를 우울($blue=1) 상태로 빠뜨림
     */
    executeGaslighting(perpetrator, victim) {
        const relation = perpetrator.initRelation(victim.id);
        
        if (relation.score < 50) return { success: false, msg: "상대가 네놈을 그 정도로 좋아하지 않는데?" };

        relation.isBlocked = true; // $urr 활성화
        victim.isBlue = true;      // $blue=1 (우울 상태)
        victim.mood = 0;
        
        return { success: true, msg: `${victim.name}은(는) 이제 네놈의 정서적 노예다.` };
    }

    /**
     * 격려 (cheer)
     * 타인의 상태 수치를 회복시켜 호감도의 물꼬를 틈
     */
    cheer(sender, receiver) {
        receiver.mood = Math.min(100, receiver.mood + 20);
        const rel = sender.initRelation(receiver.id);
        rel.score += 5;
        return `${sender.name}이(가) ${receiver.name}을(를) 격려했다. 기분이 좀 나아진 것 같군.`;
    }
}