import React, { useState, useRef, useEffect, DragEvent, TouchEvent } from "react";
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
  Scale,
  Clock,
  Timer,
  Coffee
} from "lucide-react";
import { motion } from "motion/react";
import { Dossier, TamponOption, TAMPONS_DISPONIBLES } from "../dossiers";
import { soundFx } from "../services/soundFx";

interface QualificationDeskWindowProps {
  dossier: Dossier;
  isAwaitingNext: boolean;
  activeStamp: { code: string; label: string; isCorrect: boolean; angle?: number } | null;
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
  // Chrono & Pointeuse Option A
  isChronoStarted?: boolean;
  timeRemaining?: number;
  maxTime?: number;
  onStartChrono?: () => void;
  autoPunchNext?: boolean;
  onToggleAutoPunch?: () => void;
  onAddCoffeeTime?: () => void;
  hasCoffee?: boolean;
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
  isChronoStarted = false,
  timeRemaining = 180.0,
  maxTime = 180.0,
  onStartChrono,
  autoPunchNext = false,
  onToggleAutoPunch,
  onAddCoffeeTime,
  hasCoffee = false,
}) => {
  const medicalBlocked = Boolean(
    dossier.termesCaviardes &&
    dossier.termesCaviardes.length > 0 &&
    caviardagesFaits === 0
  );
  const isAnyBlocked = cameraBlocked || medicalBlocked;

  const prevChronoStartedRef = useRef<boolean>(isChronoStarted);
  const [isPunchFlash, setIsPunchFlash] = useState<boolean>(false);
  const passed25Ref = useRef<boolean>(false);
  const passed10Ref = useRef<boolean>(false);
  const [thresholdPulse, setThresholdPulse] = useState<"25" | "10" | null>(null);

  useEffect(() => {
    if (!prevChronoStartedRef.current && isChronoStarted) {
      setIsPunchFlash(true);
      const timer = setTimeout(() => setIsPunchFlash(false), 320);
      return () => clearTimeout(timer);
    }
    prevChronoStartedRef.current = isChronoStarted;
  }, [isChronoStarted]);

  useEffect(() => {
    if (!isChronoStarted) {
      passed25Ref.current = false;
      passed10Ref.current = false;
      setThresholdPulse(null);
      return;
    }

    if (timeRemaining <= 25 && timeRemaining > 10 && !passed25Ref.current) {
      passed25Ref.current = true;
      setThresholdPulse("25");
      const timer = setTimeout(() => setThresholdPulse(null), 250);
      return () => clearTimeout(timer);
    } else if (timeRemaining <= 10 && !passed10Ref.current) {
      passed10Ref.current = true;
      setThresholdPulse("10");
      const timer = setTimeout(() => setThresholdPulse(null), 300);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, isChronoStarted]);

  const formatChrono = (seconds: number): string => {
    const s = Math.max(0, seconds);
    if (s >= 60) {
      const mins = Math.floor(s / 60);
      const secs = Math.floor(s % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${s.toFixed(1)}s`;
  };

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
            disabled={!isChronoStarted && !isAwaitingNext}
            onClick={() => {
              soundFx.playUiClick();
              onOpenExplorer();
            }}
            className={`xp-btn flex items-center gap-1.5 ${
              !isChronoStarted && !isAwaitingNext ? "opacity-50 cursor-not-allowed text-slate-500" : ""
            }`}
          >
            <span>📁</span>
            <span>{!isChronoStarted && !isAwaitingNext ? "PIÈCES SOUS SCELLÉ" : "PIÈCES D'INSTRUCTION"}</span>
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
          APPLICATION ART. L. 435-1 CSI // PROTOCOLE CHEOPS
        </span>
      </div>

      {/* ALERTE BLOCAGE VIDÉO CCTV (UNIQUEMENT VISIBLE APRÈS POINTAGE) */}
      {cameraBlocked && isChronoStarted && (
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

      {/* ALERTE CONTRADICTION MÉDICALE (UNIQUEMENT VISIBLE APRÈS POINTAGE) */}
      {medicalBlocked && isChronoStarted && (
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
        {/* GROUPBOX 0 : HORODATEUR DE CADENCE // POINTEUSE ADMINISTRATIVE (OPTION A) */}
        <fieldset
          className={`border-2 p-2.5 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff] transition-all duration-150 ${
            isPunchFlash
              ? "border-[#0055ea] bg-[#dbeafe] shadow-[0_0_16px_rgba(0,85,234,0.45)]"
              : !isChronoStarted && !isAwaitingNext
              ? "border-[#003366] bg-[#f0f4fc]"
              : isChronoStarted && !isAwaitingNext
              ? timeRemaining <= 10
                ? "border-[#c00000] bg-[#fff0f0]"
                : timeRemaining <= 25
                ? "border-[#cc6600] bg-[#fffbe6]"
                : "border-[#0055ea] bg-[#f0f6ff]"
              : "border-[#2e7d32] bg-[#f0fff4]"
          }`}
        >
          <legend className="px-2 font-sans text-[11px] font-black text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#7f9db9] flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[#0055ea]" />
            <span>HORODATEUR DE CADENCE // POINTEUSE DE SERVICE MINISTÉRIELLE</span>
          </legend>

          {/* CAS 1 : EN ATTENTE DU POINTAGE DU JOUEUR */}
          {!isChronoStarted && !isAwaitingNext && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block" />
                  <span className="text-xs font-bold text-[#002244] uppercase tracking-wide">
                    Dossier en attente de prise en charge
                  </span>
                  <span className="bg-white px-1.5 py-0.2 border border-[#7f9db9] text-[10px] text-slate-600 font-mono">
                    {Math.round(maxTime)}s allouées
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug">
                  L'instruction des pièces et la qualification contentieuse sont verrouillées. Pointez la prise de dossier pour ouvrir le décompte réglementaire.
                </p>
                {dossier.id === "DOS-B75-1890" && (
                  <p className="text-[10px] text-[#003366] bg-[#e8f4fc] border border-[#7f9db9] p-1.5 mt-1 font-semibold">
                    ℹ️ Le délai réglementaire d'instruction débute à la prise en charge du dossier. Consultez l'ordre de mission puis pointez pour ouvrir l'instruction.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  id="btn-pointer-chrono"
                  onClick={() => {
                    if (onStartChrono) {
                      onStartChrono();
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-[#0055ea] hover:bg-[#0044cc] text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md border-2 border-t-white border-l-white border-b-[#002266] border-r-[#002266] active:scale-[0.97] active:translate-y-0.5 transition-transform duration-75"
                >
                  <span className="text-base">⏱️</span>
                  <span>PRENDRE EN CHARGE // POINTER</span>
                  <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-xs font-mono ml-1">[P]</span>
                </button>

                {onToggleAutoPunch && (
                  <label className="text-[10px] text-slate-600 flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoPunchNext}
                      onChange={onToggleAutoPunch}
                      className="cursor-pointer"
                    />
                    <span>Enchaîner automatiquement les dossiers suivants</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* CAS 2 : CHRONOMÈTRE EN COURS D'ÉCOULEMENT */}
          {isChronoStarted && !isAwaitingNext && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1">
              {/* COMPTEUR NUMÉRIQUE EN RELIEF & JAUGE */}
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <div
                  className={`font-mono font-black text-xl sm:text-2xl px-3 py-1 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white shadow-inner shrink-0 tracking-wider flex items-center gap-2 transition-transform duration-150 ${
                    thresholdPulse === "25"
                      ? "scale-[1.03]"
                      : thresholdPulse === "10"
                      ? "scale-[1.05]"
                      : ""
                  } ${
                    timeRemaining <= 10
                      ? "bg-red-950 text-red-400 border-red-700 animate-pulse"
                      : timeRemaining <= 25
                      ? "bg-amber-950 text-amber-300"
                      : "bg-black text-[#00ff66]"
                  }`}
                >
                  <Clock className="w-5 h-5 opacity-80" />
                  <span>{formatChrono(timeRemaining)}</span>
                </div>

                <div className="flex-1 min-w-[140px]">
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span
                      className={`uppercase tracking-wide ${
                        timeRemaining <= 10
                          ? "text-red-700 font-black animate-bounce"
                          : timeRemaining <= 25
                          ? "text-amber-800"
                          : "text-[#003366]"
                      }`}
                    >
                      {timeRemaining <= 10
                        ? "🚨 URGENCE : DÉPASSEMENT PROCÉDURAL IMMINENT !"
                        : timeRemaining <= 25
                        ? "⚠️ Cadence critique : concluez l'instruction"
                        : "✓ Décompte officiel en cours"}
                    </span>
                    <span className="font-mono text-slate-600">
                      {Math.max(0, Math.round((timeRemaining / (maxTime || 180)) * 100))}%
                    </span>
                  </div>

                  {/* BARRE DE PROGRESSION WIN32 XP SUNKEN */}
                  <div className="h-3.5 bg-white border border-[#7f9db9] p-0.5 shadow-inner overflow-hidden">
                    <div
                      style={{ width: `${Math.max(0, Math.min(100, (timeRemaining / (maxTime || 180)) * 100))}%` }}
                      className={`h-full transition-all duration-100 ${
                        timeRemaining <= 10
                          ? "bg-red-600 animate-pulse"
                          : timeRemaining <= 25
                          ? "bg-amber-500"
                          : "bg-gradient-to-r from-emerald-600 to-[#0055ea]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* PRIMES DE CÉLÉRITÉ & BOUTON PAUSE CAFÉ */}
              <div className="flex items-center gap-2.5 shrink-0 justify-end w-full sm:w-auto">
                <div className="text-[10px] text-right bg-white/70 px-2 py-1 border border-[#7f9db9]">
                  <span className="font-bold text-emerald-800 block">
                    {timeRemaining >= (maxTime || 180) * 0.5
                      ? "⚡ Cadence : palier célérité"
                      : timeRemaining >= (maxTime || 180) * 0.2
                      ? "⏱️ Cadence : palier standard"
                      : "⏱️ Délai de rigueur"}
                  </span>
                  <span className="text-slate-500 text-[9px]">Apposez le visa pour clôturer</span>
                </div>

                {hasCoffee && onAddCoffeeTime && (
                  <button
                    type="button"
                    onClick={onAddCoffeeTime}
                    className="xp-btn text-xs py-1 px-2.5 text-[#663300] font-bold flex items-center gap-1.5"
                    title="Prendre une gorgée de café syndical pour gagner +25 secondes"
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-700" />
                    <span>+25s CAFÉ</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CAS 3 : DOSSIER VISÉ // CHRONO STOPPÉ */}
          {isAwaitingNext && (
            <div className="flex items-center justify-between p-1 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>HORODATAGE CLÔTURÉ // Le chronomètre est suspendu pour analyse du rapport.</span>
              </div>
              <span className="text-[10px] text-slate-600 font-mono bg-white px-2 py-0.5 border border-[#7f9db9]">
                Temps final : {formatChrono(timeRemaining)} restantes
              </span>
            </div>
          )}
        </fieldset>

        {/* GROUPBOX 1 : SYNTHÈSE DES FAITS & DOCTRINE */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
          <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
            1. EXPOSÉ SOMMAIRE DES FAITS & DOCTRINE POLICIÈRE
          </legend>

          {!isChronoStarted && !isAwaitingNext ? (
            <div className="p-4 bg-white border border-[#7f9db9] text-center text-xs text-slate-500 font-mono my-1 flex flex-col items-center justify-center gap-1 min-h-[70px]">
              <span className="font-bold text-[#003366]">🔒 [ SOUS SCELLÉ ]</span>
              <span className="text-[11px]">Accessible après prise en charge horodatée.</span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
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
            </motion.div>
          )}
        </fieldset>

        {/* GROUPBOX 2 : AUDIT RAPIDE DES PIÈCES FORENSIQUES */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-2.5 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
          <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
            2. ÉTAT DU DOSSIER D'INSTRUCTION // PIÈCES FORENSIQUES
          </legend>

          {!isChronoStarted && !isAwaitingNext ? (
            <div className="p-4 bg-white border border-[#7f9db9] text-center text-xs text-slate-500 font-mono my-1 flex flex-col items-center justify-center gap-1 min-h-[70px]">
              <span className="font-bold text-[#003366]">🔒 [ SOUS SCELLÉ ]</span>
              <span className="text-[11px]">Accessible après prise en charge horodatée.</span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] mt-1"
            >
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
                <span className="text-[9px] font-mono font-black text-amber-800 bg-amber-100 px-1 border border-amber-300">[C] ↗</span>
              </div>
              <div className="text-[10px] font-mono font-bold">
                {!dossier.termesCaviardes || dossier.termesCaviardes.length === 0
                  ? "[ OK ] Sans mention"
                  : `${caviardagesFaits}/${totalCaviardages} biffés`}
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
                <span className="text-[9px] font-mono font-black text-blue-800 bg-blue-100 px-1 border border-blue-300">[F] ↗</span>
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
          </motion.div>
          )}
        </fieldset>

        {/* GROUPBOX 3 : ZONE DE VISA ET D'ÉMARGEMENT */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
          <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
            3. VISA & ÉMARGEMENT MINISTÉRIEL DU CONTENTIEUX
          </legend>

          {!isChronoStarted && !isAwaitingNext ? (
            <div className="p-4 bg-white border border-[#7f9db9] text-center text-xs text-slate-500 font-mono my-1 flex flex-col items-center justify-center gap-1 min-h-[70px]">
              <span className="font-bold text-[#003366]">🔒 [ INSTRUCTION NON OUVERTE ]</span>
              <span className="text-[11px]">Accessible après prise en charge horodatée.</span>
            </div>
          ) : (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed p-4 text-center transition-all flex flex-col items-center justify-center min-h-[130px] relative ${
                activeStamp ? "animate-tampon-shake" : ""
              } ${
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
                      "--stamp-angle": `${activeStamp.angle || -3}deg`,
                    } as React.CSSProperties}
                    className={`border-4 px-6 py-2.5 font-sans font-black text-sm sm:text-base uppercase tracking-wider shadow-xl animate-tampon relative overflow-hidden ${
                      activeStamp.isCorrect
                        ? "border-emerald-700 text-emerald-800 bg-white/95"
                        : "border-red-700 text-red-800 bg-white/95"
                    }`}
                  >
                    {/* Flash d'encre bref à l'impact */}
                    <div
                      className={`absolute inset-0 pointer-events-none opacity-20 ${
                        activeStamp.isCorrect ? "bg-emerald-600" : "bg-red-600"
                      } animate-ping`}
                      style={{ animationDuration: "0.2s", animationIterationCount: 1 }}
                    />
                    <span className="relative z-10">[ VISA OFFICIEL : {activeStamp.label} ]</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1 font-sans">
                    {activeStamp.isCorrect
                      ? "✓ Visa homologué par la Préfecture et le Parquet."
                      : "⚠️ Visa rejeté par le Parquet : Orientation non conforme aux réquisitions."}
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
          )}
        </fieldset>

        {/* GROUPBOX 4 : SÉLECTION DES 3 SCEAUX / TAMPONS OFFICIELS (STYLE BOUTONS POUSSOIRS WIN32) */}
        {!isAwaitingNext && (
          <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff]">
            <legend className="px-2 font-sans text-[11px] font-bold text-[#003366] uppercase tracking-wide bg-[#ece9d8] border border-[#9c9a91]">
              4. APPLICATION DU SCEAU DOCTRINAL (ART. L. 435-1)
            </legend>

            {!isChronoStarted ? (
              <div className="p-4 bg-white border border-[#7f9db9] text-center text-xs text-slate-500 font-mono my-1 flex flex-col items-center justify-center gap-1 min-h-[70px]">
                <span className="font-bold text-[#003366]">🔒 [ INSTRUCTION NON OUVERTE ]</span>
                <span className="text-[11px]">Accessible après prise en charge horodatée.</span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1.5"
              >
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
            </motion.div>
            )}
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
      <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-3 py-1 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-700 shrink-0 font-sans">
        <div className="flex items-center gap-2 overflow-x-auto text-[10px] text-slate-600 font-mono">
          <span className="font-bold text-[#003366]">RACCOURCIS :</span>
          <span>[1-3] Sceaux</span>
          <span>•</span>
          <span>[P] Pointer</span>
          <span>•</span>
          <span>[Suppr] Broyeuse</span>
          <span>•</span>
          <span>[C] Caviarder</span>
          <span>•</span>
          <span>[R] Riposte</span>
          <span>•</span>
          <span>[F] RIO</span>
          <span>•</span>
          <span>[B] Boutique</span>
          <span>•</span>
          <span>[Espace] Pièce</span>
        </div>
        <span className="text-emerald-800 font-bold text-[10px]">● FORMULAIRE CERFA CONFORME</span>
      </div>

    </div>
  );
};
