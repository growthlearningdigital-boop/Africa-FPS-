/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CityMission, CityCapturePoint, Obstacle } from '../types.ts';

export const CITIES_DATA: CityMission[] = [
  {
    id: 'lome',
    name: 'Lomé',
    country: 'Togo',
    description: 'La cité côtière et son Grand Marché sont encerclés. Sécurisez la tour radio et le port pour couper le ravitaillement des insurgés.',
    difficulty: 'FACILE',
    mapWidth: 2400,
    mapHeight: 1800,
    weather: 'COASTAL_BREEZE',
    coordinates: { x: 42, y: 55 },
    rewardValor: 250,
    unlockedByDefault: true,
    enemyWavesCount: 3,
    capturePoints: [
      {
        id: 'cp_lome_1',
        name: 'Grand Marché Assigamé',
        x: 800,
        y: 600,
        radius: 110,
        type: 'DEPOT',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'DEPOT',
      },
      {
        id: 'cp_lome_2',
        name: 'Tour Radio du Littoral',
        x: 1600,
        y: 750,
        radius: 100,
        type: 'RADIO',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'RADIO',
      },
      {
        id: 'cp_lome_3',
        name: 'Poste Hospitalier de Bè',
        x: 1200,
        y: 1300,
        radius: 120,
        type: 'HOSPITAL',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'HOSPITAL',
      },
      {
        id: 'cp_lome_4',
        name: 'QG des Forces Spéciales',
        x: 350,
        y: 350,
        radius: 100,
        type: 'HQ',
        owner: 'PLAYER',
        captureProgress: 100,
        icon: 'HQ',
      }
    ],
    obstacles: [
      // Market buildings and stalls
      { x: 700, y: 480, width: 140, height: 80, type: 'BUILDING', name: 'Hangar Marchand' },
      { x: 920, y: 520, width: 120, height: 70, type: 'BUILDING', name: 'Entrepôt Cacao' },
      { x: 740, y: 680, width: 80, height: 50, type: 'MARKET_STALL', name: 'Étal Wax & Épices' },
      { x: 860, y: 690, width: 90, height: 50, type: 'MARKET_STALL', name: 'Étal Tissus Africains' },
      // Radio compound
      { x: 1540, y: 660, width: 160, height: 110, type: 'BUILDING', name: 'Station Émettrice' },
      { x: 1480, y: 780, width: 90, height: 25, type: 'SANDBAG', isCover: true, name: 'Barricade Sable' },
      { x: 1680, y: 780, width: 90, height: 25, type: 'SANDBAG', isCover: true, name: 'Barricade Sable' },
      // Clinic compound
      { x: 1120, y: 1220, width: 170, height: 95, type: 'BUILDING', name: 'Clinique de Bè' },
      { x: 1100, y: 1340, width: 80, height: 25, type: 'SANDBAG', isCover: true, name: 'Poste de Contrôle' },
      // Urban warehouses
      { x: 1900, y: 1100, width: 220, height: 130, type: 'BUILDING', name: 'Dépôt Maritime' },
      { x: 1850, y: 400, width: 180, height: 100, type: 'BUILDING', name: 'Douane Portuaire' },
      { x: 450, y: 1100, width: 150, height: 90, type: 'BUILDING', name: 'Complexe Résidentiel' },
      // Road barricades
      { x: 1050, y: 920, width: 110, height: 30, type: 'SANDBAG', isCover: true, name: 'Barrage Routier' },
    ],
    decorations: [
      { x: 250, y: 600, type: 'PALM' },
      { x: 280, y: 750, type: 'PALM' },
      { x: 600, y: 900, type: 'PALM' },
      { x: 1400, y: 450, type: 'PALM' },
      { x: 1750, y: 950, type: 'PALM' },
      { x: 2100, y: 350, type: 'PALM' },
      { x: 2150, y: 600, type: 'PALM' },
      { x: 1300, y: 800, type: 'BAOBAB' },
      { x: 650, y: 1400, type: 'BAOBAB' },
      { x: 1700, y: 1350, type: 'BAOBAB' },
      { x: 780, y: 630, type: 'CRATE' },
      { x: 800, y: 640, type: 'BARREL' },
      { x: 1580, y: 790, type: 'BARREL' },
    ]
  },
  {
    id: 'dakar',
    name: 'Dakar',
    country: 'Sénégal',
    description: 'Bataille urbaine sur la presqu\'île du Cap-Vert. Prenez le contrôle des boulevards côtiers et sécurisez la station relais.',
    difficulty: 'MOYEN',
    mapWidth: 2600,
    mapHeight: 1900,
    weather: 'SUNNY',
    coordinates: { x: 22, y: 46 },
    rewardValor: 350,
    unlockedByDefault: false,
    enemyWavesCount: 4,
    capturePoints: [
      {
        id: 'cp_dk_1',
        name: 'Place de l\'Indépendance',
        x: 1300,
        y: 850,
        radius: 120,
        type: 'HQ',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'HQ',
      },
      {
        id: 'cp_dk_2',
        name: 'Relais Corniche Ouest',
        x: 800,
        y: 1300,
        radius: 100,
        type: 'RADIO',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'RADIO',
      },
      {
        id: 'cp_dk_3',
        name: 'Dépôt Munition Bel-Air',
        x: 2000,
        y: 700,
        radius: 110,
        type: 'DEPOT',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'DEPOT',
      },
      {
        id: 'cp_dk_base',
        name: 'Base Aéronavale',
        x: 350,
        y: 350,
        radius: 100,
        type: 'HQ',
        owner: 'PLAYER',
        captureProgress: 100,
        icon: 'HQ',
      }
    ],
    obstacles: [
      { x: 1200, y: 720, width: 200, height: 90, type: 'BUILDING', name: 'Palais Administratif' },
      { x: 1220, y: 980, width: 160, height: 80, type: 'BUILDING', name: 'Immeuble Teranga' },
      { x: 740, y: 1200, width: 130, height: 75, type: 'BUILDING', name: 'Tour de Contrôle Maritime' },
      { x: 1920, y: 600, width: 180, height: 90, type: 'BUILDING', name: 'Dépôt Stratégique' },
      { x: 1000, y: 650, width: 90, height: 25, type: 'SANDBAG', isCover: true, name: 'Poste Sandbag' },
      { x: 1550, y: 900, width: 90, height: 25, type: 'SANDBAG', isCover: true, name: 'Ligne Défensive' },
      { x: 1850, y: 720, width: 90, height: 25, type: 'SANDBAG', isCover: true, name: 'Barrage Blindé' },
    ],
    decorations: [
      { x: 600, y: 500, type: 'BAOBAB' },
      { x: 1100, y: 1200, type: 'BAOBAB' },
      { x: 1600, y: 400, type: 'BAOBAB' },
      { x: 2200, y: 1200, type: 'BAOBAB' },
      { x: 400, y: 800, type: 'PALM' },
      { x: 1700, y: 1100, type: 'PALM' },
    ]
  },
  {
    id: 'abidjan',
    name: 'Abidjan',
    country: 'Côte d\'Ivoire',
    description: 'La perle des lagunes est menacée par une faction lourdement armée. Reprenez les ponts stratégiques et le centre de transmission.',
    difficulty: 'DIFFICILE',
    mapWidth: 2600,
    mapHeight: 1900,
    weather: 'TROPICAL_RAIN',
    coordinates: { x: 36, y: 58 },
    rewardValor: 450,
    unlockedByDefault: false,
    enemyWavesCount: 4,
    capturePoints: [
      {
        id: 'cp_abj_1',
        name: 'Centre Télécom du Plateau',
        x: 1350,
        y: 950,
        radius: 110,
        type: 'RADIO',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'RADIO',
      },
      {
        id: 'cp_abj_2',
        name: 'Tête de Pont HKB',
        x: 850,
        y: 1250,
        radius: 110,
        type: 'HQ',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'HQ',
      },
      {
        id: 'cp_abj_3',
        name: 'Hôpital Militaire Treichville',
        x: 1850,
        y: 800,
        radius: 110,
        type: 'HOSPITAL',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'HOSPITAL',
      },
      {
        id: 'cp_abj_base',
        name: 'Camp Akouédo',
        x: 350,
        y: 350,
        radius: 100,
        type: 'HQ',
        owner: 'PLAYER',
        captureProgress: 100,
        icon: 'HQ',
      }
    ],
    obstacles: [
      { x: 1260, y: 860, width: 200, height: 100, type: 'BUILDING', name: 'Tour Postale' },
      { x: 800, y: 1140, width: 140, height: 80, type: 'BUILDING', name: 'Péage Militaire' },
      { x: 1780, y: 720, width: 180, height: 95, type: 'BUILDING', name: 'Pavillon Médical' },
      { x: 1100, y: 1260, width: 100, height: 25, type: 'SANDBAG', isCover: true, name: 'Barrage Pont' },
    ],
    decorations: [
      { x: 500, y: 700, type: 'PALM' },
      { x: 600, y: 850, type: 'PALM' },
      { x: 1450, y: 1250, type: 'PALM' },
      { x: 2100, y: 1000, type: 'PALM' },
    ]
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    description: 'Défense de la métropole d\'Afrique de l\'Est aux portes de la savane. Affrontez les pick-up blindés sur les grands axes ferroviaires.',
    difficulty: 'EXTRÊME',
    mapWidth: 2800,
    mapHeight: 2000,
    weather: 'SAHEL_DUST',
    coordinates: { x: 74, y: 61 },
    rewardValor: 600,
    unlockedByDefault: false,
    enemyWavesCount: 5,
    capturePoints: [
      {
        id: 'cp_nrb_1',
        name: 'Gare Centrale SGR',
        x: 1400,
        y: 950,
        radius: 120,
        type: 'DEPOT',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'DEPOT',
      },
      {
        id: 'cp_nrb_2',
        name: 'Silicon Savannah Hub',
        x: 2050,
        y: 850,
        radius: 110,
        type: 'RADIO',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'RADIO',
      },
      {
        id: 'cp_nrb_3',
        name: 'QG Insurgé du Warlord',
        x: 1600,
        y: 1500,
        radius: 120,
        type: 'HQ',
        owner: 'ENEMY',
        captureProgress: -100,
        icon: 'HQ',
      },
      {
        id: 'cp_nrb_base',
        name: 'Camp KDF',
        x: 400,
        y: 400,
        radius: 100,
        type: 'HQ',
        owner: 'PLAYER',
        captureProgress: 100,
        icon: 'HQ',
      }
    ],
    obstacles: [
      { x: 1300, y: 840, width: 220, height: 110, type: 'BUILDING', name: 'Terminal Ferroviaire' },
      { x: 1980, y: 760, width: 170, height: 90, type: 'BUILDING', name: 'Centre Données' },
      { x: 1520, y: 1420, width: 180, height: 100, type: 'BUILDING', name: 'Bastion Ennemi' },
      { x: 1200, y: 1100, width: 120, height: 30, type: 'SANDBAG', isCover: true, name: 'Fortification' },
      { x: 1750, y: 1100, width: 120, height: 30, type: 'SANDBAG', isCover: true, name: 'Fortification' },
    ],
    decorations: [
      { x: 700, y: 550, type: 'BAOBAB' },
      { x: 1000, y: 1450, type: 'BAOBAB' },
      { x: 2300, y: 600, type: 'BAOBAB' },
      { x: 2250, y: 1350, type: 'BAOBAB' },
    ]
  }
];

