import { useState, useEffect, useRef, useCallback, type CSSProperties, type MouseEvent, type TouchEvent, type DragEvent } from "react";
import {
  FileText,
  Camera,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Coffee,
  Award,
  Stamp,
  Scale,
  Search,
  ShoppingCart,
  Trash2,
  Maximize2,
  Minimize2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Radio,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  PenTool,
  Lock,
  Unlock,
  CornerDownRight,
  TrendingUp,
} from "lucide-react";
import {
  dossiers,
  Dossier,
  TAMPONS_DISPONIBLES,
  TamponOption,
  ACTUALITES_CONTINU,
  GRADES,
  TermeCaviarde,
  PieceASubstituer,
  BOUTIQUE_EQUIPEMENTS,
  EquipementBoutique,
} from "./dossiers";
import { generateFileSystemForDossier, getPrimaryCaseFile, VirtualFile } from "./fileSystem";
import { DiegeticTopBar } from "./components/DiegeticTopBar";
import { HumanDbWindow } from "./components/HumanDbWindow";
import { VideoPlayerWindow } from "./components/VideoPlayerWindow";
import { MessagingWindow } from "./components/MessagingWindow";
import { DiegeticTaskbar } from "./components/DiegeticTaskbar";
import { ProceduralWorkflowBar } from "./components/ProceduralWorkflowBar";
import { OfficeCosmetics } from "./components/OfficeCosmetics";
import { DesktopWorkspace, WindowId } from "./components/DesktopWorkspace";
import { soundFx } from "./services/soundFx";
import { InvestigationObjectives } from "./components/InvestigationObjectives";
import { OfficerEvaluationReportModal } from "./components/OfficerEvaluationReportModal";
import { DecisionVerdictModal } from "./components/DecisionVerdictModal";
import { TelegramBannerToast, TelegramAlert } from "./components/TelegramBannerToast";
import {
  jouerSonTampon,
  jouerSonAlerteTelegramme,
  jouerSonPrime,
  jouerSonGlitch,
  jouerSonBlame,
  jouerSonFeutre,
  jouerSonSubstitut,
  jouerSonBroyeur,
  jouerSonSaisie,
  jouerSonCombo,
  jouerSonAchat,
  jouerSonOutrageRiposte,
  jouerSonRio,
} from "./audio";

type GameState = "intro" | "playing" | "gameover" | "completed";

interface StampResult {
  tamponLabel: string;
  isCorrect: boolean;
  angle: number;
  code: string;
}

