/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CITIES_DATA } from '../world/CityManager.ts';
import { PlayerProgress, CityMission } from '../types.ts';
import { 
  Shield, 
  Crosshair, 
  Users, 
  Heart, 
  Flame, 
  MapPin, 
  Award, 
  Play, 
  CheckCircle2, 
  Lock,
  Zap,
  Info
} from 'lucide-react';

interface CampaignMapProps {
  progress: PlayerProgress;
  onSelectCity: (cityId: string) => void;
  onUpgrade: (upgradeKey: keyof PlayerProgress['upgrades'], cost: number) => void;
  onOpenAcademy: () => void;
}

export const CampaignMap: React.FC<CampaignMapProps> = ({
  progress,
  onSelectCity,
  onUpgrade,
  onOpenAcademy,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('lome');
  const activeCity = CITIES_DATA.find((c) => c.id === selectedCityId) || CITIES_DATA[0];

  const UPGRADES_LIST = [
    {
      key: 'armorLevel' as const,
      name: 'Gilet Kevlar Panafricain',
      desc: '+15% de points de vie maximum pour tous les soldats de l\'escouade.',
      icon: Shield,
      baseCost: 150,
      currentLevel: progress.upgrades.armorLevel,
      maxLevel: 3,
    },
    {
      key: 'weaponCaliber' as const,
      name: 'Munitions Haute Vélocité',
      desc: '+20% de dégâts balistiques et portée de tir accrue.',
      icon: Crosshair,
      baseCost: 180,
      currentLevel: progress.upgrades.weaponCaliber,
      maxLevel: 3,
    },
    {
      key: 'medicalSupplies' as const,
      name: 'Logistique Médicale de Brousse',
      desc: 'Rayon et vitesse de guérison du Médecin augmentés de 30%.',
      icon: Heart,
      baseCost: 140,
      currentLevel: progress.upgrades.medicalSupplies,
      maxLevel: 3,
    },
    {
      key: 'airstrikeSupport' as const,
      name: 'Support Artillerie Lourde',
      desc: 'Réduit le coût des frappes de Mortier et augmente le rayon d\'explosion.',
      icon: Flame,
      baseCost: 200,
      currentLevel: progress.upgrades.airstrikeSupport,
      maxLevel: 3,
    },
  ];

  return (
    <div className="relative w-full h-full overflow-y-auto bg-stone-950 text-stone-100 flex flex-col p-6 max-w-7xl mx-auto">
      {/* Top Title Bar */}
      <header className="flex items-center justify-between border-b border-stone-800 pb-5 mb-6">
        <div>
          <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
            Commandement Central des Forces Tactiques
          </span>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-stone-100 mt-1">
            Opération Libération des Métropoles
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Déployez vos escouades dans les capitales africaines, reprenez les infrastructures stratégiques et sécurisez la population.
          </p>
        </div>

        {/* Commander Identity Card */}
        <div className="flex items-center gap-4 bg-stone-900 border border-stone-800 rounded-xl px-5 py-3 shadow-md">
          <div className="w-11 h-11 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-display text-lg">
            ★
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-stone-200">Commandant {progress.commanderRank}</span>
              <span className="text-xs text-stone-400 font-mono">Niv. {progress.commanderLevel}</span>
            </div>
            <div className="flex items-center gap-4 text-xs mt-1">
              <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                {progress.valorPoints} pts de valeur
              </span>
              <span className="text-stone-400">
                {progress.liberatedCities.length} / {CITIES_DATA.length} villes libérées
              </span>
            </div>
          </div>

          <button
            onClick={onOpenAcademy}
            className="ml-3 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300 transition-colors border border-stone-700"
          >
            Guide Tactique
          </button>
        </div>
      </header>

      {/* Main Grid: African Theater Map + City Intelligence + Armory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* African Tactical Map (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between tactical-grid shadow-xl">
          <div className="flex items-center justify-between z-10 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Carte Stratégique du Continent
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Secteur Sécurisé
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                Secteur Sous Menace
              </span>
            </div>
          </div>

          {/* Africa Tactical Map Graphic with Clickable City Nodes */}
          <div className="relative w-full aspect-[4/3] max-h-[460px] my-auto flex items-center justify-center">
            {/* Continental Silhouette Stylized SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-35 stroke-amber-600/60 fill-stone-800/40">
              <path
                d="M 28 20 C 35 16, 55 15, 68 20 C 78 24, 82 32, 78 40 C 75 46, 82 52, 75 65 C 68 78, 55 90, 48 94 C 44 86, 38 72, 34 62 C 30 54, 20 48, 16 38 C 14 30, 20 22, 28 20 Z"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Regional grid lines */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="#78350f" strokeDasharray="2,2" strokeWidth="0.5" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#78350f" strokeDasharray="2,2" strokeWidth="0.5" />
            </svg>

            {/* City Nodes */}
            {CITIES_DATA.map((city) => {
              const isLiberated = progress.liberatedCities.includes(city.id);
              const isUnlocked = city.unlockedByDefault || isLiberated || progress.liberatedCities.length >= 1;
              const isSelected = city.id === selectedCityId;

              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  style={{ left: `${city.coordinates.x}%`, top: `${city.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 group flex items-center gap-2 ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isLiberated
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                        : isUnlocked
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-stone-900 border-stone-700 text-stone-500'
                    } ${isSelected ? 'ring-4 ring-amber-400/30 shadow-lg' : ''}`}
                  >
                    {isLiberated ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isUnlocked ? (
                      <MapPin className="w-4 h-4 animate-bounce" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  {/* City Label */}
                  <div className="bg-stone-900/90 backdrop-blur-sm border border-stone-800 px-2 py-0.5 rounded text-left">
                    <span className="block font-display font-bold text-xs text-stone-200 group-hover:text-amber-300">
                      {city.name}
                    </span>
                    <span className="block text-[10px] text-stone-400 uppercase font-mono">
                      {city.country}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-500 font-mono mt-3 text-center">
            Sélectionnez une métropole sur la carte pour consulter les rapports de renseignement et déployer vos troupes.
          </div>
        </div>

        {/* Intelligence Briefing & Deploy (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* City Dossier Card */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-amber-500 font-semibold tracking-wider">
                  Dossier de Mission
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                  activeCity.difficulty === 'FACILE' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : activeCity.difficulty === 'MOYEN'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  Difficulté: {activeCity.difficulty}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl text-stone-100">
                {activeCity.name} · {activeCity.country}
              </h2>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                {activeCity.description}
              </p>

              {/* Strategic Objectives */}
              <div className="mt-4 pt-4 border-t border-stone-800">
                <span className="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-2">
                  Points Stratégiques à Conquérir:
                </span>
                <div className="space-y-1.5">
                  {activeCity.capturePoints.map((cp) => (
                    <div key={cp.id} className="flex items-center gap-2 text-xs text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="font-medium">{cp.name}</span>
                      <span className="text-stone-500 font-mono">({cp.type})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="mt-4 flex items-center justify-between text-xs bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400">Prime de Victoire:</span>
                <span className="font-mono font-bold text-amber-400 flex items-center gap-1 text-sm">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  +{activeCity.rewardValor} PTS
                </span>
              </div>
            </div>

            {/* Launch Mission Button */}
            <button
              onClick={() => onSelectCity(activeCity.id)}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-display font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all hover:shadow-amber-500/20 active:scale-[0.99]"
            >
              <Play className="w-5 h-5 fill-stone-950" />
              <span>DÉPLOYER LES TROUPES SUR LE TERRAIN</span>
            </button>
          </div>

          {/* Tactical Armory Upgrades */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-stone-200">
                Armurerie & Améliorations
              </h3>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                {progress.valorPoints} PTS DISPONIBLES
              </span>
            </div>

            <div className="space-y-2 mt-1">
              {UPGRADES_LIST.map((up) => {
                const Icon = up.icon;
                const cost = up.baseCost * (up.currentLevel + 1);
                const isMax = up.currentLevel >= up.maxLevel;
                const canAfford = progress.valorPoints >= cost;

                return (
                  <div
                    key={up.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800 gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-200">{up.name}</span>
                          <span className="text-[10px] font-mono text-stone-400">
                            Niv. {up.currentLevel}/{up.maxLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 line-clamp-1">{up.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onUpgrade(up.key, cost)}
                      disabled={isMax || !canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors shrink-0 ${
                        isMax
                          ? 'bg-stone-800 text-stone-500 cursor-default'
                          : canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                          : 'bg-stone-800 text-stone-500 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {isMax ? 'MAX' : `${cost} PTS`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
