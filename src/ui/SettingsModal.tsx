import { type ChangeEvent } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Modal } from "./Modal";

const LS_KEY = "dacon_game.settings.v1";

type Settings = {
  master: number;
  sfx: number;
  music: number;
};

const DEFAULTS: Settings = { master: 80, sfx: 100, music: 70 };

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function sanitize(parsed: Partial<Settings>): Settings {
  return {
    master: clamp(parsed.master ?? DEFAULTS.master),
    sfx: clamp(parsed.sfx ?? DEFAULTS.sfx),
    music: clamp(parsed.music ?? DEFAULTS.music),
  };
}

type Props = { open: boolean; onClose: () => void };

export function SettingsModal({ open, onClose }: Props) {
  // useLocalStorage 가 읽기/쓰기/탭 간 동기화를 모두 처리한다(저장용 useEffect 불필요).
  const [settings, setSettings] = useLocalStorage<Settings>(LS_KEY, DEFAULTS, {
    deserializer: (raw) => {
      try {
        return sanitize(JSON.parse(raw) as Partial<Settings>);
      } catch {
        return DEFAULTS;
      }
    },
  });

  const update = (key: keyof Settings) => (e: ChangeEvent<HTMLInputElement>) => {
    setSettings((s) => ({ ...s, [key]: clamp(Number(e.target.value)) }));
  };

  const resetDefaults = () => setSettings(DEFAULTS);

  return (
    <Modal open={open} title="설정" onClose={onClose}>
      <div className="space-y-5">
        <Slider label="마스터 음량" value={settings.master} onChange={update("master")} />
        <Slider label="효과음 (SFX)" value={settings.sfx} onChange={update("sfx")} />
        <Slider label="배경 음악" value={settings.music} onChange={update("music")} />
        <div className="flex items-center justify-between pt-3 border-t border-bone-white/10">
          <span className="text-xs text-ash-grey">설정은 자동 저장됩니다.</span>
          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs text-bone-white/70 hover:text-torch-flame transition-colors px-2 py-1 border border-bone-white/20 hover:border-torch-flame"
          >
            기본값
          </button>
        </div>
      </div>
    </Modal>
  );
}

type SliderProps = {
  label: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Slider({ label, value, onChange }: SliderProps) {
  return (
    <label className="block">
      <div className="flex justify-between mb-2">
        <span className="text-sm">{label}</span>
        <span className="text-sm text-torch-core tabular-nums font-pixel-en">{String(value).padStart(3, "0")}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={onChange}
        aria-label={label}
        className="w-full"
      />
    </label>
  );
}
