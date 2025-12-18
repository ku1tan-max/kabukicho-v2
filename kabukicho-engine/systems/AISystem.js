// kabukicho-engine/systems/AISystem.js
import { VIRTUE_TYPES } from '../constants/Virtues.js';

export class AISystem {
    constructor() {
        this.styles = {
            [VIRTUE_TYPES.INTELLECT]: ["분석 결과,", "본인의 가설에 따르면", "논리적으로 볼 때"],
            [VIRTUE_TYPES.STAMINA]: ["야!", "한판 붙자고!", "뜨겁게 타올라라!"],
            [VIRTUE_TYPES.KINDNESS]: ["저기..", "항상 응원해요", "오늘 하루는 어떠셨나요?"],
            [VIRTUE_TYPES.WEALTH]: ["자본의 논리에 따르면", "내 수표책이 말하길"],
            [VIRTUE_TYPES.SINCERITY]: ["규율에 따라,", "성실함이 최고의 가치지."]
        };
    }

    /**
     * 6. 지능형 메일 생성 (아이디어 20선 중 핵심 템플릿 데이터화)
     */
    generateMail(sender, receiver, type) {
        const topVirtue = this._getTopVirtue(sender);
        const prefix = this.styles[topVirtue]?.[Math.floor(Math.random() * this.styles[topVirtue].length)] || "어이,";
        let content = "";

        switch (type) {
            case 'affair_confess': // 바람기($AF) 위장 고백
                if (sender.instincts.affair >= 4) {
                    content = `${prefix} 사실 내 마음속엔 너뿐이야. (현재 ${sender.relations.size}명에게 작업 중)`;
                } else {
                    content = `${prefix} 오직 당신만을 바라보고 있습니다.`;
                }
                break;

            case 'gaslighting_chain': // 가스라이팅 집착 ($urr)
                content = `${prefix} 왜 답장이 없어? 나 없으면 죽는다며? 네가 자초한 고립인 걸 잊지 마.`;
                break;

            case 'madao_beg': // 마다오의 구걸 (재력/소지금 부족)
                content = `${prefix} 미안한데... 파친코 자금이 떨어졌어. 1000엔만 빌려주면 안 될까?`;
                break;

            case 'drunken_truth': // 취중진담 (오타 생성기 적용)
                content = `${prefix} ${this._applyDrunkenEffect("너를 정말로 좋아하고 있어.. 우리 사귈래?")}`;
                break;

            case 'bisexual_vibe': // 동성애도 발동 ($bs)
                if (Math.random() < (sender.instincts.orientation / 100)) {
                    content = `${prefix} 너랑 있으면 기분이 묘해. 우리 그냥 친구 맞지?`;
                } else {
                    content = `${prefix} 넌 정말 의리 있는 녀석이야.`;
                }
                break;

            case 'will': // 사망 전 유언장
                content = `${prefix} 내가 떠나더라도 카부키초는 변함없겠지. 내 재산은 네가 잘 써줘라.`;
                break;

            default:
                content = `${prefix} 마요네즈나 먹으러 가자. 🚬`;
        }

        return {
            id: crypto.randomUUID(),
            senderName: sender.name,
            content: content,
            timestamp: new Date().toLocaleTimeString()
        };
    }

    _getTopVirtue(char) {
        const sorted = Object.entries(char.virtues).sort(([, a], [, b]) => a - b);
        return sorted[0][0];
    }

    _applyDrunkenEffect(text) {
        const hiccups = ["..헤헤", " 윽.. ", " 어라..", " 우웩 ", " 읏.. "];
        return text.split('').map(c => 
            Math.random() < 0.2 ? c + hiccups[Math.floor(Math.random() * hiccups.length)] : c
        ).join('');
    }

    /**
     * 7. 상세 로그 묘사 엔진
     */
    describeEvent(a, b, action) {
        if (action === 'fight') return `${a.name}와 ${b.name}이 취해서 가치관 문제로 술상을 엎었습니다!`;
        if (action === 'divorce') return `${a.name}가 ${b.name}에게 위자료 200만 엔을 뜯어내며 파멸시켰습니다.`;
        if (action === 'snapshot') return `📸 [스냅샷] ${a.name}와 ${b.name}의 즐거운(?) 한때가 기록되었습니다.`;
        return `${a.name}와 ${b.name} 사이에 묘한 기류가 흐릅니다.`;
    }
}