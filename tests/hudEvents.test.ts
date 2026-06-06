import assert from "node:assert/strict";
import {
  GAME_HUD_EVENT,
  GAME_PAUSE_EVENT,
  GAME_RESULT_EVENT,
  emitHudSnapshot,
  emitPauseState,
  emitResultState,
} from "../src/ui/game/hudEvents.ts";
import type { GameHudSnapshot, HudResult } from "../src/ui/game/hudTypes.ts";

const snapshot = {
  hp: { current: 10, max: 20, ratio: 0.5 },
  time: { elapsedSec: 3, remainingSec: 597, label: "9:57" },
  wave: { current: 1, total: 20, progress: 0.1, label: "01 / 20" },
  stats: { kills: 2, score: 30, finalScore: 100 },
  party: [],
  synergies: [],
  boss: null,
} satisfies GameHudSnapshot;

const result = {
  victory: true,
  elapsedSec: 180,
  kills: 12,
  score: 300,
  finalScore: 540,
  wave: 5,
} satisfies HudResult;

const events: Event[] = [];
const target = {
  dispatchEvent(event: Event) {
    events.push(event);
    return true;
  },
};

emitHudSnapshot(target, snapshot);
emitPauseState(target, true);
emitResultState(target, result);
emitResultState(target, null);

assert.equal(events[0].type, GAME_HUD_EVENT);
assert.equal((events[0] as CustomEvent<GameHudSnapshot>).detail, snapshot);
assert.equal(events[1].type, GAME_PAUSE_EVENT);
assert.equal((events[1] as CustomEvent<boolean>).detail, true);
assert.equal(events[2].type, GAME_RESULT_EVENT);
assert.equal((events[2] as CustomEvent<HudResult | null>).detail, result);
assert.equal((events[3] as CustomEvent<HudResult | null>).detail, null);
