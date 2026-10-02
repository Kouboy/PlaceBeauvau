import React, { useState, type CSSProperties, type DragEvent } from "react";
import {
  Camera,
  Play,
  Pause,
  AlertTriangle,
  Zap,
  Stamp,
  CheckCircle2,
  XCircle,
  PenTool,
  CornerDownRight,
  FileText,
  ShieldCheck,
  Eye,
  Lock,
  Layers,
  Sparkles,
  Search,
  Crosshair,
  Sliders,
  Maximize2
} from "lucide-react";
import { soundFx } from "../services/soundFx";
import { Dossier, TamponOption } from "../dossiers";

interface StampResult {
  tamponLabel: string;
  isCorrect: boolean;
  angle: number;
  code: string;
}

interface VideoPlayerWindowProps {
  dossier: Dossier;
  cameraGlitchActive: boolean;
  cameraNeutralisee: boolean;
  cameraDecision?: "neutralisee" | "conservee" | null;
  onTrancherCamera?: (decision: "neutralisee" | "conservee") => void;
  cameraFeedback?: { valide: boolean; explication: string; bonus: number } | null;
  onNeutraliserCamera: () => void;
  isDropZoneOver: boolean;
  draggedTampon: TamponOption | null;
  activeStamp: StampResult | null;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  // Caviardage & substitutions
  caviardagesFaits: Set<string>;
  caviardagesErreurs?: Set<string>;
  onCaviarderTerme: (terme: any) => void;
  onCaviarderTout: () => void;
  substitutionsFaites: Set<string>;
  onSubstituerScelle: (piece: any) => void;
  equipementsPossedes: Set<string>;
}

