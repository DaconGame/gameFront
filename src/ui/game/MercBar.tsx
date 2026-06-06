import type { CSSProperties } from "react";
import type { GameHudSnapshot, HudPartyUnit } from "./hudTypes.ts";

type Props = {
  party: GameHudSnapshot["party"];
};

function Tooltip({ unit }: { unit: HudPartyUnit }) {
  return (
    <div
      className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-20 min-w-48 -translate-x-1/2 translate-y-1 rounded-[6px] border-2 bg-dungeon-deepest/95 px-3 py-2 text-left opacity-0 shadow-[inset_1px_1px_0_rgba(236,226,200,0.12),0_0_0_2px_rgba(0,0,0,0.65),0_8px_26px_rgba(0,0,0,0.72)] transition group-hover:translate-y-0 group-hover:opacity-100"
      role="tooltip"
      style={{ borderColor: unit.color }}
    >
      {unit.tooltip.map((line, index) => (
        <div
          key={`${unit.uid}-${line}`}
          className={index === 0 ? "mb-1 text-sm font-bold" : "text-[12px] leading-relaxed text-bone-white/80"}
          style={index === 0 ? { color: unit.color } : undefined}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

function MercSlot({ unit }: { unit: HudPartyUnit }) {
  return (
    <div
      className="group relative flex h-[86px] w-[64px] flex-col items-center justify-end"
      aria-label={`${unit.label} ${unit.badge}`}
    >
      <Tooltip unit={unit} />
      <div
        className="relative flex h-[62px] w-[62px] items-center justify-center rounded-[6px] border-2 bg-dungeon-deepest/92 shadow-[inset_1px_1px_0_rgba(236,226,200,0.12),0_0_0_2px_rgba(0,0,0,0.58),0_8px_18px_rgba(0,0,0,0.5)] transition group-hover:-translate-y-1"
        style={{ borderColor: unit.color }}
      >
        <span
          className="absolute inset-1 rounded-[4px] opacity-25"
          style={{ background: `radial-gradient(circle at 50% 70%, ${unit.color} 0%, transparent 58%)` }}
        />
        <div
          className="merc-sprite relative h-[80px] w-[80px]"
          style={
            {
              "--merc-sprite": `url("${unit.spriteUrl}")`,
              filter: `drop-shadow(0 0 7px ${unit.color})`,
              transform: "scale(3)",
              transformOrigin: "center",
            } as CSSProperties
          }
          aria-hidden="true"
        />
        {unit.rank > 1 && (
          <span
            className="absolute -right-2 -top-2 min-w-6 border px-1 text-center font-pixel-en text-[9px] leading-5 text-dungeon-deepest"
            style={{ borderColor: unit.color, backgroundColor: unit.color }}
          >
            {unit.badge}
          </span>
        )}
      </div>
      <span className="mt-1 text-[11px] leading-none text-bone-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        {unit.label}
      </span>
    </div>
  );
}

export function MercBar({ party }: Props) {
  if (party.length === 0) return null;

  return (
    <nav
      className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 items-end gap-2 rounded-[6px] border border-bone-white/10 bg-black/18 px-2 pt-1 shadow-[0_0_24px_rgba(0,0,0,0.35)]"
      aria-label="용병 HUD"
    >
      {party.map((unit) => (
        <MercSlot key={unit.uid} unit={unit} />
      ))}
    </nav>
  );
}
