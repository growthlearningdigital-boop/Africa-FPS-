/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnemyStats, EnemyType, Vector2D } from '../types.ts';
import { Projectile } from './Projectile.ts';
import { sound } from '../engine/Sound.ts';

export class Enemy implements EnemyStats {
  public id: string;
  public type: EnemyType;
  public name: string;
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public hp: number;
  public maxHp: number;
  public speed: number;
  public range: number;
  public damage: number;
  public fireRate: number;
  public lastFired: number = 0;
  public angle: number = 0;
  public state: 'IDLE' | 'PATROL' | 'ALERT' | 'ATTACK' | 'TAKE_COVER' = 'PATROL';
  public patrolPoint: Vector2D;
  public alertTimer: number = 0;
  public isBoss: boolean = false;
  public radius: number = 14;

  private walkCycle: number = 0;
  private patrolTimer: number = 0;

  constructor(x: number, y: number, type: EnemyType = 'RAIDER', isBoss: boolean = false) {
    this.id = Math.random().toString(36).substring(2, 9);
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.patrolPoint = { x, y };
    this.type = type;
    this.isBoss = isBoss;

    switch (type) {
      case 'SKIRMISHER':
        this.name = 'Tireur RPG';
        this.maxHp = 100;
        this.speed = 110;
        this.range = 420;
        this.damage = 65;
        this.fireRate = 0.5; // rocket every 2s
        this.radius = 13;
        break;
      case 'HEAVY_ENFORCER':
        this.name = 'Garde Blindé';
        this.maxHp = 260;
        this.speed = 85;
        this.range = 320;
        this.damage = 16;
        this.fireRate = 5.0;
        this.radius = 17;
        break;
      case 'TECHNICAL':
        this.name = 'Pick-up Armé';
        this.maxHp = 420;
        this.speed = 140;
        this.range = 360;
        this.damage = 20;
        this.fireRate = 6.0;
        this.radius = 24;
        break;
      case 'WARLORD':
        this.name = 'Seigneur de Guerre';
        this.maxHp = 650;
        this.speed = 95;
        this.range = 380;
        this.damage = 32;
        this.fireRate = 3.5;
        this.radius = 20;
        this.isBoss = true;
        break;
      case 'RAIDER':
      default:
        this.name = 'Milicien Rebelle';
        this.maxHp = 110;
        this.speed = 125;
        this.range = 280;
        this.damage = 15;
        this.fireRate = 3.0;
        this.radius = 13;
        break;
    }

    this.hp = this.maxHp;
  }

  public update(dt: number, now: number, soldiers: { x: number; y: number; hp: number; id: string }[]): Projectile | null {
    // Check for nearest living soldier
    let closestSoldier: { x: number; y: number; hp: number; id: string } | null = null;
    let closestDist = Infinity;

    for (const s of soldiers) {
      if (s.hp <= 0) continue;
      const d = Math.hypot(s.x - this.x, s.y - this.y);
      if (d < closestDist) {
        closestDist = d;
        closestSoldier = s;
      }
    }

    // AI state machine
    if (closestSoldier && closestDist <= this.range + 80) {
      this.state = 'ATTACK';
      this.angle = Math.atan2(closestSoldier.y - this.y, closestSoldier.x - this.x);

      // Keep optimal shooting distance
      const minDistance = this.type === 'SKIRMISHER' ? 220 : 120;
      if (closestDist > this.range * 0.75) {
        // Move closer
        this.targetX = closestSoldier.x;
        this.targetY = closestSoldier.y;
      } else if (closestDist < minDistance) {
        // Back away slightly
        const awayAngle = this.angle + Math.PI;
        this.targetX = this.x + Math.cos(awayAngle) * 50;
        this.targetY = this.y + Math.sin(awayAngle) * 50;
      } else {
        // In sweet spot
        this.targetX = this.x;
        this.targetY = this.y;
      }

      // Try firing
      if (closestDist <= this.range) {
        const interval = 1000 / this.fireRate;
        if (now - this.lastFired >= interval) {
          this.lastFired = now;
          return this.spawnProjectile(closestSoldier.x, closestSoldier.y);
        }
      }
    } else {
      // Idle / Patrol behavior
      this.patrolTimer += dt;
      if (this.patrolTimer > 4.5) {
        this.patrolTimer = 0;
        // Wander around patrol origin
        const wanderRadius = 160;
        const angle = Math.random() * Math.PI * 2;
        this.targetX = this.patrolPoint.x + Math.cos(angle) * (Math.random() * wanderRadius);
        this.targetY = this.patrolPoint.y + Math.sin(angle) * (Math.random() * wanderRadius);
      }
    }

    // Step movement
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 8) {
      const step = Math.min(dist, this.speed * dt);
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
      if (this.state !== 'ATTACK') {
        this.angle = Math.atan2(dy, dx);
      }
      this.walkCycle += dt * 8;
    }

