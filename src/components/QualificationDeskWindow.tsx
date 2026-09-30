import React, { DragEvent, TouchEvent } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Stamp,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  FileCheck2,
  Coins,
  Scale
} from "lucide-react";
import { Dossier, TamponOption, TAMPONS_DISPONIBLES } from "../dossiers";
import { soundFx } from "../services/soundFx";

interface QualificationDeskWindowProps {
  dossier: Dossier;
  isAwaitingNext: boolean;
  activeStamp: { code: string; label: string; isCorrect: boolean } | null;
  cameraBlocked: boolean;
  onApplyTampon: (t: TamponOption) => void;
  draggedTampon: TamponOption | null;
  onDragStartTampon: (t: TamponOption, e: DragEvent<HTMLButtonElement>) => void;
  onDragEndTampon: () => void;
  onTouchStartTampon: (t: TamponOption, e: TouchEvent<HTMLButtonElement>) => void;
  onTouchMoveTampon: (e: TouchEvent<HTMLButtonElement>) => void;
  onTouchEndTampon: () => void;
  isDropZoneOver: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onPasserAuDossierSuivant: () => void;
  onOpenExplorer: () => void;
  onClose?: () => void;
  // Métriques pour aperçu global d'un coup d'œil
  caviardagesFaits?: number;
  totalCaviardages?: number;
  cameraDecision?: "neutralisee" | "conservee" | null;
  cameraNeutralisee?: boolean;
  rioDecision?: "flouter" | "valider" | null;
  substitutionFaite?: boolean;
  onOpenApp?: (appId: string) => void;
}

