// kabukicho-engine/systems/LifeCycleSystem.js
import { Character } from '../models/Character.js';

/**
 * 가족 및 생물학적 사이클: "가문의 형성과 파멸" 연산 엔진
 */
export class LifeCycleSystem {
    constructor() {
        this.DEFS = {
            BIRTH_AGE: 20,           // 자식이 독립하는 나이
            DIVORCE_ALIMONY: 2000000, // 위자료 200만 엔 (경제적 파멸)
            DEATH_PROB_BASE: 0.01,   // 기초 사망 확률 (sub dead_check)
            PREGNANCY_CHANCE: 0.1    // 임신 확률 (pg 수치 활성화)
        };
    }

    /**
     * 5.1. 번식 및 유전 (pg / birth)
     * 연인/배우자와 함께 있을 때 임신 트리거를 체크한다.
     */
    checkPregnancyTrigger(parentA, parentB, logs) {
        // 이미 임신 중이면 패스
        if (parentA.isPregnant || parentB.isPregnant) return;

        // 임신 체크 (pg 수치 활성화)
        if (Math.random() < this.DEFS.PREGNANCY_CHANCE) {
            const mother = parentA.gender === 'F' ? parentA : (parentB.gender === 'F' ? parentB : null);
            if (mother) {
                mother.isPregnant = true;
                logs.push(`🍼 [경축] ${parentA.name}와 ${parentB.name} 사이에 새로운 생명이 싹텄다! (pg 활성화)`);
            }
        }
    }

    /**
     * 유전 로직: 부모의 상위 덕목 3개를 자식에게 높은 확률로 상속
     */
    processBirth(mother, father, worldManager) {
        if (!mother.isPregnant) return;

        // 부모 상위 덕목 추출
        const getTop3 = (v) => Object.entries(v).sort(([, a], [, b]) => a - b).slice(0, 3).map(([k]) => k);
        const inheritedTraits = [...new Set([...getTop3(mother.virtues), ...getTop3(father.virtues)])];

        // 자식 캐릭터 생성 (유닛으로 독립하기 전 단계)
        const childName = `${mother.name.substring(0, 1)}${father.name.substring(1, 2)}의 자식`;
        const child = new Character(childName, false, mother.faction, Math.random() > 0.5 ? 'M' : 'F');
        
        // 유전 반영: 부모의 상위 덕목 우선순위를 높임
        inheritedTraits.forEach(trait => {
            if (child.virtues[trait] > 3) child.virtues[trait] -= 2; // 우선순위 상향 조정
        });

        child.age = 0;
        mother.isPregnant = false;
        
        // 자식 데이터 등록 (cd 단계)
        mother.relations.set(child.id, { level: 'cd', score: 100 });
        father.relations.set(child.id, { level: 'cd', score: 100 });

        return child;
    }

    /**
     * 5.2. 파멸과 종말: 살벌한 이혼
     * 호감도 추락 시 발생. 위자료 200만 지불 + 자산/자식 소유권 강제 이전.
     */
    executeDivorce(a, b, logs) {
        logs.push(`💔 [파멸] ${a.name}와 ${b.name}의 관계가 끝났다. 살벌한 이혼 절차에 들어간다.`);

        // 경제적 파멸: 위자료 200만 지불
        const alimony = this.DEFS.DIVORCE_ALIMONY;
        if (a.money >= alimony) {
            a.money -= alimony;
            b.money += alimony;
        } else {
            // 돈 없으면 자산(부동산) 털기
            b.money += a.money;
            b.assets += a.assets;
            a.money = 0;
            a.assets = 0;
        }

        // 관계 초기화 및 자식 소유권 이전 (단순화: 상대방 호감도 떡락)
        const relA = a.initRelation(b.id);
        const relB = b.initRelation(a.id);
        relA.level = 'bl'; relA.score = -100;
        relB.level = 'bl'; relB.score = -100;

        logs.push(`💸 ${a.name}은(는) 위자료 지불로 파산 직전이다. 카부키초에서 빈털터리로 살아남아 보라고. 🚬`);
    }

    /**
     * 사망 시스템 (sub dead_check)
     * 일정 연령 초과 시 사망 주사위를 던진다.
     */
    checkDeath(character, logs) {
        if (character.age < 60) return false;

        // 나이가 들수록 사망 확률 증가
        const deathProb = this.DEFS.DEATH_PROB_BASE * (character.age - 50);
        if (Math.random() < deathProb) {
            logs.push(`💀 [부고] ${character.name}이(가) 노환으로 별세했다. 카부키초 거리에 슬픔이 잠긴다...`);
            return true; // 사망 확정
        }
        return false;
    }
}