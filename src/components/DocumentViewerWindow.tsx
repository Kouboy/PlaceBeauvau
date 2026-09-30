import React, { useState } from "react";
import {
  FileText,
  Printer,
  Shield,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Highlighter,
  Trash2,
  Sparkles,
  Share2,
  ArrowRight
} from "lucide-react";
import { VirtualFile } from "../fileSystem";
import { Dossier, TermeCaviarde } from "../dossiers";
import { soundFx } from "../services/soundFx";

interface DocumentViewerWindowProps {
  file: VirtualFile;
  dossier: Dossier;
  caviardagesFaits: Set<string>;
  caviardagesErreurs: Set<string>;
  onCaviarderTerme: (terme: TermeCaviarde) => void;
  onCaviarderTout?: () => void;
  onOpenQualification: () => void;
  onClose: () => void;
}

export const DocumentViewerWindow: React.FC<DocumentViewerWindowProps> = ({
  file,
  dossier,
  caviardagesFaits,
  caviardagesErreurs,
  onCaviarderTerme,
  onCaviarderTout,
  onOpenQualification,
  onClose,
}) => {
  const [caviardageMode, setCaviardageMode] = useState<boolean>(true);
  const isMedicalReport = file.name.includes("RAPPORT_MEDICO_LEGAL") || file.name.includes("03_");
  const isPvInterpellation = file.name.includes("PV_SYNTHESE") || file.name.includes("01_");
  const hasCaviardages = Boolean(dossier.termesCaviardes && dossier.termesCaviardes.length > 0);

  // Classification colors
  const getStampColor = (classification: string) => {
    switch (classification) {
      case "SECRET DÉFENSE":
        return "border-red-600 text-red-500 bg-red-950/40";
      case "CONFIDENTIEL":
        return "border-amber-500 text-amber-400 bg-amber-950/40";
      case "PIÈCE SOUS SCELLÉ":
        return "border-purple-500 text-purple-400 bg-purple-950/40";
      default:
        return "border-sky-500 text-sky-400 bg-sky-950/40";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-sans text-black select-none overflow-hidden">
      
      {/* BANDEAU SUPÉRIEUR DU VISUALISEUR WIN32 (STYLE WORPAD / ACROBAT XP) */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 py-1 flex items-center justify-between shrink-0 text-xs shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 bg-[#d4d0c8] border border-[#808080] flex items-center justify-center text-black text-xs font-bold shadow-xs">
            📄
          </div>
          <span className="font-bold text-black text-xs sm:text-sm truncate">
            {file.name}
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 border uppercase ${getStampColor(file.classification)} shrink-0`}>
            {file.classification}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="text-slate-600 hidden sm:inline">{file.date}</span>
          <span className="text-[10px] text-slate-800 bg-white px-2 py-0.5 border border-[#808080] font-mono">
            {file.size}
          </span>
        </div>
      </div>

      {/* SOUS-BARRE D'OUTILS SPÉCIFIQUES (FEUTRE NOIR / CAVIARDAGE MINISTÉRIEL) */}
      {isMedicalReport && hasCaviardages && (
        <div className="bg-[#fff8e7] border-b border-[#d48c00] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 shadow-inner">
          <div className="flex items-center gap-2">
            <Highlighter className="w-4 h-4 text-amber-700 animate-pulse" />
            <span className="text-amber-900 font-bold text-xs uppercase">
              CRAYON DE CAVIARDAGE OFFICIEL :
            </span>
            <span className="text-slate-700 text-[11px] hidden sm:inline">
              Biffez directement les lésions pour aligner le constat sur la version policière (+20€/biffage).
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onCaviarderTout && (
              <button
                type="button"
                onClick={onCaviarderTout}
                className="xp-btn text-rose-900 font-bold flex items-center gap-1"
              >
                <span>🖍️ Tout caviarder</span>
              </button>
            )}
            <span className="bg-white px-2 py-0.5 border border-[#808080] text-black text-xs font-bold">
              Biffages : <strong className="text-emerald-700">{caviardagesFaits.size}</strong> / {dossier.termesCaviardes?.length || 0}
            </span>
          </div>
        </div>
      )}

      {/* FEUILLE DU DOCUMENT : FOND GRIS BUREAU ET FEUILLE PAPIER CONTRASTÉE */}
      <div
        onWheel={() => soundFx.playScrollTick()}
        className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#687a8a] flex justify-center border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white m-1"
      >
        
        <div className="w-full max-w-3xl bg-[#ffffff] border border-[#555] p-5 sm:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-mono text-black flex flex-col gap-4 relative">
          
          {/* SCEAU TAMPONNÉ EN ARRIÈRE-PLAN */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 border-4 border-red-700 text-red-700 font-black text-xs sm:text-sm px-3 py-1.5 transform rotate-6 uppercase tracking-widest pointer-events-none select-none opacity-85">
            {file.classification} // ARCHIVAGE BEAUVAU
          </div>

          {/* EN-TÊTE OFFICIEL DE LA RÉPUBLIQUE */}
          <div className="border-b-2 border-black pb-3">
            <div className="text-xs font-black tracking-widest text-[#003366] uppercase flex items-center gap-2">
              <span>🇫🇷</span>
              <span>RÉPUBLIQUE FRANÇAISE // MINISTÈRE DE L'INTÉRIEUR</span>
            </div>
            <div className="text-[11px] text-slate-700 uppercase font-bold mt-0.5">
              DIRECTION GÉNÉRALE DE LA POLICE NATIONALE // DÉPARTEMENT DU CONTENTIEUX
            </div>
            <div className="text-sm sm:text-base font-black text-black mt-2 font-sans">
              {file.titre}
            </div>
            <div className="text-xs text-slate-700 mt-0.5">
              Émetteur : <span className="font-bold text-[#003366]">{file.auteur}</span> | Date : {file.date}
            </div>
          </div>

          {/* TEXTE PRINCIPAL DU DOCUMENT (CADRE RÉTRO EFFET PAPIER TAMPONNÉ) */}
          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono text-slate-900 bg-[#faf8f5] p-3 sm:p-4 border border-[#cfc6b0] shadow-inner">
            {file.content}
          </div>

          {/* GROUPBOX DE CAVIARDAGE SUR LE RAPPORT MÉDICAL */}
          {isMedicalReport && dossier.termesCaviardes && dossier.termesCaviardes.length > 0 && (
            <fieldset className="mt-2 border-2 border-[#b45309] bg-[#fffbf2] p-3 sm:p-4 shadow-xs">
              <legend className="text-xs font-bold text-amber-950 px-2 uppercase bg-amber-200 border border-[#b45309]">
                📋 CONSTATATIONS MÉDICO-LÉGALES À ARBITRER (CLIQUER POUR BIFFER AU MARQUEUR)
              </legend>

              <div className="space-y-2 mt-1">
                {dossier.termesCaviardes.map((terme, index) => {
                  const estCaviarde = caviardagesFaits.has(terme.id);
                  const estErreur = caviardagesErreurs.has(terme.id);

                  return (
                    <div
                      key={terme.id}
                      onClick={() => onCaviarderTerme(terme)}
                      className={`p-2.5 border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                        estCaviarde
                          ? estErreur
                            ? "bg-[#fee2e2] border-red-700 text-red-950"
                            : "bg-[#e2e8f0] border-slate-600 text-slate-700"
                          : "bg-white hover:bg-[#fff9eb] border-[#b45309] text-slate-900 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#ece9d8] border border-[#808080] text-black text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>

                        <div>
                          {estCaviarde ? (
                            <span className="bg-black text-black px-2 py-0.5 border border-black select-none font-black tracking-widest line-through">
                              ████████████████████
                            </span>
                          ) : (
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              « {terme.texteBrut} »
                            </span>
                          )}
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            Diagnostic : {terme.motifCensure}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {estCaviarde ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                            estErreur ? "bg-red-800 border-red-950 text-white" : "bg-emerald-800 border-emerald-950 text-white"
                          }`}>
                            {estErreur ? "⚠️ FAUTE DE ZELE" : "✓ CAVIARDÉ"}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="xp-btn text-[10px] font-bold flex items-center gap-1"
                          >
                            <span>🖍️ Biffer au marqueur</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* PIED DE DOCUMENT AVEC AVIS JURIDIQUE ET TRANSITION QUALIFICATION */}
          <div className="mt-3 pt-3 border-t-2 border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-600 text-[11px] font-bold">
              CERTIFIÉ CONFORME À LA MINUTE // DIFFUSION ADMINISTRATIVE STRICTE
            </div>

            <button
              type="button"
              onClick={onOpenQualification}
              className="xp-btn-blue text-xs font-bold flex items-center gap-2"
            >
              <span>Appliquer le Visa de Qualification</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>

      </div>

      {/* BAS DU LECTEUR (BARRE D'ÉTAT WIN32) */}
      <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-2 py-0.5 flex items-center justify-between text-[11px] text-slate-700 shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <span className="border-r border-[#9c9a91] pr-2">Réf : {file.path}</span>
          <span>Prêt</span>
        </div>
        <span className="text-slate-800 font-bold">Visualiseur de pièces CHEOPS v3.12</span>
      </div>

    </div>
  );
};
