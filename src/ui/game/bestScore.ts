const BEST_SCORE_KEY = "dacon-game:best-score";

export function getBestScore(): number {
  const raw = localStorage.getItem(BEST_SCORE_KEY);
  const value = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(value) ? value : 0;
}

/**
 * 점수를 기록한다. 기존 최고점을 넘으면 저장 후 true(신기록)를 반환한다.
 */
export function recordScore(score: number): { best: number; isNewRecord: boolean } {
  const prev = getBestScore();
  if (score > prev) {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
    return { best: score, isNewRecord: true };
  }
  return { best: prev, isNewRecord: false };
}
