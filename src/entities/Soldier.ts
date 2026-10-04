/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoldierStats, UnitRole, UnitStance, Vector2D } from '../types.ts';
import { Projectile } from './Projectile.ts';
import { sound } from '../engine/Sound.ts';

export class Soldier implements SoldierStats {
  public id: string;
  public name: string;
  public role: UnitRole;
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
  public ammo: number;
  public maxAmmo: number;
  public reloadTime: number;
  public isReloading: boolean = false;
  public reloadStart: number = 0;
  public stance: UnitStance = 'AGGRESSIVE';
  public angle: number = 0;
  public level: number = 1;
  public color: string;
  public accentColor: string;
  public specialCooldown: number;
  public lastSpecial: number = 0;

  public isSelected: boolean = false;
  private walkCycle: number = 0;
  private isMoving: boolean = false;
  public radius: number = 14;

  constructor(x: number, y: number, role: UnitRole = 'HERO', id?: string) {
    this.id = id || Math.random().toString(36).substring(2, 9);
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.role = role;

    switch (role) {
      case 'HERO':
        this.name = 'Alpha Commandant';
        this.maxHp = 220;
        this.speed = 135;
        this.range = 380;
        this.damage = 28;
        this.fireRate = 4.2; // shots/sec
        this.maxAmmo = 30;
        this.reloadTime = 1400;
        this.color = '#15803d'; // African military green
        this.accentColor = '#f59e0b'; // Gold Kente sash
        this.specialCooldown = 12000;
        break;
      case 'COMMANDO':
        this.name = 'Voltigeur';
        this.maxHp = 160;
        this.speed = 160;
        this.range = 280;
        this.damage = 22;
        this.fireRate = 5.5;
        this.maxAmmo = 25;
        this.reloadTime = 1100;
        this.color = '#047857';
        this.accentColor = '#ef4444';
        this.specialCooldown = 8000;
        break;
      case 'SNIPER':
        this.name = 'Tireur d\'Élite';
        this.maxHp = 110;
        this.speed = 120;
        this.range = 650;
        this.damage = 95;
        this.fireRate = 1.0;
        this.maxAmmo = 6;
        this.reloadTime = 2000;
        this.color = '#0f766e';
        this.accentColor = '#38bdf8';
        this.specialCooldown = 10000;
        break;
      case 'HEAVY':
        this.name = 'Soutien Lourd';
        this.maxHp = 280;
        this.speed = 105;
        this.range = 340;
        this.damage = 18;
        this.fireRate = 7.0;
        this.maxAmmo = 60;
        this.reloadTime = 2600;
        this.color = '#b45309';
        this.accentColor = '#fbbf24';
        this.specialCooldown = 15000;
        break;
      case 'MEDIC':
        this.name = 'Médecin de Terrain';
        this.maxHp = 140;
        this.speed = 145;
        this.range = 240;
        this.damage = 15;
        this.fireRate = 2.5;
        this.maxAmmo = 15;
        this.reloadTime = 1200;
        this.color = '#0284c7';
        this.accentColor = '#ffffff';
        this.specialCooldown = 6000;
        break;
    }

    this.hp = this.maxHp;
    this.ammo = this.maxAmmo;
  }

  public setDestination(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  public update(dt: number, now: number) {
    // Movement logic
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      this.isMoving = true;
      const step = Math.min(dist, this.speed * dt);
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
      this.angle = Math.atan2(dy, dx);
      this.walkCycle += dt * 10;
    } else {
      this.isMoving = false;
    }

    // Reload check
    if (this.isReloading && now - this.reloadStart >= this.reloadTime) {
      this.ammo = this.maxAmmo;
      this.isReloading = false;
    }
  }

  public aimAt(targetX: number, targetY: number) {
    this.angle = Math.atan2(targetY - this.y, targetX - this.x);
  }

  public canFire(now: number): boolean {
    if (this.isReloading) return false;
    if (this.ammo <= 0) {
      this.startReload(now);
      return false;
    }
    const interval = 1000 / this.fireRate;
    return now - this.lastFired >= interval;
  }

