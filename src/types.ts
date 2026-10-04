/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vector2D {
  x: number;
  y: number;
}

export type UnitRole = 'HERO' | 'COMMANDO' | 'SNIPER' | 'HEAVY' | 'MEDIC';
export type UnitStance = 'AGGRESSIVE' | 'DEFENSIVE' | 'HOLD';

export interface SoldierStats {
  id: string;
  name: string;
  role: UnitRole;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  hp: number;
  maxHp: number;
  speed: number;
  range: number;
  damage: number;
  fireRate: number; // bullets per second
  lastFired: number;
  ammo: number;
  maxAmmo: number;
  reloadTime: number; // ms
  isReloading: boolean;
  reloadStart: number;
  stance: UnitStance;
  angle: number;
  level: number;
  color: string;
  accentColor: string;
  specialCooldown: number;
  lastSpecial: number;
}

export type EnemyType = 'RAIDER' | 'SKIRMISHER' | 'HEAVY_ENFORCER' | 'TECHNICAL' | 'WARLORD';

export interface EnemyStats {
  id: string;
  type: EnemyType;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  hp: number;
  maxHp: number;
  speed: number;
  range: number;
  damage: number;
  fireRate: number;
  lastFired: number;
  angle: number;
  state: 'IDLE' | 'PATROL' | 'ALERT' | 'ATTACK' | 'TAKE_COVER';
  patrolPoint: Vector2D;
  alertTimer: number;
  isBoss?: boolean;
}

export type ProjectileType = 'BULLET' | 'SNIPER_ROUND' | 'HEAVY_ROUND' | 'ROCKET' | 'MORTAR';

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  damage: number;
  speed: number;
  type: ProjectileType;
  owner: 'PLAYER' | 'ENEMY';
  ownerId?: string;
  distanceTraveled: number;
  maxDistance: number;
  splashRadius?: number;
  arcProgress?: number; // For mortar (0 to 1)
  arcHeight?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'SPARK' | 'SMOKE' | 'BLOOD' | 'FLASH' | 'CRATER' | 'HEAL' | 'SHELL';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  size?: number;
}

export interface CityCapturePoint {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  type: 'HQ' | 'RADIO' | 'DEPOT' | 'HOSPITAL';
  owner: 'PLAYER' | 'ENEMY' | 'NEUTRAL';
  captureProgress: number; // -100 (Enemy) to 100 (Player)
  icon: string;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'BUILDING' | 'MARKET_STALL' | 'SANDBAG' | 'VEHICLE' | 'TREE' | 'WATER';
  hp?: number;
  isCover?: boolean;
  color?: string;
  name?: string;
}

export interface CityMission {
  id: string;
  name: string;
  country: string;
  description: string;
  difficulty: 'FACILE' | 'MOYEN' | 'DIFFICILE' | 'EXTRÊME';
  mapWidth: number;
  mapHeight: number;
  capturePoints: CityCapturePoint[];
  obstacles: Obstacle[];
  decorations: Array<{ x: number; y: number; type: 'PALM' | 'BAOBAB' | 'BARREL' | 'CRATE' | 'BENCH' | 'RUG' }>;
  enemyWavesCount: number;
  rewardValor: number;
  unlockedByDefault: boolean;
  weather: 'SUNNY' | 'SAHEL_DUST' | 'COASTAL_BREEZE' | 'TROPICAL_RAIN';
  coordinates: { x: number; y: number }; // For continental map
}

export interface PlayerProgress {
  valorPoints: number;
  commanderRank: string;
  commanderLevel: number;
  liberatedCities: string[];
  unlockedRoles: UnitRole[];
  upgrades: {
    armorLevel: number; // 0-3
    weaponCaliber: number; // 0-3
    squadLogistics: number; // max units 3 -> 6
    medicalSupplies: number; // 0-3
    airstrikeSupport: number; // 0-3
  };
  totalEnemiesNeutralized: number;
  totalMissionsCompleted: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume: number;
}

export type GameScreen = 
  | 'CAMPAIGN_MAP' 
  | 'BRIEFING' 
  | 'PLAYING' 
  | 'PAUSED' 
  | 'VICTORY' 
  | 'DEFEAT' 
  | 'ACADEMY';

export type SupportStrikeType = 'MORTAR' | 'RECON_FLARE' | 'MEDIC_DROP';
