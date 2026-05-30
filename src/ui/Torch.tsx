import type { ReactElement } from "react";

type Props = {
  side: "left" | "right";
};

/**
 * 픽셀 아트 횃불.
 * - 불꽃: 3프레임 스프라이트식 픽셀 플리커(벡터 곡선 없음, 좌우 대칭은 코드에서 미러링).
 * - 몸통: 철제 벽 브라켓(암 + 컵 + 대각 지지대) + 나뭇결 음영이 들어간 손잡이.
 * - 그 위로 떠오르는 잿불과 따뜻한 글로우가 분위기를 만든다.
 */

const FLAME_COLORS: Record<string, string> = {
  r: "#cf2a12", // 외곽 (딥 레드)
  o: "#ff7a2a", // 중간 (오렌지)
  y: "#ffd35a", // 안쪽 (옐로)
  w: "#fff6d8", // 코어 (화이트핫)
};

/** 7칸 좌반부(가운데 포함) → 13칸 대칭 행으로 확장 */
const mirrorRow = (half: string) => half + half.slice(0, 6).split("").reverse().join("");

// 각 프레임은 20행 × (좌반부 7칸). '.'=빈칸, r/o/y/w=색.
const FRAME_1 = [
  "......r",
  ".....ro",
  "....roo",
  "....roo",
  "...rooy",
  "...royy",
  "..rooyy",
  "..royyy",
  "..royyw",
  ".rooyww",
  ".royyww",
  ".royyww",
  ".rooyyw",
  ".rooyyy",
  "..rooyy",
  "..roooy",
  "...rooo",
  "...rooo",
  "....roo",
  ".....ro",
];

const FRAME_2 = [
  "......r",
  "......o",
  ".....ro",
  ".....oo",
  "....roy",
  "....roy",
  "...rooy",
  "...royy",
  "..rooyy",
  "..royyw",
  "..royww",
  ".rooyww",
  ".royyww",
  ".rooyyw",
  ".rooyyy",
  "..rooyy",
  "..roooy",
  "...rooo",
  "....roo",
  ".....ro",
];

const FRAME_3 = [
  ".......",
  "......r",
  ".....ro",
  "....roo",
  "...rooy",
  "...royy",
  "..rooyy",
  "..royyw",
  ".rooyww",
  ".royyww",
  ".royyww",
  ".rooyyw",
  ".rooyyy",
  "..rooyy",
  "..roooy",
  "...rooo",
  "...rooo",
  "....roo",
  ".....ro",
  ".......",
];

const FLAME_OX = 7;
const FLAME_OY = 2;

function FlameFrame({ rows, className, delay }: { rows: string[]; className: string; delay: string }) {
  const cells: ReactElement[] = [];
  rows.forEach((half, r) => {
    const full = mirrorRow(half);
    for (let c = 0; c < full.length; c++) {
      const ch = full[c];
      if (ch === ".") continue;
      cells.push(
        <rect key={`${r}-${c}`} x={FLAME_OX + c} y={FLAME_OY + r} width={1} height={1} fill={FLAME_COLORS[ch]} />,
      );
    }
  });
  return (
    <g className={className} style={{ animationDelay: delay }}>
      {cells}
    </g>
  );
}

