/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera } from './engine/Camera.ts';
import { InputHandler } from './engine/Input.ts';
import { sound } from './engine/Sound.ts';
import { Soldier } from './entities/Soldier.ts';
import { Enemy } from './entities/Enemy.ts';
import { Projectile } from './entities/Projectile.ts';
import { CityManager, CITIES_DATA } from './world/CityManager.ts';
import { 
  GameScreen, 
  PlayerProgress, 
  UnitRole, 
  UnitStance, 
  SupportStrikeType, 
  Particle, 
  FloatingText 
} from './types.ts';
import { TacticalHUD } from './components/TacticalHUD.tsx';
import { CampaignMap } from './components/CampaignMap.tsx';
import { TacticalAcademy } from './components/TacticalAcademy.tsx';
import { MissionSummary } from './components/MissionSummary.tsx';

const DEFAULT_PROGRESS: PlayerProgress = {
  valorPoints: 300,
  commanderRank: 'Capitaine',
  commanderLevel: 1,
  liberatedCities: [],
  unlockedRoles: ['HERO', 'COMMANDO', 'SNIPER', 'HEAVY', 'MEDIC'],
  upgrades: {
    armorLevel: 0,
    weaponCaliber: 0,
    squadLogistics: 0,
    medicalSupplies: 0,
    airstrikeSupport: 0,
  },
  totalEnemiesNeutralized: 0,
  totalMissionsCompleted: 0,
  soundEnabled: true,
  musicEnabled: true,
  masterVolume: 0.8,
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Persistent Player Progress
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem('afro_rts_save_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROGRESS;
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('afro_rts_save_v1', JSON.stringify(progress));
    } catch {
      // storage unavailable
    }
  }, [progress]);

  // Screen State
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('CAMPAIGN_MAP');
  const [activeCityId, setActiveCityId] = useState<string>('lome');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);

  // Tactical in-game state
  const [valorPoints, setValorPoints] = useState<number>(300);
  const [currentWave, setCurrentWave] = useState<number>(1);
  const [totalWaves, setTotalWaves] = useState<number>(3);
  const [selectedSoldierId, setSelectedSoldierId] = useState<string | null>(null);
  const [activeTargetingStrike, setActiveTargetingStrike] = useState<SupportStrikeType | null>(null);

  // Summary state
  const [summaryData, setSummaryData] = useState<{
    isVictory: boolean;
    enemiesNeutralized: number;
    sectorsCaptured: number;
    valorEarned: number;
  } | null>(null);

  // Engine references
  const engineRef = useRef<{
    camera: Camera;
    input: InputHandler | null;
    city: CityManager;
    soldiers: Soldier[];
    enemies: Enemy[];
    projectiles: Projectile[];
    particles: Particle[];
    floatingTexts: FloatingText[];
    lastFrameTime: number;
    waveSpawnTimer: number;
    medicHealTimer: number;
    enemiesDefeatedInMission: number;
  }>({
    camera: new Camera(400, 350),
    input: null,
    city: new CityManager('lome'),
    soldiers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    floatingTexts: [],
    lastFrameTime: performance.now(),
    waveSpawnTimer: 0,
    medicHealTimer: 0,
    enemiesDefeatedInMission: 0,
  });

  // Start African background rhythm
  useEffect(() => {
    sound.startMusic();
    return () => {
      sound.stopMusic();
    };
  }, []);

  // Initialize or start a mission
  const startMission = useCallback((cityId: string) => {
    const city = new CityManager(cityId);
    const camera = new Camera(350, 350);
    camera.setMapBounds(city.mission.mapWidth, city.mission.mapHeight);

    // Alpha Hero commander
    const hero = new Soldier(350, 350, 'HERO');
    hero.isSelected = true;

    // Apply upgrades to hero
    hero.maxHp += progress.upgrades.armorLevel * 30;
    hero.hp = hero.maxHp;
    hero.damage += progress.upgrades.weaponCaliber * 5;

    // Initial squad support: 1 Commando
    const commando = new Soldier(380, 380, 'COMMANDO');
    commando.maxHp += progress.upgrades.armorLevel * 20;
    commando.hp = commando.maxHp;

    const initialEnemies: Enemy[] = [];
    // Spawn wave 1 patrol enemies around capture points
    for (const cp of city.capturePoints) {
      if (cp.owner === 'ENEMY') {
        initialEnemies.push(new Enemy(cp.x - 30, cp.y - 30, 'RAIDER'));
        initialEnemies.push(new Enemy(cp.x + 30, cp.y + 30, 'RAIDER'));
        if (cp.type === 'RADIO') {
          initialEnemies.push(new Enemy(cp.x + 50, cp.y - 30, 'SKIRMISHER'));
        }
      }
    }

    engineRef.current.city = city;
    engineRef.current.camera = camera;
    engineRef.current.soldiers = [hero, commando];
    engineRef.current.enemies = initialEnemies;
    engineRef.current.projectiles = [];
    engineRef.current.particles = [];
    engineRef.current.floatingTexts = [];
    engineRef.current.waveSpawnTimer = 0;
    engineRef.current.medicHealTimer = 0;
    engineRef.current.enemiesDefeatedInMission = 0;

    setActiveCityId(cityId);
    setSelectedSoldierId(hero.id);
    setCurrentWave(1);
    setTotalWaves(city.mission.enemyWavesCount);
    setValorPoints(progress.valorPoints);
    setActiveTargetingStrike(null);
    setSummaryData(null);
    setIsPaused(false);
    setCurrentScreen('PLAYING');

    sound.playRadioChirp('CONFIRM');
  }, [progress]);

  // Main Canvas & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize InputHandler
    const input = new InputHandler(canvas, engineRef.current.camera);
    engineRef.current.input = input;

    // Resize canvas
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      engineRef.current.camera.setViewport(canvas.width, canvas.height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - engineRef.current.lastFrameTime) / 1000);
      engineRef.current.lastFrameTime = now;

      if (currentScreen === 'PLAYING' && !isPaused) {
        updateGame(dt, now);
      }

      renderGame();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentScreen, isPaused]);

  // Update Game Logic
  const updateGame = (dt: number, now: number) => {
    const { camera, input, city, soldiers, enemies, projectiles, particles, floatingTexts } = engineRef.current;
    if (!input) return;

    input.updateWorldPosition();

    // 1. Camera Keyboard Pan (WASD / Arrows)
    let camDx = 0;
    let camDy = 0;
    if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) camDy -= 600 * dt;
    if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) camDy += 600 * dt;
    if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) camDx -= 600 * dt;
    if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) camDx += 600 * dt;
    if (camDx !== 0 || camDy !== 0) {
      camera.pan(camDx, camDy);
    }
    camera.update(dt);

    // 2. Space key: Direct fire from Alpha Hero / Selected Soldier
    const selected = soldiers.find((s) => s.id === selectedSoldierId);
    if (selected && selected.hp > 0 && input.isSpacePressed()) {
      const p = selected.fire(input.worldMouseX, input.worldMouseY, now);
      if (p) projectiles.push(p);
    }

    // 3. Mouse Click Actions
    if (input.isMouseClicked) {
      if (activeTargetingStrike) {
        // Execute Tactical Support Strike
        executeSupportStrike(activeTargetingStrike, input.clickX, input.clickY);
        setActiveTargetingStrike(null);
      } else {
        // Check if user clicked on a player soldier
        let clickedSoldier: Soldier | null = null;
        for (const s of soldiers) {
          if (s.hp > 0 && Math.hypot(s.x - input.clickX, s.y - input.clickY) <= s.radius + 8) {
            clickedSoldier = s;
            break;
          }
        }

        if (clickedSoldier) {
          // Select this soldier
          soldiers.forEach((s) => (s.isSelected = s.id === clickedSoldier!.id));
          setSelectedSoldierId(clickedSoldier.id);
          sound.playRadioChirp('CONFIRM');
        } else {
          // RTS Move Order: Move selected soldier(s) to destination
          const selectedGroup = soldiers.filter((s) => s.isSelected && s.hp > 0);
          if (selectedGroup.length === 1) {
            selectedGroup[0].setDestination(input.clickX, input.clickY);
            spawnClickIndicator(input.clickX, input.clickY);
            sound.playRadioChirp('MOVE');
          } else if (selectedGroup.length > 1) {
            // Formation spread around click point
            selectedGroup.forEach((s, idx) => {
              const angle = (idx / selectedGroup.length) * Math.PI * 2;
              const radius = 35;
              s.setDestination(
                input.clickX + Math.cos(angle) * radius,
                input.clickY + Math.sin(angle) * radius
              );
            });
            spawnClickIndicator(input.clickX, input.clickY);
            sound.playRadioChirp('MOVE');
          }
        }
      }
    }

    // Right click: Force attack at location
    if (input.isRightMouseClicked) {
      if (selected && selected.hp > 0) {
        selected.aimAt(input.rightClickX, input.rightClickY);
        const p = selected.fire(input.rightClickX, input.rightClickY, now);
        if (p) projectiles.push(p);
      }
    }

    input.resetFrameClicks();

    // 4. Update Soldiers & Autonomous Fire
    soldiers.forEach((soldier) => {
      if (soldier.hp <= 0) return;
      soldier.update(dt, now);

      // Autonomous firing in AGGRESSIVE / DEFENSIVE stance
      if (soldier.stance !== 'HOLD' && soldier.canFire(now)) {
        // Find nearest living enemy within weapon range
        let targetEnemy: Enemy | null = null;
        let minDist = soldier.range;

        for (const e of enemies) {
          if (e.hp <= 0) continue;
          const d = Math.hypot(e.x - soldier.x, e.y - soldier.y);
          if (d <= minDist) {
            minDist = d;
            targetEnemy = e;
          }
        }

        if (targetEnemy) {
          const p = soldier.fire(targetEnemy.x, targetEnemy.y, now);
          if (p) projectiles.push(p);
        }
      }
    });

    // 5. Field Medic Passive Aura Healing
    engineRef.current.medicHealTimer += dt;
    if (engineRef.current.medicHealTimer >= 1.5) {
      engineRef.current.medicHealTimer = 0;
      const medics = soldiers.filter((s) => s.role === 'MEDIC' && s.hp > 0);
      medics.forEach((medic) => {
        soldiers.forEach((s) => {
          if (s.hp > 0 && s.hp < s.maxHp && Math.hypot(s.x - medic.x, s.y - medic.y) <= 100) {
            const healAmt = 12 + progress.upgrades.medicalSupplies * 4;
            s.heal(healAmt);
            floatingTexts.push({
              id: Math.random().toString(),
              x: s.x,
              y: s.y - 20,
              text: `+${healAmt}`,
              color: '#38bdf8',
              life: 1.0,
              maxLife: 1.0,
            });
          }
        });
      });
    }

    // 6. Update Enemies & Autonomous Attacks
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (enemy.hp <= 0) {
        enemies.splice(i, 1);
        continue;
      }

      const p = enemy.update(dt, now, soldiers);
      if (p) projectiles.push(p);
    }

    // 7. Update Projectiles & Hit Detection
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const proj = projectiles[i];
      const active = proj.update(dt, particles);

      if (!active || proj.isOutOfBounds(city.mission.mapWidth, city.mission.mapHeight)) {
        if (proj.type === 'MORTAR' || proj.type === 'ROCKET') {
          // Detonate area splash
          detonateExplosion(proj.x, proj.y, proj.splashRadius || 80, proj.damage, proj.owner);
        }
        projectiles.splice(i, 1);
        continue;
      }

      // Check collision with targets
      if (proj.owner === 'PLAYER') {
        // Check hits against enemies
        let hit = false;
        for (const enemy of enemies) {
          if (enemy.hp <= 0) continue;
          if (Math.hypot(enemy.x - proj.x, enemy.y - proj.y) <= enemy.radius + 4) {
            const killed = enemy.takeDamage(proj.damage);
            hit = true;

            // Spawn hit sparks & damage number
            spawnHitEffect(proj.x, proj.y, '#f59e0b');
            floatingTexts.push({
              id: Math.random().toString(),
              x: enemy.x,
              y: enemy.y - 15,
              text: `-${Math.round(proj.damage)}`,
              color: '#fbbf24',
              life: 0.8,
              maxLife: 0.8,
            });

            if (killed) {
              engineRef.current.enemiesDefeatedInMission++;
              const pts = enemy.isBoss ? 80 : enemy.type === 'TECHNICAL' ? 45 : 20;
              setValorPoints((prev) => prev + pts);
              floatingTexts.push({
                id: Math.random().toString(),
                x: enemy.x,
                y: enemy.y - 30,
                text: `+${pts} VALEUR`,
                color: '#22c55e',
                life: 1.2,
                maxLife: 1.2,
              });
              spawnBloodSplatter(enemy.x, enemy.y);
            }
            break;
          }
        }
        if (hit && proj.type !== 'SNIPER_ROUND') {
          projectiles.splice(i, 1);
        }
      } else {
        // Enemy projectile hits player soldier
        let hit = false;
        for (const soldier of soldiers) {
          if (soldier.hp <= 0) continue;
          if (Math.hypot(soldier.x - proj.x, soldier.y - proj.y) <= soldier.radius + 4) {
            const dead = soldier.takeDamage(proj.damage);
            hit = true;
            camera.addShake(4);

            spawnHitEffect(proj.x, proj.y, '#ef4444');
            floatingTexts.push({
              id: Math.random().toString(),
              x: soldier.x,
              y: soldier.y - 15,
              text: `-${Math.round(proj.damage)}`,
              color: '#ef4444',
              life: 0.8,
              maxLife: 0.8,
            });

            if (dead) {
              sound.playRadioChirp('ALERT');
              spawnBloodSplatter(soldier.x, soldier.y);
            }
            break;
          }
        }
        if (hit) {
          projectiles.splice(i, 1);
        }
      }
    }

    // 8. Capture Points Update
    city.updateCapturePoints(dt, soldiers, enemies, (capturedCp) => {
      sound.playCaptureChime();
      floatingTexts.push({
        id: Math.random().toString(),
        x: capturedCp.x,
        y: capturedCp.y - 40,
        text: `SECTEUR SÉCURISÉ : ${capturedCp.name}`,
        color: '#22c55e',
        life: 2.0,
        maxLife: 2.0,
      });
      setValorPoints((prev) => prev + 50);
    });

    // 9. Wave Progression & Victory / Defeat Check
    const livingSoldiers = soldiers.filter((s) => s.hp > 0);
    const alphaHero = soldiers.find((s) => s.role === 'HERO');

    // Defeat Check
    if (livingSoldiers.length === 0 || (alphaHero && alphaHero.hp <= 0)) {
      handleGameOver(false);
      return;
    }

    // Victory Check: Liberation >= 100% and currentWave >= totalWaves and enemies cleared
    const liberation = city.getLiberationPercentage();
    if (liberation >= 100 && currentWave >= totalWaves && enemies.length === 0) {
      handleGameOver(true);
      return;
    }

    // Wave Spawning logic
    if (enemies.length <= 1 && currentWave < totalWaves) {
      engineRef.current.waveSpawnTimer += dt;
      if (engineRef.current.waveSpawnTimer >= 4.0) {
        engineRef.current.waveSpawnTimer = 0;
        spawnNextWave(currentWave + 1);
      }
    }

    // 10. Update Particles & Floating Text
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 25 * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        floatingTexts.splice(i, 1);
      }
    }
  };

  // Spawn Next Tactical Wave
  const spawnNextWave = (nextWaveNumber: number) => {
    setCurrentWave(nextWaveNumber);
    sound.playRadioChirp('ALERT');

    const { city, enemies, floatingTexts } = engineRef.current;
    const isFinalWave = nextWaveNumber >= city.mission.enemyWavesCount;

    floatingTexts.push({
      id: Math.random().toString(),
      x: city.mission.mapWidth / 2,
      y: 400,
      text: isFinalWave ? 'ALERTE : ASSAUT FINAL DU SEIGNEUR DE GUERRE !' : `VAGUE ENNEMIE ${nextWaveNumber} EN APPROCHE !`,
      color: '#ef4444',
      life: 3.0,
      maxLife: 3.0,
      size: 20,
    });

    // Spawn raiders & skirmishers from contested points or borders
    const spawnPoints = [
      { x: city.mission.mapWidth - 200, y: 300 },
      { x: city.mission.mapWidth - 300, y: city.mission.mapHeight - 300 },
      { x: 200, y: city.mission.mapHeight - 200 },
    ];

    spawnPoints.forEach((sp, idx) => {
      enemies.push(new Enemy(sp.x + (idx * 20), sp.y, 'RAIDER'));
      enemies.push(new Enemy(sp.x + 30, sp.y + 30, 'SKIRMISHER'));
      if (nextWaveNumber >= 2) {
        enemies.push(new Enemy(sp.x - 30, sp.y - 20, 'HEAVY_ENFORCER'));
      }
    });

    // Final Wave: Spawn Boss Warlord & Technical Truck
    if (isFinalWave) {
      enemies.push(new Enemy(city.mission.mapWidth - 350, city.mission.mapHeight / 2, 'WARLORD', true));
      enemies.push(new Enemy(city.mission.mapWidth - 420, city.mission.mapHeight / 2 + 60, 'TECHNICAL'));
    }
  };

  // Detonate Splash Explosions (Mortar / Rocket)
  const detonateExplosion = (
    x: number,
    y: number,
    radius: number,
    damage: number,
    owner: 'PLAYER' | 'ENEMY'
  ) => {
    sound.playExplosion();
    engineRef.current.camera.addShake(12);

    // Spawn explosion particles
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 160;
      engineRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        color: Math.random() < 0.6 ? '#f59e0b' : '#ef4444',
        size: 4 + Math.random() * 6,
        type: 'FLASH',
      });
    }

    // Damage units in splash radius
    if (owner === 'PLAYER') {
      engineRef.current.enemies.forEach((enemy) => {
        if (enemy.hp <= 0) return;
        const dist = Math.hypot(enemy.x - x, enemy.y - y);
        if (dist <= radius) {
          const falloff = 1 - dist / radius;
          const dmg = damage * falloff;
          const killed = enemy.takeDamage(dmg);
          if (killed) {
            engineRef.current.enemiesDefeatedInMission++;
            setValorPoints((v) => v + 30);
          }
        }
      });
    } else {
      engineRef.current.soldiers.forEach((soldier) => {
        if (soldier.hp <= 0) return;
        const dist = Math.hypot(soldier.x - x, soldier.y - y);
        if (dist <= radius) {
          const falloff = 1 - dist / radius;
          soldier.takeDamage(damage * falloff);
        }
      });
    }
  };

  // Execute Tactical Support Strike
  const executeSupportStrike = (strike: SupportStrikeType, targetX: number, targetY: number) => {
    const { projectiles, soldiers, floatingTexts } = engineRef.current;

    if (strike === 'MORTAR') {
      sound.playRadioChirp('ATTACK');
      // Fire 3 staggered mortar shells
      [0, 180, 360].forEach((delay, idx) => {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 60;
          const offsetY = (Math.random() - 0.5) * 60;
          const mortar = new Projectile(
            targetX + offsetX - 200,
            targetY + offsetY - 200,
            targetX + offsetX,
            targetY + offsetY,
            120 + progress.upgrades.airstrikeSupport * 30,
            'MORTAR',
            'PLAYER'
          );
          projectiles.push(mortar);
        }, delay);
      });
      setValorPoints((v) => Math.max(0, v - 150));
    } else if (strike === 'RECON_FLARE') {
      sound.playRadioChirp('CONFIRM');
      floatingTexts.push({
        id: Math.random().toString(),
        x: targetX,
        y: targetY - 30,
        text: 'RECONNAISSANCE DRONE DÉPLOYÉE',
        color: '#38bdf8',
        life: 2.0,
        maxLife: 2.0,
      });
      setValorPoints((v) => Math.max(0, v - 60));
    } else if (strike === 'MEDIC_DROP') {
      sound.playCaptureChime();
      soldiers.forEach((s) => {
        if (s.hp > 0) {
          s.heal(60);
          floatingTexts.push({
            id: Math.random().toString(),
            x: s.x,
            y: s.y - 20,
            text: '+60 SOINS',
            color: '#22c55e',
            life: 1.5,
            maxLife: 1.5,
          });
        }
      });
      setValorPoints((v) => Math.max(0, v - 90));
    }
  };

  // Render Game Elements on Canvas
  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { camera, city, soldiers, enemies, projectiles, particles, floatingTexts, input } = engineRef.current;

    // Apply Camera Transform
    camera.applyTransform(ctx);

    // 1. Draw World & African City Map
    city.draw(ctx, canvas);

    // 2. Draw Projectiles
    projectiles.forEach((p) => p.draw(ctx));

    // 3. Draw Soldiers
    soldiers.forEach((s) => {
      if (s.hp > 0) s.draw(ctx);
    });

    // 4. Draw Enemies
    enemies.forEach((e) => {
      if (e.hp > 0) e.draw(ctx);
    });

    // 5. Draw Particles
    particles.forEach((pt) => {
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Draw Floating Texts
    floatingTexts.forEach((ft) => {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${ft.size || 12}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.globalAlpha = 1.0;
    });

    // 7. Targeting Strike Reticle if active
    if (activeTargetingStrike && input) {
      ctx.strokeStyle = activeTargetingStrike === 'MORTAR' ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(input.worldMouseX, input.worldMouseY, activeTargetingStrike === 'MORTAR' ? 80 : 50, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(input.worldMouseX - 15, input.worldMouseY);
      ctx.lineTo(input.worldMouseX + 15, input.worldMouseY);
      ctx.moveTo(input.worldMouseX, input.worldMouseY - 15);
      ctx.lineTo(input.worldMouseX, input.worldMouseY + 15);
      ctx.stroke();
    }

    camera.restoreTransform(ctx);
  };

  // Helper FX
  const spawnClickIndicator = (x: number, y: number) => {
    engineRef.current.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0.3,
      maxLife: 0.3,
      color: '#22c55e',
      size: 16,
      type: 'FLASH',
    });
  };

  const spawnHitEffect = (x: number, y: number, color: string) => {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 20 + Math.random() * 60;
      engineRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0.25,
        maxLife: 0.25,
        color,
        size: 3,
        type: 'SPARK',
      });
    }
  };

  const spawnBloodSplatter = (x: number, y: number) => {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 10 + Math.random() * 40;
      engineRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0.5,
        maxLife: 0.5,
        color: '#991b1b',
        size: 4,
        type: 'BLOOD',
      });
    }
  };

  // End Mission handler
  const handleGameOver = (isVictory: boolean) => {
    const { city, enemiesDefeatedInMission } = engineRef.current;
    const sectors = city.capturePoints.filter((cp) => cp.owner === 'PLAYER' && !cp.id.includes('base')).length;
    const earnedValor = isVictory ? city.mission.rewardValor : 60;

    if (isVictory) {
      sound.playCaptureChime(true);
      setProgress((prev) => {
        const nextLiberated = prev.liberatedCities.includes(city.mission.id)
          ? prev.liberatedCities
          : [...prev.liberatedCities, city.mission.id];

        // Unlock next cities in order
        return {
          ...prev,
          valorPoints: prev.valorPoints + earnedValor,
          liberatedCities: nextLiberated,
          totalEnemiesNeutralized: prev.totalEnemiesNeutralized + enemiesDefeatedInMission,
          totalMissionsCompleted: prev.totalMissionsCompleted + 1,
          commanderLevel: prev.commanderLevel + 1,
          commanderRank:
            nextLiberated.length >= 3
              ? 'Général Panafricain'
              : nextLiberated.length >= 2
              ? 'Commandant d\'Élite'
              : 'Capitaine de Brigade',
        };
      });
    } else {
      sound.playRadioChirp('ALERT');
    }

    setSummaryData({
      isVictory,
      enemiesNeutralized: enemiesDefeatedInMission,
      sectorsCaptured: sectors,
      valorEarned: earnedValor,
    });

    setCurrentScreen(isVictory ? 'VICTORY' : 'DEFEAT');
  };

  // Reinforcements deployment handler
  const handleDeployReinforcement = (role: UnitRole) => {
    const costMap: Record<UnitRole, number> = {
      HERO: 200,
      COMMANDO: 80,
      SNIPER: 120,
      HEAVY: 140,
      MEDIC: 100,
    };

    const cost = costMap[role];
    if (valorPoints < cost || engineRef.current.soldiers.length >= 6) return;

    const basePoint = engineRef.current.city.capturePoints.find((cp) => cp.id.includes('base')) || {
      x: 350,
      y: 350,
    };

    const newSoldier = new Soldier(
      basePoint.x + (Math.random() * 40 - 20),
      basePoint.y + (Math.random() * 40 - 20),
      role
    );

    // Apply upgrades
    newSoldier.maxHp += progress.upgrades.armorLevel * 20;
    newSoldier.hp = newSoldier.maxHp;
    newSoldier.damage += progress.upgrades.weaponCaliber * 4;

    engineRef.current.soldiers.push(newSoldier);
    setValorPoints((v) => v - cost);
    sound.playRadioChirp('CONFIRM');

    engineRef.current.floatingTexts.push({
      id: Math.random().toString(),
      x: newSoldier.x,
      y: newSoldier.y - 25,
      text: `RENFORT DÉPLOYÉ : ${newSoldier.name}`,
      color: '#22c55e',
      life: 2.0,
      maxLife: 2.0,
    });
  };

  // Selected Soldier controls
  const handleStanceChange = (soldier: Soldier, stance: UnitStance) => {
    soldier.stance = stance;
    sound.playRadioChirp('CONFIRM');
  };

  const handleManualReload = (soldier: Soldier) => {
    soldier.startReload(performance.now());
  };

  const handleTriggerSpecial = (soldier: Soldier) => {
    const success = soldier.useSpecial(performance.now());
    if (!success) return;

    sound.playRadioChirp('ATTACK');

    if (soldier.role === 'HERO') {
      // Rally buff (+30% speed & damage for 6s)
      engineRef.current.soldiers.forEach((s) => {
        s.speed *= 1.3;
        setTimeout(() => (s.speed /= 1.3), 6000);
      });
      engineRef.current.floatingTexts.push({
        id: Math.random().toString(),
        x: soldier.x,
        y: soldier.y - 30,
        text: 'RALLIEMENT HÉROÏQUE ! (+30% Vitesse)',
        color: '#f59e0b',
        life: 2.5,
        maxLife: 2.5,
      });
    } else if (soldier.role === 'COMMANDO') {
      // Grenade throw
      detonateExplosion(soldier.x + Math.cos(soldier.angle) * 120, soldier.y + Math.sin(soldier.angle) * 120, 80, 80, 'PLAYER');
    } else if (soldier.role === 'MEDIC') {
      // Emergency team heal
      engineRef.current.soldiers.forEach((s) => s.heal(40));
    }
  };

  // Armory upgrade purchase handler
  const handleUpgrade = (upgradeKey: keyof PlayerProgress['upgrades'], cost: number) => {
    if (progress.valorPoints < cost) return;
    setProgress((prev) => ({
      ...prev,
      valorPoints: prev.valorPoints - cost,
      upgrades: {
        ...prev.upgrades,
        [upgradeKey]: prev.upgrades[upgradeKey] + 1,
      },
    }));
    sound.playCaptureChime();
  };

  const selectedSoldier = engineRef.current.soldiers.find((s) => s.id === selectedSoldierId) || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 select-none">
      {/* 2D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block ${
          currentScreen === 'PLAYING' ? 'cursor-crosshair' : 'pointer-events-none'
        }`}
      />

      {/* Playing Tactical HUD */}
      {currentScreen === 'PLAYING' && (
        <TacticalHUD
          city={engineRef.current.city}
          camera={engineRef.current.camera}
          soldiers={engineRef.current.soldiers}
          enemies={engineRef.current.enemies}
          selectedSoldier={selectedSoldier}
          onSelectSoldier={(s) => setSelectedSoldierId(s.id)}
          valorPoints={valorPoints}
          currentWave={currentWave}
          totalWaves={totalWaves}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((p) => !p)}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            sound.setMuted(next);
          }}
          onToggleMusic={() => {
            const next = !isMusicMuted;
            setIsMusicMuted(next);
            sound.setMusicMuted(next);
          }}
          isMuted={isMuted}
          isMusicMuted={isMusicMuted}
          onOpenCampaign={() => {
            setIsPaused(true);
            setCurrentScreen('CAMPAIGN_MAP');
          }}
          onDeployReinforcement={handleDeployReinforcement}
          onTriggerSupport={(strike) => setActiveTargetingStrike(strike)}
          activeTargetingStrike={activeTargetingStrike}
          onCancelSupport={() => setActiveTargetingStrike(null)}
          onStanceChange={handleStanceChange}
          onManualReload={handleManualReload}
          onTriggerSpecial={handleTriggerSpecial}
        />
      )}

      {/* Strategic Continental Campaign Map Screen */}
      {currentScreen === 'CAMPAIGN_MAP' && (
        <div className="absolute inset-0 z-30 bg-stone-950">
          <CampaignMap
            progress={progress}
            onSelectCity={(cityId) => startMission(cityId)}
            onUpgrade={handleUpgrade}
            onOpenAcademy={() => setCurrentScreen('ACADEMY')}
          />
        </div>
      )}

      {/* Tactical Academy & Controls Guide Screen */}
      {currentScreen === 'ACADEMY' && (
        <div className="absolute inset-0 z-40 bg-stone-950">
          <TacticalAcademy onClose={() => setCurrentScreen('CAMPAIGN_MAP')} />
        </div>
      )}

      {/* Victory / Defeat Mission Summary Modal */}
      {(currentScreen === 'VICTORY' || currentScreen === 'DEFEAT') && summaryData && (
        <MissionSummary
          isVictory={summaryData.isVictory}
          city={engineRef.current.city.mission}
          enemiesNeutralized={summaryData.enemiesNeutralized}
          sectorsCaptured={summaryData.sectorsCaptured}
          valorEarned={summaryData.valorEarned}
          onContinue={() => setCurrentScreen('CAMPAIGN_MAP')}
          onRetry={() => startMission(activeCityId)}
        />
      )}
    </div>
  );
}
