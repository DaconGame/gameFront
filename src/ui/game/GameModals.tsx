import type { ReactNode } from "react";
import {
  GAME_RESTART_REQUEST_EVENT,
  GAME_RESUME_REQUEST_EVENT,
} from "./hudEvents.ts";
import type { HudResult } from "./hudTypes.ts";

const GAME_EXIT_EVENT = "game:exit";

function dispatch(type: string): void {
  window.dispatchEvent(new CustomEvent(type));
}

function formatElapsed(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function OverlayButton({
  children,
  danger = false,
  onClick,
}: {
  children: ReactNode;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`h-[52px] w-[280px] rounded-[6px] border-2 bg-dungeon-stone text-xl text-bone-white shadow-[inset_1px_1px_0_rgba(236,226,200,0.12),0_0_0_2px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:bg-dungeon-mid ${
        danger ? "hover:border-blood-red" : "hover:border-torch-core"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function PauseOverlay() {
  return (
    <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center bg-dungeon-deepest/75">
      <section className="flex w-[360px] flex-col items-center rounded-[6px] border-2 border-bone-white/70 bg-dungeon-deepest/95 px-8 py-9 shadow-[inset_1px_1px_0_rgba(236,226,200,0.12),0_0_0_2px_rgba(0,0,0,0.65),0_0_42px_rgba(255,122,58,0.18),0_18px_52px_rgba(0,0,0,0.78)]">
        <h2 className="text-3xl text-bone-white drop-shadow-[0_0_10px_rgba(255,213,138,0.35)]">일시정지</h2>
        <p className="mt-3 text-sm text-ash-grey">ESC 로 돌아가기</p>
        <div className="mt-8 flex flex-col gap-4">
          <OverlayButton onClick={() => dispatch(GAME_RESUME_REQUEST_EVENT)}>돌아가기</OverlayButton>
          <OverlayButton danger onClick={() => dispatch(GAME_EXIT_EVENT)}>나가기</OverlayButton>
        </div>
      </section>
    </div>
  );
}

export function ResultOverlay({ result }: { result: HudResult }) {
  const title = result.victory ? "생존 성공!" : "패배";

  return (
    <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center bg-dungeon-deepest/85">
      <section className="flex w-[420px] flex-col items-center rounded-[6px] border-2 border-torch-core/75 bg-dungeon-deepest/95 px-8 py-9 shadow-[inset_1px_1px_0_rgba(236,226,200,0.12),0_0_0_2px_rgba(0,0,0,0.65),0_0_44px_rgba(255,122,58,0.2),0_18px_52px_rgba(0,0,0,0.78)]">
        <h2 className={result.victory ? "text-4xl text-torch-core" : "text-4xl text-blood-red"}>
          {title}
        </h2>
        <dl className="mt-8 grid w-full grid-cols-[1fr_auto] gap-x-5 gap-y-2 rounded-[6px] border border-bone-white/10 bg-black/25 px-4 py-4 text-lg text-ash-grey">
          <dt>생존 시간</dt>
          <dd className="font-pixel-en text-bone-white">{formatElapsed(result.elapsedSec)}</dd>
          <dt>처치 수</dt>
          <dd className="font-pixel-en text-bone-white">{result.kills}</dd>
          <dt>처치 점수</dt>
          <dd className="font-pixel-en text-bone-white">{result.score}</dd>
          <dt>최종 점수</dt>
          <dd className="font-pixel-en text-torch-core">{result.finalScore}</dd>
          <dt>도달 웨이브</dt>
          <dd className="font-pixel-en text-bone-white">{result.wave} / 20</dd>
        </dl>
        <div className="mt-8 flex flex-col gap-3">
          <OverlayButton onClick={() => dispatch(GAME_RESTART_REQUEST_EVENT)}>다시 시작</OverlayButton>
          <OverlayButton danger onClick={() => dispatch(GAME_EXIT_EVENT)}>나가기</OverlayButton>
        </div>
      </section>
    </div>
  );
}