export class CityManager {
  public mission: CityMission;
  public capturePoints: CityCapturePoint[];
  public obstacles: Obstacle[];

  constructor(cityId: string = 'lome') {
    const found = CITIES_DATA.find((c) => c.id === cityId) || CITIES_DATA[0];
    // Deep copy so game state mutations do not pollute static config
    this.mission = JSON.parse(JSON.stringify(found));
    this.capturePoints = this.mission.capturePoints;
    this.obstacles = this.mission.obstacles;
  }

  public getLiberationPercentage(): number {
    const totalPoints = this.capturePoints.filter(cp => cp.type !== 'HQ' || cp.owner !== 'PLAYER');
    if (totalPoints.length === 0) return 100;
    const captured = totalPoints.filter(cp => cp.owner === 'PLAYER').length;
    return Math.round((captured / totalPoints.length) * 100);
  }

  public updateCapturePoints(
    dt: number,
    soldiers: { x: number; y: number; hp: number }[],
    enemies: { x: number; y: number; hp: number }[],
    onCaptured?: (cp: CityCapturePoint) => void
  ) {
    for (const cp of this.capturePoints) {
      if (cp.id.includes('base')) continue; // Player home base cannot be captured

      // Count units in radius
      let playerCount = 0;
      let enemyCount = 0;

      for (const s of soldiers) {
        if (s.hp > 0 && Math.hypot(s.x - cp.x, s.y - cp.y) <= cp.radius) {
          playerCount++;
        }
      }

      for (const e of enemies) {
        if (e.hp > 0 && Math.hypot(e.x - cp.x, e.y - cp.y) <= cp.radius) {
          enemyCount++;
        }
      }

      const captureSpeed = 18 * dt; // % per second

      if (playerCount > 0 && enemyCount === 0) {
        // Player capturing
        const prev = cp.captureProgress;
        cp.captureProgress = Math.min(100, cp.captureProgress + captureSpeed * playerCount);
        if (cp.captureProgress >= 100 && prev < 100) {
          cp.owner = 'PLAYER';
          if (onCaptured) onCaptured(cp);
        }
      } else if (enemyCount > 0 && playerCount === 0) {
        // Enemy reclaiming
        cp.captureProgress = Math.max(-100, cp.captureProgress - captureSpeed * enemyCount);
        if (cp.captureProgress <= -100) {
          cp.owner = 'ENEMY';
        }
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const w = this.mission.mapWidth;
    const h = this.mission.mapHeight;

    // 1. Ground base: rich warm African laterite earth & sand tone
    ctx.fillStyle = this.mission.weather === 'COASTAL_BREEZE' ? '#d97706' : '#b45309';
    ctx.fillRect(0, 0, w, h);

    // Subtle ground dust / laterite grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    for (let gx = 0; gx < w; gx += 160) {
      for (let gy = 0; gy < h; gy += 160) {
        if ((gx + gy) % 320 === 0) {
          ctx.fillRect(gx, gy, 160, 160);
        }
      }
    }

    // 2. Main paved asphalt boulevards & laterite crossroads
    ctx.fillStyle = '#292524'; // Modern asphalt road
    // Horizontal main boulevard
    ctx.fillRect(0, 750, w, 140);
    // Vertical avenue
    ctx.fillRect(1150, 0, 130, h);
    // Secondary bypass
    ctx.fillRect(600, 300, 1200, 80);

    // Road markings (white dashed center lines)
    ctx.strokeStyle = '#f5f5f4';
    ctx.lineWidth = 3;
    ctx.setLineDash([24, 20]);
    // Horizontal road center
    ctx.beginPath();
    ctx.moveTo(0, 820);
    ctx.lineTo(w, 820);
    ctx.stroke();
    // Vertical road center
    ctx.beginPath();
    ctx.moveTo(1215, 0);
    ctx.lineTo(1215, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosswalk zebra stripes at intersection
    ctx.fillStyle = '#f5f5f4';
    for (let z = 0; z < 100; z += 18) {
      ctx.fillRect(1160 + z, 730, 12, 18);
      ctx.fillRect(1160 + z, 892, 12, 18);
    }

    // 3. Draw capture zones on the ground
    for (const cp of this.capturePoints) {
      this.drawCaptureZone(ctx, cp);
    }

    // 4. Draw Obstacles (Buildings, Sandbag barricades, Market stalls)
    for (const obs of this.obstacles) {
      this.drawObstacle(ctx, obs);
    }

    // 5. Draw Foliage & Decor (Palms, Baobabs, Crates)
    for (const dec of this.mission.decorations) {
      this.drawDecoration(ctx, dec);
    }
  }

  private drawCaptureZone(ctx: CanvasRenderingContext2D, cp: CityCapturePoint) {
    const isPlayer = cp.owner === 'PLAYER';
    const isNeutral = cp.owner === 'NEUTRAL';
    const zoneColor = isPlayer ? 'rgba(34, 197, 94, 0.16)' : isNeutral ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.16)';
    const ringColor = isPlayer ? '#22c55e' : isNeutral ? '#eab308' : '#ef4444';

    // Area fill
    ctx.fillStyle = zoneColor;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
    ctx.fill();

    // Area boundary ring
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Inner icon emblem
    ctx.fillStyle = ringColor;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Icon text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cp.type === 'HQ' ? 'HQ' : cp.type === 'RADIO' ? 'RAD' : cp.type === 'DEPOT' ? 'MUN' : 'MED', cp.x, cp.y);

    // Label under icon
    ctx.fillStyle = '#f5f5f4';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(cp.name, cp.x, cp.y + 38);

    // Capture gauge bar
    const barW = 60;
    const barH = 5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(cp.x - barW / 2, cp.y + 48, barW, barH);

    // -100 (Enemy red) to +100 (Player green)
    const norm = (cp.captureProgress + 100) / 200; // 0 to 1
    ctx.fillStyle = norm > 0.5 ? '#22c55e' : '#ef4444';
    ctx.fillRect(cp.x - barW / 2, cp.y + 48, barW * norm, barH);
  }