interface FeedbackState {
  correct: boolean;
  tamponTente: string;
  tamponAttendu?: string;
  motifErreur?: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(180.0);
  const [maxTime, setMaxTime] = useState<number>(180.0);
  const [activeStamp, setActiveStamp] = useState<StampResult | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [totalProcessed, setTotalProcessed] = useState<number>(0);
  const [blames, setBlames] = useState<number>(0);
  const [gameOverReason, setGameOverReason] = useState<"timeout" | "blames" | "credibilite">("blames");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isAwaitingNext, setIsAwaitingNext] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showMobileGuide, setShowMobileGuide] = useState<boolean>(false);
  const [urlCopied, setUrlCopied] = useState<boolean>(false);

  // Chrono & Pointeuse Option A
  const [isChronoStarted, setIsChronoStarted] = useState<boolean>(false);
  const [chronoCadenceActive, setChronoCadenceActive] = useState<boolean>(false);
  const [autoPunchNext, setAutoPunchNext] = useState<boolean>(false);

  // Satire procédurale & dynamisme
  const [primeTotale, setPrimeTotale] = useState<number>(0);
  const [dernierePrime, setDernierePrime] = useState<number | null>(null);
  const [credibiliteMinistere, setCredibiliteMinistere] = useState<number>(85);
  const [telegrammeActif, setTelegrammeActif] = useState<boolean>(false);
  const [cameraNeutralisee, setCameraNeutralisee] = useState<boolean>(true);
  const [cameraGlitchActive, setCameraGlitchActive] = useState<boolean>(false);
  const [cameraBloqueeNotice, setCameraBloqueeNotice] = useState<boolean>(false);
  const [newsTickerIndex, setNewsTickerIndex] = useState<number>(0);
  const [flashNews, setFlashNews] = useState<string | null>(null);
  const [deskTooltip, setDeskTooltip] = useState<string | null>(null);

  // Déductions & Arbitrages (Gameplay d'enquête bureaucratique)
  const [rioDecision, setRioDecision] = useState<"flouter" | "valider" | null>(null);
  const [rioFeedback, setRioFeedback] = useState<{ valide: boolean; explication: string; bonus: number } | null>(null);
  const [cameraDecision, setCameraDecision] = useState<"neutralisee" | "conservee" | null>(null);
  const [cameraFeedback, setCameraFeedback] = useState<{ valide: boolean; explication: string; bonus: number } | null>(null);
  const [caviardagesErreurs, setCaviardagesErreurs] = useState<Set<string>>(new Set());

  // Gamification Absurde & Dénonciation Systémique
  const [paxSociale, setPaxSociale] = useState<number>(84);
  const [comboZeile, setComboZeile] = useState<number>(0);
  const [equipementsPossedes, setEquipementsPossedes] = useState<Set<string>>(new Set());
  const [isBoutiqueOpen, setIsBoutiqueOpen] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"humandb" | "video" | "chat">("video");
  const [activeContactId, setActiveContactId] = useState<string>("montmirail");
  const [rioInspecteDossier, setRioInspecteDossier] = useState<boolean>(false);
  const [riposteDeclenchee, setRiposteDeclenchee] = useState<boolean>(false);
  const [notesDuPosteOuvertes, setNotesDuPosteOuvertes] = useState<boolean>(false);
  const [fuitesTransmises, setFuitesTransmises] = useState<Set<string>>(new Set());

  // Manipulations avancées : Glisser-déposer, Caviardage, Substitution & Broyeuse
  const [caviardagesFaits, setCaviardagesFaits] = useState<Set<string>>(new Set());
  const [modeFeutreActif, setModeFeutreActif] = useState<boolean>(true);
  const [substitutionsFaites, setSubstitutionsFaites] = useState<Set<string>>(new Set());
  const [draggedTampon, setDraggedTampon] = useState<TamponOption | null>(null);
  const [isDropZoneOver, setIsDropZoneOver] = useState<boolean>(false);
  const [isExhibitDropOver, setIsExhibitDropOver] = useState<boolean>(false);
  const [broyeurAnime, setBroyeurAnime] = useState<boolean>(false);
  const [documentsBroyes, setDocumentsBroyes] = useState<number>(0);
  const [touchGhostPos, setTouchGhostPos] = useState<{ x: number; y: number } | null>(null);

  // Flags procéduraux de session pour conséquences différées déductives
  const [notaireProtege2144, setNotaireProtege2144] = useState<boolean>(false);
  const [videoNeutralisee0942, setVideoNeutralisee0942] = useState<boolean>(false);
  const [rioFloute2011, setRioFloute2011] = useState<boolean>(false);

  // Système de fichiers diégétique (Navigation, Répertoire et Bureau OS)
  const initialDossier = dossiers[0];
  const [currentPath, setCurrentPath] = useState<string>(
    `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${initialDossier.id}`
  );
  const [openedDocument, setOpenedDocument] = useState<VirtualFile | null>(null);
  const [discoveredFiles, setDiscoveredFiles] = useState<Set<string>>(new Set());
  const [nextZIndex, setNextZIndex] = useState<number>(20);
  const [activeWindowId, setActiveWindowId] = useState<WindowId>("qualification");
  const [missionNotificationOpen, setMissionNotificationOpen] = useState<boolean>(true);
  const [floatingBonus, setFloatingBonus] = useState<{ text: string; id: number } | null>(null);
  const [openWindows, setOpenWindows] = useState<
    Record<WindowId, { isOpen: boolean; isMinimized: boolean; zIndex: number }>
  >({
    explorer: { isOpen: false, isMinimized: false, zIndex: 10 },
    document: { isOpen: false, isMinimized: false, zIndex: 12 },
    qualification: { isOpen: true, isMinimized: false, zIndex: 11 },
    video: { isOpen: false, isMinimized: false, zIndex: 6 },
    humandb: { isOpen: false, isMinimized: false, zIndex: 5 },
    messages: { isOpen: false, isMinimized: false, zIndex: 4 },
    scelles: { isOpen: false, isMinimized: false, zIndex: 3 },
    rio: { isOpen: false, isMinimized: false, zIndex: 2 },
  });

  // Notification administrative de verrouillage avant pointage (Patch R1)
  const notifierAccesRefuse = useCallback(() => {
    soundFx.playSystemWarning();
    jouerSonBlame();
    setFlashNews("ACCÈS REFUSÉ : Aucune instruction active. Pointez la prise en charge du dossier pour accéder aux pièces.");
    setTimeout(() => setFlashNews(null), 4500);
    setFloatingBonus({ text: "🔒 ACCÈS REFUSÉ — POINTEZ D'ABORD", id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 1800);
  }, []);

  const handleToggleWindow = useCallback(
    (id: WindowId) => {
      if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
        if (id !== "qualification") {
          notifierAccesRefuse();
          return;
        }
      }
      setOpenWindows((prev) => {
        const win = prev[id] || { isOpen: false, isMinimized: false, zIndex: 1 };

        if (win.isOpen && !win.isMinimized && activeWindowId === id) {
          // Minimiser
          return {
            ...prev,
            [id]: { ...win, isMinimized: true },
          };
        }

        // Ouvrir ou Restaurer au premier plan
        const currentMax = Math.max(
          ...Object.values(prev).map((w) => w?.zIndex || 0),
          10
        );
        const newZ = currentMax + 1;
        setNextZIndex(newZ + 1);
        setActiveWindowId(id);

        return {
          ...prev,
          [id]: { isOpen: true, isMinimized: false, zIndex: newZ },
        };
      });
    },
    [activeWindowId, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]
  );

  const handleFocusWindow = useCallback((id: WindowId) => {
    let targetId = id;
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      if (id !== "qualification") {
        notifierAccesRefuse();
        targetId = "qualification";
      }
    }
    soundFx.playWindowOpen();
    setActiveWindowId(targetId);
    setOpenWindows((prev) => {
      const currentMax = Math.max(
        ...Object.values(prev).map((w) => w?.zIndex || 0),
        10
      );
      const newZ = currentMax + 1;
      setNextZIndex(newZ + 1);

      return {
        ...prev,
        [targetId]: {
          ...(prev[targetId] || { isOpen: true, isMinimized: false }),
          isOpen: true,
          isMinimized: false,
          zIndex: newZ,
        },
      };
    });
  }, [gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  const handleCloseWindow = useCallback((id: WindowId) => {
    setOpenWindows((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { isMinimized: false, zIndex: 1 }),
        isOpen: false,
      },
    }));
  }, []);

  const handleOpenFile = useCallback(
    (file: VirtualFile) => {
      if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
        notifierAccesRefuse();
        return;
      }
      soundFx.playHddSeek("short");
      // Marquer comme examiné pour le suivi d'enquête
      setDiscoveredFiles((prev) => {
        const next = new Set(prev);
        if (!next.has(file.id)) {
          next.add(file.id);
          if (file.isCrucialClue) {
            setPrimeTotale((p) => p + 15);
            setFloatingBonus({ text: "🔍 INDICE FORENSIQUE (+15 €)", id: Date.now() });
            setTimeout(() => setFloatingBonus(null), 1500);
            jouerSonPrime();
          }
        }
        return next;
      });

      // Routage selon le type d'élément
      if (file.extension === "cctv") {
        handleFocusWindow("video");
      } else if (file.extension === "rio") {
        handleFocusWindow("rio");
      } else if (file.extension === "taj") {
        handleFocusWindow("humandb");
      } else if (file.extension === "scelle") {
        handleFocusWindow("scelles");
      } else if (file.extension === "visa") {
        handleFocusWindow("qualification");
      } else if (file.extension === "telex") {
        handleFocusWindow("messages");
      } else {
        setOpenedDocument(file);
        handleFocusWindow("document");
      }
    },
    [handleFocusWindow, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]
  );

  // Accès direct et instantané à la pièce maîtresse du dossier en cours
  const ouvrirPieceMaitresse = useCallback(() => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    const current = dossiers[currentIndex];
    if (!current) return;
    const pvFile = getPrimaryCaseFile(current);
    handleOpenFile(pvFile);
  }, [currentIndex, handleOpenFile, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Retours sensoriels & ludiques enrichis
  const [screenFlash, setScreenFlash] = useState<"success" | "error" | null>(null);
  const [telegramAlert, setTelegramAlert] = useState<TelegramAlert | null>(null);

  const declencherTelegramme = useCallback(
    (source: TelegramAlert["source"], message: string | any, priority: TelegramAlert["priority"] = "urgente") => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");

      let textMessage = "";
      if (typeof message === "string") {
        textMessage = message;
      } else if (message && typeof message === "object") {
        const alerte = message.alerte || message.titre || "";
        const ordre = message.ordre ? ` — Ordre : « ${message.ordre} »` : "";
        const bonus = message.primeBonus ? ` (+${message.primeBonus} €)` : "";
        textMessage = `${alerte}${ordre}${bonus}`.trim();
      } else {
        textMessage = String(message ?? "");
      }

      setTelegramAlert({
        id: String(Date.now()),
        source,
        message: textMessage,
        timestamp: `${h}:${m}:${s}`,
        priority,
      });
      jouerSonAlerteTelegramme();
      setTimeout(() => {
        setTelegramAlert(null);
      }, 7000);
    },
    []
  );

  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // Temps alloué : commence à 3 minutes (180s) pour le premier cas, puis réduction progressive équilibrée
  const calculateAllocatedTime = useCallback((index: number): number => {
    // Dossier 1 (index 0) : 180.0s (3 min)
    // Réduction progressive : -7.0s par dossier avec palier plancher de 90.0s pour le climax
    const baseTime = 180.0;
    const reduction = index * 7.0;
    const allocated = Math.max(90.0, Math.round((baseTime - reduction) * 10) / 10);
    return allocated;
  }, []);

  const startDossier = useCallback((index: number, shouldAutoStartChrono?: boolean) => {
    const current = dossiers[index];
    let allocated = calculateAllocatedTime(index);
    if (equipementsPossedes.has("cafe_syndical")) {
      allocated += 30.0;
    }
    setMaxTime(allocated);
    setTimeRemaining(allocated);
    setActiveStamp(null);
    setFeedback(null);
    setIsAwaitingNext(false);
    isProcessingRef.current = false;
    lastTickRef.current = performance.now();
    setCameraBloqueeNotice(false);

    // Initialisation du chrono selon le pointage joueur (Option A)
    const willStart = Boolean(shouldAutoStartChrono ?? autoPunchNext);
    setIsChronoStarted(willStart);
    if (willStart) {
      soundFx.playPointeusePunch();
    }

    // Réinitialisation des manipulations et arbitrages déductifs du dossier
    setCaviardagesFaits(new Set());
    setCaviardagesErreurs(new Set());
    setSubstitutionsFaites(new Set());
    setIsDropZoneOver(false);
    setIsExhibitDropOver(false);
    setDraggedTampon(null);
    setTouchGhostPos(null);
    setRioInspecteDossier(false);
    setRioDecision(null);
    setRioFeedback(null);
    setRiposteDeclenchee(false);

    // Initialisation caméra défaillante & arbitrage
    if (current && current.incidentCamera) {
      setCameraNeutralisee(false);
      setCameraGlitchActive(false);
      setCameraDecision(null);
      setCameraFeedback(null);
    } else {
      setCameraNeutralisee(true);
      setCameraGlitchActive(false);
      setCameraDecision("conservee");
      setCameraFeedback(null);
    }

    // Télégramme prioritaire du Préfet
    if (current && current.telegrammePrefet) {
      setTelegrammeActif(true);
      jouerSonAlerteTelegramme();
    } else {
      setTelegrammeActif(false);
    }

    // Réinitialisation du système de fichiers pour la nouvelle affaire
    if (current) {
      soundFx.playHddSeek("burst");
      const pvFile = getPrimaryCaseFile(current);
      setCurrentPath(`/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${current.id}`);

      if (willStart) {
        setOpenedDocument(pvFile);
        setDiscoveredFiles(new Set([pvFile.id]));
        setActiveWindowId("document");
        setOpenWindows({
          explorer: { isOpen: true, isMinimized: false, zIndex: 10 },
          document: { isOpen: true, isMinimized: false, zIndex: 12 },
          qualification: { isOpen: true, isMinimized: false, zIndex: 11 },
          video: { isOpen: false, isMinimized: false, zIndex: 6 },
          humandb: { isOpen: false, isMinimized: false, zIndex: 5 },
          messages: { isOpen: false, isMinimized: false, zIndex: 4 },
          scelles: { isOpen: false, isMinimized: false, zIndex: 3 },
          rio: { isOpen: false, isMinimized: false, zIndex: 2 },
        });
      } else {
        setOpenedDocument(null);
        setDiscoveredFiles(new Set());
        setActiveWindowId("qualification");
        setOpenWindows({
          explorer: { isOpen: false, isMinimized: false, zIndex: 10 },
          document: { isOpen: false, isMinimized: false, zIndex: 12 },
          qualification: { isOpen: true, isMinimized: false, zIndex: 11 },
          video: { isOpen: false, isMinimized: false, zIndex: 6 },
          humandb: { isOpen: false, isMinimized: false, zIndex: 5 },
          messages: { isOpen: false, isMinimized: false, zIndex: 4 },
          scelles: { isOpen: false, isMinimized: false, zIndex: 3 },
          rio: { isOpen: false, isMinimized: false, zIndex: 2 },
        });
      }

      setMissionNotificationOpen(true);

      // 1. Télégramme d'ordre hiérarchique prioritaire propre au dossier
      if (current.telegrammePrefet) {
        declencherTelegramme(
          "CABINET DU MINISTRE",
          `${current.telegrammePrefet.alerte} — Ordre : « ${current.telegrammePrefet.ordre} » (+${current.telegrammePrefet.primeBonus} €)`,
          "urgente"
        );
      }

      // 2. Émission d'échos institutionnels différés (temporisés si un ordre d'urgence préfectoral est déjà affiché)
      const emettreEchoDiffere = (
        source: TelegramAlert["source"],
        message: string,
        priority: TelegramAlert["priority"] = "consigne"
      ) => {
        if (current.telegrammePrefet) {
          setTimeout(() => {
            declencherTelegramme(source, message, priority);
          }, 7500);
        } else {
          declencherTelegramme(source, message, priority);
        }
      };

      if (index === 3 && notaireProtege2144) {
        // Conséquence différée 1 (suite à protection du notable DOS-B75-2144 sur l'Avenue Foch)
        emettreEchoDiffere(
          "DIRECTION DE LA COMMUNICATION",
          "Un élément de langage a été stabilisé suite à l'arbitrage rendu sur l'Avenue Foch.",
          "consigne"
        );
      } else if (index === 5 && videoNeutralisee0942) {
        // Conséquence différée 2 (suite à tentative d'effacement du cliché de presse extérieur DOS-B75-0942)
        emettreEchoDiffere(
          "PARQUET DE PARIS",
          "Une divergence est relevée entre l'inventaire CHEOPS et les pièces déjà versées par des tiers.",
          "consigne"
        );
      } else if (index === 8 && rioFloute2011) {
        // Conséquence différée 3 (suite à floutage / dissimulation du RIO en gare DOS-B75-2011)
        emettreEchoDiffere(
          "CABINET BEAUVAU",
          "Plusieurs captures publiques sur les réseaux rendent l'anonymisation du matricule difficile à soutenir.",
          "consigne"
        );
      } else if (index === 10 && fuitesTransmises.size > 0) {
        // Conséquence différée 4 (suite à transmission hors procédure à un conseil extérieur)
        emettreEchoDiffere(
          "AUDIT INTERNE DGPN",
          "Des copies non expurgées ont été transmises à un conseil extérieur hors circuit CHEOPS. Traçabilité compromise.",
          "urgente"
        );
      } else if (index === 12 && documentsBroyes > 0) {
        // Conséquence différée 5 (suite à destructions documentaires ou scellés)
        emettreEchoDiffere(
          "CENTRE DE SUPERVISION URBAIN",
          "Contrôle automatisé terminé : une rupture de séquence demeure inexpliquée dans les archives CSU.",
          "consigne"
        );
      }
    }
  }, [
    calculateAllocatedTime,
    declencherTelegramme,
    autoPunchNext,
    fuitesTransmises.size,
    documentsBroyes,
    notaireProtege2144,
    videoNeutralisee0942,
    rioFloute2011,
  ]);

  // Rotation continue du bandeau d'actualités
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsTickerIndex((prev) => (prev + 1) % ACTUALITES_CONTINU.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Enclenchement de la prise en charge et de l'horodateur par le joueur (Option A - Patch R1)
  const lancerChronoDossier = useCallback(() => {
    if (isAwaitingNext || isChronoStarted || gameState !== "playing") return;
    const current = dossiers[currentIndex];
    soundFx.playPointeusePunch();
    lastTickRef.current = performance.now();
    setIsChronoStarted(true);
    setFloatingBonus({ text: "⏱ PRISE EN CHARGE HORODATÉE", id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 1400);

    // Déverrouillage immédiat des outils et ouverture automatique de la pièce maîtresse
    if (current) {
      const pvFile = getPrimaryCaseFile(current);
      setCurrentPath(`/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${current.id}`);
      setOpenedDocument(pvFile);
      setDiscoveredFiles((prev) => new Set(prev).add(pvFile.id));
      setOpenWindows((prev) => ({
        ...prev,
        explorer: { isOpen: true, isMinimized: false, zIndex: 10 },
        document: { isOpen: true, isMinimized: false, zIndex: 12 },
        qualification: { isOpen: true, isMinimized: false, zIndex: 11 },
      }));
      setActiveWindowId("document");
      // Séquence sonore M1.1 : PUNCH POINTEUSE -> petit relais système -> léger accès disque + ouverture PV
      setTimeout(() => {
        soundFx.playSystemRelayClick();
      }, 110);
      setTimeout(() => {
        soundFx.playHddSeek("short");
        soundFx.playPaperRustle();
      }, 220);
    }
  }, [isAwaitingNext, isChronoStarted, gameState, currentIndex]);

  // Pause café syndicale (+25s d'instruction)
  const ajouterTempsCafe = useCallback(() => {
    soundFx.playCoffeeSip();
    setTimeRemaining((prev) => prev + 25.0);
    setMaxTime((prev) => prev + 25.0);
    setFloatingBonus({ text: "☕ PAUSE CAFÉ (+25s)", id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 1500);
  }, []);

  // Dépassement de délai réglementaire (Timeout)
  const handleChronoTimeout = useCallback(() => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    setIsChronoStarted(false);
    soundFx.playSystemWarning();

    setBlames((b) => {
      const newBlames = b + 1;
      declencherTelegramme(
        "GREFFE & STATISTIQUES",
        `DÉPASSEMENT DE DÉLAI RÉGLEMENTAIRE (+1 Blâme : ${newBlames}/3). Le greffe dénonce l'encombrement des tiroirs de l'instruction !`,
        "sanction"
      );
      setFloatingBonus({ text: `⏱️ DÉLAI ÉCOULÉ (+1 BLÂME : ${newBlames}/3)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 2500);

      if (newBlames >= 3) {
        setGameOverReason("timeout");
        setGameState("gameover");
      } else {
        // Délai de grâce d'urgence de 20 secondes pour permettre au joueur de conclure
        setMaxTime(20.0);
        setTimeRemaining(20.0);
        setIsChronoStarted(true);
        lastTickRef.current = performance.now();
      }
      return newBlames;
    });
  }, [declencherTelegramme]);

  // Boucle active du chronomètre (Option A)
  useEffect(() => {
    if (!isChronoStarted || isAwaitingNext || gameState !== "playing") {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    let lastTick = performance.now();
    let lastAudioTickSec = Math.ceil(timeRemaining);
    let passed25Audio = timeRemaining <= 25;

    const tick = (now: number) => {
      const dt = (now - lastTick) / 1000;
      lastTick = now;

      setTimeRemaining((prev) => {
        const next = Math.max(0, prev - dt);
        const curSec = Math.ceil(next);

        // M1.6 : Clic de relais discret unique au franchissement des 25 secondes
        if (next <= 25 && !passed25Audio) {
          passed25Audio = true;
          soundFx.playSystemRelayClick();
        } else if (next > 25) {
          passed25Audio = false;
        }

        // Tic-tac sec d'urgence dans les 8 dernières secondes (intensifié dans les 4 dernières)
        if (curSec <= 8 && curSec > 0 && curSec !== lastAudioTickSec) {
          lastAudioTickSec = curSec;
          soundFx.playChronoTick(curSec <= 4);
        }

        if (next <= 0) {
          handleChronoTimeout();
          return 0;
        }
        return next;
      });

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isChronoStarted, isAwaitingNext, gameState, handleChronoTimeout]);

  // Détection du mode plein écran natif
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
      };
      setIsFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const basculerPleinEcran = useCallback(() => {
    try {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
      };
      const docEl = document.documentElement as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
      };

      const isFull = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);

      if (!isFull) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen().catch(() => {});
        }
      } else {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen().catch(() => {});
        }
      }
    } catch {
      // Ignorer si non autorisé par la politique navigateur
    }
  }, []);

  const copierUrlDirect = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 3000);
      }).catch(() => {});
    }
  }, []);

  const declencherVibration = (pattern: number | number[]) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Silencieux si non supporté
      }
    }
  };

  // Arbitrage déductif de la caméra piéton / carte SD (neutraliser vs conserver)
  const trancherCamera = useCallback((decision: "neutralisee" | "conservee") => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    const current = dossiers[currentIndex];
    if (cameraDecision !== null || !current?.incidentCamera) return;

    const attendu = current.incidentCamera.doitEtreNeutralisee ? "neutralisee" : "conservee";
    const estCorrect = decision === attendu;

    setCameraDecision(decision);
    setCameraNeutralisee(true);
    if (current.id === "DOS-B75-0942" && decision === "neutralisee") {
      setVideoNeutralisee0942(true);
    }
    if (decision === "neutralisee") {
      setCameraGlitchActive(true);
      jouerSonGlitch();
      setTimeout(() => {
        setCameraGlitchActive(false);
      }, 400);
    } else {
      jouerSonSubstitut();
    }

    if (estCorrect) {
      declencherVibration([30, 40, 50]);
      const gain = 35;
      setPrimeTotale((prev) => prev + gain);
      setCredibiliteMinistere((prev) => Math.min(100, prev + 10));
      setFloatingBonus({ text: `📹 FLUX ENREGISTRÉ (+${gain} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);
      setCameraFeedback({
        valide: true,
        explication: current.incidentCamera.explicationBonneDecision || "Décision de gestion du flux parfaitement alignée avec le dossier.",
        bonus: gain,
      });
      setFlashNews(
        `GESTION DU FLUX CCTV : ${decision === "neutralisee" ? "Défaillance technique actée" : "Pièce versée aux débats"} (+${gain} € / Crédibilité +10%).`
      );
    } else {
      jouerSonBlame();
      declencherVibration([90, 90]);
      const perte = 35;
      setPrimeTotale((prev) => Math.max(0, prev - perte));
      setCredibiliteMinistere((prev) => {
        const next = Math.max(0, prev - 22);
        if (next <= 0) {
          setGameOverReason("credibilite");
          setGameState("gameover");
        }
        return next;
      });
      setFloatingBonus({ text: `⚠️ ARBITRAGE VIDÉO CONTESTÉ (-${perte} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1800);
      setCameraFeedback({
        valide: false,
        explication: current.incidentCamera.explicationErreur || "Erreur de doctrine sur la conservation ou purge du flux vidéo.",
        bonus: -perte,
      });
      setFlashNews(
        `ARBITRAGE VIDÉO CONTESTÉ PAR LE PARQUET (-${perte} € / Crédibilité -22%).`
      );
    }
    setTimeout(() => setFlashNews(null), 6000);
  }, [currentIndex, cameraDecision, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  const neutraliserCamera = useCallback(() => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    trancherCamera("neutralisee");
  }, [trancherCamera, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Prise de décision : application d'un visa de qualification
  const appliquerTampon = useCallback((tamponChoisi: TamponOption) => {
    if (gameState !== "playing" || isProcessingRef.current || isAwaitingNext) return;
    if (!isChronoStarted) {
      notifierAccesRefuse();
      return;
    }

    const currentDossier: Dossier = dossiers[currentIndex];

    // Vérification de sécurité hiérarchique : arbitrage caméra requis avant signature
    if (currentDossier.incidentCamera && cameraDecision === null) {
      setCameraBloqueeNotice(true);
      jouerSonBlame();
      declencherVibration([80, 80]);
      setFlashNews("ARBITRAGE CAMÉRA OBLIGATOIRE : Purgez ou validez le flux CCTV avant d'apposer votre visa !");
      setTimeout(() => setCameraBloqueeNotice(false), 3000);
      setTimeout(() => setFlashNews(null), 5000);
      return;
    }

    // Vérification de contradiction médicale : les lésions IML doivent être neutralisées au feutre noir
    if (
      currentDossier.termesCaviardes &&
      currentDossier.termesCaviardes.length > 0 &&
      caviardagesFaits.size === 0
    ) {
      jouerSonBlame();
      declencherVibration([80, 80]);
      setFlashNews("CONTRADICTION MÉDICALE : Le rapport IML contredit le non-lieu. Caviardez les traumatismes au feutre noir avant signature !");
      setTimeout(() => setFlashNews(null), 5000);
      ouvrirPieceMaitresse();
      return;
    }

    isProcessingRef.current = true;
    const isCorrect = tamponChoisi.code === currentDossier.categorie_attendue;

    if (currentDossier.id === "DOS-B75-2144" && isCorrect) {
      setNotaireProtege2144(true);
    }

    // Séquence audio M1.1 : Tampon (t=0) -> Écriture disque (t=+150ms) -> Feedback prime/combo (t=+320ms)
    jouerSonTampon();
    setTimeout(() => {
      soundFx.playHddSeek("burst");
    }, 150);

    // Vibration tactile mobile
    if (isCorrect) {
      declencherVibration([30, 40, 30]);
      setScreenFlash("success");
      setTimeout(() => setScreenFlash(null), 450);
    } else {
      declencherVibration([60, 90, 60]);
      setScreenFlash("error");
      setTimeout(() => setScreenFlash(null), 500);
    }

    // M1.4 : Secousse locale de formulaire gérée dans QualificationDeskWindow (pas de secousse globale de tout l'écran)
    const randomAngle = -4 + Math.random() * 8;

    setActiveStamp({
      tamponLabel: tamponChoisi.label,
      isCorrect,
      angle: randomAngle,
      code: tamponChoisi.code
    });

    if (isCorrect) {
      // Prime de célérité Option A si le chrono d'instruction était actif
      let bonusCelerite = 0;
      if (isChronoStarted && timeRemaining > 0) {
        if (timeRemaining >= maxTime * 0.5) {
          bonusCelerite = 30;
          setFloatingBonus({ text: "⚡ CÉLÉRITÉ EXCEPTIONNELLE (+30 €)", id: Date.now() + 1 });
        } else if (timeRemaining >= maxTime * 0.2) {
          bonusCelerite = 15;
          setFloatingBonus({ text: "⏱️ CADENCE RÉGLEMENTAIRE (+15 €)", id: Date.now() + 1 });
        }
        if (bonusCelerite > 0) {
          setTimeout(() => {
            soundFx.playBonusCoinsSound();
          }, 300);
        }
      }
      setIsChronoStarted(false);

      const newCombo = comboZeile + 1;
      setComboZeile(newCombo);
      const mult = 1 + newCombo * 0.25;
      const basePrime = Math.round(45 * mult);
      const bonusPrefet = currentDossier.telegrammePrefet ? currentDossier.telegrammePrefet.primeBonus : 0;
      const gainDossier = basePrime + bonusPrefet + bonusCelerite;

      setPrimeTotale((prev) => prev + gainDossier);
      setDernierePrime(gainDossier);
      setCredibiliteMinistere((prev) => Math.min(100, prev + 6));
      setPaxSociale((prev) => Math.min(100, prev + 5));
      setFloatingBonus({ text: `+${gainDossier} € (HOMOLOGUÉ)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);

      // Feedback audio de rétribution (échelonné à t=+320ms / +380ms)
      setTimeout(() => {
        if (newCombo > 1) {
          jouerSonCombo(newCombo);
        } else {
          jouerSonPrime();
        }
      }, bonusCelerite > 0 ? 380 : 320);

      setFlashNews(
        `COMBO ZÉLÉ x${mult.toFixed(2)} : Affaire #${currentDossier.id} apurée sans réserve ! Prime de +${gainDossier} € (Crédibilité +6%).`
      );
      setTimeout(() => setFlashNews(null), 5500);

      declencherTelegramme(
        "CABINET DU MINISTRE",
        `Dossier #${currentDossier.id} apuré avec succès. Qualification « ${tamponChoisi.label} » homologuée par la Préfecture. Risque contentieux éteint.`,
        "consigne"
      );

      setFeedback({
        correct: true,
        tamponTente: tamponChoisi.label,
        tamponAttendu: currentDossier.tampon_imposé
      });
    } else {
      setIsChronoStarted(false);
      if (equipementsPossedes.has("immunite_blame")) {
        setEquipementsPossedes((prev) => {
          const next = new Set(prev);
          next.delete("immunite_blame");
          return next;
        });
        setTimeout(() => {
          jouerSonPrime();
        }, 320);
        setFloatingBonus({ text: `🛡️ BLÂME ANNULÉ (IMMUNITÉ)`, id: Date.now() });
        setTimeout(() => setFloatingBonus(null), 1800);
        declencherTelegramme(
          "CABINET DU MINISTRE",
          `INTERVENTION DISCRÈTE : Votre blâme sur #${currentDossier.id} a été retiré du registre par note confidentielle de Beauvau.`,
          "consigne"
        );

        setFeedback({
          correct: false,
          tamponTente: tamponChoisi.label,
          tamponAttendu: currentDossier.tampon_imposé,
          motifErreur: `[BLÂME NEUTRALISÉ PAR LA DIRECTION] ${currentDossier.justification_erreur}`
        });
      } else {
        setTimeout(() => {
          jouerSonBlame();
        }, 320);
        const newBlames = blames + 1;
        setBlames(newBlames);
        setComboZeile(0);
        setPaxSociale((prev) => Math.max(12, prev - 15));
        setCredibiliteMinistere((prev) => {
          const next = Math.max(0, prev - 18);
          if (next <= 0) {
            setGameOverReason("credibilite");
            setGameState("gameover");
          }
          return next;
        });
        setFloatingBonus({ text: `⚠️ RAPPEL N° ${newBlames}/3`, id: Date.now() });
        setTimeout(() => setFloatingBonus(null), 1800);

        declencherTelegramme(
          "IGPN DÉONTOLOGIE",
          `AVERTISSEMENT PROCÉDURAL (${newBlames}/3) : Qualification erronée sur #${currentDossier.id}. La Chancellerie dénonce une entorse à la doctrine ministérielle !`,
          "sanction"
        );

        setFeedback({
          correct: false,
          tamponTente: tamponChoisi.label,
          tamponAttendu: currentDossier.tampon_imposé,
          motifErreur: currentDossier.justification_erreur
        });
      }
    }

    // Le chronomètre est arrêté pour laisser le temps de lire le rapport et les motifs
    setIsChronoStarted(false);
    setIsAwaitingNext(true);
  }, [gameState, currentIndex, blames, isAwaitingNext, cameraDecision, comboZeile, equipementsPossedes, isChronoStarted, timeRemaining, maxTime]);

  // Passage manuel au dossier suivant
  const passerAuDossierSuivant = useCallback(() => {
    if (!isAwaitingNext) return;

    soundFx.playHddSeek("heavy");
    declencherVibration(30);
    setFeedback(null);

    if (blames >= 3) {
      setGameOverReason("blames");
      setGameState("gameover");
      return;
    }

    if (credibiliteMinistere <= 0) {
      setGameOverReason("credibilite");
      setGameState("gameover");
      return;
    }

    const nextIndex = currentIndex + 1;
    setTotalProcessed((prev) => prev + 1);

    if (nextIndex >= dossiers.length) {
      setGameState("completed");
    } else {
      setCurrentIndex(nextIndex);
      startDossier(nextIndex, autoPunchNext);
    }
  }, [isAwaitingNext, blames, credibiliteMinistere, currentIndex, startDossier, autoPunchNext]);

  // Arbitrage déductif du matricule RIO (flouter vs valider)
  const trancherRio = useCallback((decision: "flouter" | "valider") => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    const current = dossiers[currentIndex];
    if (rioDecision !== null || !current?.statutRio) return;

    const estBonneDecision = decision === current.statutRio.bonneDecision;
    setRioDecision(decision);
    setRioInspecteDossier(true);

    if (current.id === "DOS-B75-2011" && decision === "flouter") {
      setRioFloute2011(true);
    }

    if (estBonneDecision) {
      jouerSonRio();
      declencherVibration([30, 50]);
      const bonus = current.statutRio.primeBonus + (equipementsPossedes.has("flouteur_rio") ? 25 : 0);
      setPrimeTotale((prev) => prev + bonus);
      setCredibiliteMinistere((prev) => Math.min(100, prev + 8));
      setPaxSociale((prev) => Math.min(100, prev + 4));
      setFloatingBonus({ text: `✓ ARBITRAGE RIO HOMOLOGUÉ (+${bonus} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);
      setRioFeedback({
        valide: true,
        explication: current.statutRio.explicationBonneDecision || `Arbitrage RIO conforme aux intérêts de l'institution.`,
        bonus,
      });
      setFlashNews(
        `ARBITRAGE RIO : ${decision === "flouter" ? "Anonymat de service garanti" : "Matricule homologué"} (+${bonus} € / Crédibilité +8%).`
      );
    } else {
      jouerSonBlame();
      declencherVibration([80, 80]);
      const malus = 25;
      setPrimeTotale((prev) => Math.max(0, prev - malus));
      setCredibiliteMinistere((prev) => {
        const next = Math.max(0, prev - 18);
        if (next <= 0) {
          setGameOverReason("credibilite");
          setGameState("gameover");
        }
        return next;
      });
      setPaxSociale((prev) => Math.max(10, prev - 8));
      setFloatingBonus({ text: `⚠️ ARBITRAGE RIO CONTESTÉ (-${malus} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1800);
      setRioFeedback({
        valide: false,
        explication: current.statutRio.explicationErreur || `Erreur d'appréciation sur le statut du matricule RIO.`,
        bonus: -malus,
      });
      setFlashNews(
        `ARBITRAGE RIO CONTESTÉ : Position désapprouvée par la hiérarchie (-${malus} € / Crédibilité -18%).`
      );
    }
    setTimeout(() => setFlashNews(null), 6000);
  }, [currentIndex, rioDecision, equipementsPossedes, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  const inspecterRio = useCallback(() => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    trancherRio("flouter");
  }, [trancherRio, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Inversion accusatoire : outrage et rébellion réflexe
  const declencherRiposteOutrage = useCallback(() => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    const current = dossiers[currentIndex];
    if (riposteDeclenchee || !current?.riposteOutrage) return;
    setRiposteDeclenchee(true);
    jouerSonOutrageRiposte();
    declencherVibration([50, 80, 50]);
    const mult = equipementsPossedes.has("riposte_systematique") ? 2 : 1;
    const bonus = current.riposteOutrage.primeRiposte * mult;
    setPrimeTotale((prev) => prev + bonus);
    setPaxSociale((prev) => Math.min(100, prev + 4));
    setFloatingBonus({ text: `⚖️ +${bonus} € (CONTRE-PLAINTE DÉPOSÉE)`, id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 1600);
    setFlashNews(
      `INVERSION ACCUSATOIRE : Procédure d'outrage & rébellion transmise au Parquet contre la victime (+${bonus} €).`
    );
    setTimeout(() => setFlashNews(null), 6000);
  }, [riposteDeclenchee, currentIndex, equipementsPossedes, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Voie externe : transmission de copie hors procédure à Me Camille Sorel
  const transmettreFuiteClandestine = useCallback((dossierId: string) => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    if (fuitesTransmises.has(dossierId)) return;
    soundFx.playWhistleblowLeak();
    declencherVibration([40, 70, 40, 90]);
    setFuitesTransmises((prev) => new Set(prev).add(dossierId));
    setPaxSociale((prev) => Math.max(10, prev - 8));
    setFloatingBonus({ text: "📡 COPIE HORS PROCÉDURE TRANSMISE", id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 2000);
    setFlashNews(
      "📡 LIAISON EXTERNE // TRANSMISSION EFFECTUÉE : Copie non expurgée versée à la défense."
    );
    setTimeout(() => setFlashNews(null), 7000);
  }, [fuitesTransmises, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Feutre triple-mine : caviarder tous les termes d'un coup
  const caviarderTout = useCallback(() => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    const current = dossiers[currentIndex];
    if (!current?.termesCaviardes) return;
    const nonFaits = current.termesCaviardes.filter((t) => !caviardagesFaits.has(t.id));
    if (nonFaits.length === 0) return;
    jouerSonFeutre();
    declencherVibration([30, 40, 50]);
    nonFaits.forEach((t) => caviarderTerme(t));
  }, [currentIndex, caviardagesFaits, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Achat dans la Boutique de la Mutuelle Police
  const acheterEquipement = useCallback((eq: EquipementBoutique) => {
    if (primeTotale < eq.cout || equipementsPossedes.has(eq.id)) return;
    setPrimeTotale((prev) => prev - eq.cout);
    setEquipementsPossedes((prev) => new Set(prev).add(eq.id));
    jouerSonAchat();
    declencherVibration([40, 80]);

    if (eq.id === "immunite_blame" && blames > 0) {
      setBlames((prev) => Math.max(0, prev - 1));
      setFloatingBonus({ text: `🛡️ BLÂME EFFACÉ`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);
      setFlashNews("MUTUELLE POLICE : Note de protection appliquée, 1 blâme immédiatement annulé !");
    } else if (eq.id === "cafe_syndical") {
      setTimeRemaining((prev) => prev + 10);
      setMaxTime((prev) => prev + 10);
      setFloatingBonus({ text: `☕ +10s DE CHRONO`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);
      setFlashNews("DOTATION CAFÉ : +10s ajoutées au chronomètre d'instruction.");
    } else {
      setFloatingBonus({ text: `📦 ${eq.nom} REÇU`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);
      setFlashNews(`DOTATION LIVRÉE : ${eq.nom} activé dans le paquetage administratif.`);
    }
    setTimeout(() => setFlashNews(null), 5000);
  }, [primeTotale, equipementsPossedes, blames]);

  // Caviardage au feutre noir de censure ministérielle (déductif avec gestion des pièges)
  const caviarderTerme = useCallback((terme: TermeCaviarde) => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    // Si déjà caviardé : permet de rétablir le mot si on a biffé une pièce à charge par erreur !
    if (caviardagesFaits.has(terme.id)) {
      jouerSonFeutre();
      declencherVibration(25);
      setCaviardagesFaits((prev) => {
        const next = new Set(prev);
        next.delete(terme.id);
        return next;
      });
      if (caviardagesErreurs.has(terme.id) || terme.estCompromettant === false) {
        setCaviardagesErreurs((prev) => {
          const next = new Set(prev);
          next.delete(terme.id);
          return next;
        });
        setCredibiliteMinistere((prev) => Math.min(100, prev + 12));
        setPrimeTotale((prev) => prev + 35);
        setFloatingBonus({ text: `✓ TERME RÉTABLI (+35 €)`, id: Date.now() });
        setTimeout(() => setFloatingBonus(null), 1500);
        setFlashNews(`RECTIFICATION : Mention utile « ${terme.texteBrut} » réintégrée au dossier (Crédibilité restaurée).`);
      }
      return;
    }

    jouerSonFeutre();
    declencherVibration(35);
    setCaviardagesFaits((prev) => new Set(prev).add(terme.id));

    // Déduction : est-ce vraiment un terme compromettant à biffer ?
    if (terme.estCompromettant !== false) {
      const current = dossiers[currentIndex];
      if (current && current.id === "DOS-B75-2144") {
        setNotaireProtege2144(true);
      }
      // Bonne censure : terme compromettant pour l'institution
      const bonusCensure = 20;
      setPrimeTotale((prev) => prev + bonusCensure);
      setCredibiliteMinistere((prev) => Math.min(100, prev + 4));
      setFloatingBonus({ text: `🖍️ +${bonusCensure} € (CENSURÉ)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1500);
      setFlashNews(
        `CAVIARDAGE OPPORTUN : « ${terme.texteBrut} » occulté du bordereau (+${bonusCensure} €).`
      );
    } else {
      // Erreur de zèle : terme utile à charge biffé
      jouerSonBlame();
      declencherVibration([80, 50]);
      const malusCensure = 35;
      setCaviardagesErreurs((prev) => new Set(prev).add(terme.id));
      setPrimeTotale((prev) => Math.max(0, prev - malusCensure));
      setCredibiliteMinistere((prev) => {
        const next = Math.max(0, prev - 14);
        if (next <= 0) {
          setGameOverReason("credibilite");
          setGameState("gameover");
        }
        return next;
      });
      setFloatingBonus({ text: `⚠️ COHÉRENCE DU MÉMOIRE COMPROMISE (-${malusCensure} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1800);
      setFlashNews(
        `COHÉRENCE DU MÉMOIRE DÉGRADÉE : « ${terme.texteBrut} » soutenait la qualification retenue (-${malusCensure} € / Crédibilité -14%).`
      );
    }
    setTimeout(() => setFlashNews(null), 5500);
  }, [caviardagesFaits, caviardagesErreurs, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse, currentIndex]);

  // Substitution de pièce à conviction compromettante
  const substituerScelle = useCallback((piece: PieceASubstituer) => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    if (substitutionsFaites.has(piece.id)) return;
    jouerSonSubstitut();
    declencherVibration([40, 70]);
    setSubstitutionsFaites((prev) => new Set(prev).add(piece.id));
    setPrimeTotale((prev) => prev + piece.primeBonus);
    setFloatingBonus({ text: `🔄 +${piece.primeBonus} € (PV SUBSTITUÉ)`, id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 1600);
    setFlashNews(
      `SUBSTITUTION RÉGLEMENTAIRE : Scellé gênant remplacé par la synthèse officielle (+${piece.primeBonus} €).`
    );
    setTimeout(() => setFlashNews(null), 5000);
  }, [substitutionsFaites, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Actionnement de la déchiqueteuse / broyeuse de bureau
  const actionnerBroyeuse = useCallback(() => {
    if (gameState === "playing" && !isChronoStarted && !isAwaitingNext) {
      notifierAccesRefuse();
      return;
    }
    jouerSonBroyeur();
    soundFx.playHddSeek("short");
    declencherVibration([50, 40, 50]);
    setBroyeurAnime(true);
    setDocumentsBroyes((prev) => prev + 1);
    const primeBroyeur = 15;
    setPrimeTotale((prev) => prev + primeBroyeur);
    setFloatingBonus({ text: `🗑️ +${primeBroyeur} € (BROYÉ)`, id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 1500);

    if (blames > 0) {
      setBlames((prev) => Math.max(0, prev - 1));
      setFlashNews(
        `BROYEUSE CHEOPS : Note disciplinaire détruite ! Un blâme a été effacé du registre d'instruction (+${primeBroyeur} €).`
      );
    } else {
      setFlashNews(
        `BROYEUSE CHEOPS : Document sensible réduit en confettis conformes (+${primeBroyeur} € prime de discrétion).`
      );
    }
    setTimeout(() => setFlashNews(null), 4500);
    // M1.5 : Durée mécanique alignée sur le moteur sonore (380 ms)
    setTimeout(() => setBroyeurAnime(false), 380);
  }, [blames, gameState, isChronoStarted, isAwaitingNext, notifierAccesRefuse]);

  // Gestion tactile du glisser-déposer sur mobile / tablette
  const handleTouchStartTampon = (t: TamponOption, e: TouchEvent) => {
    if (isAwaitingNext) return;
    if (gameState === "playing" && !isChronoStarted) {
      notifierAccesRefuse();
      return;
    }
    const touch = e.touches[0];
    setDraggedTampon(t);
    setTouchGhostPos({ x: touch.clientX, y: touch.clientY });
    jouerSonSaisie();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!draggedTampon) return;
    const touch = e.touches[0];
    setTouchGhostPos({ x: touch.clientX, y: touch.clientY });

    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const isInside =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;
      setIsDropZoneOver(isInside);
    }
  };

  const handleTouchEnd = () => {
    if (!draggedTampon) return;
    if (isDropZoneOver) {
      appliquerTampon(draggedTampon);
    }
    setDraggedTampon(null);
    setTouchGhostPos(null);
    setIsDropZoneOver(false);
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropZoneOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDropZoneOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropZoneOver(false);
    if (draggedTampon) {
      appliquerTampon(draggedTampon);
    }
  }, [draggedTampon, appliquerTampon]);

  // Raccourcis clavier (F1-F3, 1-3, A/Z/E, Entrée, Espace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Écran d'accueil
      if (gameState === "intro" && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        soundFx.startAmbiance();
        setGameState("playing");
        setCurrentIndex(0);
        setTotalProcessed(0);
        setBlames(0);
        setPrimeTotale(0);
        setDernierePrime(null);
        startDossier(0);
        jouerSonTampon();
        return;
      }

      // Écrans de fin
      if ((gameState === "gameover" || gameState === "completed") && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        soundFx.startAmbiance();
        setGameState("playing");
        setCurrentIndex(0);
        setTotalProcessed(0);
        setBlames(0);
        setPrimeTotale(0);
        setDernierePrime(null);
        startDossier(0);
        return;
      }

      // En attente d'émargement / dossier suivant
      if (gameState === "playing" && isAwaitingNext) {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          passerAuDossierSuivant();
        }
        return;
      }

      // En cours d'examen du dossier
      if (gameState !== "playing" || isProcessingRef.current) return;

      // [SUPPR] / [DEL] / [BACKSPACE] : Broyeuse administrative (détruit un blâme ou pièce sensible)
      if (e.key === "Delete" || e.code === "Delete" || e.key === "Backspace" || e.code === "Backspace") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        e.preventDefault();
        actionnerBroyeuse();
        return;
      }

      // [ESPACE] : Ouvrir la pièce maîtresse du dossier en cours
      if (e.code === "Space") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
          return;
        }
        e.preventDefault();
        ouvrirPieceMaitresse();
        return;
      }

      // [P] : Pointer la prise de dossier / Lancer le chrono (Option A)
      if (e.key === "p" || e.key === "P") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
          return;
        }
        e.preventDefault();
        lancerChronoDossier();
        return;
      }

      // [C] : Caviarder d'un coup tous les termes compromettants restants
      if (e.key === "c" || e.key === "C") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        e.preventDefault();
        caviarderTout();
        return;
      }

      // [R] : Riposte immédiate au Parquet (Inversion accusatoire / Outrage)
      if (e.key === "r" || e.key === "R") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        e.preventDefault();
        declencherRiposteOutrage();
        return;
      }

      // [F] : Arbitrage RIO (Flouter protecteur)
      if (e.key === "f" || e.key === "F") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        e.preventDefault();
        inspecterRio();
        return;
      }

      // [B] : Ouvrir / Fermer la boutique de la Mutuelle Police
      if (e.key === "b" || e.key === "B") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        e.preventDefault();
        setIsBoutiqueOpen((prev) => !prev);
        soundFx.playUiClick();
        return;
      }

      if (e.key === "1" || e.key === "a" || e.key === "A" || e.key === "&" || e.key === "F1") {
        e.preventDefault();
        appliquerTampon(TAMPONS_DISPONIBLES[0]);
      } else if (e.key === "2" || e.key === "z" || e.key === "Z" || e.key === "é" || e.key === "F2") {
        e.preventDefault();
        appliquerTampon(TAMPONS_DISPONIBLES[1]);
      } else if (e.key === "3" || e.key === "e" || e.key === "E" || e.key === '"' || e.key === "F3") {
        e.preventDefault();
        appliquerTampon(TAMPONS_DISPONIBLES[2]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    gameState,
    isAwaitingNext,
    passerAuDossierSuivant,
    appliquerTampon,
    startDossier,
    ouvrirPieceMaitresse,
    lancerChronoDossier,
    actionnerBroyeuse,
    caviarderTout,
    declencherRiposteOutrage,
    inspecterRio,
  ]);

  const currentDossier: Dossier | undefined = dossiers[currentIndex] || dossiers[0];
  const progressRatio = Math.max(0, Math.min(1, timeRemaining / maxTime));

  // Progression de carrière et mobilier de bureau
  const currentGrade = GRADES.slice().reverse().find((g) => totalProcessed >= g.seuilDossiers) || GRADES[0];
  const hasCafe = totalProcessed >= 1;
  const hasTamponTitane = totalProcessed >= 3;
  const hasMedaille = totalProcessed >= 6;
  const hasPortrait = totalProcessed >= 8;

  const restartGame = (e?: React.MouseEvent | MouseEvent) => {
    e?.stopPropagation();
    soundFx.startAmbiance();
    setGameState("playing");
    setCurrentIndex(0);
    setTotalProcessed(0);
    setBlames(0);
    setPrimeTotale(0);
    setDernierePrime(null);
    setFuitesTransmises(new Set());
    setDocumentsBroyes(0);
    setNotaireProtege2144(false);
    setVideoNeutralisee0942(false);
    setRioFloute2011(false);
    startDossier(0, chronoCadenceActive);
  };

  return (
    <div
      id="main-viewport"
      className={`relative w-full min-h-[100dvh] lg:h-screen lg:max-h-screen bg-[#004e98] text-slate-100 select-none flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden ${
        gameState === "playing" ? "p-0" : "p-1.5 sm:p-2 lg:p-3 bg-[#001c54]"
      } ${
        screenShake ? "animate-screen-shake" : ""
      } ${
        screenFlash === "success" ? "flash-screen-success" : screenFlash === "error" ? "flash-screen-error" : ""
      }`}
    >
      {/* RETOUR VISUEL FLOTTANT DE PRIME OU BLÂME */}
      {floatingBonus && (
        <div
          key={floatingBonus.id}
          className="pointer-events-none fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-float-feedback font-mono font-black text-sm sm:text-base px-3.5 py-1.5 border-2 shadow-2xl backdrop-blur-sm flex items-center gap-2"
          style={{
            backgroundColor: floatingBonus.text.includes("RAPPEL") || floatingBonus.text.includes("REJET")
              ? "rgba(185, 28, 28, 0.95)"
              : "rgba(4, 30, 16, 0.95)",
            borderColor: floatingBonus.text.includes("RAPPEL") || floatingBonus.text.includes("REJET")
              ? "#ef4444"
              : "#00ff66",
            color: floatingBonus.text.includes("RAPPEL") || floatingBonus.text.includes("REJET")
              ? "#fecaca"
              : "#00ff66",
          }}
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{floatingBonus.text}</span>
        </div>
      )}

      {/* EN-TÊTE DIÉGÉTIQUE SUPÉRIEUR (POSTE DE TRAVAIL CHEOPS // OS CONTENTIEUX) */}
      {gameState !== "playing" && (
        <DiegeticTopBar
          activeContactId={activeContactId}
          onSelectContact={(id) => setActiveContactId(id)}
          primeTotale={primeTotale}
          dernierePrime={dernierePrime}
          credibiliteMinistere={credibiliteMinistere}
          blames={blames}
          currentGrade={currentGrade}
          totalProcessed={totalProcessed}
          totalDossiers={dossiers.length}
          currentIndex={currentIndex}
          paxSociale={paxSociale}
          comboZeile={comboZeile}
          isBoutiqueOpen={isBoutiqueOpen}
          onToggleBoutique={() => setIsBoutiqueOpen(!isBoutiqueOpen)}
          equipementsCount={equipementsPossedes.size}
          onOpenGuide={() => setShowGuideModal(true)}
          documentsBroyes={documentsBroyes}
          broyeurAnime={broyeurAnime}
          onBroyerPiece={actionnerBroyeuse}
        />
      )}

      {/* ZONE CENTRALE DE TRAITEMENT DU DOSSIER - BUREAU PLEIN ÉCRAN LORS DU JEU */}
      <main className={`flex-1 min-h-0 flex flex-col items-center justify-center relative w-full overflow-hidden ${gameState === "playing" ? "p-0 m-0 max-w-none" : "w-full my-auto"}`}>
        {/* ÉCRAN D'ACCUEIL : OUVERTURE DE SESSION WINDOWS XP PROFESSIONNEL (CHEOPS XP) */}
        {gameState === "intro" && (
          <div className="w-full max-w-5xl my-auto font-sans select-none p-2 sm:p-4">
            {/* BOÎTE DU LOGON XP PROFESSIONNEL */}
            <div className="bg-[#003399] border-2 border-[#002266] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden rounded-xs text-white">
              
              {/* BANDEAU SUPÉRIEUR BLEU PROFOND AVEC LISERÉ ORANGE XP */}
              <div className="bg-gradient-to-r from-[#001c54] via-[#003399] to-[#001c54] px-4 py-3 flex items-center justify-between border-b border-[#001c54]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 border border-white/80 flex items-center justify-center text-sm shadow-xs">
                    🇫🇷
                  </div>
                  <div>
                    <h1 className="font-bold text-base sm:text-lg tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      CHEOPS Professionnel
                    </h1>
                    <div className="text-[11px] text-sky-200">
                      Système d'Information et d'Apurement du Contentieux // DGPN
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block text-right text-[10px] text-sky-200">
                  <div>Direction Générale de la Police Nationale</div>
                  <div className="font-mono text-amber-300 font-bold">APPLICATION ART. L. 435-1 CSI</div>
                </div>
              </div>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#d76b00] to-transparent" />

              {/* CORPS DE L'ÉCRAN DE LOGON EN 2 VOLETS (GAUCHE & DROITE) */}
              <div className="p-4 sm:p-8 bg-gradient-to-b from-[#0a3596] to-[#052269] flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
                
                {/* VOLET GAUCHE : DOCTRINE & CADRE LÉGAL */}
                <div className="md:w-1/2 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                      Vacation contentieuse ministérielle :
                    </div>
                    <h2 className="text-base sm:text-xl font-bold leading-tight mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      Pour commencer votre service, ouvrez votre session d'officier instructeur.
                    </h2>
                    <p className="text-xs text-sky-100 leading-relaxed mb-3">
                      Sous la supervision de la hiérarchie et des circulaires d'engagement,
                      votre mission est de qualifier chaque intervention litigieuse pour garantir la
                      continuité du service et neutraliser les poursuites pénales contre l'administration.
                    </p>
                  </div>

                  {/* 3 QUALIFICATIONS DE DOCTRINE MINISTÉRIELLE (CADRE EN RELIEF) */}
                  <div className="bg-[#ece9d8] text-black border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-3 shadow-inner space-y-2 text-xs">
                    <div className="font-bold text-[#003366] border-b border-[#9c9a91] pb-1 text-[11px] uppercase">
                      Doctrine d'instruction (Objectif : 98% rejets) :
                    </div>
                    <div>
                      <strong className="text-[#0055ea]">[1] NON-LIEU // USAGE CONFORME :</strong>
                      <span className="text-slate-800 text-[11px] block">Défaillance physiologique autonome de l'administré ou force régulière.</span>
                    </div>
                    <div>
                      <strong className="text-[#990000]">[2] VIOLENCES SUR DÉPOSITAIRE :</strong>
                      <span className="text-slate-800 text-[11px] block">Préjudice matériel ou corporel subi par l'agent ou la tenue.</span>
                    </div>
                    <div>
                      <strong className="text-[#664400]">[3] ENTRAVE & TAPAGE :</strong>
                      <span className="text-slate-800 text-[11px] block">Cris perçants, agitation corporelle ou refus d'obtempérer.</span>
                    </div>
                  </div>
                </div>

                {/* SÉPARATEUR VERTICAL XP */}
                <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                {/* VOLET DROIT : COMPTE UTILISATEUR XP & CONNEXION */}
                <div className="md:w-1/2 flex flex-col justify-between space-y-4">
                  {/* TUILE UTILISATEUR WINDOWS XP AUTHENTIQUE */}
                  <div className="p-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xs transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xs border-2 border-white/80 bg-[#002266] flex items-center justify-center text-3xl shadow-md shrink-0">
                        👮
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm sm:text-base leading-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] truncate">
                          Major Christian Dupuis
                        </div>
                        <div className="text-xs text-sky-200">
                          Matricule #7501923 // Agent de conformité
                        </div>
                        <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                          Direction Centrale de la Sécurité Publique
                        </div>
                      </div>
                    </div>

                    {/* OPTION HORODATEUR DE VACATION (OPTION A) */}
                    <div className="mt-3 bg-white/10 p-2.5 border border-white/20 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-sky-100">
                        <input
                          type="checkbox"
                          checked={chronoCadenceActive}
                          onChange={(e) => setChronoCadenceActive(e.target.checked)}
                          className="cursor-pointer"
                        />
                        <span className="font-bold text-amber-300">⏱️ Enclencher l'horodateur dès la prise de poste</span>
                      </label>
                      <p className="text-[10px] text-sky-200 mt-1 leading-snug">
                        {chronoCadenceActive
                          ? "Pointeuse activée dès votre arrivée sur le bureau (avec primes de cadence de +30 €)."
                          : "Vous pointerez manuellement sur votre bureau d'instruction quand vous serez prêt."}
                      </p>
                    </div>

                    {/* BOUTONS D'OUVERTURE DE SESSION XP */}
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        id="btn-start-fullscreen"
                        onClick={() => {
                          soundFx.startAmbiance();
                          basculerPleinEcran();
                          setGameState("playing");
                          setCurrentIndex(0);
                          setTotalProcessed(0);
                          setBlames(0);
                          startDossier(0, chronoCadenceActive);
                          jouerSonTampon();
                          declencherVibration(40);
                        }}
                        className="flex-1 xp-btn text-xs sm:text-sm py-2 px-3 text-[#003366] font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>⛶</span>
                        <span>Prendre le poste (Plein écran)</span>
                      </button>

                      <button
                        type="button"
                        id="btn-start-game"
                        onClick={() => {
                          soundFx.startAmbiance();
                          setGameState("playing");
                          setCurrentIndex(0);
                          setTotalProcessed(0);
                          setBlames(0);
                          startDossier(0, chronoCadenceActive);
                          jouerSonTampon();
                          declencherVibration(30);
                        }}
                        className="xp-btn text-xs py-2 px-3 text-slate-800 font-bold shadow-xs cursor-pointer"
                      >
                        Mode fenêtré
                      </button>
                    </div>
                  </div>

                  {/* GUIDE D'ACCÈS SMARTPHONE ET PWA */}
                  <div className="bg-[#041a4a] border border-[#1a44a7] p-2.5 text-xs text-sky-100">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowMobileGuide(!showMobileGuide)}
                        className="text-[11px] text-sky-300 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer uppercase"
                      >
                        <span>📲</span>
                        <span>{showMobileGuide ? "[-] Masquer guide smartphone" : "[+] Mode smartphone & plein écran"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={copierUrlDirect}
                        className="xp-btn text-[10px] py-0.5 px-2"
                      >
                        {urlCopied ? "✓ Lien copié !" : "Copier URL"}
                      </button>
                    </div>

                    {showMobileGuide && (
                      <div className="mt-2.5 pt-2 border-t border-[#1a44a7] space-y-1 text-[11px] text-sky-200 leading-relaxed font-sans">
                        <div>
                          <strong>Safari (iOS) :</strong> Icône Partage ⎋ puis <em>« Sur l'écran d'accueil »</em> ➕.
                        </div>
                        <div>
                          <strong>Chrome (Android) :</strong> Menu ⋮ puis <em>« Ajouter à l'écran d'accueil »</em>.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* BANDEAU INFÉRIEUR XP ARRÊTER L'ORDINATEUR */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#d76b00] to-transparent" />
              <div className="bg-gradient-to-r from-[#001c54] via-[#003399] to-[#001c54] px-4 py-2.5 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => alert("CHEOPS XP : La continuité républicaine interdit d'éteindre ce terminal !")}
                  className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white font-bold flex items-center gap-1.5 rounded-xs border border-red-400 cursor-pointer shadow-xs text-xs"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span>Arrêter l'ordinateur</span>
                </button>

                <div className="text-[11px] text-sky-200 hidden sm:block">
                  Après avoir ouvert votre session, vous pourrez consulter les pièces et viser les dossiers.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ÉCRAN DE JEU : BUREAU OS DU FONCTIONNAIRE BEAUVAU-OS */}
        {gameState === "playing" && currentDossier && (
          <div className="relative w-full h-full flex flex-col justify-between flex-1 min-h-0 p-0 overflow-hidden bg-[#040914]">
            {/* MÉMOS POST-ITS & PAUSE CAFÉ DU COMMISSARIAT (ÉLÉMENT COSMÉTIQUE CONTEXTUEL) */}
            <OfficeCosmetics
              isOpen={notesDuPosteOuvertes}
              onClose={() => setNotesDuPosteOuvertes(false)}
              onBoireCafe={() => {
                setDeskTooltip("Pause café validée : +5 en clairvoyance corporatiste !");
                setTimeout(() => setDeskTooltip(null), 3500);
              }}
            />

            {/* BUREAU FORENSIQUE CHEOPS : BUREAU OS, EXPLORATEUR, NOTIFICATIONS ET DÉCISION */}
            <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden">
              <DesktopWorkspace
                rootFolder={generateFileSystemForDossier(currentDossier, currentIndex)}
                currentDossier={currentDossier}
                dossierIndex={currentIndex}
                totalDossiers={dossiers.length}
                currentPath={currentPath}
                onNavigateToPath={(p) => setCurrentPath(p)}
                openedDocument={openedDocument}
                onOpenDocument={handleOpenFile}
                onCloseDocument={() => setOpenedDocument(null)}
                onOpenPieceMaitresse={ouvrirPieceMaitresse}
                discoveredFiles={discoveredFiles}
                isAwaitingNext={isAwaitingNext}
                activeStamp={activeStamp}
                cameraBlocked={Boolean(currentDossier.incidentCamera && cameraDecision === null)}
                onApplyTampon={appliquerTampon}
                draggedTampon={draggedTampon}
                onDragStartTampon={(t, e) => {
                  e.dataTransfer.setData("text/plain", t.code);
                  setDraggedTampon(t);
                  jouerSonSaisie();
                }}
                onDragEndTampon={() => {
                  setDraggedTampon(null);
                  setIsDropZoneOver(false);
                }}
                onTouchStartTampon={handleTouchStartTampon}
                onTouchMoveTampon={handleTouchMove}
                onTouchEndTampon={handleTouchEnd}
                isDropZoneOver={isDropZoneOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onPasserAuDossierSuivant={passerAuDossierSuivant}
                caviardagesFaits={caviardagesFaits}
                caviardagesErreurs={caviardagesErreurs}
                onCaviarderTerme={caviarderTerme}
                onCaviarderTout={caviarderTout}
                cameraGlitchActive={cameraGlitchActive}
                cameraNeutralisee={cameraNeutralisee}
                onNeutraliserCamera={neutraliserCamera}
                cameraDecision={cameraDecision}
                onTrancherCamera={trancherCamera}
                cameraFeedback={cameraFeedback}
                rioInspecte={rioInspecteDossier}
                onInspecterRio={inspecterRio}
                rioDecision={rioDecision}
                onTrancherRio={trancherRio}
                rioFeedback={rioFeedback}
                riposteDeclenchee={riposteDeclenchee}
                onRiposteOutrage={declencherRiposteOutrage}
                substitutionsFaites={substitutionsFaites}
                onSubstituerScelle={substituerScelle}
                activeContactId={activeContactId}
                onSelectContact={(id) => setActiveContactId(id)}
                fuitesTransmises={fuitesTransmises}
                onTransmettreFuite={transmettreFuiteClandestine}
                credibiliteMinistere={credibiliteMinistere}
                paxSociale={paxSociale}
                blames={blames}
                primeTotale={primeTotale}
                onBroyerPiece={actionnerBroyeuse}
                broyeurAnime={broyeurAnime}
                documentsBroyes={documentsBroyes}
                equipementsPossedes={equipementsPossedes}
                openWindows={openWindows}
                onToggleWindow={handleToggleWindow}
                onFocusWindow={handleFocusWindow}
                onCloseWindow={handleCloseWindow}
                activeWindowId={activeWindowId}
                missionNotificationOpen={missionNotificationOpen}
                onCloseMissionNotification={() => setMissionNotificationOpen(false)}
                onOpenMissionNotification={() => setMissionNotificationOpen(true)}
                onToggleNotes={() => setNotesDuPosteOuvertes((prev) => !prev)}
                notesOuvertes={notesDuPosteOuvertes}
                onOpenGuide={() => setShowGuideModal(true)}
                onOpenBoutique={() => setIsBoutiqueOpen(true)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={basculerPleinEcran}
                isChronoStarted={isChronoStarted}
                timeRemaining={timeRemaining}
                maxTime={maxTime}
                onStartChrono={lancerChronoDossier}
                autoPunchNext={autoPunchNext}
                onToggleAutoPunch={() => setAutoPunchNext((prev) => !prev)}
                onAddCoffeeTime={ajouterTempsCafe}
              />
            </div>

            {/* MODALE D'ÉVALUATION ET DE VERDICT DU PARQUET (HOMOLOGATION OU REJET DOCTRINAL) */}
            {feedback && (
              <DecisionVerdictModal
                feedback={feedback}
                blames={blames}
                primeTotale={primeTotale}
                credibiliteMinistere={credibiliteMinistere}
                onPasserSuivant={passerAuDossierSuivant}
                onRevoirDossier={() => setFeedback(null)}
              />
            )}
          </div>
        )}

        {/* ÉCRAN DE BILAN FORENSIQUE ET NOTATION DU PRÉFET (VICTOIRE OU GAMEOVER) */}
        {(gameState === "completed" || gameState === "gameover") && (
          <OfficerEvaluationReportModal
            isVictory={gameState === "completed"}
            onRestart={restartGame}
            gameOverReason={gameOverReason}
            stats={{
              totalProcessed,
              totalDossiers: dossiers.length,
              primeTotale,
              credibiliteMinistere,
              paxSociale,
              blames,
              documentsBroyes,
              substitutionsCount: substitutionsFaites.size,
              equipementsCount: equipementsPossedes.size,
              fuitesCount: fuitesTransmises.size,
              currentGrade,
            }}
          />
        )}
      </main>

      {/* FIL D'ACTUALITÉ EN CONTINU HORS DU BUREAU DE JEU */}
      {gameState !== "playing" && (
        <footer className="w-full bg-[#001c54] border-t border-[#003399] py-1 px-3 font-sans text-xs flex items-center gap-2 overflow-hidden shrink-0 text-white select-none">
          <span className="bg-[#cc0000] text-white px-1.5 py-0.5 font-bold text-[10px] shrink-0 tracking-wider flex items-center gap-1 shadow-xs">
            <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            DÉPÊCHE OFFICIELLE
          </span>
          <div className="truncate text-sky-100 flex-1 font-mono text-[11px]">
            {flashNews ? (
              <span className="text-amber-300 font-bold">{flashNews}</span>
            ) : (
              <span>{ACTUALITES_CONTINU[newsTickerIndex]}</span>
            )}
          </div>
          <span className="text-sky-300 text-[10px] shrink-0 hidden sm:inline font-mono">CHEOPS-NEWS v2.4 // INTRANET BEAUVAU</span>
        </footer>
      )}

      {/* BANNIÈRE TÉLÉGRAMME CRYPTÉE RÉACTIVE DU MINISTÈRE */}
      <TelegramBannerToast
        alert={telegramAlert}
        onDismiss={() => setTelegramAlert(null)}
      />

      {/* Tampon fantôme flottant sous le doigt lors du glisser-déposer tactile sur mobile */}
      {touchGhostPos && draggedTampon && (
        <div
          style={{
            left: `${touchGhostPos.x}px`,
            top: `${touchGhostPos.y}px`,
            transform: "translate(-50%, -50%) rotate(-4deg)",
          }}
          className="fixed pointer-events-none z-50 p-2.5 bg-black/95 border-2 border-[#00ff66] text-[#00ff66] font-mono text-xs font-black uppercase shadow-[0_0_20px_rgba(0,255,102,0.6)] backdrop-blur-xs select-none"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base">🔨</span>
            <span>{draggedTampon.label}</span>
          </div>
          <div className="text-[9px] text-white/90 tracking-wider mt-0.5 border-t border-[#00ff66]/40 pt-0.5">
            Lâchez sur la vidéo pour apposer le visa
          </div>
        </div>
      )}

      {/* BOUTIQUE DE LA MUTUELLE POLICE & MATÉRIEL DU CENSEUR (STYLE WIN32 XP DIALOG) */}
      {isBoutiqueOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 font-sans select-none">
          <div className="bg-[#ece9d8] border-3 border-[#0055ea] max-w-2xl w-full max-h-[90vh] shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col justify-between text-black">
            <div>
              {/* BARRE DE TITRE XP LUNA BLEUE */}
              <div className="xp-titlebar-active h-7.5 px-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🛍️</span>
                  <span className="font-bold text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    Catalogue de la Mutuelle & Dotation de Censure — CHEOPS XP
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-fermer-boutique"
                  onClick={() => setIsBoutiqueOpen(false)}
                  className="xp-btn-close w-5 h-5 flex items-center justify-center text-white text-xs font-bold rounded-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* CORPS DE LA BOÎTE DE DIALOGUE */}
              <div className="p-3 sm:p-4 space-y-3 overflow-y-auto max-h-[calc(90vh-90px)]">
                {/* SOLDE DES PRIMES (CADRE EN RELIEF WIN32) */}
                <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2.5 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-slate-600 text-xs font-bold">SOLDE DU MATRICULE #7501923 :</span>
                    <div className="text-[11px] text-slate-500">Primes de zèle et de caviardage acquises</div>
                  </div>
                  <div className="text-emerald-700 font-black text-lg font-mono">
                    {primeTotale} €
                  </div>
                </div>

                {/* GROUPBOX ÉQUIPEMENTS DE CENSURE */}
                <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff]">
                  <legend className="px-1.5 font-bold text-xs text-[#003366] bg-[#ece9d8] border border-[#9c9a91]">
                    Articles agréés par la Direction Centrale :
                  </legend>

                  <div className="space-y-2 mt-2">
                    {BOUTIQUE_EQUIPEMENTS.map((eq) => {
                      const possede = equipementsPossedes.has(eq.id);
                      const achetable = primeTotale >= eq.cout && !possede;

                      return (
                        <div
                          key={eq.id}
                          className={`p-2.5 border transition-all text-xs ${
                            possede
                              ? "bg-[#e8f8f0] border-[#2e7d32]"
                              : achetable
                              ? "bg-white border-[#7f9db9] hover:border-[#0055ea]"
                              : "bg-[#ece9d8] border-[#9c9a91] opacity-65"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{eq.icone}</span>
                              <div>
                                <span className="font-bold text-slate-900 text-xs block">
                                  {eq.nom}
                                </span>
                                <span className="text-[10px] text-[#0055ea] font-bold">
                                  EFFET : {eq.effetDescription}
                                </span>
                              </div>
                            </div>
                            <div className="text-right font-mono font-bold text-slate-800 shrink-0">
                              {eq.cout} €
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-snug my-1">
                            {eq.description}
                          </p>

                          <div className="mt-1.5 flex justify-end">
                            {possede ? (
                              <span className="text-emerald-800 font-bold text-[11px] flex items-center gap-1 bg-white px-2 py-0.5 border border-[#2e7d32]">
                                ✓ En dotation officielle
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => acheterEquipement(eq)}
                                disabled={!achetable}
                                className={`xp-btn text-xs py-1 px-3 ${
                                  achetable ? "text-[#003366]" : "opacity-50 cursor-not-allowed"
                                }`}
                              >
                                {primeTotale < eq.cout ? `Fonds insuffisants (${eq.cout - primeTotale} €)` : `Commander (${eq.cout} €)`}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </div>

            {/* PIED DE BOÎTE DIALOGUE */}
            <div className="bg-[#ece9d8] border-t border-[#9c9a91] p-2.5 px-4 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 italic">
                Achat subventionné par la caisse d'entraide de la Préfecture.
              </span>
              <button
                type="button"
                onClick={() => setIsBoutiqueOpen(false)}
                className="xp-btn min-w-20"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
