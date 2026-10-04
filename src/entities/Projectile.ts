/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Projectile as IProjectile, ProjectileType, Particle } from '../types.ts';

export class Projectile implements IProjectile {
  public id: string;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public startX: number;
  public startY: number;
  public targetX: number;
  public targetY: number;
  public damage: number;
  public speed: number;
  public type: ProjectileType;
  public owner: 'PLAYER' | 'ENEMY';
  public ownerId?: string;
  public distanceTraveled: number = 0;
  public maxDistance: number;
  public splashRadius?: number;
  public arcProgress?: number;
  public arcHeight?: number;

  constructor(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    damage: number,
    type: ProjectileType = 'BULLET',
    owner: 'PLAYER' | 'ENEMY' = 'PLAYER',
    ownerId?: string
  ) {
    this.id = Math.random().toString(36).substring(2, 9);
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.damage = damage;
    this.type = type;
    this.owner = owner;
    this.ownerId = ownerId;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;

    switch (type) {
      case 'SNIPER_ROUND':
        this.speed = 1300;
        this.maxDistance = 1100;
        break;
      case 'HEAVY_ROUND':
        this.speed = 850;
        this.maxDistance = 750;
        break;
      case 'ROCKET':
        this.speed = 480;
        this.maxDistance = dist;
        this.splashRadius = 85;
        break;
      case 'MORTAR':
        this.speed = 320;
        this.maxDistance = dist;
        this.splashRadius = 120;
        this.arcProgress = 0;
        this.arcHeight = 120;
        break;
      case 'BULLET':
      default:
        this.speed = 780;
        this.maxDistance = 650;
        break;
    }

    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  public update(dt: number, particles: Particle[]): boolean {
    // Return true if projectile is still active, false if expired
    const moveDist = this.speed * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.distanceTraveled += moveDist;

    // Mortar arc
    if (this.type === 'MORTAR' && this.arcProgress !== undefined) {
      this.arcProgress = Math.min(1, this.distanceTraveled / this.maxDistance);
      if (this.arcProgress >= 1) {
        return false; // Impact
      }
    }

    // Rocket smoke trail
    if (this.type === 'ROCKET' && Math.random() < 0.6) {
      particles.push({
        x: this.x - (this.vx / this.speed) * 8 + (Math.random() * 4 - 2),
        y: this.y - (this.vy / this.speed) * 8 + (Math.random() * 4 - 2),
        vx: -(this.vx / this.speed) * 20 + (Math.random() * 10 - 5),
        vy: -(this.vy / this.speed) * 20 + (Math.random() * 10 - 5),
        life: 0.35,
        maxLife: 0.35,
        color: Math.random() < 0.5 ? '#f59e0b' : '#78716c',
        size: 3 + Math.random() * 3,
        type: 'SMOKE',
      });
    }

    return this.distanceTraveled < this.maxDistance;
  }

  public isOutOfBounds(mapWidth: number, mapHeight: number): boolean {
    return this.x < -100 || this.x > mapWidth + 100 || this.y < -100 || this.y > mapHeight + 100;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (this.type === 'MORTAR' && this.arcProgress !== undefined && this.arcHeight) {
      // Draw shadow on ground
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw shell in air (parabolic height)
      const currentHeight = Math.sin(this.arcProgress * Math.PI) * this.arcHeight;
      const shellY = this.y - currentHeight;

      ctx.fillStyle = '#1c1917';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.x, shellY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      return;
    }

    const angle = Math.atan2(this.vy, this.vx);
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);

    if (this.type === 'ROCKET') {
      // Rocket body
      ctx.fillStyle = '#44403c';
      ctx.fillRect(-10, -3, 14, 6);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(4, -3);
      ctx.lineTo(10, 0);
      ctx.lineTo(4, 3);
      ctx.fill();
      // Engine flame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-10, -2);
      ctx.lineTo(-15, 0);
      ctx.lineTo(-10, 2);
      ctx.fill();
    } else if (this.type === 'SNIPER_ROUND') {
      // High speed cyan/gold tracer
      ctx.strokeStyle = this.owner === 'PLAYER' ? '#38bdf8' : '#f87171';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(6, 0);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, 0, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'HEAVY_ROUND') {
      // Chunky amber tracer
      ctx.strokeStyle = this.owner === 'PLAYER' ? '#fbbf24' : '#f87171';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(4, 0);
      ctx.stroke();
    } else {
      // Standard bullet
      ctx.strokeStyle = this.owner === 'PLAYER' ? '#fde047' : '#fb7185';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(2, 0);
      ctx.stroke();
    }

    ctx.restore();
  }
}
