import React from "react";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Fingerprint,
  Camera,
  Stamp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileCheck,
  FileSearch,
  PenTool,
  Terminal
} from "lucide-react";
import { Dossier } from "../dossiers";

interface ProceduralWorkflowBarProps {
  dossier: Dossier;
  rioInspecte: boolean;
  riposteDeclenchee: boolean;
  cameraNeutralisee: boolean;
  hasIncidentCamera: boolean;
  caviardagesFaits: number;
  totalCaviardages: number;
  substitutionFaite: boolean;
  hasSubstitution: boolean;
  activeStampCorrect: boolean;
  isAwaitingNext: boolean;
  onToggleNotes: () => void;
  notesOuvertes: boolean;
}

export const ProceduralWorkflowBar: React.FC<ProceduralWorkflowBarProps> = ({
  dossier,
  rioInspecte,
  riposteDeclenchee,
  cameraNeutralisee,
  hasIncidentCamera,
  caviardagesFaits,
  totalCaviardages,
  substitutionFaite,
  hasSubstitution,
  activeStampCorrect,
  isAwaitingNext,
  onToggleNotes,
  notesOuvertes,
}) => {
  // Étape 1 : Signalement
  const etape1Complete = rioInspecte || riposteDeclenchee;
  
  // Étape 2 : Assainissement forensique
  const cameraOk = !hasIncidentCamera || cameraNeutralisee;
  const caviardageOk = totalCaviardages === 0 || caviardagesFaits > 0;
  const substitutionOk = !hasSubstitution || substitutionFaite;
  const etape2Complete = cameraOk && (caviardageOk || substitutionOk || !hasIncidentCamera);

  // Étape 3 : Visa
  const etape3Complete = activeStampCorrect || isAwaitingNext;

  return (
    <div className="bg-[#031525] border-2 border-[#0284c7] p-2.5 mb-2.5 shadow-xl rounded-xs flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs select-none">
      
      {/* FIL D'ARIANE DES 3 ÉTAPES PROCÉDURALES */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="text-slate-400 font-black text-[10px] sm:text-xs uppercase tracking-widest hidden md:inline">
          WORKFLOW OPJ :
        </span>

        {/* ÉTAPE 1 */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border transition-all ${
            etape1Complete
              ? "bg-[#052918] border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              : "bg-[#051a2d] border-[#0284c7]/60 text-sky-200"
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
            etape1Complete ? "bg-emerald-500 text-black" : "bg-[#0284c7] text-white"
          }`}>
            {etape1Complete ? "✓" : "1"}
          </div>
          <div className="leading-tight">
            <div className="font-black text-[11px] uppercase">1. SIGNALEMENT</div>
            <div className="text-[9px] text-slate-300">
              {rioInspecte ? "RIO vérifié" : "Contrôler RIO"}
            </div>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />

        {/* ÉTAPE 2 */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border transition-all ${
            etape2Complete
              ? "bg-[#052918] border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              : "bg-[#051a2d] border-[#0284c7]/60 text-sky-200"
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
            etape2Complete ? "bg-emerald-500 text-black" : "bg-[#0284c7] text-white"
          }`}>
            {etape2Complete ? "✓" : "2"}
          </div>
          <div className="leading-tight">
            <div className="font-black text-[11px] uppercase">2. ASSAINISSEMENT</div>
            <div className="text-[9px] text-slate-300">
              {caviardagesFaits > 0
                ? `${caviardagesFaits} biffés`
                : hasIncidentCamera && !cameraNeutralisee
                ? "Arbitrage CCTV"
                : "Purge & Scellés"}
            </div>
          </div>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />

        {/* ÉTAPE 3 */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border transition-all ${
            etape3Complete
              ? "bg-[#052918] border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              : "bg-[#051a2d] border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
            etape3Complete ? "bg-emerald-500 text-black" : "bg-amber-400 text-black animate-pulse"
          }`}>
            {etape3Complete ? "✓" : "3"}
          </div>
          <div className="leading-tight">
            <div className="font-black text-[11px] uppercase">3. VISA DOCTRINAL</div>
            <div className="text-[9px] text-slate-300">
              {etape3Complete ? "Dossier clôturé" : "Apposer [1], [2] ou [3]"}
            </div>
          </div>
        </div>
      </div>

      {/* BOUTON DIRECTIVES DU MAJOR & INTRANET DU POSTE */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleNotes}
          className={`px-3 py-1 text-xs font-black border flex items-center gap-1.5 cursor-pointer transition-all rounded-xs shadow ${
            notesOuvertes
              ? "bg-[#0284c7] text-white border-white shadow-[0_0_12px_rgba(2,132,199,0.5)]"
              : "bg-[#06182c] border-sky-400 text-sky-300 hover:bg-[#0c2948]"
          }`}
        >
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>{notesOuvertes ? "MASQUER LES DIRECTIVES" : "📋 DIRECTIVES DU MAJOR & INTRANET"}</span>
        </button>
      </div>

    </div>
  );
};
