/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Soldier } from '../entities/Soldier.ts';
import { Enemy } from '../entities/Enemy.ts';
import { CityManager } from '../world/CityManager.ts';
import { Camera } from '../engine/Camera.ts';
import { UnitRole, UnitStance, SupportStrikeType } from '../types.ts';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Pause, 
  Play, 
  MapPin, 
  Shield, 
  Crosshair, 
  Heart, 
  Zap, 
  Compass,
  Bomb,
  Radio,
  PlusCircle,
  RotateCcw
} from 'lucide-react';

interface TacticalHUDProps {
  city: CityManager;
  camera: Camera;
  soldiers: Soldier[];
  enemies: Enemy[];
  selectedSoldier: Soldier | null;
  onSelectSoldier: (soldier: Soldier) => void;
  valorPoints: number;
  currentWave: number;
  totalWaves: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  isMuted: boolean;
  isMusicMuted: boolean;
  onOpenCampaign: () => void;
  onDeployReinforcement: (role: UnitRole) => void;
  onTriggerSupport: (strike: SupportStrikeType) => void;
  activeTargetingStrike: SupportStrikeType | null;
  onCancelSupport: () => void;
  onStanceChange: (soldier: Soldier, stance: UnitStance) => void;
  onManualReload: (soldier: Soldier) => void;
  onTriggerSpecial: (soldier: Soldier) => void;
}

