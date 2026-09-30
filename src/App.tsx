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
  const [timeRemaining, setTimeRemaining] = useState<number>(26.0);
  const [maxTime, setMaxTime] = useState<number>(26.0);
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

  // Système de fichiers diégétique (Navigation, Répertoire et Bureau OS)
  const initialDossier = dossiers[0];
  const [currentPath, setCurrentPath] = useState<string>(
    `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${initialDossier.id}`
  );
  const [openedDocument, setOpenedDocument] = useState<VirtualFile | null>(null);
  const [discoveredFiles, setDiscoveredFiles] = useState<Set<string>>(new Set());
  const [nextZIndex, setNextZIndex] = useState<number>(20);
  const [activeWindowId, setActiveWindowId] = useState<WindowId>("explorer");
  const [missionNotificationOpen, setMissionNotificationOpen] = useState<boolean>(true);
  const [openWindows, setOpenWindows] = useState<
    Record<WindowId, { isOpen: boolean; isMinimized: boolean; zIndex: number }>
  >({
    explorer: { isOpen: true, isMinimized: false, zIndex: 10 },
    document: { isOpen: false, isMinimized: false, zIndex: 12 },
    qualification: { isOpen: true, isMinimized: false, zIndex: 9 },
    video: { isOpen: false, isMinimized: false, zIndex: 6 },
    humandb: { isOpen: false, isMinimized: false, zIndex: 5 },
    messages: { isOpen: false, isMinimized: false, zIndex: 4 },
    scelles: { isOpen: false, isMinimized: false, zIndex: 3 },
    rio: { isOpen: false, isMinimized: false, zIndex: 2 },
  });

  const handleToggleWindow = useCallback(
    (id: WindowId) => {
      setOpenWindows((prev) => {
        const win = prev[id] || { isOpen: false, isMinimized: false, zIndex: 1 };
        const newZ = nextZIndex + 1;
        setNextZIndex(newZ);

        if (win.isOpen && !win.isMinimized && activeWindowId === id) {
          // Minimiser
          return {
            ...prev,
            [id]: { ...win, isMinimized: true },
          };
        }

        // Ouvrir ou Restaurer
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { isOpen: true, isMinimized: false, zIndex: newZ },
        };
      });
    },
    [nextZIndex, activeWindowId]
  );

  const handleFocusWindow = useCallback(
    (id: WindowId) => {
      const newZ = nextZIndex + 1;
      setNextZIndex(newZ);
      setActiveWindowId(id);
      setOpenWindows((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || { isOpen: true, isMinimized: false }),
          isOpen: true,
          isMinimized: false,
          zIndex: newZ,
        },
      }));
    },
    [nextZIndex]
  );

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
    [handleFocusWindow]
  );

  // Accès direct et instantané à la pièce maîtresse du dossier en cours
  const ouvrirPieceMaitresse = useCallback(() => {
    const current = dossiers[currentIndex];
    if (!current) return;
    const pvFile = getPrimaryCaseFile(current);
    handleOpenFile(pvFile);
  }, [currentIndex, handleOpenFile]);

  // Retours sensoriels & ludiques enrichis
  const [screenFlash, setScreenFlash] = useState<"success" | "error" | null>(null);
  const [floatingBonus, setFloatingBonus] = useState<{ text: string; id: number } | null>(null);
  const [telegramAlert, setTelegramAlert] = useState<TelegramAlert | null>(null);

  const declencherTelegramme = useCallback(
    (source: TelegramAlert["source"], message: string, priority: TelegramAlert["priority"] = "urgente") => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTelegramAlert({
        id: String(Date.now()),
        source,
        message,
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

  // Temps alloué : ~26 secondes pour analyser et qualifier, dégressif jusqu'à 12s
  const calculateAllocatedTime = useCallback((index: number): number => {
    if (index < 3) return 26.0;
    const steps = index - 2;
    const time = 26.0 / Math.pow(1.12, steps);
    return Math.max(12.0, Math.round(time * 10) / 10);
  }, []);

  const startDossier = useCallback((index: number) => {
    const current = dossiers[index];
    let allocated = calculateAllocatedTime(index);
    if (equipementsPossedes.has("cafe_syndical")) {
      allocated += 8.0;
    }
    setMaxTime(allocated);
    setTimeRemaining(allocated);
    setActiveStamp(null);
    setFeedback(null);
    setIsAwaitingNext(false);
    isProcessingRef.current = false;
    lastTickRef.current = performance.now();
    setCameraBloqueeNotice(false);

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
      const pvFile = getPrimaryCaseFile(current);
      setCurrentPath(`/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${current.id}`);
      setOpenedDocument(pvFile);
      setDiscoveredFiles(new Set([pvFile.id]));
      setActiveWindowId("document");
      setMissionNotificationOpen(true);
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

      // Télégramme de prise en charge du dossier
      if (current.telegrammePrefet) {
        declencherTelegramme("CABINET DU MINISTRE", current.telegrammePrefet, "urgente");
      }
    }
  }, [calculateAllocatedTime, declencherTelegramme]);

  // Rotation continue du bandeau d'actualités
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsTickerIndex((prev) => (prev + 1) % ACTUALITES_CONTINU.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Mode sans limite de temps : instruction approfondie des pièces sans contrainte d'horloge
  useEffect(() => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  }, [gameState, isAwaitingNext]);

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
  const trancherCamera = useCallback((decision: "neutraliser" | "conserver") => {
    const current = dossiers[currentIndex];
    if (cameraDecision !== null || !current?.incidentCamera) return;

    const attendu = current.incidentCamera.doitEtreNeutralisee ? "neutraliser" : "conserver";
    const estCorrect = decision === attendu;

    setCameraDecision(decision);
    setCameraNeutralisee(true);
    if (decision === "neutraliser") {
      setCameraGlitchActive(true);
      jouerSonGlitch();
    } else {
      jouerSonSubstitut();
    }

    if (estCorrect) {
      declencherVibration([30, 40, 50]);
      const gain = 35;
      setPrimeTotale((prev) => prev + gain);
      setCredibiliteMinistere((prev) => Math.min(100, prev + 10));
      setFloatingBonus({ text: `📹 FLUX MAÎTRISÉ (+${gain} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);
      setCameraFeedback({
        valide: true,
        explication: current.incidentCamera.explicationBonneDecision || "Décision de gestion du flux parfaitement alignée avec le dossier.",
        bonus: gain,
      });
      setFlashNews(
        `ARBITRAGE VIDÉO CONFORME : ${decision === "neutraliser" ? "Flux compromettant purgé" : "Preuve à charge conservée"} (+${gain} € / Crédibilité +10%).`
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
      setFloatingBonus({ text: `⚠️ FAUTE VIDÉO (-${perte} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1800);
      setCameraFeedback({
        valide: false,
        explication: current.incidentCamera.explicationErreur || "Erreur de doctrine sur la conservation ou purge du flux vidéo.",
        bonus: -perte,
      });
      setFlashNews(
        `FAUTE PROCÉDURALE VIDÉO : ${decision === "neutraliser" ? "Preuve à charge effacée par erreur !" : "Vidéo compromettante laissée au dossier !"} (-${perte} € / Crédibilité -22%).`
      );
    }
    setTimeout(() => setFlashNews(null), 6000);
  }, [currentIndex, cameraDecision]);

  const neutraliserCamera = useCallback(() => {
    trancherCamera("neutraliser");
  }, [trancherCamera]);

  // Prise de décision : application d'un visa de qualification
  const appliquerTampon = useCallback((tamponChoisi: TamponOption) => {
    if (gameState !== "playing" || isProcessingRef.current || isAwaitingNext) return;

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

    // Son de tampon administratif
    jouerSonTampon();

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

    // Effet d'impact
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 220);

    const randomAngle = -4 + Math.random() * 8;

    setActiveStamp({
      tamponLabel: tamponChoisi.label,
      isCorrect,
      angle: randomAngle,
      code: tamponChoisi.code
    });

    if (isCorrect) {
      const newCombo = comboZeile + 1;
      setComboZeile(newCombo);
      const mult = 1 + newCombo * 0.25;
      const basePrime = Math.round(45 * mult);
      const bonusPrefet = currentDossier.telegrammePrefet ? currentDossier.telegrammePrefet.primeBonus : 0;
      const gainDossier = basePrime + bonusPrefet;

      setPrimeTotale((prev) => prev + gainDossier);
      setDernierePrime(gainDossier);
      setCredibiliteMinistere((prev) => Math.min(100, prev + 6));
      setPaxSociale((prev) => Math.min(100, prev + 5));
      setFloatingBonus({ text: `+${gainDossier} € (HOMOLOGUÉ)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);

      if (newCombo > 1) {
        jouerSonCombo(newCombo);
      } else {
        jouerSonPrime();
      }

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
      if (equipementsPossedes.has("immunite_blame")) {
        setEquipementsPossedes((prev) => {
          const next = new Set(prev);
          next.delete("immunite_blame");
          return next;
        });
        jouerSonPrime();
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
        jouerSonBlame();
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
    setIsAwaitingNext(true);
  }, [gameState, currentIndex, blames, isAwaitingNext, cameraDecision, comboZeile, equipementsPossedes]);

  // Passage manuel au dossier suivant
  const passerAuDossierSuivant = useCallback(() => {
    if (!isAwaitingNext) return;

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
      startDossier(nextIndex);
    }
  }, [isAwaitingNext, blames, credibiliteMinistere, currentIndex, startDossier]);

  // Arbitrage déductif du matricule RIO (flouter vs valider)
  const trancherRio = useCallback((decision: "flouter" | "valider") => {
    const current = dossiers[currentIndex];
    if (rioDecision !== null || !current?.statutRio) return;

    const estBonneDecision = decision === current.statutRio.bonneDecision;
    setRioDecision(decision);
    setRioInspecteDossier(true);

    if (estBonneDecision) {
      jouerSonRio();
      declencherVibration([30, 50]);
      const bonus = current.statutRio.primeBonus + (equipementsPossedes.has("flouteur_rio") ? 25 : 0);
      setPrimeTotale((prev) => prev + bonus);
      setCredibiliteMinistere((prev) => Math.min(100, prev + 8));
      setPaxSociale((prev) => Math.min(100, prev + 4));
      setFloatingBonus({ text: `✓ RIO CONFORME (+${bonus} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1600);
      setRioFeedback({
        valide: true,
        explication: current.statutRio.explicationBonneDecision || `Arbitrage RIO conforme aux intérêts de l'institution.`,
        bonus,
      });
      setFlashNews(
        `ARBITRAGE RIO CONFORME : ${decision === "flouter" ? "Anonymat garanti" : "Matricule homologué"} (+${bonus} € / Crédibilité +8%).`
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
      setFloatingBonus({ text: `⚠️ ERREUR RIO (-${malus} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1800);
      setRioFeedback({
        valide: false,
        explication: current.statutRio.explicationErreur || `Erreur d'appréciation sur le statut du matricule RIO.`,
        bonus: -malus,
      });
      setFlashNews(
        `AVERTISSEMENT RIO : Décision inappropriée sur le matricule (-${malus} € / Crédibilité -18%).`
      );
    }
    setTimeout(() => setFlashNews(null), 6000);
  }, [currentIndex, rioDecision, equipementsPossedes]);

  const inspecterRio = useCallback(() => {
    trancherRio("flouter");
  }, [trancherRio]);

  // Inversion accusatoire : outrage et rébellion réflexe
  const declencherRiposteOutrage = useCallback(() => {
    const current = dossiers[currentIndex];
    if (riposteDeclenchee || !current?.riposteOutrage) return;
    setRiposteDeclenchee(true);
    jouerSonOutrageRiposte();
    declencherVibration([50, 80, 50]);
    const mult = equipementsPossedes.has("riposte_systematique") ? 2 : 1;
    const bonus = current.riposteOutrage.primeRiposte * mult;
    setPrimeTotale((prev) => prev + bonus);
    setPaxSociale((prev) => Math.min(100, prev + 4));
    setFloatingBonus({ text: `⚖️ +${bonus} € (OUTRAGE PARQUET)`, id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 1600);
    setFlashNews(
      `INVERSION ACCUSATOIRE : Procédure d'outrage & rébellion transmise au Parquet contre la victime (+${bonus} €).`
    );
    setTimeout(() => setFlashNews(null), 6000);
  }, [riposteDeclenchee, currentIndex, equipementsPossedes]);

  // Voie de résistance citoyenne : fuite clandestine sécurisée à Me Camille Sorel
  const transmettreFuiteClandestine = useCallback((dossierId: string) => {
    if (fuitesTransmises.has(dossierId)) return;
    soundFx.playWhistleblowLeak();
    declencherVibration([40, 70, 40, 90]);
    setFuitesTransmises((prev) => new Set(prev).add(dossierId));
    setPaxSociale((prev) => Math.max(10, prev - 8));
    setFloatingBonus({ text: "📡 FUITE SÉCURISÉE ENVOYÉE", id: Date.now() });
    setTimeout(() => setFloatingBonus(null), 2000);
    setFlashNews(
      "📡 LIAISON TOR // FUITE SÉCURISÉE : Copie brute non caviardée transmise à Me Camille Sorel et au Défenseur des Droits !"
    );
    setTimeout(() => setFlashNews(null), 7000);
  }, [fuitesTransmises]);

  // Feutre triple-mine : caviarder tous les termes d'un coup
  const caviarderTout = useCallback(() => {
    const current = dossiers[currentIndex];
    if (!current?.termesCaviardes) return;
    const nonFaits = current.termesCaviardes.filter((t) => !caviardagesFaits.has(t.id));
    if (nonFaits.length === 0) return;
    jouerSonFeutre();
    declencherVibration([30, 40, 50]);
    nonFaits.forEach((t) => caviarderTerme(t));
  }, [currentIndex, caviardagesFaits]);

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
      setFloatingBonus({ text: `⚠️ FAUTE DE CENSURE (-${malusCensure} €)`, id: Date.now() });
      setTimeout(() => setFloatingBonus(null), 1800);
      setFlashNews(
        `ERREUR DE CAVIARDAGE : « ${terme.texteBrut} » constituait une preuve à charge ! (-${malusCensure} € / Crédibilité -14%).`
      );
    }
    setTimeout(() => setFlashNews(null), 5500);
  }, [caviardagesFaits, caviardagesErreurs]);

  // Substitution de pièce à conviction compromettante
  const substituerScelle = useCallback((piece: PieceASubstituer) => {
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
  }, [substitutionsFaites]);

  // Actionnement de la déchiqueteuse / broyeuse de bureau
  const actionnerBroyeuse = useCallback(() => {
    jouerSonBroyeur();
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
    setTimeout(() => setBroyeurAnime(false), 900);
  }, [blames]);

  // Gestion tactile du glisser-déposer sur mobile / tablette
  const handleTouchStartTampon = (t: TamponOption, e: TouchEvent) => {
    if (isAwaitingNext) return;
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
  }, [gameState, isAwaitingNext, passerAuDossierSuivant, appliquerTampon, startDossier, ouvrirPieceMaitresse]);

  const currentDossier: Dossier | undefined = dossiers[currentIndex] || dossiers[0];
  const progressRatio = Math.max(0, Math.min(1, timeRemaining / maxTime));

  // Progression de carrière et mobilier de bureau
  const currentGrade = GRADES.slice().reverse().find((g) => totalProcessed >= g.seuilDossiers) || GRADES[0];
  const hasCafe = totalProcessed >= 1;
  const hasTamponTitane = totalProcessed >= 3;
  const hasMedaille = totalProcessed >= 6;
  const hasPortrait = totalProcessed >= 8;

  const restartGame = (e: MouseEvent) => {
    e.stopPropagation();
    setGameState("playing");
    setCurrentIndex(0);
    setTotalProcessed(0);
    setBlames(0);
    setPrimeTotale(0);
    setDernierePrime(null);
    startDossier(0);
  };

  return (
    <div
      id="main-viewport"
      className={`relative w-full min-h-[100dvh] lg:h-screen lg:max-h-screen bg-[#03060a] text-[#e2e8f0] select-none flex flex-col justify-between p-1.5 sm:p-2 lg:p-2.5 overflow-x-hidden overflow-y-auto lg:overflow-hidden crt-monitor pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] ${
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
      <main className={`flex-1 min-h-0 flex flex-col items-center justify-center relative w-full overflow-hidden ${gameState === "playing" ? "p-0 m-0 max-w-none" : "my-0.5 sm:my-1 max-w-[1700px] mx-auto px-0 sm:px-1"}`}>
        {/* ÉCRAN D'ACCUEIL : PRISE DE SERVICE */}
        {gameState === "intro" && (
          <div className="border-2 sm:border-3 border-[#334155] p-4 sm:p-6 md:p-8 text-center max-w-3xl bg-[#080d14] shadow-2xl font-mono w-full my-auto">
            <div className="inline-block bg-[#1e293b] text-[#00ff66] text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 border border-[#334155] mb-3 sm:mb-4">
              [ TERMINAL D'INSTRUCTION ET DE QUALIFICATION CONTENTIEUSE ]
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-wider sm:tracking-widest mb-2 sm:mb-3 text-white">
              POLICE NATIONALE — APUREMENT DU CONTENTIEUX
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 text-[#cbd5e1]">
              Sous la supervision de la hiérarchie policière et des circulaires d'engagement,
              vous êtes chargé de qualifier chaque intervention litigieuse pour garantir la
              continuité du service et neutraliser les actions contentieuses contre l'administration.
            </p>

            <div className="border-2 border-[#1e293b] p-3 sm:p-4 mb-3 sm:mb-4 text-xs text-left bg-[#04080e] space-y-2.5 sm:space-y-3">
              <div className="text-[#94a3b8] font-bold border-b border-[#1e293b] pb-1 uppercase tracking-wider text-[11px] sm:text-xs">
                LES 3 QUALIFICATIONS DE DOCTRINE MINISTÉRIELLE :
              </div>
              <div>
                <span className="font-bold text-white bg-[#1e293b] px-1.5 sm:px-2 py-0.5 mr-1.5 text-[11px] sm:text-xs">[1] NON-LIEU // USAGE CONFORME</span>
                <span className="text-[#94a3b8] text-[11px] sm:text-xs block sm:inline mt-0.5 sm:mt-0">
                  Usage régulier de la force ou défaillance physiologique autonome de l'administré.
                </span>
              </div>
              <div>
                <span className="font-bold text-white bg-[#1e293b] px-1.5 sm:px-2 py-0.5 mr-1.5 text-[11px] sm:text-xs">[2] VIOLENCES SUR DÉPOSITAIRE</span>
                <span className="text-[#94a3b8] text-[11px] sm:text-xs block sm:inline mt-0.5 sm:mt-0">
                  Préjudice matériel ou corporel subi par le service (blessure de l'agent, sang projeté sur la tenue).
                </span>
              </div>
              <div>
                <span className="font-bold text-white bg-[#1e293b] px-1.5 sm:px-2 py-0.5 mr-1.5 text-[11px] sm:text-xs">[3] ENTRAVE & TAPAGE ILLICITE</span>
                <span className="text-[#94a3b8] text-[11px] sm:text-xs block sm:inline mt-0.5 sm:mt-0">
                  Agitation corporelle désordonnée, cris perçants ou encombrement au sol perturbant l'intervention.
                </span>
              </div>
            </div>

            {/* Manipulations tactiles et administratives autorisées */}
            <div className="border border-[#1e293b] bg-[#02060b] p-2.5 sm:p-3 mb-3 sm:mb-4 text-left text-xs font-mono">
              <div className="text-[#00ff66] font-bold text-[10px] sm:text-xs uppercase mb-1.5 flex items-center gap-1.5">
                <span>⚡</span>
                <span>OUTILS ET MANIPULATIONS TACTILES DU BUREAU :</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-[#cbd5e1]">
                <div className="bg-[#0b131e] p-2 border border-[#1e293b]">
                  <strong className="text-white">🖐️ GLISSER-DÉPOSER LE TAMPON :</strong> Saisissez le tampon à la souris ou au doigt et glissez-le directement sur la vidéo ou le bordereau (ou simple clic direct).
                </div>
                <div className="bg-[#0b131e] p-2 border border-[#1e293b]">
                  <strong className="text-white">🖍️ CAVIARDAGE AU FEUTRE NOIR :</strong> Biffez les termes médicaux alarmistes dans les constats pour toucher votre prime de censure (+20 €).
                </div>
                <div className="bg-[#0b131e] p-2 border border-[#1e293b]">
                  <strong className="text-white">🔄 SUBSTITUTION DE SCELLÉ :</strong> Glissez ou cliquez pour remplacer une pièce compromettante par un PV homologué pour le parquet.
                </div>
                <div className="bg-[#0b131e] p-2 border border-[#1e293b]">
                  <strong className="text-white">🗑️ DÉCHIQUETEUSE CHEOPS :</strong> Actionnez la broyeuse en haut à droite pour détruire des notes et effacer vos blâmes disciplinaires.
                </div>
              </div>
            </div>

            <div className="text-[10px] sm:text-[11px] text-[#e2e8f0] mb-4 sm:mb-5 bg-[#152336] p-2 sm:p-2.5 border border-[#3b82f6]/40 text-left">
              <strong className="text-[#60a5fa]">FONCTIONNEMENT RÉGLEMENTAIRE :</strong> Le rapport officiel du chef de dispositif est
              placé sous scellé chiffré et ne sera déverrouillé qu'en cas de qualification conforme. 3 erreurs entraînent la suspension immédiate du matricule.
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-stretch sm:items-center mb-4">
              <button
                type="button"
                id="btn-start-fullscreen"
                onClick={() => {
                  basculerPleinEcran();
                  setGameState("playing");
                  setCurrentIndex(0);
                  setTotalProcessed(0);
                  setBlames(0);
                  startDossier(0);
                  jouerSonTampon();
                  declencherVibration(40);
                }}
                className="w-full sm:w-auto min-h-[48px] text-xs sm:text-sm font-black tracking-wider border-2 border-[#00ff66] py-3 px-6 bg-[#00ff66] text-black hover:bg-[#00cc52] active:scale-[0.98] cursor-pointer uppercase transition-transform font-mono shadow-lg flex items-center justify-center gap-2"
              >
                <span>⛶</span>
                <span>[ JOUER EN PLEIN ÉCRAN (RECOMMANDÉ) ]</span>
              </button>

              <button
                type="button"
                id="btn-start-game"
                onClick={() => {
                  setGameState("playing");
                  setCurrentIndex(0);
                  setTotalProcessed(0);
                  setBlames(0);
                  startDossier(0);
                  jouerSonTampon();
                  declencherVibration(30);
                }}
                className="w-full sm:w-auto min-h-[48px] text-xs sm:text-sm font-bold tracking-wider border border-[#334155] py-3 px-5 bg-[#0f172a] text-[#cbd5e1] hover:bg-[#1e293b] hover:text-white active:scale-[0.98] cursor-pointer uppercase transition-transform font-mono"
              >
                [ OUVRIR EN MODE FENÊTRE ]
              </button>
            </div>

            {/* Guide d'installation et jeu plein écran sur smartphone */}
            <div className="border border-[#1e293b] bg-[#050b12] text-left p-3 text-xs">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowMobileGuide(!showMobileGuide)}
                  className="text-[11px] sm:text-xs text-[#60a5fa] hover:text-[#93c5fd] font-bold flex items-center gap-1.5 cursor-pointer font-mono uppercase"
                >
                  <span>📲</span>
                  <span>{showMobileGuide ? "[-] MASQUER LE GUIDE SMARTPHONE" : "[+] ACCÈS DIRECT SMARTPHONE & PLEIN ÉCRAN"}</span>
                </button>
                <button
                  type="button"
                  onClick={copierUrlDirect}
                  className="text-[10px] bg-[#1e293b] hover:bg-[#334155] active:bg-[#00ff66] active:text-black text-[#00ff66] border border-[#334155] px-2 py-0.5 font-mono cursor-pointer"
                >
                  {urlCopied ? "✓ LIEN COPIÉ !" : "COPIER L'URL DU JEU"}
                </button>
              </div>

              {showMobileGuide && (
                <div className="mt-3 pt-2.5 border-t border-[#1e293b] space-y-2 text-[11px] text-[#94a3b8] font-mono leading-relaxed">
                  <div>
                    <strong className="text-white">1. URL DIRECTE :</strong> Ouvrez le jeu dans le navigateur de votre téléphone (Safari ou Chrome).
                  </div>
                  <div>
                    <strong className="text-white">2. PLEIN ÉCRAN RAPIDE :</strong> Appuyez sur le bouton vert <span className="text-[#00ff66] font-bold">[⛶ PLEIN ÉCRAN]</span> en haut ou au lancement.
                  </div>
                  <div>
                    <strong className="text-white">3. APPLICATION SANS BARRE D'ADRESSE :</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5 text-gray-300">
                      <li><strong>Sur iPhone (Safari) :</strong> Touchez l'icône de partage ⎋ puis choisissez <em>« Sur l'écran d'accueil »</em> ➕.</li>
                      <li><strong>Sur Android (Chrome) :</strong> Touchez les trois points ⋮ puis <em>« Installer l'application »</em> ou <em>« Ajouter à l'écran d'accueil »</em>.</li>
                    </ul>
                  </div>
                  <div className="text-[10px] text-gray-400 italic">
                    L'application se lance alors comme un jeu natif plein écran sans aucune bordure ni barre d'adresse.
                  </div>
                </div>
              )}
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

      {/* FIL D'ACTUALITÉ EN CONTINU (SATIRE DES DÉCLARATIONS OFFICIELLES) */}
      <footer className="w-full bg-[#05090f] border-t border-[#1e293b] py-1 px-2 font-mono text-[9px] sm:text-[11px] flex items-center gap-2 overflow-hidden shrink-0">
        <span className="bg-[#cc0000] text-white px-1.5 py-0.5 font-black text-[8px] sm:text-[9px] shrink-0 tracking-wider flex items-center gap-1 animate-pulse">
          <span className="inline-block w-1.5 h-1.5 bg-white rounded-full"></span>
          FLASH INFO
        </span>
        <div className="truncate text-gray-300 flex-1 font-mono">
          {flashNews ? (
            <span className="text-[#00ff66] font-bold animate-pulse">{flashNews}</span>
          ) : (
            <span>{ACTUALITES_CONTINU[newsTickerIndex]}</span>
          )}
        </div>
        <span className="text-gray-600 text-[8px] sm:text-[9px] shrink-0 hidden sm:inline">CHEOPS-NEWS v2.4 // INTRANET MINISTÈRE</span>
      </footer>

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

      {/* BOUTIQUE DE LA MUTUELLE POLICE & MATÉRIEL DU CENSEUR */}
      {isBoutiqueOpen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-[#080d14] border-2 sm:border-3 border-[#3b82f6] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-3 sm:p-5 font-mono shadow-2xl flex flex-col justify-between">
            <div>
              {/* En-tête de la Boutique */}
              <div className="flex justify-between items-center border-b-2 border-[#1e293b] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1e3a5f] text-white px-2 py-1 text-xs font-black">
                    CHEOPS // INTRANET
                  </span>
                  <span className="text-white font-bold text-xs sm:text-sm tracking-wide">
                    MUTUELLE & DOTATION DU CENSEUR
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-fermer-boutique"
                  onClick={() => setIsBoutiqueOpen(false)}
                  className="bg-[#1e293b] hover:bg-[#ef4444] text-white px-2.5 py-1 text-xs font-black cursor-pointer transition-colors"
                >
                  ✕ FERMER
                </button>
              </div>

              {/* Solde des primes disponibles */}
              <div className="flex justify-between items-center bg-[#04080e] p-2.5 border border-[#1e293b] mb-3 text-xs">
                <span className="text-gray-400">SOLDE DU MATRICULE #7501923 :</span>
                <span className="text-[#fbbf24] font-black text-sm sm:text-base">
                  {primeTotale} € <span className="text-[10px] text-gray-500 font-normal">(Primes de zèle acquises)</span>
                </span>
              </div>

              {/* Grille des équipements */}
              <div className="space-y-2 mb-4">
                {BOUTIQUE_EQUIPEMENTS.map((eq) => {
                  const possede = equipementsPossedes.has(eq.id);
                  const achetable = primeTotale >= eq.cout && !possede;

                  return (
                    <div
                      key={eq.id}
                      className={`p-2.5 sm:p-3 border transition-all ${
                        possede
                          ? "bg-[#06170d] border-[#00ff66]/60"
                          : achetable
                          ? "bg-[#0c1420] border-[#3b82f6]/60 hover:border-[#60a5fa]"
                          : "bg-[#090e15] border-[#1e293b] opacity-65"
                      }`}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{eq.icone}</span>
                          <div>
                            <span className="font-bold text-white text-xs sm:text-sm block">
                              {eq.nom}
                            </span>
                            <span className="text-[9px] text-[#60a5fa] font-bold">
                              EFFET : {eq.effetDescription}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-xs sm:text-sm text-[#fbbf24] block">
                            {eq.cout} €
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-gray-300 leading-snug my-1">
                        {eq.description}
                      </p>

                      <div className="mt-2 flex justify-end">
                        {possede ? (
                          <span className="bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66] px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                            ✓ EN DOTATION OFFICIELLE
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => acheterEquipement(eq)}
                            disabled={!achetable}
                            className={`px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                              achetable
                                ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white border-white active:scale-95 shadow"
                                : "bg-[#1e293b] text-gray-500 border-[#334155] cursor-not-allowed"
                            }`}
                          >
                            {primeTotale < eq.cout ? `FONDS INSUFFISANTS (${eq.cout - primeTotale} €)` : `COMMANDER (${eq.cout} €)`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[9px] text-gray-500 border-t border-[#1e293b] pt-2 text-center">
              CIRCULAIRE INTERNE DCAJ : Les achats de matériel de censure n'ouvrent aucun droit de recours syndical.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
