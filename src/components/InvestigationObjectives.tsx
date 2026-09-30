import React from "react";
import {
  FolderSearch,
  Database,
  Video,
  FileBadge,
  Highlighter,
  Stamp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Coffee,
  Sparkles,
  Search
} from "lucide-react";
import { Dossier } from "../dossiers";

interface InvestigationObjectivesProps {
  dossier: Dossier;
  discoveredFilesCount: number;
  totalCaseFiles: number;
  tajConsulted: boolean;
  cameraDecision: "neutralisee" | "conservee" | null;
  cameraNeutralisee: boolean;
  hasIncidentCamera: boolean;
  rioDecision: "flouter" | "valider" | null;
  hasRio: boolean;
  caviardagesCount: number;
  totalCaviardages: number;
  substitutionFaite: boolean;
  hasSubstitution: boolean;
  activeStampCorrect: boolean;
  isAwaitingNext: boolean;
  onOpenExplorer: () => void;
  onOpenApp: (appId: string) => void;
  onToggleNotes: () => void;
  notesOuvertes: boolean;
}

export const InvestigationObjectives: React.FC<InvestigationObjectivesProps> = ({
  dossier,
  discoveredFilesCount,
  totalCaseFiles,
  tajConsulted,
  cameraDecision,
  cameraNeutralisee,
  hasIncidentCamera,
  rioDecision,
  hasRio,
  caviardagesCount,
  totalCaviardages,
  substitutionFaite,
  hasSubstitution,
  activeStampCorrect,
  isAwaitingNext,
  onOpenExplorer,
  onOpenApp,
  onToggleNotes,
  notesOuvertes,
}) => {
  const piecesExamined = discoveredFilesCount >= 2;
  const cctvSettled = !hasIncidentCamera || Boolean(cameraDecision) || cameraNeutralisee;
  const rioSettled = !hasRio || Boolean(rioDecision);

  return (
    <div className="bg-[#030914] border-b-2 border-[#0284c7] px-2.5 sm:px-4 py-2 flex flex-col gap-1.5 shrink-0 select-none font-mono shadow-md">
      
      {/* LIGNE 1 : TITRE DE L'ENQUÊTE & ACCÈS DIRECTS */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#0284c7] text-white px-2 py-0.5 font-black text-xs uppercase flex items-center gap-1 shadow">
            <Search className="w-3.5 h-3.5" />
            <span>ENQUÊTE FORENSIQUE</span>
          </span>
          <span className="text-white font-bold truncate">
            AFFAIRE #{dossier.id} : <strong className="text-sky-300">{dossier.profilage.identite}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={onToggleNotes}
            className={`px-2 py-0.5 border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              notesOuvertes
                ? "bg-amber-400 text-black border-white font-black"
                : "bg-[#181103] border-amber-500/70 text-amber-300 hover:bg-[#2e2004]"
            }`}
          >
            <Coffee className="w-3 h-3 text-amber-400" />
            <span>MÉMOS & CAFÉ</span>
          </button>
        </div>
      </div>

      {/* LIGNE 2 : OBJECTIFS INTERACTIFS À ACCOMPLIR PAR NAVIGATION */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 text-[11px]">
        
        {/* 1. PIÈCES ET RAPPORTS DU DOSSIER */}
        <button
          type="button"
          onClick={onOpenExplorer}
          className={`px-2 py-1 border text-left flex items-center gap-1.5 transition-all cursor-pointer truncate ${
            piecesExamined
              ? "bg-[#032415] border-[#00ff66] text-[#00ff66]"
              : "bg-[#051322] border-[#0284c7]/60 text-sky-200 hover:bg-[#09223d]"
          }`}
          title="Ouvrir l'explorateur pour lire les pièces de procédure"
        >
          {piecesExamined ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
          ) : (
            <FolderSearch className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          )}
          <span className="truncate font-bold">1. Pièces ({discoveredFilesCount})</span>
        </button>

        {/* 2. BASE TAJ / ANTECEDENTS */}
        <button
          type="button"
          onClick={() => onOpenApp("humandb")}
          className={`px-2 py-1 border text-left flex items-center gap-1.5 transition-all cursor-pointer truncate ${
            tajConsulted
              ? "bg-[#032415] border-[#00ff66] text-[#00ff66]"
              : "bg-[#031d2e] border-cyan-600/70 text-cyan-200 hover:bg-[#06334a]"
          }`}
          title="Consulter les antécédents de l'administré sur le TAJ"
        >
          {tajConsulted ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
          ) : (
            <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          )}
          <span className="truncate font-bold">2. Fichier TAJ</span>
        </button>

        {/* 3. FLUX VIDEO CCTV */}
        <button
          type="button"
          onClick={() => onOpenApp("video")}
          className={`px-2 py-1 border text-left flex items-center gap-1.5 transition-all cursor-pointer truncate ${
            cctvSettled
              ? "bg-[#032415] border-[#00ff66] text-[#00ff66]"
              : "bg-[#1f0b0b] border-red-500 text-rose-200 hover:bg-[#381212] animate-pulse"
          }`}
          title="Examiner la vidéo CSU et trancher la défaillance SD"
        >
          {cctvSettled ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
          ) : (
            <Video className="w-3.5 h-3.5 text-red-400 shrink-0" />
          )}
          <span className="truncate font-bold">3. Vidéo CCTV</span>
        </button>

        {/* 4. MATRICULE RIO */}
        <button
          type="button"
          onClick={() => onOpenApp("rio")}
          className={`px-2 py-1 border text-left flex items-center gap-1.5 transition-all cursor-pointer truncate ${
            rioSettled
              ? "bg-[#032415] border-[#00ff66] text-[#00ff66]"
              : "bg-[#1a1204] border-amber-500 text-amber-200 hover:bg-[#302107]"
          }`}
          title="Contrôler le port du RIO et arbitrer le flou"
        >
          {rioSettled ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
          ) : (
            <FileBadge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span className="truncate font-bold">4. RIO Agent</span>
        </button>

        {/* 5. CENSURE & SCELLES */}
        <button
          type="button"
          onClick={() => onOpenApp(hasSubstitution ? "scelles" : "caviardeur")}
          className={`px-2 py-1 border text-left flex items-center gap-1.5 transition-all cursor-pointer truncate ${
            caviardagesCount > 0 || substitutionFaite
              ? "bg-[#032415] border-[#00ff66] text-[#00ff66]"
              : "bg-[#140b28] border-purple-500/70 text-purple-200 hover:bg-[#251547]"
          }`}
          title="Biffer les lésions au marqueur ou substituer les scellés"
        >
          {caviardagesCount > 0 || substitutionFaite ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
          ) : (
            <Highlighter className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          )}
          <span className="truncate font-bold">5. Censure/Scellés</span>
        </button>

        {/* 6. VISA DE QUALIFICATION */}
        <button
          type="button"
          onClick={() => onOpenApp("qualification")}
          className={`px-2 py-1 border text-left flex items-center gap-1.5 transition-all cursor-pointer truncate ${
            isAwaitingNext || activeStampCorrect
              ? "bg-[#00ff66] border-white text-black font-black"
              : "bg-[#032313] border-[#00ff66]/70 text-[#00ff66] hover:bg-[#06381e]"
          }`}
          title="Apposer le visa de qualification juridique réglementaire"
        >
          {isAwaitingNext ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
          ) : (
            <Stamp className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
          )}
          <span className="truncate font-bold">6. Visa Juridique</span>
        </button>

      </div>

    </div>
  );
};
