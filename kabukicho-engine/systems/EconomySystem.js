// kabukicho-engine/systems/EconomySystem.js
import { JOB_TIERS, MAX_JOB_TIER } from '../constants/Jobs.js';
import { StorageManager } from '../services/StorageManager.js';

export class EconomySystem {
    constructor() {
        this.PROMOTION_REQ = 100;  // 승진에 필요한 성실도
        this.DEMOTION_LIMIT = -50; // 강등 기준
    }

    /**
     * 1. 정책 심의 처리 ($lg)
     */
    processPolicyDeliberation(city, logs) {
        if (city.policyTimer > 0) {
            city.policyTimer--;
            if (city.policyTimer === 0 && city.pendingPolicy) {
                const { type, value } = city.pendingPolicy;
                if (type === 'taxRate') {
                    city.taxRate = value;
                    logs.push(`📢 [행정] 심의 완료. 새로운 세율(${value}%)이 적용됩니다.`);
                }
                city.pendingPolicy = null;
            }
        }
    }

    /**
     * 2. 세금 징수 및 파산 체크 (processCityEconomy)
     */
    processCityEconomy(city, citizens, logs) {
        let totalTax = 0;
        citizens.forEach(c => {
            const tax = Math.floor(c.money * (city.taxRate / 100));
            c.money -= tax;
            totalTax += tax;
        });

        city.budget += totalTax;
        city.budget -= city.maintenance; // 유지비(cs) 차감

        if (city.budget <= 0) {
            logs.push("🚨 [FATAL] 카부키초 파산! 예산이 0 이하입니다.");
            StorageManager.nukeData(); // 데이터 소거 실행
        }
    }

    /**
     * 3. 직업 승진/강등 로직 (updateJobStatus)
     */
    updateJobStatus(char, logs) {
        if (char.sincerityScore >= this.PROMOTION_REQ && char.jobTier < MAX_JOB_TIER) {
            char.jobTier++;
            char.sincerityScore = 0;
            logs.push(`🎊 ${char.name}님이 [${JOB_TIERS[char.jobTier].name}]급으로 승진했습니다!`);
        } else if (char.sincerityScore <= this.DEMOTION_LIMIT && char.jobTier > 1) {
            char.jobTier--;
            char.sincerityScore = 0;
            logs.push(`💢 ${char.name}님이 성실도 부족으로 [${JOB_TIERS[char.jobTier].name}]급으로 강등되었습니다.`);
        }
    }
}