import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Video,
  ShieldCheck,
  FileBadge,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Scale,
  Database,
  ExternalLink,
  Flame,
  Zap,
  Info
} from "lucide-react";
import { Dossier } from "../dossiers";
import { soundFx } from "../services/soundFx";

export interface CaseMissionChecklistProps {
  dossier: Dossier;
  dossierIndex: number;
  totalDossiers: number;
  discoveredFilesCount: number;
  tajConsulted: boolean;
  cameraDecision: "neutralisee" | "conservee" | null;
  cameraNeutralisee: boolean;
  rioDecision: "flouter" | "valider" | null;
  caviardagesFaitsCount: number;
  substitutionFaite: boolean;
  isAwaitingNext: boolean;
  activeStampCorrect: boolean;
  onFocusWindow: (id: string) => void;
  onNavigateToPath: (path: string) => void;
  onOpenApp: (appId: string) => void;
  onOpenPieceMaitresse?: () => void;
}

export const CaseMissionChecklist: React.FC<CaseMissionChecklistProps> = ({
  dossier,
  dossierIndex,
  totalDossiers,
  discoveredFilesCount,
  tajConsulted,
  cameraDecision,
  cameraNeutralisee,
  rioDecision,
  caviardagesFaitsCount,
  substitutionFaite,
  isAwaitingNext,
  activeStampCorrect,
  onFocusWindow,
  onNavigateToPath,
  onOpenApp,
  onOpenPieceMaitresse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // État des 4 piliers de conformité de l'affaire
  const piecesCheck = discoveredFilesCount >= 2;
  const tajCheck = tajConsulted;
  const cameraCheck = !dossier.incidentCamera || Boolean(cameraDecision) || cameraNeutralisee;
  const rioCheck = !dossier.statutRio || Boolean(rioDecision);
  const censureCheck = (!dossier.termesCaviardes || dossier.termesCaviardes.length === 0) || caviardagesFaitsCount > 0;
  const scelleCheck = !dossier.pieceASubstituer || substitutionFaite;

  // Calcul du taux d'immunité blindée du dossier
  const totalSteps = 4;
  let validatedSteps = 0;
  if (piecesCheck) validatedSteps++;
  if (tajCheck) validatedSteps++;
  if (cameraCheck) validatedSteps++;
  if (rioCheck && censureCheck && scelleCheck) validatedSteps++;

  const isDossierBlindagePret = validatedSteps === totalSteps;

  return (
    <div className="bg-[#ece9d8] border-b-2 border-[#9c9a91] px-3 py-1 font-sans text-black select-none shadow-xs shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* TITRE DE SAISINE ET BADGE DE PROGRESSION DU DOSSIER */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 bg-[#0055ea] text-white px-2.5 py-0.5 font-bold text-xs uppercase shadow-xs rounded-none shrink-0">
            <Scale className="w-3.5 h-3.5" />
            <span>DOSSIER #{dossier.id} ({dossierIndex + 1}/{totalDossiers})</span>
          </div>

          <div className="truncate">
            <span className="text-[#003366] font-bold text-xs sm:text-sm">{dossier.profilage.identite}</span>
            <span className="text-slate-600 text-xs hidden sm:inline ml-2 font-medium">
              — {dossier.faits.slice(0, 65)}...
            </span>
          </div>
        </div>

        {/* JAUGE DE PRÉPARATION DOCTRINALE (BLINDAGE JURIDIQUE) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-white border border-[#7f9db9] px-2 py-0.5 rounded-none shadow-inner">
            <ShieldCheck className={`w-3.5 h-3.5 ${isDossierBlindagePret ? "text-emerald-600" : "text-amber-600"}`} />
            <span className="text-xs text-slate-700 font-bold">CONFORMITÉ :</span>
            <span className={`font-bold text-xs ${isDossierBlindagePret ? "text-emerald-700" : "text-amber-700"}`}>
              {validatedSteps}/{totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playUiClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="xp-btn py-0.5 px-1.5 flex items-center justify-center text-black"
            title={isCollapsed ? "Déplier la feuille de route" : "Replier"}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* FEUILLE DE ROUTE DÉPLIÉE : LES 4 ACTIONS PRIORITAIRES DE CLASSEMENT SANS SUITE */}
      {!isCollapsed && (
        <div className="mt-1.5 pt-1.5 border-t border-[#b8b4a6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          
          {/* 1. ÉTUDE DES PIÈCES & CONSTAT MÉDICAL */}
          <div
            onClick={() => {
              soundFx.playUiClick();
              if (onOpenPieceMaitresse) {
                onOpenPieceMaitresse();
              } else {
                onNavigateToPath(`/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${dossier.id}`);
                onFocusWindow("explorer");
              }
            }}
            className={`p-1.5 border text-left cursor-pointer flex items-center justify-between gap-1.5 transition-colors shadow-xs ${
              piecesCheck
                ? "bg-[#e8f8f0] border-[#2e7d32] text-[#1b5e20]"
                : "bg-white border-[#7f9db9] text-black hover:bg-[#f0f4f9]"
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {piecesCheck ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
              )}
              <div className="truncate">
                <span className="font-bold text-xs">1. Pièces & Rapports</span>
                <span className="text-[10px] text-slate-600 block truncate">
                  {piecesCheck ? "Procédure examinée" : "Lire PV [ESPACE]"}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#003366] font-bold shrink-0 bg-[#e4efff] px-1 py-0.2 border border-[#7f9db9]">
              [ESPACE]
            </span>
          </div>

          {/* 2. BASE TAJ / CASIER */}
          <div
            onClick={() => {
              soundFx.playUiClick();
              onFocusWindow("humandb");
            }}
            className={`p-1.5 border text-left cursor-pointer flex items-center justify-between gap-1.5 transition-colors shadow-xs ${
              tajCheck
                ? "bg-[#e8f8f0] border-[#2e7d32] text-[#1b5e20]"
                : "bg-white border-[#7f9db9] text-black hover:bg-[#f0f4f9]"
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {tajCheck ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Database className="w-3.5 h-3.5 text-[#0055ea] shrink-0" />
              )}
              <div className="truncate">
                <span className="font-bold text-xs">2. Fichier TAJ</span>
                <span className="text-[10px] text-slate-600 block truncate">
                  {tajCheck ? "Antécédents confirmés" : "Vérifier la dangerosité"}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-[#0055ea] font-bold shrink-0">↗</span>
          </div>

          {/* 3. ARBITRAGE VIDÉO CCTV */}
          <div
            onClick={() => {
              soundFx.playUiClick();
              onFocusWindow("video");
            }}
            className={`p-1.5 border text-left cursor-pointer flex items-center justify-between gap-1.5 transition-colors shadow-xs ${
              cameraCheck
                ? "bg-[#e8f8f0] border-[#2e7d32] text-[#1b5e20]"
                : "bg-[#ffebee] border-[#c00000] text-[#990000] hover:bg-[#ffd5d8] animate-pulse"
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {cameraCheck ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Video className="w-3.5 h-3.5 text-red-600 shrink-0" />
              )}
              <div className="truncate">
                <span className="font-bold text-xs">3. Vidéo CCTV</span>
                <span className="text-[10px] text-slate-600 block truncate">
                  {cameraCheck ? "Flux conforme/purgé" : "Incident carte SD à trancher"}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-red-600 font-bold shrink-0">↗</span>
          </div>

          {/* 4. VISA DE QUALIFICATION FINALE */}
          <div
            onClick={() => {
              soundFx.playUiClick();
              onFocusWindow("qualification");
            }}
            className={`p-1.5 border text-left cursor-pointer flex items-center justify-between gap-1.5 transition-colors shadow-xs ${
              activeStampCorrect
                ? "bg-[#e8f8f0] border-[#2e7d32] text-[#1b5e20]"
                : isAwaitingNext
                ? "bg-[#fff8e8] border-[#cc9900] text-[#664400]"
                : "bg-white border-[#7f9db9] text-black hover:bg-[#f0f4f9]"
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {activeStampCorrect ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Scale className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              )}
              <div className="truncate">
                <span className="font-bold text-xs">4. Visa Contentieux</span>
                <span className="text-[10px] text-slate-600 block truncate">
                  {isAwaitingNext ? "Homologué ➔ Passer" : activeStampCorrect ? "Qualification validée" : isDossierBlindagePret ? "Prêt à être visé !" : "Étayer le dossier"}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold shrink-0">➔</span>
          </div>

        </div>
      )}
    </div>
  );
};
