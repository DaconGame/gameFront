import Phaser from "phaser";

export type ProjectileConfig = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  /** 0 이면 단일 타격, >0 이면 착탄 시 광역 피해 반경(px) */
  aoe: number;
  texture: string;
  scale: number;
  tint: number;
  maxRange: number;
  rotateToDir: boolean;
};

const PROJECTILE_DEPTH = 22;

/** 풀링되는 투사체(화살/마법구). 사거리를 넘으면 스스로 비활성화된다. */
export class Projectile extends Phaser.Physics.Arcade.Sprite {
  damage = 0;
  aoe = 0;
  private startX = 0;
  private startY = 0;
  private maxRange = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }

  fire(cfg: ProjectileConfig): void {
    this.damage = cfg.damage;
    this.aoe = cfg.aoe;
    this.startX = cfg.x;
    this.startY = cfg.y;
    this.maxRange = cfg.maxRange;

    this.setTexture(cfg.texture);
    this.setPosition(cfg.x, cfg.y);
    this.setScale(cfg.scale);
    this.setTint(cfg.tint);
    this.setDepth(PROJECTILE_DEPTH);
    this.setRotation(cfg.rotateToDir ? cfg.angle : 0);
    this.setActive(true);
    this.setVisible(true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    body.setVelocity(Math.cos(cfg.angle) * cfg.speed, Math.sin(cfg.angle) * cfg.speed);
  }

  deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    body.setVelocity(0, 0);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (!this.active) return;
    if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) > this.maxRange) {
      this.deactivate();
    }
  }
}
