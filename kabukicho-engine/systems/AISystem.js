// kabukicho-engine/systems/AISystem.js
import { VIRTUE_TYPES } from '../constants/Virtues.js';

/**
 * API 연동 지능형 통신 엔진: 캐릭터의 인격에 따른 텍스트 생성
 */
export class AISystem {
    constructor() {
        this.styles = {
            intellect: ["논리적으로 분석해본 결과...", "본인의 견해로는 말이죠.", "통계학적으로 당신은..."],
            stamina: ["야! 너 일루와 봐!", "몸으로 부딪혀보자고!", "뜨겁게 타올라라!!"],
            kindness: ["항상 응원하고 있어요.", "오늘 하루는 어떠셨나요?", "부디 몸조심하세요..."]
        };
    }

    /**
     * 6. 편지 및 소통 엔진: 캐릭터의 성향에 따른 메일 내용 생성
     */
    generateMailContent(sender, receiver, type) {
        let content = "";
        const topVirtue = this._getTopVirtue(sender);

        // 1. 덕목 기반 문체 결정
        let prefix = "어이, ";
        if (sender.virtues[VIRTUE_TYPES.INTELLECT] <= 2) prefix = this.styles.intellect[Math.floor(Math.random() * 3)];
        else if (sender.virtues[VIRTUE_TYPES.STAMINA] <= 2) prefix = this.styles.stamina[Math.floor(Math.random() * 3)];
        else if (sender.virtues[VIRTUE_TYPES.KINDNESS] <= 2) prefix = this.styles.kindness[Math.floor(Math.random() * 3)];

        // 2. 상황(type)에 따른 내용 생성
        switch (type) {
            case 'love': // 바람기($AF)가 반영된 고백
                if (sender.instincts.affair >= 4) {
                    content = `${prefix} 사실 내 마음속엔 너뿐이야. (다른 4명에게도 보낸 메시지입니다.)`;
                } else {
                    content = `${prefix} 진심으로 당신을 좋아하게 된 것 같습니다.`;
                }
                break;

            case 'gaslighting': // 가스라이팅 집착 메일
                content = `${prefix} 나 없으면 너도 끝인 거 알지? 너 같은 걸 누가 받아주겠어.`;
                break;

            case 'begging': // 마다오의 구걸
                content = `${prefix} 미안한데... 파친코 한 판만 하게 1000엔만 빌려주면 안 될까?`;
                break;

            case 'will': // 사망 전 유언장
                content = `${prefix} 내가 떠나더라도 카부키초는 변함없겠지. 내 재산은 네가 잘 써줘라.`;
                break;

            default:
                content = `${prefix} 그냥 생각나서 보냈다. 🚬`;
        }

        return content;
    }

    /**
     * 상세 로그 및 뉴스 엔진: 사건을 문장으로 묘사
     */
    generateEventLog(a, b, action) {
        if (action === 'fight') {
            return `👊 ${a.name}와 ${b.name}이(가) 서로의 가치관을 비난하며 술상을 엎었습니다!`;
        }
        if (action === 'divorce') {
            return `💔 ${a.name}이(가) 이혼 서류를 던지며 ${b.name}의 모든 재산을 털어갔습니다.`;
        }
        return `📢 ${a.name}와 ${b.name} 사이에 사건이 발생했습니다.`;
    }

    _getTopVirtue(character) {
        return Object.entries(character.virtues).sort(([, a], [, b]) => a - b)[0][0];
    }
}