  private drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle) {
    ctx.save();

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(obs.x + 8, obs.y + 8, obs.width, obs.height);

    if (obs.type === 'BUILDING') {
      // African colonial or modern clay/concrete building
      ctx.fillStyle = '#e7e5e4'; // Warm stone walls
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

      // Roof trim / corrugated tin or red clay roof
      ctx.fillStyle = '#991b1b'; // Red clay terracotta rooftop
      ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);

      // Roof ridges
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 1.5;
      for (let rx = obs.x + 12; rx < obs.x + obs.width - 12; rx += 14) {
        ctx.beginPath();
        ctx.moveTo(rx, obs.y + 4);
        ctx.lineTo(rx, obs.y + obs.height - 4);
        ctx.stroke();
      }

      // Building label
      if (obs.name) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(obs.name, obs.x + obs.width / 2, obs.y + obs.height / 2 + 3);
      }
    } else if (obs.type === 'MARKET_STALL') {
      // Colorful African Wax print canopy roof! (Vibrant stripes)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

      // Vibrant wax stripes
      const stripeW = 12;
      for (let sx = obs.x; sx < obs.x + obs.width; sx += stripeW * 2) {
        ctx.fillStyle = '#059669'; // Emerald green
        ctx.fillRect(sx, obs.y, stripeW, obs.height);
      }

      // Stall wooden outline
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
    } else if (obs.type === 'SANDBAG') {
      // Sandbags military cover
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

      // Sandbag seams
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1.5;
      for (let bx = obs.x + 16; bx < obs.x + obs.width; bx += 18) {
        ctx.beginPath();
        ctx.moveTo(bx, obs.y);
        ctx.lineTo(bx, obs.y + obs.height);
        ctx.stroke();
      }
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
    }

    ctx.restore();
  }

  private drawDecoration(ctx: CanvasRenderingContext2D, dec: { x: number; y: number; type: string }) {
    ctx.save();
    ctx.translate(dec.x, dec.y);

    if (dec.type === 'PALM') {
      // Palm shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(8, 12, 28, 16, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      // Fronds (Tropical Palm Leaves)
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const fx = Math.cos(a) * 38;
        const fy = Math.sin(a) * 38;
        ctx.quadraticCurveTo(Math.cos(a + 0.2) * 20, Math.sin(a + 0.2) * 20, fx, fy);
        ctx.stroke();
      }
    } else if (dec.type === 'BAOBAB') {
      // Majestic Baobab tree!
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(10, 14, 45, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Massive Baobab trunk
      ctx.fillStyle = '#57534e';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      // Bark wrinkles
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Canopy foliage tufts
      ctx.fillStyle = '#166534';
      const tufts = [
        { ox: -25, oy: -20, r: 18 },
        { ox: 25, oy: -15, r: 20 },
        { ox: 0, oy: -35, r: 22 },
        { ox: -20, oy: 20, r: 19 },
        { ox: 25, oy: 20, r: 18 },
      ];
      for (const t of tufts) {
        ctx.beginPath();
        ctx.arc(t.ox, t.oy, t.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (dec.type === 'BARREL') {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (dec.type === 'CRATE') {
      ctx.fillStyle = '#a16207';
      ctx.fillRect(-8, -8, 16, 16);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-8, -8, 16, 16);
    }

    ctx.restore();
  }
}
