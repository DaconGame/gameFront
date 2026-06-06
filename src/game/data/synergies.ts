/**
 * 롤토체스식 직업 시너지(조합) 정의.
 * 현재는 HUD 좌측 패널에서 "현재 조합/임계값"을 표시하는 용도로만 사용한다.
 * (실제 전투 효과 적용은 후속 단계에서 연결)
 */
export type SynergyTier = {
  /** 발동에 필요한 해당 직업 수 */
  count: number;
  /** 발동 효과 설명(짧게) */
  desc: string;
};

export type SynergyDef = {
  /** 직업 id (sword/bow/mage/cleric) — MERC_HUD 키와 동일 */
  id: string;
  /** 시너지 이름 */
  name: string;
  tiers: SynergyTier[];
};

/** report.md의 조합 표 기반. 임계값은 2명 / 3명 두 단계. */
export const SYNERGY_DEFS: Record<string, SynergyDef> = {
  sword: {
    id: "sword",
    name: "전열",
    tiers: [
      { count: 2, desc: "공격범위 +25%, 검사 피해 -20%" },
      { count: 3, desc: "적 넉백 + 플레이어 피해 -20%" },
    ],
  },
  bow: {
    id: "bow",
    name: "연사",
    tiers: [
      { count: 2, desc: "화살 관통(뒤 적 추가 타격)" },
      { count: 3, desc: "공격속도 +30%" },
    ],
  },
  mage: {
    id: "mage",
    name: "광역",
    tiers: [
      { count: 2, desc: "폭발 반경 증가" },
      { count: 3, desc: "폭발 자리 장판 생성" },
    ],
  },
  cleric: {
    id: "cleric",
    name: "축복",
    tiers: [
      { count: 2, desc: "힐량 +50%, 주변 용병 회복" },
      { count: 3, desc: "주기적 전체 보호막" },
    ],
  },
};

/** 현재 발동 중인 최고 단계 티어를 반환(없으면 null). */
export function activeTier(def: SynergyDef, count: number): SynergyTier | null {
  let result: SynergyTier | null = null;
  for (const tier of def.tiers) {
    if (count >= tier.count) result = tier;
  }
  return result;
}

/** 다음 단계까지 필요한 티어를 반환(이미 만렙이면 null). */
export function nextTier(def: SynergyDef, count: number): SynergyTier | null {
  for (const tier of def.tiers) {
    if (count < tier.count) return tier;
  }
  return null;
}
