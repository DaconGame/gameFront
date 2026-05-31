import { CLASS_ASSET_BASE } from "../config";

export type EnemyId =
  | "slime"
  | "rusher"
  | "brute"
  | "boss-orcrider"
  | "boss-eliteorc"
  | "boss-skeleton"
  | "boss-armoredorc";
export type EnemyAnimKind = "idle" | "walk" | "hurt" | "death";

export const ENEMY_FRAME = { width: 100, height: 100 } as const;

export type EnemyDef = {
  id: EnemyId;
  label: string;
  /** Tiny RPG 팩 내 캐릭터 폴더명 (기획서 3종을 보유 에셋에 매핑) */
  folder: string;
  hp: number;
  speed: number;
  damage: number;
  score: number;
  scale: number;
  /** 100px 프레임에서 발이 닿는 세로 비율(원점) */
  feetRatio: number;
  /** 충돌 바디 크기(px, 스케일 적용 전) */
  body: { w: number; h: number };
  /** 보스 여부(체력바·라운드 규칙 처리에 사용) */
  boss?: boolean;
};

/** 기획서 8-1 수치 기반. slime=Orc / rusher=Werewolf / brute=Werebear 로 매핑. */
export const ENEMY_DEFS: Record<EnemyId, EnemyDef> = {
  slime: {
    id: "slime",
    label: "슬라임",
    folder: "Orc",
    hp: 18,
    speed: 70,
    damage: 8,
    score: 10,
    scale: 3.3,
    feetRatio: 0.62,
    body: { w: 30, h: 26 },
  },
  rusher: {
    id: "rusher",
    label: "돌진병",
    folder: "Werewolf",
    hp: 12,
    speed: 120,
    damage: 6,
    score: 15,
    scale: 3.4,
    feetRatio: 0.62,
    body: { w: 30, h: 28 },
  },
  brute: {
    id: "brute",
    label: "덩치",
    folder: "Werebear",
    hp: 55,
    speed: 45,
    damage: 15,
    score: 30,
    scale: 4.2,
    feetRatio: 0.62,
    body: { w: 40, h: 34 },
  },
  "boss-orcrider": {
    id: "boss-orcrider",
    label: "오크 라이더",
    folder: "Orc rider",
    hp: 500,
    speed: 60,
    damage: 16,
    score: 300,
    scale: 5.0,
    feetRatio: 0.62,
    body: { w: 46, h: 42 },
    boss: true,
  },
  "boss-eliteorc": {
    id: "boss-eliteorc",
    label: "엘리트 오크 군주",
    folder: "Elite Orc",
    hp: 1000,
    speed: 58,
    damage: 20,
    score: 500,
    scale: 5.4,
    feetRatio: 0.62,
    body: { w: 50, h: 46 },
    boss: true,
  },
  "boss-skeleton": {
    id: "boss-skeleton",
    label: "강철 해골 장군",
    folder: "Armored Skeleton",
    hp: 1700,
    speed: 64,
    damage: 22,
    score: 700,
    scale: 5.2,
    feetRatio: 0.62,
    body: { w: 48, h: 46 },
    boss: true,
  },
  "boss-armoredorc": {
    id: "boss-armoredorc",
    label: "대마왕 아머드 오크",
    folder: "Armored Orc",
    hp: 2600,
    speed: 56,
    damage: 26,
    score: 1200,
    scale: 5.8,
    feetRatio: 0.62,
    body: { w: 54, h: 50 },
    boss: true,
  },
};

export const ENEMY_IDS = Object.keys(ENEMY_DEFS) as EnemyId[];

/** 보스가 등장하는 웨이브 → 보스 종류 매핑. */
export const BOSS_WAVE_MAP: Record<number, EnemyId> = {
  5: "boss-orcrider",
  10: "boss-eliteorc",
  15: "boss-skeleton",
  20: "boss-armoredorc",
};

export const BOSS_WAVES = Object.keys(BOSS_WAVE_MAP).map(Number);

export function isBossWave(wave: number): boolean {
  return wave in BOSS_WAVE_MAP;
}

export function bossIdForWave(wave: number): EnemyId | undefined {
  return BOSS_WAVE_MAP[wave];
}

export const enemyTex = (id: EnemyId, kind: EnemyAnimKind): string => `tex-enemy-${id}-${kind}`;
export const enemyAnimKey = (id: EnemyId, kind: EnemyAnimKind): string => `enemy-${id}-${kind}`;

const ANIM_FILE: Record<EnemyAnimKind, string> = {
  idle: "Idle",
  walk: "Walk",
  hurt: "Hurt",
  death: "Death",
};

export function enemySheetPath(folder: string, kind: EnemyAnimKind): string {
  return encodeURI(`${CLASS_ASSET_BASE}/${folder}/${folder}/${folder}-${ANIM_FILE[kind]}.png`);
}
