import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const synergyPanel = readFileSync("src/ui/game/SynergyPanel.tsx", "utf8");
const mercBar = readFileSync("src/ui/game/MercBar.tsx", "utf8");

assert.equal(/<button\b/.test(synergyPanel), false);
assert.equal(/\stabIndex=/.test(mercBar), false);
