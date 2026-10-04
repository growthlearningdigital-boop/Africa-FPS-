/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MousePointer, Crosshair, Shield, Users, Radio, Zap, ArrowLeft } from 'lucide-react';

interface TacticalAcademyProps {
  onClose: () => void;
}

export const TacticalAcademy: React.FC<TacticalAcademyProps> = ({ onClose }) => {
  return (
    <div className="relative w-full h-full overflow-y-auto bg-stone-950 text-stone-100 flex flex-col p-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-stone-100">
              Académie Tactique Afro RTS 2D
            </h1>
            <p className="text-xs text-stone-400">
              Manuel d'instruction pour la prise en main des unités et la libération des métropoles
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs font-mono transition-colors"
        >
          RETOUR AU COMMANDEMENT
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {/* Commandes Fondamentales */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 text-amber-400 mb-3">
            <MousePointer className="w-5 h-5" />
            <h2 className="font-display font-bold text-lg text-stone-100">Commandes & Déplacement</h2>
          </div>
          <ul className="space-y-3 text-xs text-stone-300">
            <li className="flex items-start gap-2">
              <span className="font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300 shrink-0">Clic Gauche</span>
              <span>Sélectionne une unité ou ordonne un déplacement immédiat vers la position ciblée.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300 shrink-0">Espace</span>
              <span>Déclenche le tir direct de l'Alpha Commandant vers la position de la souris.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300 shrink-0">Clic Droit</span>
              <span>Ordre d'attaque forcé ou tir tactique ciblé sur un ennemi.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300 shrink-0">R</span>
              <span>Recharge l'arme de l'unité activement sélectionnée.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300 shrink-0">Molette</span>
              <span>Zoom et dézoom de la caméra aérienne RTS (de 0.7x à 1.5x).</span>
            </li>
          </ul>
        </div>

        {/* Classes d'Unités */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 text-emerald-400 mb-3">
            <Users className="w-5 h-5" />
            <h2 className="font-display font-bold text-lg text-stone-100">Escouade & Spécialités</h2>
          </div>
          <div className="space-y-3 text-xs text-stone-300">
            <div>
              <span className="font-bold text-amber-400">Alpha Commandant :</span> Chef d'escouade polyvalent, fusil d'assaut lourd et capacité de Ralliement Héroïque qui stimule les alliés.
            </div>
            <div>
              <span className="font-bold text-emerald-400">Voltigeur (Commando) :</span> Unité d'assaut véloce, cadence de tir élevée au corps-à-corps, idéal pour nettoyer les marchés.
            </div>
            <div>
              <span className="font-bold text-sky-400">Tireur d'Élite (Sniper) :</span> Portée extrême et munitions perforantes capables d'éliminer les chefs ennemis à distance.
            </div>
            <div>
              <span className="font-bold text-amber-500">Soutien Mitrailleur :</span> Mitrailleuse lourde capable d'arrêter les vagues d'ennemis et d'endommager les pick-up blindés.
            </div>
            <div>
              <span className="font-bold text-blue-400">Médecin de Terrain :</span> Génère une aura de soins automatique pour régénérer la santé des soldats à proximité.
            </div>
          </div>
        </div>

        {/* Objectifs de Conquête */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 text-sky-400 mb-3">
            <Radio className="w-5 h-5" />
            <h2 className="font-display font-bold text-lg text-stone-100">Points de Contrôle & Victoire</h2>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-3">
            Pour libérer chaque métropole, stationnez vos troupes à l'intérieur des cercles de capture (QG, Stations Radio, Dépôts de Munitions, Postes Médicaux).
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>Cercle Vert : Infrastructure sous contrôle des forces alliées.</span>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <span>Cercle Rouge : Zone tenue par les insurgés et seigneurs de guerre.</span>
            </div>
          </div>
        </div>

        {/* Frappes Tactiques & Appui */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 text-rose-400 mb-3">
            <Zap className="w-5 h-5" />
            <h2 className="font-display font-bold text-lg text-stone-100">Appui Tactique & Points de Valeur</h2>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-3">
            Chaque ennemi neutralisé et chaque zone capturée octroie des Points de Valeur utilisables en temps réel :
          </p>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>• <strong className="text-stone-100">Mortier (150 pts) :</strong> Pilonnage dévastateur sur un groupe d'ennemis ou un pick-up blindé.</li>
            <li>• <strong className="text-stone-100">Drone Recon (60 pts) :</strong> Révèle les positions ennemies dans tout le secteur.</li>
            <li>• <strong className="text-stone-100">Ravitaillement Médical (90 pts) :</strong> Soigne immédiatement les blessés de votre escouade.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