export const QualificationDeskWindow: React.FC<QualificationDeskWindowProps> = ({
  dossier,
  isAwaitingNext,
  activeStamp,
  cameraBlocked,
  onApplyTampon,
  draggedTampon,
  onDragStartTampon,
  onDragEndTampon,
  onTouchStartTampon,
  onTouchMoveTampon,
  onTouchEndTampon,
  isDropZoneOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onPasserAuDossierSuivant,
  onOpenExplorer,
  onClose,
  caviardagesFaits = 0,
  totalCaviardages = 0,
  cameraDecision,
  cameraNeutralisee = true,
  rioDecision,
  substitutionFaite = false,
  onOpenApp,
}) => {
  const medicalBlocked = Boolean(
    dossier.termesCaviardes &&
    dossier.termesCaviardes.length > 0 &&
    caviardagesFaits === 0
  );
  const isAnyBlocked = cameraBlocked || medicalBlocked;

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-sans text-black select-none overflow-hidden">
      
      {/* BANDEAU OFFICIEL BORDEREAU DE QUALIFICATION (STYLE CERFA WIN32) */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-3 py-1.5 flex items-center justify-between shrink-0 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#003366] border border-[#002244] flex items-center justify-center text-amber-300 text-xs font-black shadow-xs">
            ⚖
          </div>
          <span className="font-sans font-bold text-[#003366] text-xs sm:text-sm tracking-wide uppercase truncate">
            FORMULAIRE CERFA-BEAUVAU #435-B // DOSSIER {dossier.id}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundFx.playUiClick();
              onOpenExplorer();
            }}
            className="xp-btn flex items-center gap-1.5"
          >
            <span>📁</span>
            <span>PIÈCES D'INSTRUCTION</span>
          </button>
        </div>
      </div>

      {/* BANNIÈRE STATISTIQUE BEAUVAU (BANDEAU DOCTRINE PROGICIEL) */}
      <div className="bg-[#f0ede4] border-b border-[#b8b4a6] px-3 py-1 text-[11px] text-[#4d4030] flex flex-wrap items-center justify-between gap-1 shrink-0 font-sans">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#990000]">
          <span className="inline-block w-2 h-2 bg-[#cc0000] rounded-full animate-pulse"></span>
          <span>QUOTA CIRCONSCRIPTION : 98% REJETS EXIGÉS // CONSIGNES DU PRÉFET</span>
        </div>
        <span className="text-[10px] text-slate-600 bg-white/80 px-1.5 py-0.2 border border-[#b8b4a6] font-mono hidden sm:inline">
          CIRCULAIRE INTER-MINISTÉRIELLE L. 435-1
        </span>
      </div>

      {/* ALERTE BLOCAGE VIDÉO CCTV (BOÎTE D'ALERTE WINDOWS JAUNE) */}
      {cameraBlocked && (
        <div className="bg-[#ffffcc] border-b-2 border-[#cc9900] text-[#4d3300] font-sans font-bold text-xs p-2 flex items-center justify-between gap-2 shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#cc6600] shrink-0 animate-bounce" />
            <span>BLOCAGE VIDÉO : Une séquence compromettante doit être neutralisée dans CCTV avant visa !</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenApp && onOpenApp("video")}
            className="xp-btn text-[11px] uppercase text-[#990000]"
          >
            OUVRIR CCTV ↗
          </button>
        </div>
      )}

      {/* ALERTE CONTRADICTION MÉDICALE */}
      {medicalBlocked && (
        <div className="bg-[#ffe8d6] border-b-2 border-[#cc6600] text-[#663300] font-sans font-bold text-xs p-2 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#cc6600] shrink-0" />
            <span>CONTRADICTION MÉDICALE : Les constatations de l'IML réfutent la thèse officielle. Caviardez au feutre noir !</span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFx.playMarkerSound();
              onOpenExplorer();
            }}
            className="xp-btn text-xs uppercase text-[#994400] flex items-center gap-1"
          >
            <span>🖍️</span>
            <span>BIFFER LE RAPPORT IML</span>
          </button>
        </div>
      )}

      {/* CORPS DU FORMULAIRE : GROUPBOXES WIN32 EN TOUTE LÉGÈRETÉ */}
      <div
        onWheel={() => soundFx.playScrollTick()}
        className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 custom-scrollbar bg-[#ece9d8]"
      >
        
        {/* GROUPBOX 1 : SYNTHÈSE DES FAITS & DOCTRINE */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
          <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
            1. EXPOSÉ SOMMAIRE DES FAITS & DOCTRINE POLICIÈRE
          </legend>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d8d4c4] pb-1.5 mb-2 text-xs">
            <span className="text-slate-800">
              Administré mis en cause : <strong className="text-black font-sans">{dossier.profilage.identite}</strong>
            </span>
            <span className="text-[11px] text-slate-700 bg-white px-2 py-0.5 border border-[#7f9db9]">
              Profil : <strong className="text-[#003366]">{dossier.profilage.classeSociale}</strong>
            </span>
          </div>

          {/* CHAMP TEXTE ENFONCÉ (SUNKEN WIN32 BLANC PUR) */}
          <div className="text-xs sm:text-sm text-black leading-relaxed font-mono mb-2 bg-white p-2.5 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white shadow-inner select-text">
            <span className="text-[#003366] font-bold block mb-1">Constatations brutes transmises :</span>
            {dossier.faits}
          </div>

          {dossier.novlangue && (
            <div className="bg-[#e4efff] p-2 border border-[#7f9db9] text-xs text-[#002244]">
              <span className="font-bold">Lexique officiel préconisé :</span> « {dossier.novlangue.termeMinisteriel} »
            </div>
          )}
        </fieldset>

        {/* GROUPBOX 2 : AUDIT RAPIDE DES PIÈCES FORENSIQUES */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-2.5 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
          <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
            2. ÉTAT DU DOSSIER D'INSTRUCTION // PIÈCES FORENSIQUES
          </legend>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] mt-1">
            {/* CCTV */}
            <button
              type="button"
              onClick={() => onOpenApp && onOpenApp("video")}
              className={`p-2 border-2 text-left cursor-pointer transition-all flex flex-col justify-between shadow-xs active:translate-y-0.5 ${
                !dossier.incidentCamera
                  ? "bg-[#ece9d8] border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-black"
                  : cameraDecision === "neutralisee"
                  ? "bg-[#e8f8f0] border-t-white border-l-white border-b-[#2e7d32] border-r-[#2e7d32] text-[#1b5e20]"
                  : cameraDecision === "conservee"
                  ? "bg-[#fff8e8] border-t-white border-l-white border-b-[#cc9900] border-r-[#cc9900] text-[#664400]"
                  : "bg-[#ffebee] border-t-white border-l-white border-b-[#c00000] border-r-[#c00000] text-[#990000] animate-pulse"
              }`}
            >
              <div className="font-bold uppercase flex items-center justify-between border-b border-black/10 pb-0.5 mb-1">
                <span>📹 VIDÉO CCTV</span>
                <span className="text-[9px] font-mono">↗</span>
              </div>
              <div className="text-[10px] font-mono font-bold">
                {!dossier.incidentCamera
                  ? "[ OK ] Nominal"
                  : cameraDecision === "neutralisee"
                  ? "[ OK ] Défaillance actée"
                  : cameraDecision === "conservee"
                  ? "[ ⚠️ ] Flux brut conservé"
                  : "[ ● ] Incident à arbitrer"}
              </div>
            </button>

            {/* MÉDICAL / CAVIARDAGE */}
            <button
              type="button"
              onClick={onOpenExplorer}
              className={`p-2 border-2 text-left cursor-pointer transition-all flex flex-col justify-between shadow-xs active:translate-y-0.5 ${
                !dossier.termesCaviardes || dossier.termesCaviardes.length === 0
                  ? "bg-[#ece9d8] border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-black"
                  : caviardagesFaits >= totalCaviardages && totalCaviardages > 0
                  ? "bg-[#e8f8f0] border-t-white border-l-white border-b-[#2e7d32] border-r-[#2e7d32] text-[#1b5e20]"
                  : "bg-[#fff8e8] border-t-white border-l-white border-b-[#cc9900] border-r-[#cc9900] text-[#664400]"
              }`}
            >
              <div className="font-bold uppercase flex items-center justify-between border-b border-black/10 pb-0.5 mb-1">
                <span>🖍️ RAPPORT IML</span>
                <span className="text-[9px] font-mono">↗</span>
              </div>
              <div className="text-[10px] font-mono font-bold">
                {!dossier.termesCaviardes || dossier.termesCaviardes.length === 0
                  ? "[ OK ] Sans mention"
                  : `${caviardagesFaits}/${totalCaviardages} biffés (+${caviardagesFaits * 20}€)`}
              </div>
            </button>

            {/* RIO */}
            <button
              type="button"
              onClick={() => onOpenApp && onOpenApp("rio")}
              className={`p-2 border-2 text-left cursor-pointer transition-all flex flex-col justify-between shadow-xs active:translate-y-0.5 ${
                !dossier.statutRio
                  ? "bg-[#ece9d8] border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-black"
                  : rioDecision
                  ? "bg-[#e8f8f0] border-t-white border-l-white border-b-[#2e7d32] border-r-[#2e7d32] text-[#1b5e20]"
                  : "bg-[#eaf3fc] border-t-white border-l-white border-b-[#0055ea] border-r-[#0055ea] text-[#003366]"
              }`}
            >
              <div className="font-bold uppercase flex items-center justify-between border-b border-black/10 pb-0.5 mb-1">
                <span>🎖️ MATRICULE RIO</span>
                <span className="text-[9px] font-mono">↗</span>
              </div>
              <div className="text-[10px] font-mono font-bold">
                {!dossier.statutRio
                  ? "[ OK ] Non requis"
                  : rioDecision
                  ? `[ OK ] ${rioDecision}`
                  : "[ ● ] À contrôler"}
              </div>
            </button>

            {/* SCELLÉ */}
            <button
              type="button"
              onClick={() => onOpenApp && onOpenApp("scelles")}
              className={`p-2 border-2 text-left cursor-pointer transition-all flex flex-col justify-between shadow-xs active:translate-y-0.5 ${
                !dossier.pieceASubstituer
                  ? "bg-[#ece9d8] border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-black"
                  : substitutionFaite
                  ? "bg-[#e8f8f0] border-t-white border-l-white border-b-[#2e7d32] border-r-[#2e7d32] text-[#1b5e20]"
                  : "bg-[#f3eafa] border-t-white border-l-white border-b-[#7b1fa2] border-r-[#7b1fa2] text-[#4a148c]"
              }`}
            >
              <div className="font-bold uppercase flex items-center justify-between border-b border-black/10 pb-0.5 mb-1">
                <span>📦 CASIER SCELLÉS</span>
                <span className="text-[9px] font-mono">↗</span>
              </div>
              <div className="text-[10px] font-mono font-bold">
                {!dossier.pieceASubstituer
                  ? "[ OK ] Aucun"
                  : substitutionFaite
                  ? "[ OK ] Pièce substituée"
                  : "[ ● ] Substitution possible"}
              </div>
            </button>
          </div>
        </fieldset>

        {/* GROUPBOX 3 : ZONE DE VISA ET D'ÉMARGEMENT */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
          <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
            3. VISA & ÉMARGEMENT MINISTÉRIEL DU CONTENTIEUX
          </legend>

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-2 border-dashed p-4 text-center transition-all flex flex-col items-center justify-center min-h-[130px] relative ${
              isDropZoneOver
                ? "border-emerald-600 bg-[#e8f8f0] scale-[1.005]"
                : activeStamp
                ? activeStamp.isCorrect
                  ? "border-emerald-600 bg-[#f0fff4]"
                  : "border-red-600 bg-[#fff5f5]"
                : "border-[#7f9db9] bg-white shadow-inner"
            }`}
          >
            {activeStamp ? (
              /* TAMPON APPOSÉ AVEC ENCRE ET RELIEF RÉALISTE */
              <div className="flex flex-col items-center gap-1.5">
                <div
                  style={{
                    transform: `rotate(${activeStamp.angle || -3}deg)`,
                  }}
                  className={`border-4 px-6 py-2.5 font-sans font-black text-sm sm:text-base uppercase tracking-wider shadow-xl animate-tampon transition-transform relative overflow-hidden ${
                    activeStamp.isCorrect
                      ? "border-emerald-700 text-emerald-800 bg-white/95"
                      : "border-red-700 text-red-800 bg-white/95"
                  }`}
                >
                  <span className="relative z-10">[ VISA OFFICIEL : {activeStamp.label} ]</span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 font-sans">
                  {activeStamp.isCorrect
                    ? "✓ Qualification homologuée par la Préfecture et le Parquet."
                    : "⚠️ Rejet par le Parquet : Qualification non conforme à la circulaire."}
                </div>
              </div>
            ) : (
              /* EN ATTENTE DU VISA */
              <div className="flex flex-col items-center gap-1.5 text-slate-600">
                <Stamp className="w-7 h-7 text-slate-400" />
                <div className="text-xs font-black text-[#003366] uppercase tracking-wider font-sans">
                  {cameraBlocked
                    ? "ZONE VÉROUILLÉE : ARBITREZ D'ABORD LA VIDÉO CCTV"
                    : medicalBlocked
                    ? "ZONE VÉROUILLÉE : CAVIARDEZ LES LÉSIONS IML AU FEUTRE NOIR"
                    : "GLISSEZ LE TAMPON DE SERVICE OU CLIQUEZ CI-DESSOUS"}
                </div>
                <div className="text-[11px] text-slate-600 font-sans max-w-md">
                  {medicalBlocked
                    ? "Le rapport médical contredit la version des policiers. Biffez les mentions contestées dans le visualiseur."
                    : "Sélectionnez le visa doctrinal conforme pour clôturer le dossier."}
                </div>
              </div>
            )}
          </div>
        </fieldset>

        {/* GROUPBOX 4 : SÉLECTION DES 3 SCEAUX / TAMPONS OFFICIELS (STYLE BOUTONS POUSSOIRS WIN32) */}
        {!isAwaitingNext && (
          <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
            <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
              4. APPLICATION DU SCEAU DOCTRINAL (ART. L. 435-1)
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1.5">
              {TAMPONS_DISPONIBLES.map((t, index) => {
                const isImpunite = t.code === "impunite";
                const isVictimisation = t.code === "victimisation";

                return (
                  <button
                    key={t.code}
                    type="button"
                    disabled={isAnyBlocked}
                    draggable={!isAnyBlocked}
                    onDragStart={(e) => onDragStartTampon(t, e)}
                    onDragEnd={onDragEndTampon}
                    onTouchStart={(e) => onTouchStartTampon(t, e)}
                    onTouchMove={onTouchMoveTampon}
                    onTouchEnd={onTouchEndTampon}
                    onClick={() => onApplyTampon(t)}
                    className={`p-2.5 text-left font-sans transition-all flex flex-col justify-between cursor-pointer min-h-[95px] select-none border-2 shadow-md ${
                      isAnyBlocked
                        ? "opacity-40 cursor-not-allowed bg-[#dedbd2] border-[#808080] text-slate-500"
                        : isImpunite
                        ? "bg-[#e8f8f0] hover:bg-[#d0f0e0] border-t-white border-l-white border-b-[#2e7d32] border-r-[#2e7d32] text-[#1b5e20] active:translate-y-0.5"
                        : isVictimisation
                        ? "bg-[#fff8e8] hover:bg-[#ffeed0] border-t-white border-l-white border-b-[#cc9900] border-r-[#cc9900] text-[#664400] active:translate-y-0.5"
                        : "bg-[#ffebee] hover:bg-[#ffd5d8] border-t-white border-l-white border-b-[#c00000] border-r-[#c00000] text-[#990000] active:translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-1">
                      <span className="font-bold text-xs">
                        [{index + 1}] {t.label}
                      </span>
                      <Stamp className="w-3.5 h-3.5 opacity-80" />
                    </div>
                    <div className="text-[11px] text-slate-700 font-sans line-clamp-2">
                      {t.sousTitre}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-black/10 flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-wider font-bold">CLIC OU GLISSER</span>
                      <span className="text-black font-bold bg-white px-1 border border-[#808080]">[{index + 1}]</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* BOUTON PASSER AU DOSSIER SUIVANT SI HOMOLOGUÉ */}
        {isAwaitingNext && (
          <button
            type="button"
            onClick={onPasserAuDossierSuivant}
            className="w-full py-3 px-4 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-sans font-bold uppercase text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg border-2 border-t-white border-l-white border-b-black border-r-black active:translate-y-0.5"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>ÉMARGER DÉFINITIVEMENT LE DOSSIER & TRANSMETTRE AU LITIGE SUIVANT ➔</span>
          </button>
        )}

      </div>

      {/* PIED DE PAGE FORMULAIRE */}
      <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-3 py-1 flex items-center justify-between text-[11px] text-slate-700 shrink-0 font-sans">
        <span>BUREAU D'INSTRUCTION CONTENTIEUSE // CHEOPS WIN32</span>
        <span className="text-emerald-800 font-bold">● FORMULAIRE CERFA CONFORME</span>
      </div>

    </div>
  );
};