export const TacticalHUD: React.FC<TacticalHUDProps> = ({
  city,
  camera,
  soldiers,
  enemies,
  selectedSoldier,
  onSelectSoldier,
  valorPoints,
  currentWave,
  totalWaves,
  isPaused,
  onTogglePause,
  onToggleMute,
  onToggleMusic,
  isMuted,
  isMusicMuted,
  onOpenCampaign,
  onDeployReinforcement,
  onTriggerSupport,
  activeTargetingStrike,
  onCancelSupport,
  onStanceChange,
  onManualReload,
  onTriggerSpecial,
}) => {
  const minimapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const liberation = city.getLiberationPercentage();

  // Render Mini-map
  useEffect(() => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mw = city.mission.mapWidth;
    const mh = city.mission.mapHeight;
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, w, h);

    // Roads
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, (750 / mh) * h, w, (140 / mh) * h);
    ctx.fillRect((1150 / mw) * w, 0, (130 / mw) * w, h);

    // Capture points
    for (const cp of city.capturePoints) {
      const cx = (cp.x / mw) * w;
      const cy = (cp.y / mh) * h;
      ctx.fillStyle = cp.owner === 'PLAYER' ? '#22c55e' : '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Enemies (red dots)
    ctx.fillStyle = '#ef4444';
    for (const e of enemies) {
      if (e.hp <= 0) continue;
      const ex = (e.x / mw) * w;
      const ey = (e.y / mh) * h;
      ctx.fillRect(ex - 1.5, ey - 1.5, 3, 3);
    }

    // Player soldiers (bright cyan / green dots)
    for (const s of soldiers) {
      if (s.hp <= 0) continue;
      const sx = (s.x / mw) * w;
      const sy = (s.y / mh) * h;
      ctx.fillStyle = s.isSelected ? '#38bdf8' : '#22c55e';
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Camera viewport box
    const halfVw = (camera.viewportWidth / 2) / camera.zoom;
    const halfVh = (camera.viewportHeight / 2) / camera.zoom;
    const vx = ((camera.x - halfVw) / mw) * w;
    const vy = ((camera.y - halfVh) / mh) * h;
    const vw = ((halfVw * 2) / mw) * w;
    const vh = ((halfVh * 2) / mh) * h;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(vx, vy, vw, vh);

  }, [city, camera, soldiers, enemies]);

  // Mini-map click to pan
  const handleMinimapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = (clickX / canvas.width) * city.mission.mapWidth;
    const targetWorldY = (clickY / canvas.height) * city.mission.mapHeight;

    camera.lookAt(targetWorldX, targetWorldY);
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 z-20">
      {/* Top Header Bar */}
      <header className="pointer-events-auto flex items-center justify-between gap-4 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl px-4 py-2.5 shadow-xl">
        {/* City Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-base text-stone-100 tracking-wide">
                {city.mission.name}
              </h1>
              <span className="text-xs text-stone-400 font-medium">· {city.mission.country}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Libération:</span>
              <div className="w-24 h-2 bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${liberation}%` }}
                />
              </div>
              <span className="font-mono font-semibold text-emerald-400">{liberation}%</span>
            </div>
          </div>
        </div>

        {/* Tactical Metrics */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider">Points de Valeur</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-lg">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>{valorPoints}</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider">Vague Ennemie</span>
            <span className="font-mono font-bold text-stone-200 text-lg">
              {currentWave} <span className="text-stone-500 font-normal text-sm">/ {totalWaves}</span>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider">Escouade</span>
            <span className="font-mono font-bold text-emerald-400 text-lg">
              {soldiers.filter(s => s.hp > 0).length} <span className="text-stone-500 font-normal text-sm">/ 6</span>
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            title={isMusicMuted ? "Activer les rythmes africains" : "Couper la musique"}
            className={`p-2 rounded-lg border transition-colors ${
              !isMusicMuted 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? "Activer les effets sonores" : "Couper les effets"}
            className="p-2 rounded-lg bg-stone-800/80 border border-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onTogglePause}
            title={isPaused ? "Reprendre" : "Pause tactique"}
            className="p-2 rounded-lg bg-stone-800/80 border border-stone-700 text-stone-300 hover:text-stone-100 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCampaign}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white transition-colors"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Carte QG</span>
          </button>
        </div>
      </header>

      {/* Target Strike Alert Banner */}
      {activeTargetingStrike && (
        <div className="pointer-events-auto self-center mt-2 flex items-center gap-3 bg-amber-600/90 border border-amber-400 text-white px-4 py-2 rounded-lg shadow-lg">
          <Bomb className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-semibold">
            {activeTargetingStrike === 'MORTAR' && "Cliquez sur la carte pour cibler le Tir de Mortier"}
            {activeTargetingStrike === 'RECON_FLARE' && "Cliquez sur la carte pour déployer la Fusée Éclairante"}
            {activeTargetingStrike === 'MEDIC_DROP' && "Cliquez sur la carte pour larguer la Caisse Médicale"}
          </span>
          <button
            onClick={onCancelSupport}
            className="ml-2 text-xs bg-black/40 hover:bg-black/60 px-2 py-1 rounded"
          >
            Annuler (Échap)
          </button>
        </div>
      )}

      {/* Bottom Bar: Mini-map + Squad Deck + Selected Soldier */}
      <footer className="pointer-events-auto flex items-end justify-between gap-4">
        {/* Left: Mini-map radar */}
        <div className="flex flex-col gap-1.5 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl p-2 shadow-xl">
          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 font-mono">
            <span>RADAR TACTIQUE</span>
            <span className="text-amber-400">{camera.zoom.toFixed(1)}x</span>
          </div>
          <canvas
            ref={minimapCanvasRef}
            width={160}
            height={120}
            onClick={handleMinimapClick}
            className="rounded-lg border border-stone-800 cursor-crosshair"
            title="Cliquez pour déplacer la vue"
          />
        </div>

        {/* Center: Selected Soldier Card & Stance */}
        {selectedSoldier && selectedSoldier.hp > 0 ? (
          <div className="flex items-center gap-4 bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-xl p-3 shadow-xl max-w-xl">
            {/* Portrait / Badge */}
            <div 
              className="w-14 h-14 rounded-lg flex flex-col items-center justify-center border font-display font-bold text-xl text-white shadow-inner"
              style={{ backgroundColor: selectedSoldier.color, borderColor: selectedSoldier.accentColor }}
            >
              <span>{selectedSoldier.role === 'HERO' ? '★' : selectedSoldier.name[0]}</span>
              <span className="text-[9px] tracking-tight font-sans uppercase text-stone-200">
                {selectedSoldier.role}
              </span>
            </div>

            {/* Vitals */}
            <div className="flex flex-col gap-1.5 min-w-[170px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-100">{selectedSoldier.name}</span>
                <span className="font-mono text-stone-400 text-[11px]">
                  {selectedSoldier.hp}/{selectedSoldier.maxHp} HP
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-200 ${
                    selectedSoldier.hp / selectedSoldier.maxHp > 0.5 ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(selectedSoldier.hp / selectedSoldier.maxHp) * 100}%` }}
                />
              </div>

              {/* Ammo gauge */}
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Munitions:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {selectedSoldier.isReloading ? "Rechargement..." : `${selectedSoldier.ammo}/${selectedSoldier.maxAmmo}`}
                </span>
              </div>
            </div>

            {/* Stance Selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">Posture</span>
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
                {(['AGGRESSIVE', 'DEFENSIVE', 'HOLD'] as UnitStance[]).map((stance) => (
                  <button
                    key={stance}
                    onClick={() => onStanceChange(selectedSoldier, stance)}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      selectedSoldier.stance === stance
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {stance === 'AGGRESSIVE' ? 'Attaque' : stance === 'DEFENSIVE' ? 'Défense' : 'Garde'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions (Reload / Special) */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
              <button
                onClick={() => onManualReload(selectedSoldier)}
                disabled={selectedSoldier.isReloading || selectedSoldier.ammo === selectedSoldier.maxAmmo}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:text-white disabled:opacity-40 transition-colors"
                title="Recharger (R)"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">Recharge</span>
              </button>

              <button
                onClick={() => onTriggerSpecial(selectedSoldier)}
                disabled={!selectedSoldier.canUseSpecial(Date.now())}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-600/50 disabled:opacity-40 transition-colors"
                title="Capacité Spéciale"
              >
                <Zap className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">Spécial</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-400">
            Cliquez sur un soldat pour lui donner des ordres tactiques (Déplacement, Tirs, Postures).
          </div>
        )}

        {/* Right: Reinforcements & Tactical Strikes */}
        <div className="flex flex-col gap-2">
          {/* Support Strikes */}
          <div className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl p-2 shadow-xl">
            <span className="text-[10px] text-stone-400 font-mono uppercase px-1">Appui</span>
            
            <button
              onClick={() => onTriggerSupport('MORTAR')}
              disabled={valorPoints < 150}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-800 text-red-300 hover:bg-red-900/50 disabled:opacity-40 text-xs font-medium transition-colors"
              title="Pilonnage d'artillerie (150 pts)"
            >
              <Bomb className="w-3.5 h-3.5" />
              <span>Mortier (150)</span>
            </button>

            <button
              onClick={() => onTriggerSupport('RECON_FLARE')}
              disabled={valorPoints < 60}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/50 border border-blue-800 text-blue-300 hover:bg-blue-900/50 disabled:opacity-40 text-xs font-medium transition-colors"
              title="Fusée Éclairante de Reconnaissance (60 pts)"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Drone (60)</span>
            </button>

            <button
              onClick={() => onTriggerSupport('MEDIC_DROP')}
              disabled={valorPoints < 90}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/50 disabled:opacity-40 text-xs font-medium transition-colors"
              title="Largage de caisse de soins (90 pts)"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Soins (90)</span>
            </button>
          </div>

          {/* Reinforcements Recruitment Deck */}
          <div className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl p-2 shadow-xl">
            <span className="text-[10px] text-stone-400 font-mono uppercase px-1">Renforts</span>

            <button
              onClick={() => onDeployReinforcement('COMMANDO')}
              disabled={valorPoints < 80 || soldiers.length >= 6}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium disabled:opacity-40 transition-colors"
            >
              + Voltigeur (80)
            </button>

            <button
              onClick={() => onDeployReinforcement('SNIPER')}
              disabled={valorPoints < 120 || soldiers.length >= 6}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium disabled:opacity-40 transition-colors"
            >
              + Sniper (120)
            </button>

            <button
              onClick={() => onDeployReinforcement('HEAVY')}
              disabled={valorPoints < 140 || soldiers.length >= 6}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium disabled:opacity-40 transition-colors"
            >
              + Lourd (140)
            </button>

            <button
              onClick={() => onDeployReinforcement('MEDIC')}
              disabled={valorPoints < 100 || soldiers.length >= 6}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium disabled:opacity-40 transition-colors"
            >
              + Médecin (100)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