export function Torch({ side }: Props) {
  const isLeft = side === "left";
  // 3개 불꽃 프레임은 반드시 같은 딜레이를 공유해야 한다.
  // (키프레임이 프레임 순서를 담당 → 항상 한 프레임만 표시)
  // 좌우는 단일 딜레이만 다르게 줘 위상을 어긋나게 한다.
  const flameDelay = isLeft ? "0s" : "-0.21s";
  const glowDelay = isLeft ? "0s" : "-0.6s";

  return (
    <div
      className="absolute pointer-events-none"
      aria-hidden="true"
      style={{
        top: "20%",
        [isLeft ? "left" : "right"]: "7%",
        width: 52,
        height: 120,
      }}
    >
      <div
        className="torch-glow"
        style={{
          top: "18%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animationDelay: glowDelay,
        }}
      />

      <svg
        viewBox="0 0 26 60"
        width="52"
        height="120"
        className="relative"
        style={{ shapeRendering: "crispEdges", transform: isLeft ? undefined : "scaleX(-1)" }}
      >
        {/* ── 철제 벽 브라켓 ── */}
        {/* 대각 지지대 (벽 → 컵) */}
        <g fill="#242430">
          <rect x="1" y="36" width="2" height="2" />
          <rect x="3" y="38" width="2" height="2" />
          <rect x="5" y="40" width="2" height="2" />
          <rect x="7" y="42" width="2" height="2" />
        </g>
        {/* 수평 암 (벽 부착) */}
        <rect x="0" y="33" width="11" height="3" fill="#1c1c22" />
        <rect x="0" y="33" width="11" height="1" fill="#3a3a44" />
        <rect x="0" y="35" width="11" height="1" fill="#000" opacity="0.4" />
        {/* 고정 볼트 */}
        <rect x="2" y="34" width="1" height="1" fill="#8a8a98" />
        <rect x="8" y="34" width="1" height="1" fill="#8a8a98" />

        {/* ── 나무 손잡이 ── */}
        <g>
          <rect x="10" y="27" width="6" height="25" fill="#2a1408" />
          <rect x="11" y="27" width="4" height="25" fill="#4a2814" />
          <rect x="12" y="27" width="2" height="25" fill="#6b3a1c" />
          <rect x="12" y="27" width="1" height="25" fill="#8a4e26" opacity="0.85" />
          <rect x="15" y="27" width="1" height="25" fill="#150a03" />
          {/* 나뭇결 가로 밴드 */}
          <rect x="10" y="31" width="6" height="1" fill="#0d0804" />
          <rect x="10" y="37" width="6" height="1" fill="#0d0804" />
          <rect x="10" y="43" width="6" height="1" fill="#0d0804" />
          <rect x="10" y="49" width="6" height="1" fill="#0d0804" />
        </g>

        {/* ── 철제 컵 (손잡이를 벽 암에 고정) ── */}
        <g>
          <rect x="9" y="31" width="8" height="2" fill="#2e2e38" />
          <rect x="9" y="31" width="8" height="1" fill="#565663" />
          <rect x="9" y="31" width="1" height="8" fill="#2e2e38" />
          <rect x="16" y="31" width="1" height="8" fill="#161620" />
          <rect x="9" y="38" width="8" height="2" fill="#161620" />
          <rect x="9" y="39" width="8" height="1" fill="#000" opacity="0.4" />
        </g>

        {/* ── 기름 헝겊 심지 ── */}
        <g>
          <rect x="9" y="22" width="8" height="5" fill="#190d04" />
          <rect x="10" y="23" width="6" height="2" fill="#2e1808" />
          <rect x="10" y="23" width="6" height="1" fill="#5a3018" />
          <rect x="10" y="25" width="6" height="1" fill="#000" opacity="0.45" />
        </g>

        {/* ── 불꽃 (3프레임 픽셀 플리커) ── */}
        <FlameFrame rows={FRAME_1} className="flame-f1" delay={flameDelay} />
        <FlameFrame rows={FRAME_2} className="flame-f2" delay={flameDelay} />
        <FlameFrame rows={FRAME_3} className="flame-f3" delay={flameDelay} />
      </svg>

      <span
        className="ember"
        style={{ left: "calc(50% - 6px)", top: 10, ["--ember-drift" as string]: "4px", animationDelay: "0s" }}
      />
      <span
        className="ember"
        style={{ left: "50%", top: 4, ["--ember-drift" as string]: "-3px", animationDelay: "0.7s" }}
      />
      <span
        className="ember"
        style={{ left: "calc(50% + 6px)", top: 12, ["--ember-drift" as string]: "5px", animationDelay: "1.3s" }}
      />
      <span
        className="ember"
        style={{ left: "calc(50% - 2px)", top: 8, ["--ember-drift" as string]: "-5px", animationDelay: "1.9s" }}
      />
    </div>
  );
}
