import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { DungeonScene } from "./scenes/DungeonScene";
import { GAME_WIDTH, GAME_HEIGHT, HEX } from "./config";

type Props = { classId?: string | null };

export function PhaserGame({ classId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (gameRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: HEX.bg,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      pixelArt: true,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [PreloadScene, DungeonScene],
    });
    game.registry.set("classId", classId ?? null);
    gameRef.current = game;

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [classId]);

  return (
    <div className="fixed inset-0 bg-dungeon-deepest flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
