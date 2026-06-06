import type { GameHudSnapshot, HudSynergyRow } from "./hudTypes.ts";

type Props = {
  rows: GameHudSnapshot["synergies"];
};

function SynergyTooltip({ row }: { row: HudSynergyRow }) {
  return (
    <div className="pointer-events-none absolute left-[calc(100%+10px)] top-0 z-20 hidden w-60 border-2 border-rune-violet bg-dungeon-deepest/95 px-3 py-2 text-left shadow-[0_0_0_2px_rgba(0,0,0,0.6),0_6px_24px_rgba(0,0,0,0.7)] group-hover:block group-focus-within:block">
      {row.tooltip.map((line, index) => (
        <div
          key={`${row.key}-${line}`}
          className={index === 0 ? "mb-1 text-sm text-torch-core" : "text-[12px] leading-relaxed text-bone-white/80"}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

function SynergyRow({ row }: { row: HudSynergyRow }) {
  return (
    <button
      type="button"
      className="group relative grid h-[52px] w-full grid-cols-[auto_1fr_auto] items-center gap-2 px-3 text-left outline-none hover:bg-bone-white/5 focus-visible:bg-bone-white/10"
      aria-label={`${row.name} ${row.progressLabel}`}
    >
      <div className="flex gap-1">
        {row.classes.map((entry) => (
          <span
            key={`${row.key}-${entry.id}`}
            className="h-2.5 w-2.5"
            style={{ backgroundColor: entry.color, opacity: entry.present ? 1 : 0.25 }}
            title={entry.label}
          />
        ))}
      </div>
      <span className={row.active ? "text-sm text-torch-core" : "text-sm text-ash-grey"}>
        {row.name}
      </span>
      <span className={row.active ? "font-pixel-en text-[10px] text-torch-core" : "font-pixel-en text-[10px] text-ash-grey"}>
        {row.progressLabel}
      </span>
      <SynergyTooltip row={row} />
    </button>
  );
}

export function SynergyPanel({ rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <aside className="pointer-events-auto absolute left-4 top-[154px] w-[230px] border-2 border-rune-violet/45 bg-dungeon-deepest/85 py-1 shadow-[0_0_0_2px_rgba(0,0,0,0.45)]">
      <div className="px-3 py-1 text-[13px] text-bone-white">시너지</div>
      {rows.map((row) => (
        <SynergyRow key={row.key} row={row} />
      ))}
    </aside>
  );
}