    return null;
  }

  private spawnProjectile(targetX: number, targetY: number): Projectile {
    const barrelOffset = this.radius + 4;
    const spawnX = this.x + Math.cos(this.angle) * barrelOffset;
    const spawnY = this.y + Math.sin(this.angle) * barrelOffset;

    if (this.type === 'SKIRMISHER') {
      sound.playRocketLaunch();
      return new Projectile(spawnX, spawnY, targetX, targetY, this.damage, 'ROCKET', 'ENEMY', this.id);
    }

    sound.playGunshot(this.type === 'HEAVY_ENFORCER' ? 'HEAVY' : 'RIFLE');
    return new Projectile(
      spawnX,
      spawnY,
      targetX + (Math.random() * 20 - 10),
      targetY + (Math.random() * 20 - 10),
      this.damage,
      this.type === 'HEAVY_ENFORCER' ? 'HEAVY_ROUND' : 'BULLET',
      'ENEMY',
      this.id
    );
  }

  public takeDamage(amount: number): boolean {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp <= 0;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Vehicle styling for Technical pickup
    if (this.type === 'TECHNICAL') {
      ctx.rotate(this.angle);

      // Chassis shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(-22, -14, 46, 28);

      // Wheels
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-18, -16, 10, 5);
      ctx.fillRect(10, -16, 10, 5);
      ctx.fillRect(-18, 11, 10, 5);
      ctx.fillRect(10, 11, 10, 5);

      // Pickup Body
      ctx.fillStyle = '#78350f'; // Desert brown truck
      ctx.fillRect(-20, -12, 42, 24);

      // Cab windshield
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(4, -9, 8, 18);

      // Mounted Turret
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(-4, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      // Gun barrel
      ctx.fillRect(-2, -3, 24, 6);

      ctx.restore();
      this.drawHealthBar(ctx);
      return;
    }

    // Foot soldiers (Raider, Skirmisher, Heavy, Warlord)
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 4, this.radius, this.radius * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(this.angle);

    // Legs
    const legOffset = Math.sin(this.walkCycle) * 3;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-5, -7 + legOffset, 5, 3);
    ctx.fillRect(-5, 4 - legOffset, 5, 3);

    // Torso / clothes
    if (this.type === 'WARLORD') {
      ctx.fillStyle = '#7f1d1d'; // Crimson warlord coat
    } else if (this.type === 'HEAVY_ENFORCER') {
      ctx.fillStyle = '#374151'; // Dark armored vest
    } else if (this.type === 'SKIRMISHER') {
      ctx.fillStyle = '#92400e'; // Desert rebel tunic
    } else {
      ctx.fillStyle = '#57534e'; // Khaki militia
    }

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Red insignia band or scarf
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-this.radius + 2, -3, this.radius * 2 - 4, 3);

    // Head
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(-1, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Weapon
    ctx.fillStyle = '#0f172a';
    if (this.type === 'SKIRMISHER') {
      // RPG tube
      ctx.fillRect(-4, 4, 22, 6);
      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.moveTo(18, 4);
      ctx.lineTo(24, 7);
      ctx.lineTo(18, 10);
      ctx.fill();
    } else {
      ctx.fillRect(4, -2, 14, 4);
    }

    ctx.restore();
    this.drawHealthBar(ctx);
  }

  private drawHealthBar(ctx: CanvasRenderingContext2D) {
    const barWidth = this.radius * 2.2;
    const barHeight = 4;
    const barY = this.y - this.radius - 12;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(this.x - barWidth / 2 - 1, barY - 1, barWidth + 2, barHeight + 2);

    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = this.isBoss ? '#f43f5e' : '#ef4444';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);

    if (this.isBoss) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BOSS', this.x, barY - 4);
    }
  }
}
