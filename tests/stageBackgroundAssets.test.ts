import assert from "node:assert/strict";
import { PACK_PATH, TEX } from "../src/game/config.ts";

assert.equal(TEX.stage1Background, "tex-stage1-background");
assert.equal(PACK_PATH.stage1Background, "assets/TilesetGrass/untitled.png");