export const VideoPlayerWindow: React.FC<VideoPlayerWindowProps> = ({
  dossier,
  cameraGlitchActive,
  cameraNeutralisee,
  cameraDecision = null,
  onTrancherCamera,
  cameraFeedback = null,
  onNeutraliserCamera,
  isDropZoneOver,
  draggedTampon,
  activeStamp,
  onDragOver,
  onDragLeave,
  onDrop,
  caviardagesFaits,
  caviardagesErreurs = new Set(),
  onCaviarderTerme,
  onCaviarderTout,
  substitutionsFaites,
  onSubstituerScelle,
  equipementsPossedes,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [videoFilter, setVideoFilter] = useState<"standard" | "thermique" | "forensique">("standard");
  const [highlightTarget, setHighlightTarget] = useState<boolean>(false);
  const [stabilizedMode, setStabilizedMode] = useState<boolean>(true);

  const togglePlay = () => {
    soundFx.playUiClick();
    setIsPlaying(!isPlaying);
  };

  const toggleZoom = () => {
    soundFx.playUiClick();
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2.2 : 1));
  };

  const toggleFilter = () => {
    soundFx.playUiClick();
    setVideoFilter((prev) => (prev === "standard" ? "forensique" : prev === "forensique" ? "thermique" : "standard"));
  };

  const toggleHighlight = () => {
    soundFx.playUiClick();
    setHighlightTarget(!highlightTarget);
  };
  return (
    <div className="flex flex-col h-full min-h-0 text-black select-none overflow-hidden bg-[#ece9d8] font-sans">
      
      {/* BANDEAU SUPÉRIEUR FORENSIQUE CCTV (STYLE MEDIA PLAYER XP) */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2.5 py-1 flex items-center justify-between shrink-0 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#d4d0c8] border border-[#808080] flex items-center justify-center text-xs shadow-xs">
            📹
          </div>
          <span className="font-bold text-black tracking-wide truncate">
            Moniteur Vidéoprotection CSU // Flux Voie Publique
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-red-600 text-white font-bold px-2 py-0.2 text-[10px] uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
            <span>DIRECT ● ENR</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] text-slate-700 bg-white px-1.5 py-0.2 border border-[#808080] font-mono">
            ART. L. 435-1 CSI
          </span>
        </div>
      </div>

      {/* ÉTIQUETTE DYMO DIÉGÉTIQUE SATIRIQUE SUR LE MONITEUR */}
      <div className="bg-[#fffae6] border-b border-[#d4c185] px-3 py-1 flex items-center justify-between text-[11px] text-[#5c4908] shrink-0 font-sans">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
          <span>CONSIGNE CCTV : EN CAS DE FORCE DISPROPORTIONNÉE FILMÉE, INVOQUER "PANNE CARTE SD"</span>
        </span>
        <span className="text-slate-600 hidden md:inline text-[10px]">CHEOPS-VIDEO v3.12</span>
      </div>

      {/* BANDEAU TECHNIQUE VIDÉO & BARRE D'OUTILS WIN32 */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 py-1 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-3 text-slate-700 text-xs">
          <span>
            Horodatage : <strong className="text-black font-mono font-bold">{dossier.piece_visuelle.horodatage}</strong>
          </span>
          <span className="hidden sm:inline text-slate-600 font-mono text-[11px]">
            Capteur : AXIS 4K // OPJ_DOSS_{dossier.id.toUpperCase()}
          </span>
        </div>

        {/* OUTILS FORENSIQUES D'INSPECTION (BOUTONS XP-BTN) */}
        <div className="flex items-center gap-1">
          {/* Stabilisation & Confort visuel */}
          <button
            type="button"
            onClick={() => {
              soundFx.playUiClick();
              setStabilizedMode(!stabilizedMode);
            }}
            className={`xp-btn flex items-center gap-1 text-[11px] ${stabilizedMode ? "bg-[#e8f8f0] border-emerald-600 font-bold text-emerald-950" : ""}`}
            title="Activer/désactiver la stabilisation d'image pour éliminer les vibrations"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{stabilizedMode ? "Stabilisé [ON]" : "Stabiliser"}</span>
          </button>

          {/* Pause / Play */}
          <button
            type="button"
            onClick={togglePlay}
            className={`xp-btn flex items-center gap-1 text-[11px] ${!isPlaying ? "bg-[#fff8e7] border-amber-600 font-bold" : ""}`}
            title="Arrêt sur image pour analyse forensique"
          >
            {!isPlaying ? <Pause className="w-3 h-3 text-amber-700" /> : <Play className="w-3 h-3 text-emerald-700" />}
            <span>{!isPlaying ? "Gelé" : "Lecture"}</span>
          </button>

          {/* Zoom dynamique */}
          <button
            type="button"
            onClick={toggleZoom}
            className={`xp-btn flex items-center gap-1 text-[11px] ${zoomLevel > 1 ? "bg-[#eaf5ff] border-[#316ac5] font-bold" : ""}`}
            title="Agrandissement loupe numérique"
          >
            <Search className="w-3 h-3 text-sky-700" />
            <span>{zoomLevel}x</span>
          </button>

          {/* Filtres d'imagerie */}
          <button
            type="button"
            onClick={toggleFilter}
            className="xp-btn flex items-center gap-1 text-[11px]"
            title="Changer de filtre spectral"
          >
            <Sliders className="w-3 h-3 text-slate-700" />
            <span>Filtre: {videoFilter}</span>
          </button>

          {/* Réticule de visée suspect */}
          <button
            type="button"
            onClick={toggleHighlight}
            className={`xp-btn flex items-center gap-1 text-[11px] ${highlightTarget ? "bg-[#fee2e2] border-red-600 font-bold text-rose-950" : ""}`}
            title="Activer la boîte d'analyse suspect"
          >
            <Crosshair className="w-3 h-3 text-rose-600" />
            <span>Réticule</span>
          </button>
        </div>
      </div>

      {/* CORPS PRINCIPAL DU LECTEUR : MONITEUR VIDÉO & DOCUMENTS */}
      <div className="flex-1 min-h-0 flex flex-col justify-between p-2 sm:p-3 space-y-2.5 overflow-y-auto">
        
        {/* MONITEUR VIDÉO CCTV AVEC BORDURE ENFONCÉE 3D NOIRE */}
        <div
          id="drop-zone-screen"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white overflow-hidden bg-black transition-all group flex items-center justify-center w-full aspect-video min-h-[200px] max-h-[460px] shadow-inner select-none ${
            isDropZoneOver
              ? "ring-4 ring-[#316ac5]"
              : ""
          }`}
        >
          {/* IMAGE CCTV / PREUVE FORENSIQUE EN OBJECT-CONTAIN AVEC ZOOM ET FILTRES DYNAMIQUES */}
          <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
            <img
              src={dossier.piece_visuelle.url}
              alt="Surveillance CCTV"
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.25s ease-out",
              }}
              className={`w-full h-full object-contain ${
                videoFilter === "forensique"
                  ? "filter contrast-200 brightness-110 hue-rotate-180 invert"
                  : videoFilter === "thermique"
                  ? "filter contrast-150 saturate-200 hue-rotate-90"
                  : "filter contrast-125 brightness-95 grayscale"
              } ${!stabilizedMode && cameraGlitchActive ? "glitch-video" : ""}`}
            />

            {/* Balayage scanner forensique actif (subtil, sans pulsation violente) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/5 to-transparent pointer-events-none" />
          </div>

          {/* RÉTICULES FORENSIQUES & OVERLAY POLICE */}
          <div className="absolute inset-0 pointer-events-none p-2.5 sm:p-3 flex flex-col justify-between z-10 font-mono">
            <div className="flex justify-between items-start gap-2">
              <div className="bg-black/90 px-2.5 py-1 text-xs text-[#38bdf8] border border-[#0284c7] font-bold shadow tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>CAM_004 // FIXE CSU-VOIE-PUBLIQUE</span>
              </div>
              <div className="bg-black/90 px-2.5 py-1 text-xs text-amber-300 border border-amber-500/60 font-bold shadow">
                FILTRE : {videoFilter.toUpperCase()} [{zoomLevel}x]
              </div>
            </div>

            {/* Réticule central ou ciblage suspect */}
            {highlightTarget && (
              <div className="self-center flex flex-col items-center bg-black/75 p-2 border-2 border-rose-500 text-rose-300 rounded-xs shadow-2xl">
                <div className="flex items-center gap-2 text-xs font-black">
                  <Crosshair className="w-4 h-4 text-rose-400" />
                  <span>[MENACE IMMINENTE CARACTÉRISÉE]</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Conformité Art. L. 435-1 : Péril immédiat pour les fonctionnaires.
                </div>
              </div>
            )}

            {!highlightTarget && (
              <div className="self-center flex flex-col items-center opacity-70">
                <div className="w-12 h-12 border-2 border-dashed border-sky-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                </div>
                <span className="text-[9px] text-sky-300 font-bold mt-1 tracking-widest bg-black/80 px-1.5 py-0.5 border border-sky-500/40">
                  [ANALYSE BALLISTIQUE CONFORME]
                </span>
              </div>
            )}

            <div className="flex justify-between items-end text-[10px] text-slate-300 bg-black/85 p-1.5 border border-slate-700">
              <span className="truncate">CAPTEUR : AXIS 4K // 60FPS // ENREGISTREMENT CONTINU</span>
              <span className="text-emerald-400 font-bold shrink-0 ml-2">PIÈCE COTÉE N° 1 // CONFORME</span>
            </div>
          </div>

          {/* INDICATEUR DE SURVOL / GLISSER-DÉPOSER DU TAMPON */}
          {isDropZoneOver && (
            <div className="absolute inset-0 bg-[#00ff66]/25 border-4 border-dashed border-[#00ff66] flex flex-col items-center justify-center p-4 z-35 backdrop-blur-xs font-mono text-center">
              <div className="text-black bg-[#00ff66] font-black text-sm sm:text-base md:text-lg px-4 py-2 uppercase shadow-2xl flex items-center gap-2">
                <Stamp className="w-6 h-6" />
                <span>RELÂCHEZ ICI POUR APPOSER LE VISA</span>
              </div>
              <div className="text-white text-xs sm:text-sm mt-2 font-black bg-black/90 px-3 py-1 border-2 border-[#00ff66]">
                {draggedTampon ? draggedTampon.label : "Visa en cours"}
              </div>
            </div>
          )}

          {/* ARBITRAGE DÉDUCTIF DE L'INCIDENT CAMÉRA // CARTE SD */}
          {dossier.incidentCamera && cameraDecision === null && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-4 text-center z-25 font-mono border-3 border-amber-500 shadow-2xl">
              <div className="text-amber-400 font-black text-sm sm:text-base md:text-lg mb-2 flex items-center justify-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>ARBITRAGE DU FLUX VIDÉO // ÉVALUATION REQUISE</span>
              </div>
              
              <div className="bg-[#1f1604] border border-amber-500/60 p-3 max-w-lg mb-3 text-left">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-1">
                  INCIDENT MATÉRIEL CONSTATÉ :
                </div>
                <div className="text-xs sm:text-sm text-amber-100 font-black mb-1">
                  « {dossier.incidentCamera.intitule} »
                </div>
                <p className="text-[11px] text-slate-300 font-normal leading-relaxed">
                  {dossier.incidentCamera.rapportOfficiel}
                </p>
              </div>

              <p className="text-[11px] text-sky-200 mb-3 max-w-md italic">
                Déterminez si ce flux compromet l'équipage policier ou constitue une preuve à charge contre l'administré :
              </p>

              {/* Les 2 options déductives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
                <button
                  type="button"
                  id="btn-neutraliser-flux"
                  onClick={() => {
                    if (onTrancherCamera) onTrancherCamera("neutralisee");
                    else onNeutraliserCamera();
                  }}
                  className="bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 active:scale-98 text-white font-black p-3 text-xs uppercase border-2 border-red-400 cursor-pointer shadow-lg transition-all flex flex-col items-center justify-center gap-1 rounded-xs"
                >
                  <div className="flex items-center gap-1.5 text-xs text-red-200">
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>⚡ PURGER LE FLUX</span>
                  </div>
                  <span className="text-[10px] text-slate-200 font-normal">
                    Déclarer carte SD HS & illisible
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-conserver-flux"
                  onClick={() => {
                    if (onTrancherCamera) onTrancherCamera("conservee");
                  }}
                  className="bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 active:scale-98 text-white font-black p-3 text-xs uppercase border-2 border-emerald-400 cursor-pointer shadow-lg transition-all flex flex-col items-center justify-center gap-1 rounded-xs"
                >
                  <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                    <Lock className="w-4 h-4 text-emerald-300" />
                    <span>🔒 CONSERVER LE FLUX</span>
                  </div>
                  <span className="text-[10px] text-slate-200 font-normal">
                    Verser au parquet comme pièce à charge
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* SCEAU CARTE SD DÉFAILLANTE CERTIFIÉE OU FLUX CONSERVÉ */}
          {cameraDecision !== null && (
            <div className={`absolute top-2 right-2 px-3 py-1.5 text-xs font-mono border-2 z-20 flex items-center gap-2 font-black shadow-lg ${
              cameraDecision === "neutralisee"
                ? "bg-black/95 text-rose-300 border-rose-500"
                : "bg-black/95 text-emerald-300 border-emerald-500"
            }`}>
              {cameraDecision === "neutralisee" ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>[ CARTE SD HS PURGÉE // VIDÉO INUTILISABLE ]</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>[ FLUX CONSERVÉ INTACT // VERSÉ AU DOSSIER ]</span>
                </>
              )}
            </div>
          )}

          {/* EMPREINTE MASSIVE DU TAMPON APPOSÉ */}
          {activeStamp && (
            <div
              style={{
                "--stamp-angle": `${activeStamp.angle}deg`,
              } as CSSProperties}
              className="animate-tampon pointer-events-none absolute left-1/2 top-1/2 z-30 w-[90%] max-w-[380px]"
            >
              <div
                className={`border-4 px-4 py-3 text-center uppercase tracking-wider font-black bg-black/95 shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-xs font-mono border-dashed ${
                  activeStamp.isCorrect
                    ? "border-[#00ff66] text-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.5)]"
                    : "border-[#ef4444] text-[#ef4444] shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                }`}
              >
                <div className="text-sm sm:text-base md:text-lg font-black whitespace-normal break-words leading-tight mb-1 flex items-center justify-center gap-2">
                  {activeStamp.isCorrect ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
                  <span>{activeStamp.tamponLabel}</span>
                </div>
                <div
                  className={`text-[10px] sm:text-xs tracking-widest border-t-2 pt-1 font-black ${
                    activeStamp.isCorrect
                      ? "border-[#00ff66]/60 text-[#a7f3d0]"
                      : "border-[#ef4444]/60 text-[#fca5a5]"
                  }`}
                >
                  {activeStamp.isCorrect ? "✓ QUALIFICATION CONFORME // CLASSEMENT SANS SUITE" : "✗ MOTIF REJETÉ PAR LA CIRCULAIRE"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PV DES FAITS & CONSTAT MÉDICAL (GROUPBOX WIN32 AUTHENTIQUE) */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 rounded-none shadow-[inset_1px_1px_0_#fff] space-y-2">
          <legend className="px-2 font-sans text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
            Rapport d'Intervention // Circonstances Constatées
          </legend>
          
          <p className="text-black text-xs sm:text-sm leading-relaxed font-sans bg-white p-2.5 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white shadow-inner">
            {dossier.faits}
          </p>

          {/* NOVLANGUE MINISTÉRIELLE EN FORMAT WIN32 */}
          {dossier.novlangue && (
            <div className="pt-1 border-t border-[#d0d0d0]">
              <div className="text-amber-900 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-amber-700" />
                <span>Qualification officielle exigée (Lexique ministériel) :</span>
              </div>
              <div className="bg-white p-2 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white flex flex-col gap-1 text-xs sm:text-sm shadow-inner">
                <div className="text-rose-700 line-through font-medium">
                  « {dossier.novlangue.faitBrut} »
                </div>
                <div className="text-emerald-700 font-bold text-sm flex items-center gap-1.5">
                  <span className="text-[#316ac5]">➔</span>
                  <span>« {dossier.novlangue.termeMinisteriel} »</span>
                </div>
              </div>
            </div>
          )}

          {/* VOLET CAVIARDAGE AU FEUTRE NOIR DE CENSURE */}
          {dossier.termesCaviardes && dossier.termesCaviardes.length > 0 && (
            <div className="pt-1 border-t border-[#d0d0d0]">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-900 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-amber-700" />
                  <span>Feutre noir // Caviardage des termes compromettants :</span>
                </span>
                <span className="text-xs text-black bg-white px-2 py-0.5 border border-[#808080] font-bold">
                  {caviardagesFaits.size} / {dossier.termesCaviardes.length} occultés (+20€ / mot)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {dossier.termesCaviardes.map((terme) => {
                  const fait = caviardagesFaits.has(terme.id);
                  const isErreur = fait && (caviardagesErreurs?.has(terme.id) || terme.estCompromettant === false);
                  return (
                    <button
                      key={terme.id}
                      type="button"
                      onClick={() => onCaviarderTerme(terme)}
                      className={`p-2 text-left text-xs border transition-all cursor-pointer font-sans rounded-none flex flex-col justify-between gap-1 ${
                        isErreur
                          ? "bg-[#fee2e2] border-red-700 text-red-950 font-bold"
                          : fait
                          ? "bg-[#222] border-black text-white font-mono"
                          : "xp-btn text-black font-medium"
                      }`}
                      title={fait ? (isErreur ? "Cliquer pour rétablir ce terme utile" : "Terme purgé") : `Biffer : ${terme.texteBrut}`}
                    >
                      <div className="flex items-center justify-between gap-1.5 w-full">
                        <span className="truncate flex items-center gap-1.5">
                          <PenTool className={`w-3.5 h-3.5 shrink-0 ${isErreur ? "text-rose-700" : fait ? "text-emerald-400" : "text-amber-700"}`} />
                          {fait ? (
                            <span className="line-through text-slate-300 font-mono">[███ {terme.texteCensure} ███]</span>
                          ) : (
                            <span>Biffer : « {terme.texteBrut} »</span>
                          )}
                        </span>
                        <span className={`text-[10px] px-1 py-0.2 font-bold shrink-0 ${
                          isErreur
                            ? "bg-red-800 text-white"
                            : fait
                            ? "bg-emerald-800 text-white"
                            : "bg-amber-100 text-amber-900 border border-amber-400"
                        }`}>
                          {isErreur ? "⚠️ FAUTE (-35€)" : fait ? "✓ PURGÉ" : "+20 €"}
                        </span>
                      </div>
                      {isErreur && terme.impactErreur && (
                        <div className="text-[10px] text-red-900 font-normal italic bg-red-100 p-1 border-l-2 border-red-700">
                          {terme.impactErreur}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bouton feutre triple-mine */}
              {equipementsPossedes.has("feutre_triple") &&
                dossier.termesCaviardes.some((t) => !caviardagesFaits.has(t.id)) && (
                  <button
                    type="button"
                    id="btn-feutre-triple-caviarder"
                    onClick={onCaviarderTout}
                    className="mt-2 w-full xp-btn-blue bg-[#0055ea] hover:bg-[#0044cc] text-white py-1.5 px-3 text-xs font-bold uppercase flex items-center justify-center gap-2 border border-[#002266] shadow-sm cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span className="text-white font-bold">[ Tout purger en 1 clic — Feutre triple-mine ]</span>
                  </button>
                )}
            </div>
          )}

          {/* VOLET SUBSTITUTION DE SCELLÉ */}
          {dossier.pieceASubstituer && (
            <div className="pt-1 border-t border-[#d0d0d0]">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-black flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-blue-700" />
                  <span>Substitution de scellé compromettant :</span>
                </span>
                <span className="text-amber-900 text-xs bg-amber-100 px-2 py-0.5 border border-amber-400 font-bold">
                  +{dossier.pieceASubstituer.primeBonus} €
                </span>
              </div>

              {substitutionsFaites.has(dossier.pieceASubstituer.id) ? (
                <div className="bg-[#eaf5ea] border border-emerald-700 p-2 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-bold">PV DE SUBSTITUTION VERSÉ AU DOSSIER</div>
                      <div className="text-[11px] text-slate-700">{dossier.pieceASubstituer.substitutOfficiel}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-700 text-white font-bold px-1.5 py-0.5">COTÉ</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="p-1.5 bg-[#fff8e7] border border-dashed border-amber-600 text-xs text-black">
                    <strong className="text-rose-900">Pièce compromettante :</strong> {dossier.pieceASubstituer.scelleCompromettant}
                  </div>
                  <button
                    type="button"
                    id="btn-substituer-scelle"
                    onClick={() => onSubstituerScelle(dossier.pieceASubstituer!)}
                    className="w-full xp-btn py-1.5 px-3 text-xs font-bold text-emerald-900 flex items-center justify-center gap-2"
                  >
                    <CornerDownRight className="w-4 h-4 text-emerald-700" />
                    <span>Remplacer par le PV homologué (+{dossier.pieceASubstituer.primeBonus}€)</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </fieldset>

      </div>
    </div>
  );
};
