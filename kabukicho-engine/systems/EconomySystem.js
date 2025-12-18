import { StorageManager } from '../services/StorageManager.js';

export class EconomySystem {
    // 1번 함수: 정책 심의 처리 ($lg)
    processPolicyDeliberation(city, logs) {
        if (city.policyTimer > 0) {
            city.policyTimer--;
            if (city.policyTimer === 0 && city.pendingPolicy) {
                this._applyPolicy(city, city.pendingPolicy, logs);
                city.pendingPolicy = null;
            }
        }
    }

    // 2번 함수: 세금 및 예산 처리
    processCityEconomy(city, citizens, logs) {
        let collectedTax = 0;
        citizens.forEach(c => {
            const tax = Math.floor(c.money * (city.taxRate / 100));
            c.money -= tax;
            collectedTax += tax;
        });
        city.budget += collectedTax;
        city.budget -= (city.maintenance || 0);

        if (city.budget <= 0) {
            logs.push("🚨 [FATAL] 카부키초 파산! 모든 데이터를 삭제합니다.");
            StorageManager.nukeData(); 
        }
    }

    // 3번 함수: 직업 상태 업데이트 (기본 틀 마련)
    updateJobStatus(char, logs) {
        // 성실도 체크 로직 (추후 보완 가능하게 뼈대 구축)
        if (char.integrity > 80 && Math.random() > 0.9) {
            logs.push(`🎊 ${char.name}님이 승진했습니다!`);
        }
    }

    _applyPolicy(city, policy, logs) {
        if (policy.type === 'taxRate') {
            city.taxRate = policy.value;
            logs.push(`📢 [행정] 심의 완료. 새로운 세율(${city.taxRate}%) 적용.`);
        }
    }
}