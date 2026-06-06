import type { GameHudSnapshot, HudPartyUnit } from "./hudTypes.ts";

type Props = {
  party: GameHudSnapshot["party"];
};

function Tooltip({ unit }: { unit: HudPartyUnit }) {
  return (
    <div
      className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-20 min-w-44 -translate-x-1/2 translate-y-1 border-2 bg-dungeon-deepest/95 px-3 py-2 text-left opacity-0 shadow-[0_0_0_2px_rgba(0,0,0,0.6),0_6px_24px_rgba(0,0,0,0.7)] transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
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
      className="group relative flex h-[86px] w-[64px] flex-col items-center justify-end outline-none"
      tabIndex={0}
      aria-label={`${unit.label} ${unit.badge}`}
    >
      <Tooltip unit={unit} />
      <div
        className="relative flex h-[60px] w-[60px] items-center justify-center border-2 bg-dungeon-deepest/90 shadow-[0_0_0_2px_rgba(0,0,0,0.55)]"
        style={{ borderColor: unit.color }}
      >
        <img
          src={unit.spriteUrl}
          alt=""
          className="h-[78px] w-[78px] object-contain"
          style={{ filter: `drop-shadow(0 0 7px ${unit.color})` }}
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
      <span className="mt-1 text-[11px] leading-none text-bone-white/80">{unit.label}</span>
    </div>
  );
}

export function MercBar({ party }: Props) {
  if (party.length === 0) return null;

  return (
    <nav
      className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 items-end gap-2"
      aria-label="용병 HUD"
    >
      {party.map((unit) => (
        <MercSlot key={unit.uid} unit={unit} />
      ))}
    </nav>
  );
}
