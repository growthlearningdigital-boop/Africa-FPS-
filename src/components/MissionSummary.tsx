/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, RotateCcw, ArrowRight, Zap, Target, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CityMission } from '../types.ts';

interface MissionSummaryProps {
  isVictory: boolean;
  city: CityMission;
  enemiesNeutralized: number;
  sectorsCaptured: number;
  valorEarned: number;
  onContinue: () => void;
  onRetry: () => void;
}

export const MissionSummary: React.FC<MissionSummaryProps> = ({
  isVictory,
  city,
  enemiesNeutralized,
  sectorsCaptured,
  valorEarned,
  onContinue,
  onRetry,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Banner Glow */}
        <div 
          className={`absolute top-0 left-0 right-0 h-2 ${
            isVictory ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500' : 'bg-red-600'
          }`}
        />

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border shadow-lg ${
              isVictory 
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400' 
                : 'bg-red-950/80 border-red-500/50 text-red-400'
            }`}
          >
            {isVictory ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-stone-400 font-semibold">
            Rapport d'Engagement Tactique
          </span>
          <h2 className="font-display font-extrabold text-3xl text-stone-100 mt-1">
            {isVictory ? `Libération de ${city.name} Réussie !` : `Repli Stratégique à ${city.name}`}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {isVictory 
              ? `Toutes les infrastructures clés de ${city.name} (${city.country}) ont été sécurisées avec honneur.`
              : `L'escouade a subi de lourdes pertes. Regroupez vos forces et réessayez.`
            }
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-stone-950 p-4 rounded-xl border border-stone-800">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-stone-400 uppercase">Ennemis Neutralisés</span>
            <div className="flex items-center gap-1 text-stone-100 font-mono font-bold text-lg mt-0.5">
              <Target className="w-4 h-4 text-red-400" />
              <span>{enemiesNeutralized}</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center border-x border-stone-800 px-2">
            <span className="text-[10px] text-stone-400 uppercase">Secteurs Sécurisés</span>
            <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold text-lg mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{sectorsCaptured} / {city.capturePoints.length - 1}</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-stone-400 uppercase">Points Gagnés</span>
            <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-lg mt-0.5">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>+{valorEarned}</span>
            </div>
          </div>
        </div>

        {/* Next Step / Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rejouer la mission</span>
          </button>

          <button
            onClick={onContinue}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-colors"
          >
            <span>Continuer la Campagne</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
