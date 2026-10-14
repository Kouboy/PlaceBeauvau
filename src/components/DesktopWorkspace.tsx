import React, { useState, useRef, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  Scale,
  Video,
  Database,
  MessageSquare,
  Package,
  FileBadge,
  Trash2,
  Command,
  ShieldCheck,
  Award,
  Clock,
  Maximize2,
  Minimize2,
  Coffee,
  Bell,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  Coins,
  AlertTriangle,
  X,
  FileText,
  HardDrive,
  Bomb,
  Calculator as CalcIcon,
  Sliders,
  ChevronRight,
  Search,
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Download,
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { VirtualFile, VirtualFolder } from "../fileSystem";
import { Dossier } from "../dossiers";
import { soundFx } from "../services/soundFx";
import { DesktopWindow, WindowRect } from "./DesktopWindow";
import { FileExplorerWindow } from "./FileExplorerWindow";
import { DocumentViewerWindow } from "./DocumentViewerWindow";
import { QualificationDeskWindow } from "./QualificationDeskWindow";
import { EvidenceLockerWindow } from "./EvidenceLockerWindow";
import { RioRegistryWindow } from "./RioRegistryWindow";
import { VideoPlayerWindow } from "./VideoPlayerWindow";
import { HumanDbWindow } from "./HumanDbWindow";
import { MessagingWindow } from "./MessagingWindow";
import { MissionNotificationToast } from "./MissionNotificationToast";
import { CaseMissionChecklist } from "./CaseMissionChecklist";
import { DesktopClutter } from "./DesktopClutter";
import blissWallpaperAzure from "../assets/images/xp_bliss_azure_1790841573015.jpg";
import blissWallpaperSurveillance from "../assets/images/bliss_police_nationale_1791041406709.jpg";
import {
  MinesweeperDialog,
  NotepadDialog,
  CalculatorDialog,
  RunDialog,
  DisplayPropertiesDialog,
} from "./XpFillerApps";

export type WindowId =
  | "explorer"
  | "document"
  | "qualification"
  | "video"
  | "humandb"
  | "messages"
  | "scelles"
  | "rio";

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

// Rectangles par défaut stables hors composant avec des proportions ergonomiques et équilibrées
const DEFAULT_WINDOW_RECTS: Record<WindowId, WindowRect> = {
  explorer: { x: 216, y: 16, width: 680, height: 535 },
  qualification: { x: 740, y: 16, width: 560, height: 535 },
  document: { x: 216, y: 16, width: 680, height: 535 },
  video: { x: 230, y: 24, width: 760, height: 530 },
  humandb: { x: 220, y: 24, width: 700, height: 520 },
  rio: { x: 230, y: 30, width: 620, height: 480 },
  scelles: { x: 240, y: 35, width: 620, height: 480 },
  messages: { x: 220, y: 24, width: 680, height: 510 },
};

interface DesktopWorkspaceProps {
  rootFolder: VirtualFolder;
  currentDossier: Dossier;
  dossierIndex?: number;
  totalDossiers?: number;
  currentPath: string;
  onNavigateToPath: (path: string) => void;
  // Documents
  openedDocument: VirtualFile | null;
  onOpenDocument: (file: VirtualFile) => void;
  onCloseDocument: () => void;
  onOpenPieceMaitresse?: () => void;
  discoveredFiles: Set<string>;
  // Tampons et Qualification
  isAwaitingNext: boolean;
  activeStamp: any;
  cameraBlocked: boolean;
  onApplyTampon: (t: any) => void;
  draggedTampon: any;
  onDragStartTampon: any;
  onDragEndTampon: any;
  onTouchStartTampon: any;
  onTouchMoveTampon: any;
  onTouchEndTampon: any;
  isDropZoneOver: boolean;
  onDragOver: any;
  onDragLeave: any;
  onDrop: any;
  onPasserAuDossierSuivant: () => void;
  // Caviardage
  caviardagesFaits: Set<string>;
  caviardagesErreurs: Set<string>;
  onCaviarderTerme: (t: any) => void;
  onCaviarderTout?: () => void;
  // Vidéo
  cameraGlitchActive: boolean;
  cameraNeutralisee: boolean;
  onNeutraliserCamera: () => void;
  cameraDecision: "neutralisee" | "conservee" | null;
  onTrancherCamera: (d: "neutralisee" | "conservee") => void;
  cameraFeedback?: { valide: boolean; explication: string; bonus: number } | null;
  // TAJ & RIO & Riposte
  rioInspecte: boolean;
  onInspecterRio: () => void;
  rioDecision: "flouter" | "valider" | null;
  onTrancherRio: (d: "flouter" | "valider") => void;
  rioFeedback?: { valide: boolean; explication: string; bonus: number } | null;
  riposteDeclenchee: boolean;
  onRiposteOutrage: () => void;
  // Scellés
  substitutionsFaites: Set<string>;
  onSubstituerScelle: (p: any) => void;
  // Messagerie & Fuites
  activeContactId: string;
  onSelectContact: (id: string) => void;
  fuitesTransmises?: Set<string>;
  onTransmettreFuite?: (dossierId: string) => void;
  credibiliteMinistere: number;
  paxSociale: number;
  blames: number;
  primeTotale: number;
  // Broyeur
  onBroyerPiece: () => void;
  broyeurAnime: boolean;
  documentsBroyes?: number;
  // Équipements
  equipementsPossedes: Set<string>;
  // Contrôle des fenêtres externe
  openWindows: Record<WindowId, WindowState>;
  onToggleWindow: (id: WindowId) => void;
  onFocusWindow: (id: WindowId) => void;
  onCloseWindow: (id: WindowId) => void;
  activeWindowId: WindowId;
  // Notification de mission & notes
  missionNotificationOpen?: boolean;
  onCloseMissionNotification?: () => void;
  onOpenMissionNotification?: () => void;
  onToggleNotes?: () => void;
  notesOuvertes?: boolean;
  // Intranet & Session
  onOpenGuide?: () => void;
  onOpenBoutique?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  // Chrono & Pointeuse Option A
  isChronoStarted?: boolean;
  timeRemaining?: number;
  maxTime?: number;
  onStartChrono?: () => void;
  autoPunchNext?: boolean;
  onToggleAutoPunch?: () => void;
  onAddCoffeeTime?: () => void;
}

export const DesktopWorkspace: React.FC<DesktopWorkspaceProps> = ({
  rootFolder,
  currentDossier,
  dossierIndex = 0,
  totalDossiers = 6,
  currentPath,
  onNavigateToPath,
  openedDocument,
  onOpenDocument,
  onCloseDocument,
  onOpenPieceMaitresse,
  discoveredFiles,
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
  caviardagesFaits,
  caviardagesErreurs,
  onCaviarderTerme,
  onCaviarderTout,
  cameraGlitchActive,
  cameraNeutralisee,
  onNeutraliserCamera,
  cameraDecision,
  onTrancherCamera,
  cameraFeedback,
  rioInspecte,
  onInspecterRio,
  rioDecision,
  onTrancherRio,
  rioFeedback,
  riposteDeclenchee,
  onRiposteOutrage,
  substitutionsFaites,
  onSubstituerScelle,
  activeContactId,
  onSelectContact,
  fuitesTransmises = new Set(),
  onTransmettreFuite,
  credibiliteMinistere,
  paxSociale,
  blames,
  primeTotale,
  onBroyerPiece,
  broyeurAnime,
  documentsBroyes = 0,
  equipementsPossedes,
  openWindows,
  onToggleWindow,
  onFocusWindow,
  onCloseWindow,
  activeWindowId,
  missionNotificationOpen = true,
  onCloseMissionNotification = () => {},
  onOpenMissionNotification = () => {},
  onToggleNotes,
  notesOuvertes = false,
  onOpenGuide = () => {},
  onOpenBoutique = () => {},
  isFullscreen = false,
  onToggleFullscreen = () => {},
  isChronoStarted = false,
  timeRemaining = 180.0,
  maxTime = 180.0,
  onStartChrono,
  autoPunchNext = false,
  onToggleAutoPunch,
  onAddCoffeeTime,
}) => {
  const desktopBoundsRef = useRef<HTMLDivElement | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [activeStartSubmenu, setActiveStartSubmenu] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState<string>("08:24:12");

  // États des accessoires et programmes parodiques Windows XP
  const [showMinesweeper, setShowMinesweeper] = useState<boolean>(false);
  const [showNotepad, setShowNotepad] = useState<boolean>(false);
  const [showCalc, setShowCalc] = useState<boolean>(false);
  const [showRunDialog, setShowRunDialog] = useState<boolean>(false);
  const [showDisplayProps, setShowDisplayProps] = useState<boolean>(false);
  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Contrôles Audio & Ambiance Rétro
  const [showVolumeControl, setShowVolumeControl] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getIsMuted());
  const [isAmbianceActive, setIsAmbianceActive] = useState<boolean>(soundFx.getIsAmbianceActive());
  const [ambianceVol, setAmbianceVol] = useState<number>(soundFx.getAmbianceVolume());
  const [isRetroMouse, setIsRetroMouse] = useState<boolean>(soundFx.getIsRetroMouseActive());
  const [officePace, setOfficePace] = useState<"fast" | "normal" | "slow">(soundFx.getOfficeEventPace());
  const [lastTestedSound, setLastTestedSound] = useState<string | null>(null);

  // Installation autonome PWA (Standalone)
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallHelp, setShowInstallHelp] = useState<boolean>(false);

  const handlePWAInstallClick = () => {
    soundFx.playUiClick();
    if (isInstallable) {
      install();
    } else {
      setShowInstallHelp(true);
    }
  };

  // Thème de fond d'écran parodique Police Nationale par défaut (persistant via localStorage)
  const [wallpaperTheme, setWallpaperTheme] = useState<"surveillance" | "azure" | "classic">(() => {
    try {
      const saved = localStorage.getItem("cheops_wallpaper_theme");
      if (saved === "surveillance" || saved === "azure" || saved === "classic") {
        return saved;
      }
    } catch {}
    return "surveillance";
  });

  useEffect(() => {
    try {
      localStorage.setItem("cheops_wallpaper_theme", wallpaperTheme);
    } catch {}
  }, [wallpaperTheme]);

  const activeWallpaperUrl =
    wallpaperTheme === "surveillance"
      ? blissWallpaperSurveillance
      : wallpaperTheme === "classic"
      ? ""
      : blissWallpaperAzure;

  // Positions déplaçables des icônes du Bureau XP avec espacement vertical généreux (pas de superposition)
  const DEFAULT_ICON_POSITIONS: Record<string, { x: number; y: number }> = {
    active_case: { x: 16, y: 16 },
    explorer: { x: 16, y: 124 },
    qualification: { x: 16, y: 232 },
    messages: { x: 16, y: 340 },
    broyeur: { x: 16, y: 448 },
    notepad: { x: 112, y: 16 },
    minesweeper: { x: 112, y: 124 },
    calc: { x: 112, y: 232 },
  };

  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(DEFAULT_ICON_POSITIONS);
  const [draggingIconId, setDraggingIconId] = useState<string | null>(null);

  // Gestion du Drag & Drop des icônes avec écouteurs globaux window (ultra-réactif, aucun blocage)
  const handleIconPointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) return; // ignorer clic droit
    e.stopPropagation();
    e.preventDefault();

    const orig = iconPositions[id] || { x: 16, y: 16 };
    let hasMoved = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = orig.x;
    const origY = orig.y;

    setDraggingIconId(id);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }
      const bounds = desktopBoundsRef.current?.getBoundingClientRect();
      const maxW = bounds ? Math.max(100, bounds.width - 90) : window.innerWidth - 90;
      const maxH = bounds ? Math.max(100, bounds.height - 110) : window.innerHeight - 110;

      const newX = Math.max(8, Math.min(maxW, origX + dx));
      const newY = Math.max(8, Math.min(maxH, origY + dy));

      setIconPositions((prev) => ({
        ...prev,
        [id]: { x: newX, y: newY },
      }));
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      setDraggingIconId(null);

      if (hasMoved) {
        soundFx.playUiClick();
      } else {
        const item = desktopIcons.find((i) => i.id === id);
        if (item?.onClick) {
          item.onClick();
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  const snapIconsToGrid = () => {
    soundFx.playUiClick();
    setIconPositions((prev) => {
      const next: Record<string, { x: number; y: number }> = {};
      (Object.entries(prev) as [string, { x: number; y: number }][]).forEach(([key, pos]) => {
        next[key] = {
          x: Math.round((pos.x - 16) / 96) * 96 + 16,
          y: Math.round((pos.y - 16) / 108) * 108 + 16,
        };
      });
      return next;
    });
    setDesktopContextMenu(null);
  };

  const resetIcons = () => {
    soundFx.playUiClick();
    setIconPositions(DEFAULT_ICON_POSITIONS);
    setDesktopContextMenu(null);
  };

  // Horloge du système
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const caseFolderPath = `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${currentDossier.id}`;

  // Référence stable des rectangles par défaut des fenêtres
  const windowRects = DEFAULT_WINDOW_RECTS;

  // Icônes du Bureau (déplaçables librement avec la souris ou au doigt)
  const desktopIcons = [
    {
      id: "active_case",
      label: `Affaire #${currentDossier.id}`,
      subLabel: "Dossier en cours",
      icon: Folder,
      color: "text-amber-400",
      border: "hover:border-amber-400 bg-[#071322]/80",
      badge: "EN COURS",
      onClick: () => {
        soundFx.playPaperRustle();
        onNavigateToPath(caseFolderPath);
        onFocusWindow("explorer");
      },
    },
    {
      id: "explorer",
      label: "Poste de travail",
      subLabel: "Disque C:",
      icon: FolderOpen,
      color: "text-sky-400",
      border: "hover:border-sky-400 bg-[#071322]/80",
      badge: null,
      onClick: () => {
        soundFx.playUiClick();
        onNavigateToPath("/C:");
        onFocusWindow("explorer");
      },
    },
    {
      id: "qualification",
      label: "Décision & Visas",
      subLabel: "Chambre contentieuse",
      icon: Scale,
      color: "text-[#00ff66]",
      border: "hover:border-[#00ff66] bg-[#071322]/80",
      badge: isAwaitingNext ? "PRÊT" : "QUALIFIER",
      onClick: () => {
        soundFx.playUiClick();
        onFocusWindow("qualification");
      },
    },
    {
      id: "messages",
      label: "Messagerie Télex",
      subLabel: "Liaison Beauvau",
      icon: MessageSquare,
      color: "text-sky-300",
      border: "hover:border-sky-400 bg-[#071322]/80",
      badge: null,
      onClick: () => {
        soundFx.playTelexBeep();
        onFocusWindow("messages");
      },
    },
    {
      id: "broyeur",
      label: "Broyeuse [Suppr]",
      subLabel: "Détruire blâmes & pièces [Suppr]",
      icon: Trash2,
      color: "text-red-400",
      border: "hover:border-red-400 bg-[#160606]/80",
      badge: documentsBroyes > 0 ? `${documentsBroyes} [Del]` : "[Del]",
      onClick: onBroyerPiece,
    },
    {
      id: "notepad",
      label: "Bloc-notes",
      subLabel: "Note confidentielle du Préfet",
      icon: FileText,
      color: "text-amber-200",
      border: "hover:border-amber-300 bg-[#071322]/80",
      badge: "MEMO",
      onClick: () => {
        soundFx.playPaperRustle();
        setShowNotepad(true);
      },
    },
    {
      id: "minesweeper",
      label: "Démineur",
      subLabel: "Démineur de manifestation",
      icon: Bomb,
      color: "text-rose-400",
      border: "hover:border-rose-400 bg-[#160606]/80",
      badge: null,
      onClick: () => {
        soundFx.playUiClick();
        setShowMinesweeper(true);
      },
    },
    {
      id: "calc",
      label: "Calculatrice",
      subLabel: "Calculateur d'indemnités",
      icon: CalcIcon,
      color: "text-emerald-300",
      border: "hover:border-emerald-400 bg-[#071322]/80",
      badge: null,
      onClick: () => {
        soundFx.playUiClick();
        setShowCalc(true);
      },
    },
  ];

  // Liste des applications pour le menu démarrer et les onglets de barre de tâches
  const systemApps = [
    { id: "explorer" as WindowId, label: "Explorateur de fichiers", icon: FolderOpen, color: "text-amber-400" },
    { id: "qualification" as WindowId, label: "Décision & Visas", icon: Scale, color: "text-[#00ff66]" },
    { id: "video" as WindowId, label: "Moniteur CCTV", icon: Video, color: "text-emerald-400" },
    { id: "humandb" as WindowId, label: "Fichier TAJ", icon: Database, color: "text-cyan-400" },
    { id: "rio" as WindowId, label: "Registre RIO", icon: FileBadge, color: "text-amber-300" },
    { id: "scelles" as WindowId, label: "Casier Scellés", icon: Package, color: "text-purple-400" },
    { id: "messages" as WindowId, label: "Messagerie Télex", icon: MessageSquare, color: "text-sky-400" },
  ];

  return (
    <div
      className="relative flex-1 min-h-0 w-full flex flex-col overflow-hidden bg-[#040914] select-none font-mono text-slate-200"
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
      }}
    >
      {/* FEUILLE DE ROUTE D'ENQUÊTE & CHECKLIST DOCTRINALE CHEOPS */}
      <CaseMissionChecklist
        dossier={currentDossier}
        dossierIndex={dossierIndex}
        totalDossiers={totalDossiers}
        discoveredFilesCount={discoveredFiles.size}
        tajConsulted={discoveredFiles.has(`taj_${currentDossier.id}`) || openWindows["humandb"]?.isOpen}
        cameraDecision={cameraDecision}
        cameraNeutralisee={cameraNeutralisee}
        rioDecision={rioDecision}
        caviardagesFaitsCount={caviardagesFaits.size}
        substitutionFaite={substitutionsFaites.size > 0}
        isAwaitingNext={isAwaitingNext}
        activeStampCorrect={Boolean(activeStamp?.isCorrect)}
        onFocusWindow={onFocusWindow}
        onNavigateToPath={onNavigateToPath}
        onOpenApp={(appId) => onFocusWindow(appId as WindowId)}
        onOpenPieceMaitresse={onOpenPieceMaitresse}
        isChronoStarted={isChronoStarted}
        onStartChrono={onStartChrono}
      />

      {/* ZONE CENTRALE DU BUREAU // FOND D'ÉCRAN DIÉGÉTIQUE & FENÊTRES FLOTTANTES */}
      <div
        ref={desktopBoundsRef}
        className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#004e98]"
      >
        {/* FOND D'ÉCRAN OFFICIEL DU MINISTÈRE (PARODIE WINDOWS XP BLISS SURVEILLANCE OU AZUR) */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-300"
          style={{ backgroundImage: activeWallpaperUrl ? `url(${activeWallpaperUrl})` : "none" }}
        />

        {/* WATERMARK OFFICIEL WINDOWS XP DU MINISTÈRE */}
        <div className="absolute bottom-8 right-6 pointer-events-none select-none text-right font-sans z-0">
          <div className="text-white text-sm font-black tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            CHEOPS Professionnel
          </div>
          <div className="text-white/90 text-[11px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            Système d'Information Policier v2.4 (Service Pack 2)
          </div>
          <div className="text-white/70 text-[10px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            Direction Générale de la Police Nationale // Beauvau
          </div>
        </div>

        {/* NOTIFICATION FLOTTANTE DE NOUVELLE SAISINE (DISCRÈTE ET FERMABLE) */}
        <MissionNotificationToast
          dossier={currentDossier}
          dossierIndex={dossierIndex}
          totalDossiers={totalDossiers}
          isOpen={missionNotificationOpen}
          onClose={onCloseMissionNotification}
          onOpenExplorer={() => {
            onNavigateToPath(caseFolderPath);
            onFocusWindow("explorer");
          }}
          onOpenDecision={() => {
            onFocusWindow("qualification");
          }}
          onOpenPieceMaitresse={onOpenPieceMaitresse}
          isChronoStarted={isChronoStarted}
          onStartChrono={onStartChrono}
        />

        {/* ÉLÉMENTS DE POSTE DE TRAVAIL D'UN FONCTIONNAIRE DÉBORDÉ : TACHES, POST-ITS & DOSSIERS */}
        <DesktopClutter
          onBroyerPiece={onBroyerPiece}
          blames={blames}
          dossierIndex={dossierIndex}
          totalDossiers={totalDossiers}
        />

        {/* ICÔNES DU BUREAU WINDOWS XP DÉPLAÇABLES (DRAG & DROP SUR LE BUREAU) */}
        {desktopIcons.map((item) => {
          const Icon = item.icon;
          const isOpen = openWindows[item.id as WindowId]?.isOpen;
          const isTrash = item.id === "broyeur";
          const pos = iconPositions[item.id] || { x: 16, y: 16 };
          const isDragging = draggingIconId === item.id;

          return (
            <div
              key={item.id}
              onPointerDown={(e) => handleIconPointerDown(item.id, e)}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                touchAction: "none",
              }}
              className={`absolute group flex flex-col items-center justify-start p-1.5 w-21 text-center cursor-grab active:cursor-grabbing select-none border transition-shadow rounded-none ${
                isDragging
                  ? "bg-[#316ac5]/70 border-dotted border-white shadow-2xl scale-105 z-30 ring-2 ring-sky-300"
                  : isTrash && broyeurAnime
                  ? "bg-red-600 text-white animate-shake border-white z-10"
                  : isOpen
                  ? "bg-[#316ac5]/45 border-[#316ac5] shadow-xs z-10"
                  : "border-transparent hover:bg-[#316ac5]/30 hover:border-[#316ac5] z-10"
              }`}
              title={item.subLabel}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform pointer-events-none">
                <Icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <span className="text-[11px] font-sans font-bold text-white text-center leading-tight [text-shadow:0_1px_2px_#000] line-clamp-2 px-1 rounded-xs pointer-events-none">
                {item.label}
              </span>
              {item.badge && (
                <span className="mt-1 text-[9px] font-mono font-black px-1.5 py-0.2 bg-black/85 text-[#00ff66] border border-[#00ff66]/60 rounded-none shadow-xs pointer-events-none">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        {/* MENU CONTEXTUEL CLIC DROIT DU BUREAU WINDOWS XP */}
        {desktopContextMenu && (
          <div
            className="fixed z-50 bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-[2px_2px_8px_rgba(0,0,0,0.5)] font-sans text-xs text-black py-1 w-52 select-none"
            style={{
              left: `${Math.min(desktopContextMenu.x, window.innerWidth - 220)}px`,
              top: `${Math.min(desktopContextMenu.y, window.innerHeight - 180)}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={snapIconsToGrid}
              className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center justify-between"
            >
              <span>Aligner sur la grille</span>
              <span className="text-[10px] text-slate-500 hover:text-white">Ctrl+G</span>
            </button>
            <button
              type="button"
              onClick={resetIcons}
              className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer"
            >
              Réorganiser les icônes
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playUiClick();
                setDesktopContextMenu(null);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center justify-between"
            >
              <span>Actualiser</span>
              <span className="text-[10px] text-slate-500 hover:text-white">F5</span>
            </button>
            <div className="border-t border-[#9c9a91] my-1" />
            <button
              type="button"
              onClick={() => {
                soundFx.playPaperRustle();
                setShowNotepad(true);
                setDesktopContextMenu(null);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer"
            >
              Nouveau mémo de service
            </button>
            <div className="border-t border-[#9c9a91] my-1" />
            <button
              type="button"
              onClick={() => {
                soundFx.playUiClick();
                setShowDisplayProps(true);
                setDesktopContextMenu(null);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer font-bold"
            >
              Propriétés d'affichage
            </button>
          </div>
        )}

        {/* 1. FENÊTRE : EXPLORATEUR DE FICHIERS */}
        <DesktopWindow
          id="explorer"
          title={`Explorateur de fichiers — ${currentPath}`}
          icon={FolderOpen}
          isOpen={Boolean(openWindows.explorer?.isOpen)}
          isMinimized={Boolean(openWindows.explorer?.isMinimized)}
          isActive={activeWindowId === "explorer"}
          zIndex={openWindows.explorer?.zIndex || 10}
          defaultRect={windowRects.explorer}
          onFocus={() => onFocusWindow("explorer")}
          onMinimize={() => onToggleWindow("explorer")}
          onClose={() => onCloseWindow("explorer")}
          desktopBoundsRef={desktopBoundsRef}
        >
          <FileExplorerWindow
            rootFolder={rootFolder}
            currentDossier={currentDossier}
            currentPath={currentPath}
            onNavigateToPath={onNavigateToPath}
            onOpenFile={onOpenDocument}
            onLaunchApp={(appId) => onFocusWindow(appId as WindowId)}
            discoveredFiles={discoveredFiles}
          />
        </DesktopWindow>

        {/* 2. FENÊTRE : VISUALISEUR DE DOCUMENT (QUAND UNE PIÈCE EST DOUBLE-CLIQUÉE) */}
        {openedDocument && (
          <DesktopWindow
            id="document"
            title={`Pièce : ${openedDocument.name} [${openedDocument.classification}]`}
            icon={FileText}
            badge={openedDocument.classification}
            isOpen={true}
            isMinimized={Boolean(openWindows.document?.isMinimized)}
            isActive={activeWindowId === "document"}
            zIndex={openWindows.document?.zIndex || 10}
            defaultRect={windowRects.document}
            onFocus={() => onFocusWindow("document")}
            onMinimize={() => onToggleWindow("document")}
            onClose={onCloseDocument}
            desktopBoundsRef={desktopBoundsRef}
          >
            <DocumentViewerWindow
              file={openedDocument}
              dossier={currentDossier}
              caviardagesFaits={caviardagesFaits}
              caviardagesErreurs={caviardagesErreurs}
              onCaviarderTerme={onCaviarderTerme}
              onCaviarderTout={onCaviarderTout}
              onOpenQualification={() => onFocusWindow("qualification")}
              onClose={onCloseDocument}
            />
          </DesktopWindow>
        )}

        {/* 3. FENÊTRE : BUREAU DE DÉCISION & VISAS CONTENTIEUX */}
        <DesktopWindow
          id="qualification"
          title={`Décision & Visas — Affaire #${currentDossier.id}`}
          icon={Scale}
          badge={isAwaitingNext ? "ÉMARGEMENT PRÊT" : "QUALIFICATION"}
          isOpen={Boolean(openWindows.qualification?.isOpen)}
          isMinimized={Boolean(openWindows.qualification?.isMinimized)}
          isActive={activeWindowId === "qualification"}
          zIndex={openWindows.qualification?.zIndex || 10}
          defaultRect={windowRects.qualification}
          onFocus={() => onFocusWindow("qualification")}
          onMinimize={() => onToggleWindow("qualification")}
          onClose={() => onCloseWindow("qualification")}
          desktopBoundsRef={desktopBoundsRef}
        >
          <QualificationDeskWindow
            dossier={currentDossier}
            isAwaitingNext={isAwaitingNext}
            activeStamp={activeStamp}
            cameraBlocked={cameraBlocked}
            onApplyTampon={onApplyTampon}
            draggedTampon={draggedTampon}
            onDragStartTampon={onDragStartTampon}
            onDragEndTampon={onDragEndTampon}
            onTouchStartTampon={onTouchStartTampon}
            onTouchMoveTampon={onTouchMoveTampon}
            onTouchEndTampon={onTouchEndTampon}
            isDropZoneOver={isDropZoneOver}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onPasserAuDossierSuivant={onPasserAuDossierSuivant}
            onOpenExplorer={() => onFocusWindow("explorer")}
            onClose={() => onCloseWindow("qualification")}
            caviardagesFaits={caviardagesFaits.size}
            totalCaviardages={currentDossier.termesCaviardes?.length || 0}
            cameraDecision={cameraDecision}
            cameraNeutralisee={cameraNeutralisee}
            rioDecision={rioDecision}
            substitutionFaite={substitutionsFaites.size > 0}
            onOpenApp={(appId) => onFocusWindow(appId as WindowId)}
            isChronoStarted={isChronoStarted}
            timeRemaining={timeRemaining}
            maxTime={maxTime}
            onStartChrono={onStartChrono}
            autoPunchNext={autoPunchNext}
            onToggleAutoPunch={onToggleAutoPunch}
            onAddCoffeeTime={onAddCoffeeTime}
            hasCoffee={equipementsPossedes.has("cafe_syndical")}
          />
        </DesktopWindow>

        {/* 4. FENÊTRE : MONITEUR CCTV */}
        <DesktopWindow
          id="video"
          title={`Caméras CSU — Incident #${currentDossier.id}`}
          icon={Video}
          badge={currentDossier.incidentCamera ? "INCIDENT CCTV" : null}
          isOpen={Boolean(openWindows.video?.isOpen)}
          isMinimized={Boolean(openWindows.video?.isMinimized)}
          isActive={activeWindowId === "video"}
          zIndex={openWindows.video?.zIndex || 10}
          defaultRect={windowRects.video}
          onFocus={() => onFocusWindow("video")}
          onMinimize={() => onToggleWindow("video")}
          onClose={() => onCloseWindow("video")}
          desktopBoundsRef={desktopBoundsRef}
        >
          <VideoPlayerWindow
            dossier={currentDossier}
            cameraGlitchActive={cameraGlitchActive}
            cameraNeutralisee={cameraNeutralisee}
            onNeutraliserCamera={onNeutraliserCamera}
            cameraDecision={cameraDecision}
            onTrancherCamera={onTrancherCamera}
            cameraFeedback={cameraFeedback}
            isDropZoneOver={isDropZoneOver}
            draggedTampon={draggedTampon}
            activeStamp={activeStamp}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            caviardagesFaits={caviardagesFaits}
            caviardagesErreurs={caviardagesErreurs}
            onCaviarderTerme={onCaviarderTerme}
            onCaviarderTout={onCaviarderTout}
            substitutionsFaites={substitutionsFaites}
            onSubstituerScelle={onSubstituerScelle}
            equipementsPossedes={equipementsPossedes}
          />
        </DesktopWindow>

        {/* 5. FENÊTRE : FICHIER TAJ NATIONAL */}
        <DesktopWindow
          id="humandb"
          title="Fichier TAJ — Anthropométrie & Antécédents"
          icon={Database}
          isOpen={Boolean(openWindows.humandb?.isOpen)}
          isMinimized={Boolean(openWindows.humandb?.isMinimized)}
          isActive={activeWindowId === "humandb"}
          zIndex={openWindows.humandb?.zIndex || 10}
          defaultRect={windowRects.humandb}
          onFocus={() => onFocusWindow("humandb")}
          onMinimize={() => onToggleWindow("humandb")}
          onClose={() => onCloseWindow("humandb")}
          desktopBoundsRef={desktopBoundsRef}
        >
          <HumanDbWindow
            dossier={currentDossier}
            rioInspecte={rioInspecte}
            onInspecterRio={onInspecterRio}
            rioDecision={rioDecision}
            onTrancherRio={onTrancherRio}
            rioFeedback={rioFeedback}
            riposteDeclenchee={riposteDeclenchee}
            onRiposteOutrage={onRiposteOutrage}
            equipementsPossedes={equipementsPossedes}
            onClose={() => onCloseWindow("humandb")}
            onMinimize={() => onToggleWindow("humandb")}
          />
        </DesktopWindow>

        {/* 6. FENÊTRE : MESSAGERIE CHIFFRÉE */}
        <DesktopWindow
          id="messages"
          title="Messagerie Télex d'État — Beauvau & Chancellerie"
          icon={MessageSquare}
          isOpen={Boolean(openWindows.messages?.isOpen)}
          isMinimized={Boolean(openWindows.messages?.isMinimized)}
          isActive={activeWindowId === "messages"}
          zIndex={openWindows.messages?.zIndex || 10}
          defaultRect={windowRects.messages}
          onFocus={() => onFocusWindow("messages")}
          onMinimize={() => onToggleWindow("messages")}
          onClose={() => onCloseWindow("messages")}
          desktopBoundsRef={desktopBoundsRef}
        >
          <MessagingWindow
            activeContactId={activeContactId}
            onSelectContact={onSelectContact}
            dossier={currentDossier}
            rioInspecte={rioInspecte}
            rioDecision={rioDecision}
            credibilite={credibiliteMinistere}
            riposteDeclenchee={riposteDeclenchee}
            caviardagesCount={caviardagesFaits.size}
            cameraNeutralisee={cameraNeutralisee}
            cameraDecision={cameraDecision}
            paxSociale={paxSociale}
            blames={blames}
            primeTotale={primeTotale}
            fuiteFaite={fuitesTransmises.has(currentDossier.id)}
            onTransmettreFuite={() => onTransmettreFuite && onTransmettreFuite(currentDossier.id)}
          />
        </DesktopWindow>

        {/* 7. FENÊTRE : CASIER DES SCELLÉS */}
        <DesktopWindow
          id="scelles"
          title="Casier des Scellés Judiciaires"
          icon={Package}
          badge={currentDossier.pieceASubstituer ? "PIÈCE DISPONIBLE" : null}
          isOpen={Boolean(openWindows.scelles?.isOpen)}
          isMinimized={Boolean(openWindows.scelles?.isMinimized)}
          isActive={activeWindowId === "scelles"}
          zIndex={openWindows.scelles?.zIndex || 10}
          defaultRect={windowRects.scelles}
          onFocus={() => onFocusWindow("scelles")}
          onMinimize={() => onToggleWindow("scelles")}
          onClose={() => onCloseWindow("scelles")}
          desktopBoundsRef={desktopBoundsRef}
        >
          <EvidenceLockerWindow
            dossier={currentDossier}
            substitutionsFaites={substitutionsFaites}
            onSubstituerScelle={onSubstituerScelle}
            onClose={() => onCloseWindow("scelles")}
          />
        </DesktopWindow>

        {/* 8. FENÊTRE : REGISTRE RIO */}
        <DesktopWindow
          id="rio"
          title="Registre Déontologique RIO"
          icon={FileBadge}
          badge={currentDossier.statutRio ? "MATRICULE" : null}
          isOpen={Boolean(openWindows.rio?.isOpen)}
          isMinimized={Boolean(openWindows.rio?.isMinimized)}
          isActive={activeWindowId === "rio"}
          zIndex={openWindows.rio?.zIndex || 10}
          defaultRect={windowRects.rio}
          onFocus={() => onFocusWindow("rio")}
          onMinimize={() => onToggleWindow("rio")}
          onClose={() => onCloseWindow("rio")}
          desktopBoundsRef={desktopBoundsRef}
        >
          <RioRegistryWindow
            dossier={currentDossier}
            rioInspecte={rioInspecte}
            onInspecterRio={onInspecterRio}
            rioDecision={rioDecision}
            onTrancherRio={onTrancherRio}
            rioFeedback={rioFeedback}
            onClose={() => onCloseWindow("rio")}
          />
        </DesktopWindow>
      </div>

      {/* BANNIÈRE DE VALIDATION SI DOSSIER CLÔTURÉ */}
      {isAwaitingNext && (
        <div className="bg-emerald-950 border-t-2 border-b border-emerald-400 p-2 text-center z-20 flex items-center justify-between px-4 shrink-0 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>AFFAIRE #{currentDossier.id} APURÉE SELON LA CIRCULAIRE DOCTRINALE</span>
          </div>
          <button
            type="button"
            onClick={onPasserAuDossierSuivant}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 border border-white text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            <span>ÉMARGER & PASSER AU DOSSIER SUIVANT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* UNIQUE BARRE DES TÂCHES DU SYSTÈME CHEOPS (STYLE WINDOWS XP LUNA AUTHENTIQUE) */}
      <footer className="xp-taskbar-bg h-8.5 px-0 flex items-center justify-between gap-1 shrink-0 z-30 shadow-2xl font-sans text-xs select-none relative">
        
        {/* GAUCHE : BOUTON DÉMARRER ET ONGLETS DES FENÊTRES OUVERTES */}
        <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto h-full py-0.5 pl-0 pr-1">
          
          {/* BOUTON DÉMARRER WINDOWS XP LUNA */}
          <div className="relative shrink-0 h-full">
            <button
              type="button"
              id="btn-demarrer-cheops"
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playUiClick();
                setStartMenuOpen(!startMenuOpen);
              }}
              className="xp-start-button h-full px-3 flex items-center gap-1.5 rounded-r-xl cursor-pointer text-white font-black italic text-xs tracking-wider shadow-md select-none"
            >
              <div className="w-4.5 h-4.5 rounded-full bg-white/20 border border-white/80 flex items-center justify-center text-[10px] not-italic shadow-xs">
                🇫🇷
              </div>
              <span className="tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Démarrer</span>
            </button>

            {/* MENU DÉMARRER AUTHENTIQUE WINDOWS XP À DEUX COLONNES */}
            {startMenuOpen && (
              <div
                className="absolute bottom-full left-0 mb-1 w-96 bg-white border-2 border-[#0055ea] shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 text-xs font-sans rounded-t-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* BANDEAU SUPÉRIEUR BLEU UTILISATEUR */}
                <div className="bg-gradient-to-r from-[#1c48a6] via-[#245edb] to-[#1c48a6] p-2 text-white flex items-center gap-2.5 border-b border-[#0f307a]">
                  <div className="w-10 h-10 rounded-sm border-2 border-white/80 bg-[#0c245c] flex items-center justify-center font-bold text-amber-300 text-base shadow-inner">
                    👮
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      AGENT DE CONFORMITÉ 7501923
                    </div>
                    <div className="text-[10px] text-sky-200">
                      Direction Centrale de la Sécurité Publique // CHEOPS
                    </div>
                  </div>
                </div>

                {/* CORPS À DEUX COLONNES XP (BLANC À GAUCHE, BLEU DOUX À DROITE) */}
                <div className="flex bg-white">
                  {/* COLONNE GAUCHE (BLANCHE) : APPLICATIONS DU SYSTÈME */}
                  <div className="w-3/5 p-2 flex flex-col justify-between border-r border-[#d4d0c8]">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-0.5 px-1">
                        Applications d'instruction :
                      </div>
                      {systemApps.map((app) => {
                        const Icon = app.icon;
                        return (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              soundFx.playUiClick();
                              onFocusWindow(app.id);
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 cursor-pointer rounded-none text-left group transition-colors"
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              <Icon className={`w-4 h-4 ${app.color} group-hover:text-white`} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs truncate leading-tight">{app.label}</div>
                              <div className="text-[9px] text-slate-400 group-hover:text-white/80 truncate">
                                Module CHEOPS-32
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* SOUS-MENU SURVOLABLE "TOUS LES PROGRAMMES ⯈" */}
                    <div className="border-t border-[#d4d0c8] pt-1 mt-1 relative">
                      <button
                        type="button"
                        onMouseEnter={() => setActiveStartSubmenu("programs")}
                        onClick={() => setActiveStartSubmenu((prev) => (prev === "programs" ? null : "programs"))}
                        className={`w-full px-2 py-1.5 flex items-center justify-between text-slate-900 font-bold text-xs cursor-pointer ${
                          activeStartSubmenu === "programs"
                            ? "bg-[#316ac5] text-white"
                            : "hover:bg-[#316ac5] hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-emerald-600 text-xs">▶</span>
                          <span>Tous les programmes</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* FLYOUT EN CASCADE DÉROULANT DES ACCESSOIRES ET OUTILS */}
                      {activeStartSubmenu === "programs" && (
                        <div
                          className="absolute left-full bottom-0 w-68 bg-white border-2 border-[#0055ea] shadow-2xl p-1 z-50 text-xs flex flex-col gap-0.5 rounded-r-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-[10px] text-slate-600 font-bold uppercase px-2 py-1 border-b border-[#d8d4c4] bg-[#ece9d8]">
                            📁 Accessoires de brigade :
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playUiClick();
                              setShowMinesweeper(true);
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1.5 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <Bomb className="w-4 h-4 text-rose-600" />
                            <span className="font-bold">Démineur de manifestation</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playPaperRustle();
                              setShowNotepad(true);
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1.5 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-amber-600" />
                            <span className="font-bold">Bloc-notes ministériel</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playUiClick();
                              setShowCalc(true);
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1.5 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <CalcIcon className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold">Calculatrice des primes</span>
                          </button>

                          <div className="text-[10px] text-slate-600 font-bold uppercase px-2 py-1 border-b border-[#d8d4c4] border-t bg-[#ece9d8] mt-1">
                            📁 Outils d'administration CHEOPS :
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playUiClick();
                              onNavigateToPath("/C:/CIRCULAIRES");
                              onFocusWindow("explorer");
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <span>🛡️</span>
                            <span>Journal des outrages contentieux</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onBroyerPiece();
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <span>💾</span>
                            <span>Nettoyage de disque préfectoral</span>
                          </button>

                          <div className="text-[10px] text-slate-600 font-bold uppercase px-2 py-1 border-b border-[#d8d4c4] border-t bg-[#ece9d8] mt-1">
                            📁 Divertissements de brigade :
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onToggleNotes?.();
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <span>☕</span>
                            <span>Pause-café du commissariat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playTelexBeep();
                              alert("Fréquence radio 148.550 MHz : « Toutes les unités, surveillez le secteur République. Des caméras citoyennes ont été signalées. »");
                              setStartMenuOpen(false);
                            }}
                            className="px-2 py-1 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 text-left cursor-pointer"
                          >
                            <span>📻</span>
                            <span>Radio Police FM (Interférences)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* COLONNE DROITE (BLEU CLAIR XP #d3e5fa) : SERVICES ET RESSOURCES */}
                  <div className="w-2/5 bg-[#d3e5fa] p-2 flex flex-col justify-between text-slate-800 border-l border-white">
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] text-[#003366] font-bold uppercase mb-0.5 px-1">
                        Ressources d'État :
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playPaperRustle();
                          onNavigateToPath(caseFolderPath);
                          onFocusWindow("explorer");
                          setStartMenuOpen(false);
                        }}
                        className="px-2 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-2 cursor-pointer text-left group"
                      >
                        <Folder className="w-4 h-4 text-amber-600 group-hover:text-white" />
                        <span className="font-bold text-xs truncate">Mes documents</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playUiClick();
                          onNavigateToPath("/C:");
                          onFocusWindow("explorer");
                          setStartMenuOpen(false);
                        }}
                        className="px-2 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-2 cursor-pointer text-left group"
                      >
                        <HardDrive className="w-4 h-4 text-[#003366] group-hover:text-white" />
                        <span className="font-bold text-xs">Poste de travail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playPaperRustle();
                          onOpenGuide();
                          setStartMenuOpen(false);
                        }}
                        className="px-2 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-2 cursor-pointer text-left group"
                      >
                        <BookOpen className="w-4 h-4 text-amber-700 group-hover:text-white" />
                        <span className="font-bold text-xs leading-tight">Doctrine Art. L. 435-1 CSI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playUiClick();
                          onOpenBoutique();
                          setStartMenuOpen(false);
                        }}
                        className="px-2 py-1 hover:bg-[#316ac5] hover:text-white flex items-center justify-between cursor-pointer text-left group"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-emerald-700 group-hover:text-white" />
                          <span className="font-bold text-xs">Mutuelle</span>
                        </span>
                        <span className="font-black text-[11px] text-emerald-700 group-hover:text-white">{primeTotale}€</span>
                      </button>

                      <div className="border-t border-[#b8cfe8] my-0.5" />

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playUiClick();
                          setShowDisplayProps(true);
                          setStartMenuOpen(false);
                        }}
                        className="px-2 py-1 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 cursor-pointer text-left group text-xs"
                      >
                        <Sliders className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
                        <span>Panneau de config.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playUiClick();
                          setShowRunDialog(true);
                          setStartMenuOpen(false);
                        }}
                        className="px-2 py-1 hover:bg-[#316ac5] hover:text-white text-slate-800 flex items-center gap-2 cursor-pointer text-left group text-xs"
                      >
                        <span className="text-xs">🏃</span>
                        <span>Exécuter...</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onBroyerPiece();
                          setStartMenuOpen(false);
                        }}
                        className="px-2 py-1 hover:bg-[#c00000] hover:text-white text-rose-800 flex items-center gap-2 cursor-pointer text-left group text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Vider corbeille</span>
                      </button>

                      {/* INSTALLATION STANDALONE PWA */}
                      {!isInstalled && (
                        <button
                          type="button"
                          onClick={() => {
                            setStartMenuOpen(false);
                            handlePWAInstallClick();
                          }}
                          className="px-2 py-1.5 bg-[#eaf2ff] hover:bg-[#316ac5] text-[#003366] hover:text-white flex items-center justify-between cursor-pointer text-left group text-xs border border-[#7f9db9] font-bold mt-1"
                          title="Installer CHEOPS en application autonome sur votre poste ou smartphone"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Download className="w-3.5 h-3.5 text-[#0055ea] group-hover:text-white shrink-0" />
                            <span className="truncate">Installer application</span>
                          </div>
                          <span className="text-[9px] bg-[#0055ea] text-white px-1 py-0.2 group-hover:bg-white group-hover:text-[#0055ea] font-mono shrink-0">
                            APP
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* BANDEAU INFÉRIEUR FERMETURE DE SESSION */}
                <div className="bg-gradient-to-r from-[#245edb] to-[#1846aa] p-2 flex items-center justify-between border-t border-[#4682f0] text-white">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playWindowClose();
                      setStartMenuOpen(false);
                    }}
                    className="px-2 py-1 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer rounded-xs"
                  >
                    <span>🔒 Fermer session</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playWindowClose();
                      alert("CHEOPS Professionnel : La continuité républicaine interdit l'extinction du poste pendant les heures de contentieux !");
                      setStartMenuOpen(false);
                    }}
                    className="px-2 py-1 bg-red-700/80 hover:bg-red-600 text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer rounded-xs border border-red-500"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <span>Arrêter</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SÉPARATEUR VERTICAL XP */}
          <div className="h-5 w-px bg-[#1844a4] border-r border-[#4c7fe0] mx-0.5 shrink-0" />

          {/* ONGLETS DES FENÊTRES OUVERTES (STYLE TASKBAR XP LUNA) */}
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 h-full py-0.5">
            {systemApps.map((tab) => {
              const win = openWindows[tab.id];
              if (!win?.isOpen) return null;
              const Icon = tab.icon;
              const isActive = activeWindowId === tab.id && !win.isMinimized;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundFx.playUiClick();
                    onToggleWindow(tab.id);
                  }}
                  className={`h-6.5 px-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer rounded-xs select-none ${
                    isActive
                      ? "xp-taskbar-tab-active max-w-[170px]"
                      : win.isMinimized
                      ? "xp-taskbar-tab opacity-70 max-w-[150px]"
                      : "xp-taskbar-tab max-w-[170px]"
                  }`}
                  title={win.isMinimized ? `Restaurer ${tab.label}` : `Afficher/Masquer ${tab.label}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}

            {openedDocument && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playPaperRustle();
                  onToggleWindow("document");
                }}
                className={`h-6.5 px-2.5 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer rounded-xs select-none ${
                  activeWindowId === "document" && !openWindows.document?.isMinimized
                    ? "xp-taskbar-tab-active max-w-[180px]"
                    : "xp-taskbar-tab max-w-[180px]"
                }`}
                title="Pièce en cours de consultation"
              >
                <FileText className="w-3.5 h-3.5 text-rose-300" />
                <span className="truncate">{openedDocument.name}</span>
              </button>
            )}
          </div>

        </div>

        {/* DROITE : SYSTEM TRAY WINDOWS XP LUNA (ZONE DE NOTIFICATION AUTHENTIQUE) */}
        <div className="xp-systray h-full px-2.5 flex items-center gap-2 font-sans text-xs text-white shrink-0 ml-auto select-none">
          
          {/* Progression du Quart de Travail (Shift Progress) */}
          <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 bg-[#082055] border-t border-l border-[#041233] border-b border-r border-[#1a44a7] text-[10px] font-bold">
            <span className="text-sky-200">QUART :</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: totalDossiers }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-none border text-[6px] font-black flex items-center justify-center ${
                    i < dossierIndex
                      ? "bg-[#00ff66] border-[#00ff66] text-black"
                      : i === dossierIndex
                      ? "bg-amber-400 border-white text-black animate-pulse"
                      : "bg-[#061536] border-slate-600 text-slate-500"
                  }`}
                  title={`Dossier #${i + 1}`}
                />
              ))}
            </div>
            <span className="text-amber-300 ml-0.5">{dossierIndex + 1}/{totalDossiers}</span>
          </div>

          {/* Notification de saisine */}
          <button
            type="button"
            onClick={missionNotificationOpen ? onCloseMissionNotification : onOpenMissionNotification}
            className={`p-1 border rounded-none cursor-pointer ${
              missionNotificationOpen
                ? "bg-amber-400 text-black border-amber-200 font-bold"
                : "bg-[#082055] border-[#1a44a7] text-amber-300 hover:text-white"
            }`}
            title="Notification de la mission en cours"
          >
            <Bell className="w-3 h-3" />
          </button>

          {/* Pause Café / Mémos */}
          {onToggleNotes && (
            <button
              type="button"
              onClick={onToggleNotes}
              className={`p-1 border rounded-none cursor-pointer ${
                notesOuvertes
                  ? "bg-amber-800 text-amber-100 border-amber-400"
                  : "bg-[#082055] border-[#1a44a7] text-slate-200 hover:text-white"
              }`}
              title="Pause café et mémos du bureau"
            >
              <Coffee className="w-3 h-3" />
            </button>
          )}

          {/* Bouton d'installation Standalone (PWA) */}
          {!isInstalled && (
            <button
              type="button"
              onClick={handlePWAInstallClick}
              className="p-1 border border-emerald-400/80 bg-emerald-950 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-none cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              title="Installer CHEOPS en application autonome (PWA)"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span className="hidden xl:inline">INSTALLER APP</span>
            </button>
          )}

          {/* Crédibilité */}
          <div
            className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 border text-[11px] font-bold ${
              credibiliteMinistere >= 60
                ? "bg-[#072d15] border-emerald-500 text-emerald-300"
                : "bg-[#380b0b] border-red-500 text-red-300"
            }`}
            title="Crédibilité institutionnelle du Ministère"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{credibiliteMinistere}%</span>
          </div>

          {/* Blâmes */}
          <div
            className={`flex items-center gap-1 px-1.5 py-0.5 border text-[11px] font-bold ${
              blames > 0
                ? "bg-red-950 border-red-500 text-red-300"
                : "bg-[#082055] border-[#1a44a7] text-slate-300"
            }`}
            title="Blâmes disciplinaires (Révocation à 3)"
          >
            <span className="text-[10px]">BLÂMES:</span>
            <span className={blames > 0 ? "text-red-400 font-black" : "text-white"}>{blames}/3</span>
          </div>

          {/* Primes */}
          <div
            className="flex items-center gap-1 bg-[#072d15] border border-emerald-500/80 px-1.5 py-0.5 text-[11px] font-bold text-emerald-300"
            title="Primes de qualification accumulées"
          >
            <Coins className="w-3 h-3" />
            <span>+{primeTotale}€</span>
          </div>

          {/* Pointeuse / Horodateur de vacation (Option A) */}
          {!isChronoStarted ? (
            <button
              type="button"
              id="systray-btn-chrono"
              onClick={() => {
                if (onStartChrono) {
                  onStartChrono();
                }
              }}
              className="flex items-center gap-1 bg-[#003366] hover:bg-[#002244] border border-[#7f9db9] px-2 py-0.5 text-[11px] font-bold text-amber-300 cursor-pointer shadow-xs active:translate-y-0.5"
              title="Prendre en charge le dossier / Ouvrir l'instruction (Raccourci P)"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">PRENDRE EN CHARGE // POINTER</span>
              <span className="text-[10px] text-white font-mono ml-0.5">[P]</span>
            </button>
          ) : (
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 border text-[11px] font-bold font-mono ${
                timeRemaining <= 10
                  ? "bg-red-950 border-red-500 text-red-300 animate-pulse"
                  : timeRemaining <= 25
                  ? "bg-amber-950 border-amber-500 text-amber-300"
                  : "bg-[#001c54] border-sky-400 text-[#00ff66]"
              }`}
              title="Délai d'instruction en cours"
            >
              <Clock className="w-3 h-3" />
              <span>
                {timeRemaining >= 60
                  ? `${Math.floor(timeRemaining / 60)}:${Math.floor(timeRemaining % 60).toString().padStart(2, "0")}`
                  : `${timeRemaining.toFixed(1)}s`}
              </span>
            </div>
          )}

          {/* Horloge numérique XP */}
          <div className="hidden md:flex items-center gap-1 text-white text-[11px] font-bold px-1">
            <Clock className="w-3 h-3 text-sky-300" />
            <span>{timeStr}</span>
          </div>

          {/* CONTRÔLE DU VOLUME & AMBIANCE PC SYSTRAY (SndVol32) */}
          <div className="relative">
            <button
              type="button"
              id="systray-btn-volume"
              onClick={() => {
                soundFx.playUiClick();
                setShowVolumeControl((prev) => !prev);
              }}
              className={`p-1 border rounded-none cursor-pointer flex items-center justify-center ${
                showVolumeControl
                  ? "bg-[#225ad9] text-white border-white"
                  : isMuted
                  ? "bg-red-950 border-red-500 text-red-300"
                  : isAmbianceActive
                  ? "bg-[#0b3366] border-[#316ac5] text-[#00ff66] hover:text-white"
                  : "bg-[#082055] border-[#1a44a7] text-sky-300 hover:text-white"
              }`}
              title="Contrôle du volume & Ambiance bureau (SndVol32)"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 text-red-400" />
              ) : (
                <Volume2 className={`w-3 h-3 ${isAmbianceActive ? "text-[#00ff66]" : "text-sky-300"}`} />
              )}
            </button>

            {/* POPUP SndVol32 STYLE WINDOWS XP */}
            {showVolumeControl && (
              <div
                className="absolute bottom-full right-0 mb-2 w-72 bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-[3px_3px_12px_rgba(0,0,0,0.65)] font-sans text-xs text-black p-2 z-50 select-none animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Barre de titre Win32 */}
                <div className="bg-gradient-to-r from-[#0a246a] via-[#1e57c8] to-[#a6caf0] text-white px-2 py-1 font-bold text-[11px] flex items-center justify-between shadow-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Contrôle du volume // SndVol32</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVolumeControl(false)}
                    className="w-4 h-4 bg-[#ece9d8] hover:bg-red-600 text-black hover:text-white border border-t-white border-l-white border-b-[#808080] border-r-[#808080] font-bold text-[10px] flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Section 1 : Master Mute */}
                <div className="bg-[#f5f3ec] border border-[#9c9a91] p-2 mb-2 shadow-[inset_1px_1px_0_#fff]">
                  <div className="font-bold text-[#003366] text-[11px] mb-1 flex items-center justify-between">
                    <span>AUDIO GÉNÉRAL</span>
                    <span className={isMuted ? "text-red-600 font-bold" : "text-emerald-700 font-bold"}>
                      {isMuted ? "● MODE SILENCIEUX" : "● ACTIF"}
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px]">
                    <input
                      type="checkbox"
                      checked={isMuted}
                      onChange={() => {
                        const next = !isMuted;
                        soundFx.setMuted(next);
                        setIsMuted(next);
                      }}
                      className="cursor-pointer"
                    />
                    <span>Couper tous les sons (Muet)</span>
                  </label>
                </div>

                {/* Section 2 : Ambiance Tour PC & Bureau Administratif */}
                <div className="bg-[#f5f3ec] border border-[#9c9a91] p-2 mb-2 shadow-[inset_1px_1px_0_#fff]">
                  <div className="font-bold text-[#003366] text-[11px] mb-1 flex items-center justify-between">
                    <span>AMBIANCE BUREAU & TOUR PC</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = soundFx.toggleAmbiance();
                        setIsAmbianceActive(next);
                      }}
                      className={`px-2 py-0.5 border text-[10px] font-bold cursor-pointer transition-colors ${
                        isAmbianceActive
                          ? "bg-[#2e7d32] text-white border-[#1b5e20]"
                          : "bg-[#808080] text-white border-black"
                      }`}
                    >
                      {isAmbianceActive ? "ACTIF [ON]" : "COUPÉ [OFF]"}
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-600 mb-1.5 leading-snug">
                    Souffle continu du ventilateur Pentium 4, vibration de tôle et néon 50 Hz.
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">Doux</span>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={ambianceVol}
                      disabled={!isAmbianceActive || isMuted}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setAmbianceVol(val);
                        soundFx.setAmbianceVolume(val);
                      }}
                      className="flex-1 cursor-pointer accent-[#0055ea]"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">Fort</span>
                  </div>
                </div>

                {/* Section 2.5 : Micro-événements de bureau CHEOPS (Kit A1) */}
                <div className="bg-[#f5f3ec] border border-[#9c9a91] p-2 mb-2 shadow-[inset_1px_1px_0_#fff]">
                  <div className="font-bold text-[#003366] text-[11px] mb-1 flex items-center justify-between">
                    <span>MICRO-ÉVÉNEMENTS BUREAU</span>
                    <span className="text-[9px] text-slate-500 font-mono">Kit A1</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mb-1.5 leading-snug">
                    Clavier collègue, photocopieuse, tasse, classeur, téléphone, agrafeuse.
                  </div>

                  {/* Choix de la cadence */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] text-slate-600 font-semibold">Fréquence :</span>
                    <div className="flex gap-1">
                      {(
                        [
                          { key: "fast", label: "Dynamique" },
                          { key: "normal", label: "Standard" },
                          { key: "slow", label: "Discrète" },
                        ] as const
                      ).map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          disabled={!isAmbianceActive || isMuted}
                          onClick={() => {
                            setOfficePace(key);
                            soundFx.setOfficeEventPace(key);
                          }}
                          className={`px-1.5 py-0.5 text-[9px] font-bold border transition-colors cursor-pointer ${
                            officePace === key
                              ? "bg-[#003366] text-white border-black"
                              : "bg-[#ece9d8] text-slate-700 border-[#9c9a91] hover:bg-[#d8d4c4]"
                          } ${(!isAmbianceActive || isMuted) ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bouton de test direct avec retour visuel immédiat */}
                  <div className="pt-1 border-t border-[#d8d4c4]">
                    <button
                      type="button"
                      disabled={isMuted}
                      onClick={async () => {
                        const name = await soundFx.playRareOfficeSound();
                        if (name) {
                          setLastTestedSound(name);
                          setTimeout(() => setLastTestedSound(null), 3000);
                        }
                      }}
                      className="w-full px-2 py-1 bg-[#ece9d8] hover:bg-[#d8d4c4] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white text-[10px] font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-3 h-3 text-[#003366]" />
                      <span>
                        {lastTestedSound
                          ? `Écouté : ${lastTestedSound}`
                          : "Écouter un son de bureau"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Section 3 : Bruitage Souris Vintage */}
                <div className="bg-[#f5f3ec] border border-[#9c9a91] p-2 mb-2 shadow-[inset_1px_1px_0_#fff]">
                  <label className="flex items-center justify-between cursor-pointer text-[11px]">
                    <div className="flex flex-col pr-2">
                      <span className="font-bold text-[#003366]">Clic de vieille souris</span>
                      <span className="text-[10px] text-slate-600">
                        Bruitage tactile microswitch à chaque clic
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isRetroMouse}
                      onChange={() => {
                        const next = !isRetroMouse;
                        soundFx.setRetroMouseActive(next);
                        setIsRetroMouse(next);
                      }}
                      className="cursor-pointer"
                    />
                  </label>
                </div>

                {/* Section 4 : Test Disque Dur */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#9c9a91]">
                  <span className="text-[10px] text-slate-600">Disque dur ATA IDE :</span>
                  <button
                    type="button"
                    onClick={() => soundFx.playHddSeek("heavy")}
                    className="px-2 py-1 bg-[#ece9d8] hover:bg-[#d8d4c4] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white text-[10px] font-bold text-black flex items-center gap-1 cursor-pointer"
                  >
                    <HardDrive className="w-3 h-3 text-slate-600" />
                    <span>Gratter le disque dur</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Plein Écran */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1 text-white hover:bg-white/20 border border-[#1a44a7] cursor-pointer rounded-none"
            title="Basculer le plein écran"
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>

      </footer>

      {/* 5 BOÎTES D'APPLICATIONS PARODIQUES WINDOWS XP */}
      <MinesweeperDialog isOpen={showMinesweeper} onClose={() => setShowMinesweeper(false)} />
      <NotepadDialog isOpen={showNotepad} onClose={() => setShowNotepad(false)} />
      <CalculatorDialog isOpen={showCalc} onClose={() => setShowCalc(false)} onAddBonus={undefined} />
      <RunDialog
        isOpen={showRunDialog}
        onClose={() => setShowRunDialog(false)}
        onRunCommand={(cmd) => {
          const lower = cmd.toLowerCase();
          if (lower.includes("calc")) setShowCalc(true);
          else if (lower.includes("note")) setShowNotepad(true);
          else if (lower.includes("mine") || lower.includes("dem")) setShowMinesweeper(true);
          else if (lower.includes("prop") || lower.includes("desk")) setShowDisplayProps(true);
          else onFocusWindow("explorer");
        }}
      />
      <DisplayPropertiesDialog
        isOpen={showDisplayProps}
        onClose={() => setShowDisplayProps(false)}
        wallpaperTheme={wallpaperTheme}
        onSelectWallpaper={setWallpaperTheme}
      />
    </div>
  );
};
