// kabukicho-engine/systems/RelationSystem.js

export class RelationSystem {
    constructor() {
        this.DEFS = {
            AF_MAX: 5,
            LO_LIMIT: 3,
            PB_BONUS: 20,
            GASLIGHT_THRESHOLD: 80
        };
    }

    // NPC들이 서로 친목질할 때 쓰는 함수다
    cheer(a, b) {
        const relA = a.initRelation(b.id);
        const relB = b.initRelation(a.id);
        relA.score += 2;
        relB.score += 2;
        // console.log(`${a.name}와 ${b.name}이 마요네즈 이야기를 하며 친해졌습니다.`);
    }

    // 관계 진전 시도 (고백이나 어장관리 로직의 뼈대다)
    tryProgressRelation(a, b) {
        const matchScore = this.calculateLoveMatch(a, b);
        const rel = a.initRelation(b.id);

        if (matchScore > 60) {
            rel.level = 'lv'; // 연인으로 승격
            return true;
        }
        rel.breakCount++; // 거절 횟수 증가
        return false;
    }

    calculateLoveMatch(a, b, itemBonus = 0) {
        let score = 0;
        Object.keys(a.virtues).forEach(vKey => {
            const aRank = a.virtues[vKey];
            const bRank = b.virtues[vKey];
            if (aRank <= 3 && bRank <= 3) {
                score += (4 - aRank) * 15;
            }
        });
        if (a.gender === b.gender) {
            const orientationFactor = (a.instincts.orientation + b.instincts.orientation) / 200;
            score *= orientationFactor;
        }
        score += (a.mood / 10) + itemBonus;
        return Math.min(100, Math.max(0, score));
    }
     // 가스라이팅 실행 ($urr & $blue 연동)
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