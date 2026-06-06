import type { ReactNode } from "react";
import type { GameHudSnapshot } from "./hudTypes.ts";

type Props = {
  snapshot: GameHudSnapshot;
};

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`border-2 border-bone-white/70 bg-dungeon-deepest/90 shadow-[0_0_0_2px_rgba(0,0,0,0.55),0_8px_24px_rgba(0,0,0,0.45)] ${className}`}
    >
      {children}
    </section>
  );
}

export function TopHud({ snapshot }: Props) {
  const hpColor =
    snapshot.hp.ratio < 0.3 ? "bg-blood-red" : snapshot.hp.ratio < 0.6 ? "bg-torch-core" : "bg-class-bow";

  return (
    <>
      <Panel className="absolute left-4 top-4 h-14 w-[264px] px-3 py-2">
        <div className="flex items-center justify-between text-[13px]">
          <span>체력</span>
          <span className="font-pixel-en text-[10px] text-ash-grey">
            {Math.ceil(snapshot.hp.current)} / {snapshot.hp.max}
          </span>
        </div>
        <div className="mt-2 h-3.5 bg-dungeon-mid">
          <div className={`h-full ${hpColor}`} style={{ width: `${snapshot.hp.ratio * 100}%` }} />
        </div>
      </Panel>

      <Panel className="absolute left-4 top-[88px] flex h-10 w-[264px] items-center justify-between px-3 text-[13px]">
        <span>처치 {snapshot.stats.kills}</span>
        <span>점수 {snapshot.stats.score}</span>
      </Panel>

      <Panel className="absolute left-1/2 top-4 flex h-14 w-[156px] -translate-x-1/2 items-center justify-center">
        <span className="font-pixel-en text-sm text-torch-core">{snapshot.time.label}</span>
      </Panel>

      <Panel className="absolute right-4 top-4 h-14 w-[156px] px-3 py-2">
        <div className="flex items-start justify-between">
          <span className="text-[13px]">웨이브</span>
          <span className="font-pixel-en text-[10px] text-rune-cyan">{snapshot.wave.label}</span>
        </div>
        <div className="mt-2 h-1.5 bg-dungeon-mid">
          <div className="h-full bg-rune-cyan" style={{ width: `${snapshot.wave.progress * 100}%` }} />
        </div>
      </Panel>
    </>
  );
}

export function BossHud({ boss }: { boss: GameHudSnapshot["boss"] }) {
  if (!boss) return null;

  return (
    <section className="absolute left-1/2 top-25 w-[560px] -translate-x-1/2 border-2 border-blood-red/80 bg-dungeon-deepest/90 px-3 py-2 text-center shadow-[0_0_24px_rgba(196,30,30,0.35)]">
      <div className="mb-1 text-sm text-[#ff7a6b]">{boss.name}</div>
      <div className="h-4 bg-dungeon-mid">
        <div className="h-full bg-blood-red" style={{ width: `${boss.ratio * 100}%` }} />
      </div>
    </section>
  );
}
