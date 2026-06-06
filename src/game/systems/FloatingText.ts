import Phaser from "phaser";

const FLOATING_TEXT_DEPTH = 100;

type FloatOpts = {
  color?: string;
  fontSize?: number;
  rise?: number;
  duration?: number;
};

/**
 * 지정 좌표에서 위로 떠오르며 사라지는 일회성 텍스트(데미지·점수 팝업).
 * 적과 독립된 객체라 적이 풀로 반환돼도 끝까지 애니메이션된다.
 */
export function spawnFloatingText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  opts: FloatOpts = {},
): void {
  const { color = "#ffe2b0", fontSize = 13, rise = 34, duration = 650 } = opts;

  const label = scene.add.text(x, y, text, {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: `${fontSize}px`,
    color,
    stroke: "#000000",
    strokeThickness: 3,
  });
  label.setOrigin(0.5, 1);
  label.setDepth(FLOATING_TEXT_DEPTH);

  scene.tweens.add({
    targets: label,
    y: y - rise,
    x: x + Phaser.Math.Between(-10, 10),
    alpha: { from: 1, to: 0 },
    ease: "Cubic.easeOut",
    duration,
    onComplete: () => label.destroy(),
  });
}
