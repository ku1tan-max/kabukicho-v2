// kabukicho-engine/systems/EconomySystem.js
import { JOB_TIERS, MAX_JOB_TIER } from '../constants/Jobs.js';

/**
 * 경제 및 사회적 신분 시스템: "돈이 곧 권력인 거리" 연산 엔진
 */
export class EconomySystem {
    constructor() {
        this.DEFS = {
            PROMOTION_REQ: 100, // 승진에 필요한 성실도 점수
            DEMOTION_LIMIT: -50, // 강등 기준 점수
            BASE_MAINTENANCE: 5000 // 기본 도시 유지비 (cs)
        };
    }

    /**
     * 4.1. 직업 계급 및 승진 (@JL)
     * 매 턴 캐릭터의 성실도를 체크하여 승격/강등 여부를 결정한다.
     */
    updateJobStatus(character, logs) {
        // 성실도 점수(sincerityScore)에 따른 승진/강등 로직
        if (character.sincerityScore >= this.DEFS.PROMOTION_REQ && character.jobTier < MAX_JOB_TIER) {
            character.jobTier++;
            character.sincerityScore = 0; // 점수 초기화
            logs.push(`🎊 ${character.name}: 베테랑들의 인정을 받아 [${JOB_TIERS[character.jobTier].name}]급으로 승진했다! 🚬`);
        } 
        else if (character.sincerityScore <= this.DEFS.DEMOTION_LIMIT && character.jobTier > 1) {
            character.jobTier--;
            character.sincerityScore = 0;
            logs.push(`💢 ${character.name}: 농땡이 피우다 걸려서 [${JOB_TIERS[character.jobTier].name}]급으로 강등됐다. 월급 깎일 준비나 해.`);
        }
    }

    /**
     * 4.2. 세금 징수 및 도시 예산 관리 (sc_.cgi)
     * 플레이어(시장)가 설정한 세율(tx_nm)에 따라 주민들의 돈을 뜯어내고 도시를 유지한다.
     */
    processCityEconomy(city, citizens, logs) {
        let totalTaxCollected = 0;

        citizens.forEach(c => {
            // 개인 자산(money + assets) 비례 세금 계산 (tx_nm)
            const taxAmount = Math.floor((c.money + c.assets) * (city.taxRate / 100));
            c.money -= taxAmount;
            totalTaxCollected += taxAmount;
        });

        // 도시 예산(gp) 업데이트: 세입 추가 - 유지비(cs) 차감
        city.budget += totalTaxCollected;
        city.budget -= city.maintenance;

        logs.push(`💰 이번 턴 세금 징수 완료: +${totalTaxCollected}엔 / 도시 유지비 지출: -${city.maintenance}엔`);
        logs.push(`🏦 현재 도시 예산(gp): ${city.budget}엔`);

        // 파산 리스크: 예산이 0 이하가 되면 도시 전체 데이터 삭제 (게임 오버)
        if (city.isBankrupt()) {
            logs.push(`🚨 [SYSTEM ERROR] 카부키초 파산! 예산이 바닥났다. 모든 데이터가 소거된다...`);
            // 실제 삭제 트리거는 WorldManager에서 처리하도록 유도
        }
    }

    /**
     * 급여 지급 로직
     */
    distributeSalaries(citizens, logs) {
        citizens.forEach(c => {
            const pay = JOB_TIERS[c.jobTier].salary;
            c.money += pay;
        });
        logs.push(`💵 주민들에게 월급이 지급됐다. 파친코로 달려가는 소리가 여기까지 들리는군.`);
    }

    /**
     * 정책 심의 처리 ($lg)
     * 설정한 시간이 지나면 대기 중인 정책을 실제 도시에 반영한다.
     */
    processPolicyDeliberation(city, logs) {
        if (city.policyTimer > 0) {
            city.policyTimer--;
            if (city.policyTimer === 0 && city.pendingPolicy) {
                const { type, value } = city.pendingPolicy;
                if (type === 'taxRate') city.taxRate = value;
                logs.push(`📢 [심의 완료] 새로운 정책 '${type}: ${value}'이(가) 지금부터 카부키초에 적용된다!`);
                city.pendingPolicy = null;
            }
        }
    }
}