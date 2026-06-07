import assert from "node:assert/strict";
import { PACK_PATH, TEX, stageBackgroundTex } from "../src/game/config.ts";

assert.equal(TEX.stage1Background, "tex-stage1-background");
assert.equal(TEX.cemeteryBackground, "tex-cemetery-background");
assert.equal(PACK_PATH.stage1Background, "assets/TilesetGrass/untitled.png");
assert.equal(PACK_PATH.cemeteryBackground, "assets/backgrounds/cemetery.png");
assert.equal(stageBackgroundTex(1), TEX.stage1Background);
assert.equal(stageBackgroundTex(5), TEX.stage1Background);
assert.equal(stageBackgroundTex(6), TEX.cemeteryBackground);
assert.equal(stageBackgroundTex(15), TEX.cemeteryBackground);
assert.equal(stageBackgroundTex(16), undefined);