  public fire(targetX: number, targetY: number, now: number): Projectile | null {
    if (!this.canFire(now)) return null;

    this.aimAt(targetX, targetY);
    this.lastFired = now;
    this.ammo--;

    // Sound effect
    if (this.role === 'SNIPER') {
      sound.playGunshot('SNIPER');
    } else if (this.role === 'HEAVY') {
      sound.playGunshot('HEAVY');
    } else if (this.role === 'COMMANDO') {
      sound.playGunshot('SHOTGUN');
    } else {
      sound.playGunshot('RIFLE');
    }

    // Spawn projectile from barrel tip
    const barrelOffset = 18;
    const spawnX = this.x + Math.cos(this.angle) * barrelOffset;
    const spawnY = this.y + Math.sin(this.angle) * barrelOffset;

    // Small spread for realistic feel
    const spread = (Math.random() - 0.5) * (this.role === 'SNIPER' ? 0.02 : 0.08);
    const targetDist = Math.hypot(targetX - spawnX, targetY - spawnY);
    const fireAngle = this.angle + spread;
    const endX = spawnX + Math.cos(fireAngle) * targetDist;
    const endY = spawnY + Math.sin(fireAngle) * targetDist;

    let projType: 'BULLET' | 'SNIPER_ROUND' | 'HEAVY_ROUND' = 'BULLET';
    if (this.role === 'SNIPER') projType = 'SNIPER_ROUND';
    if (this.role === 'HEAVY') projType = 'HEAVY_ROUND';

    if (this.ammo === 0) {
      this.startReload(now);
    }

    return new Projectile(spawnX, spawnY, endX, endY, this.damage, projType, 'PLAYER', this.id);
  }

  public startReload(now: number) {
    if (this.isReloading || this.ammo === this.maxAmmo) return;
    this.isReloading = true;
    this.reloadStart = now;
    sound.playReload();
  }

  public canUseSpecial(now: number): boolean {
    return now - this.lastSpecial >= this.specialCooldown;
  }

  public useSpecial(now: number): boolean {
    if (!this.canUseSpecial(now)) return false;
    this.lastSpecial = now;
    return true;
  }

  public takeDamage(amount: number): boolean {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp <= 0;
  }

  public heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Selected circle indicator
    if (this.isSelected) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Role-specific aura (e.g. Medic healing perimeter aura)
    if (this.role === 'MEDIC') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 4, this.radius, this.radius * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rotate body to face angle
    ctx.rotate(this.angle);

    // Legs animation
    const legOffset = this.isMoving ? Math.sin(this.walkCycle) * 4 : 0;
    ctx.fillStyle = '#292524'; // Boots
    ctx.fillRect(-6, -8 + legOffset, 6, 4);
    ctx.fillRect(-6, 4 - legOffset, 6, 4);

    // Main tactical body / torso
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Vest / African print accent sash
    ctx.fillStyle = this.accentColor;
    ctx.beginPath();
    ctx.moveTo(-this.radius * 0.7, -4);
    ctx.lineTo(this.radius * 0.7, 4);
    ctx.lineTo(this.radius * 0.5, 8);
    ctx.lineTo(-this.radius * 0.9, 0);
    ctx.fill();

    // Beret or tactical helmet
    ctx.fillStyle = this.role === 'HERO' ? '#b91c1c' : '#1c1917'; // Alpha Hero red beret
    ctx.beginPath();
    ctx.arc(-2, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    // Weapon barrel
    ctx.fillStyle = '#0f172a';
    if (this.role === 'SNIPER') {
      ctx.fillRect(8, -2, 16, 4); // Long sniper barrel
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(14, -3, 3, 1); // Scope reflection
    } else if (this.role === 'HEAVY') {
      ctx.fillRect(6, -4, 14, 8); // Heavy machine gun
    } else {
      ctx.fillRect(6, -2, 12, 4); // Assault rifle
    }

    // Reload indicator
    if (this.isReloading) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('...', 0, -this.radius - 8);
    }

    ctx.restore();

    // Health bar above head (unrotated)
    const barWidth = 26;
    const barHeight = 4;
    const barY = this.y - this.radius - 12;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(this.x - barWidth / 2 - 1, barY - 1, barWidth + 2, barHeight + 2);

    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);
  }
}
