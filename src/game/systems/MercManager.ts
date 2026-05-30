import Phaser from "phaser";
import { Mercenary } from "../entities/Mercenary";
import { Enemy } from "../entities/Enemy";
import { GAME_EVENT, type GameState } from "../state/GameState";
import type { ProjectileManager } from "./ProjectileManager";

const FORMATION_RADIUS = 78;
const FORMATION_SPIN = 0.0004;

/** 파티(GameState.party)에 맞춰 용병을 생성하고, 대형 추종 + 자동 전투를 매 프레임 조율한다. */
export class MercManager {
  private readonly scene: Phaser.Scene;
  private readonly state: GameState;
  private readonly getPlayer: () => Phaser.Physics.Arcade.Sprite | undefined;
  private readonly getEnemies: () => Phaser.Physics.Arcade.Group;
  private readonly projectiles: ProjectileManager;
  private readonly mercs: Mercenary[] = [];

  constructor(
    scene: Phaser.Scene,
    state: GameState,
    getPlayer: () => Phaser.Physics.Arcade.Sprite | undefined,
    getEnemies: () => Phaser.Physics.Arcade.Group,
    projectiles: ProjectileManager,
  ) {
    this.scene = scene;
    this.state = state;
    this.getPlayer = getPlayer;
    this.getEnemies = getEnemies;
    this.projectiles = projectiles;

    this.syncParty(state.party);
    state.on(GAME_EVENT.party, this.syncParty, this);
  }

  private syncParty(party: string[]): void {
    while (this.mercs.length < party.length) {
      const id = party[this.mercs.length];
      this.mercs.push(new Mercenary(this.scene, id));
    }
  }

  update(deltaMs: number): void {
    const player = this.getPlayer();
    if (!player) return;

    const total = this.mercs.length;
    const spin = this.scene.time.now * FORMATION_SPIN;

    this.mercs.forEach((merc, i) => {
      const angle = (i / Math.max(1, total)) * Math.PI * 2 + spin;
      const tx = player.x + Math.cos(angle) * FORMATION_RADIUS;
      const ty = player.y + Math.sin(angle) * FORMATION_RADIUS;
      merc.steer(tx, ty);
      merc.tickCooldown(deltaMs);
      this.runCombat(merc, player);
    });
  }

  private runCombat(merc: Mercenary, player: Phaser.Physics.Arcade.Sprite): void {
    if (merc.combat.role === "heal") {
      if (merc.ready) {
        merc.resetCooldown();
        merc.playAttackCue();
        this.state.healPlayer(merc.combat.heal ?? 0);
        this.healPulse(player.x, player.y);
      }
      return;
    }

    const target = this.nearestEnemy(merc.x, merc.y, merc.combat.range);
    if (!target) return;

    merc.faceTo(target.x);
    if (!merc.ready) return;
    merc.resetCooldown();
    merc.playAttackCue();

    switch (merc.combat.role) {
      case "melee": {
        if (target.takeDamage(merc.combat.atk)) this.state.addKill();
        this.meleeSlash(target.x, target.y);
        break;
      }
      case "ranged":
        this.projectiles.fireArrow(merc.x, merc.y - 24, target.x, target.y, merc.combat.atk);
        break;
      case "aoe":
        this.projectiles.fireMagic(
          merc.x,
          merc.y - 24,
          target.x,
          target.y,
          merc.combat.atk,
          merc.combat.aoeRadius ?? 60,
        );
        break;
    }
  }

  private nearestEnemy(x: number, y: number, range: number): Enemy | null {
    let best: Enemy | null = null;
    let bestDist = range * range;
    for (const obj of this.getEnemies().getChildren()) {
      const e = obj as Enemy;
      if (!e.targetable) continue;
      const d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y);
      if (d < bestDist) {
        bestDist = d;
        best = e;
      }
    }
    return best;
  }

  private meleeSlash(x: number, y: number): void {
    const slash = this.scene.add
      .circle(x, y, 26, 0xffffff, 0.6)
      .setDepth(23)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({
      targets: slash,
      scale: { from: 0.6, to: 1.2 },
      alpha: { from: 0.6, to: 0 },
      duration: 160,
      ease: "Quad.out",
      onComplete: () => slash.destroy(),
    });
  }

  private healPulse(x: number, y: number): void {
    const pulse = this.scene.add
      .circle(x, y, 40, 0x59c46b, 0.4)
      .setDepth(23)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({
      targets: pulse,
      scale: { from: 0.5, to: 1.4 },
      alpha: { from: 0.5, to: 0 },
      duration: 420,
      ease: "Quad.out",
      onComplete: () => pulse.destroy(),
    });
  }
}
