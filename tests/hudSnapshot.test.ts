import assert from "node:assert/strict";
import { buildHudSnapshot } from "../src/ui/game/hudSnapshot.ts";
import { createPartyUnit } from "../src/game/state/partyUnits.ts";

const player = createPartyUnit("sword", { isPlayer: true });
const bow = createPartyUnit("bow");
bow.rank = 2;

const snapshot = buildHudSnapshot({
  elapsedSec: 42.4,
  waveElapsedSec: 7.5,
  waveSec: 30,
  wave: 3,
  hp: 76,
  maxHp: 120,
  kills: 12,
  score: 340,
  finalScore: 820,
  party: [player, bow],
});

assert.equal(snapshot.time.remainingSec, 558);
assert.equal(snapshot.wave.label, "03 / 20");
assert.equal(snapshot.hp.ratio, 76 / 120);

const bowSlot = snapshot.party.find((unit) => unit.id === "bow");
assert.ok(bowSlot);
assert.equal(bowSlot.badge, "II");
assert.deepEqual(bowSlot.tooltip, ["궁수 2등급(II)", "공격 19", "쿨타임 0.68s", "사거리 340px"]);

const active = snapshot.synergies.find((row) => row.key === "cover-fire");
assert.ok(active);
assert.equal(active.active, true);
assert.equal(active.progressLabel, "2/2");
assert.equal(active.tooltip.at(-1), "궁수 공격력 +15%");

const inactive = snapshot.synergies.find((row) => row.key === "guard-oath");
assert.ok(inactive);
assert.equal(inactive.active, false);
assert.equal(inactive.progressLabel, "1/2");
assert.deepEqual(inactive.missingLabels, ["성직자"]);
assert.equal(inactive.tooltip.at(-1), "성직자 합류 시 발동");
