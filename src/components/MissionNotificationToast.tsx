import React from "react";
import { AlertCircle, FolderOpen, Scale, X, Bell, Shield, ChevronRight, FileText } from "lucide-react";
import { Dossier } from "../dossiers";

interface MissionNotificationToastProps {
  dossier: Dossier;
  dossierIndex: number;
  totalDossiers: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenExplorer: () => void;
  onOpenDecision: () => void;
  onOpenPieceMaitresse?: () => void;
}

export const MissionNotificationToast: React.FC<MissionNotificationToastProps> = ({
  dossier,
  dossierIndex,
  totalDossiers,
  isOpen,
  onClose,
  onOpenExplorer,
  onOpenDecision,
  onOpenPieceMaitresse,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="mission-notification-toast"
      className="absolute top-3 right-3 z-40 max-w-md w-[calc(100%-24px)] sm:w-96 font-sans bg-[#ece9d8] border-2 border-[#0055ea] shadow-[0_10px_25px_rgba(0,0,0,0.6)] rounded-t-lg rounded-b-xs overflow-hidden select-none animate-fadeIn"
    >
      {/* EN-TÊTE DE LA NOTIFICATION LUNA BLEU */}
      <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-2.5 py-1 border-b border-[#003399] flex items-center justify-between text-white text-xs font-bold shadow-xs">
        <div className="flex items-center gap-1.5 truncate">
          <span>🔔</span>
          <span className="truncate">Nouvelle Saisine // Dossier {dossierIndex + 1}/{totalDossiers}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-4 h-4 bg-[#d84040] hover:bg-[#f05050] text-white font-bold text-[10px] flex items-center justify-center border border-white/60 cursor-pointer"
          title="Fermer"
        >
          ✕
        </button>
      </div>

      {/* CORPS DE LA MISSION */}
      <div className="p-3 text-xs space-y-2 text-black">
        <div className="flex items-start justify-between gap-2 border-b border-[#9c9a91] pb-1.5">
          <div>
            <div className="text-[10px] text-slate-600 font-bold uppercase">Affaire Contentieuse :</div>
            <div className="text-sm font-bold text-black">
              #{dossier.id.toUpperCase()} — {dossier.profilage.identite}
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white text-black px-1.5 py-0.5 border border-[#808080] shrink-0">
            {dossier.profilage.classeSociale}
          </span>
        </div>

        {/* RÉSUMÉ DES FAITS & MISSION */}
        <div className="text-black leading-relaxed text-xs bg-white p-2 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white shadow-inner">
          <strong className="text-red-900">Faits déclarés : </strong>
          <span className="line-clamp-2">{dossier.faits}</span>
        </div>

        {/* TÉLÉGRAMME / CONSIGNE HIÉRARCHIQUE */}
        {dossier.telegrammePrefet && (
          <div className="bg-[#fff8e7] border border-[#d48c00] p-1.5 text-[11px] text-[#5c4908]">
            <strong className="text-red-900 font-bold uppercase">Consigne Beauvau : </strong>
            « {dossier.telegrammePrefet.ordre} »
          </div>
        )}

        {/* BOUTONS D'AIGUILLAGE DU JOUEUR (XP-BTN) */}
        <div className="pt-1 space-y-1.5">
          {onOpenPieceMaitresse && (
            <button
              type="button"
              onClick={() => {
                onOpenPieceMaitresse();
                onClose();
              }}
              className="w-full xp-btn-blue text-xs font-bold py-1.5 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4 shrink-0 text-white" />
              <span>Consulter le PV Principal</span>
              <span className="text-[9px] bg-white/20 text-white px-1 py-0.2 rounded-none font-mono">
                [ESPACE]
              </span>
            </button>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenExplorer();
                onClose();
              }}
              className="flex-1 xp-btn text-xs font-bold py-1 flex items-center justify-center gap-1 text-slate-800"
            >
              <FolderOpen className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              <span>Explorateur</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenDecision();
                onClose();
              }}
              className="flex-1 xp-btn text-xs font-bold py-1 flex items-center justify-center gap-1 text-slate-800"
            >
              <Scale className="w-3.5 h-3.5 shrink-0 text-blue-700" />
              <span>Qualification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
