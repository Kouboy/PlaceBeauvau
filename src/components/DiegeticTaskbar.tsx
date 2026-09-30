import React, { useState } from "react";
import {
  FolderOpen,
  Scale,
  Video,
  Database,
  MessageSquare,
  Package,
  FileBadge,
  Trash2,
  Coins,
  ArrowRight,
  AlertTriangle,
  Radio,
  FileCode,
  HardDrive,
  Globe,
  Sparkles,
  Command,
  Coffee
} from "lucide-react";
import { WindowId } from "./DesktopWorkspace";
import { TamponOption, TAMPONS_DISPONIBLES } from "../dossiers";
import { soundFx } from "../services/soundFx";

interface DiegeticTaskbarProps {
  isAwaitingNext: boolean;
  blames: number;
  onPasserAuDossierSuivant: () => void;
  // Fenêtres ouvertes
  activeWindowId: WindowId;
  openWindows: Record<WindowId, { isOpen: boolean; isMinimized: boolean; zIndex: number }>;
  onToggleWindow: (id: WindowId) => void;
  onNavigateToPath: (path: string) => void;
  currentDossierId: string;
  // Broyeuse
  documentsBroyes: number;
  broyeurAnime: boolean;
  onBroyerPiece: () => void;
  // Indicateurs
  primeTotale: number;
  dernierePrime: number | null;
  cameraNeutralisee: boolean;
  hasIncidentCamera: boolean;
}

export const DiegeticTaskbar: React.FC<DiegeticTaskbarProps> = ({
  isAwaitingNext,
  blames,
  onPasserAuDossierSuivant,
  activeWindowId,
  openWindows,
  onToggleWindow,
  onNavigateToPath,
  currentDossierId,
  documentsBroyes,
  broyeurAnime,
  onBroyerPiece,
  primeTotale,
  dernierePrime,
  cameraNeutralisee,
  hasIncidentCamera,
}) => {
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [cafeSipsLeft, setCafeSipsLeft] = useState<number>(3);
  const [cafeToast, setCafeToast] = useState<string | null>(null);

  // Recharger le café à chaque changement de dossier
  React.useEffect(() => {
    setCafeSipsLeft(3);
  }, [currentDossierId]);

  const handleDrinkCoffee = () => {
    if (cafeSipsLeft > 0) {
      soundFx.playCoffeeSip();
      const nextSips = cafeSipsLeft - 1;
      setCafeSipsLeft(nextSips);
      const repliques = [
        "« Chicorée d'État à 40 centimes : vigilance restaurée. »",
        "« L'amertume du café rappelle vos devoirs envers la hiérarchie. »",
        "« Dernière gorgée : le stylo ne tremble plus sur le non-lieu ! »"
      ];
      setCafeToast(repliques[2 - nextSips] || "Pause café accordée.");
      setTimeout(() => setCafeToast(null), 3500);
    } else {
      soundFx.playDeskTap();
      setCafeToast("Distributeur Selecta en panne. Reprendre le service !");
      setTimeout(() => setCafeToast(null), 3000);
    }
  };

  const windowTabs = [
    { id: "explorer" as WindowId, label: "Explorateur (C:)", icon: FolderOpen, color: "text-amber-400" },
    { id: "qualification" as WindowId, label: "Bordereau & Sceaux", icon: Scale, color: "text-[#00ff66]" },
    { id: "video" as WindowId, label: "Moniteur CCTV", icon: Video, color: "text-emerald-400" },
    { id: "humandb" as WindowId, label: "Fichier TAJ", icon: Database, color: "text-cyan-400" },
    { id: "messages" as WindowId, label: "Messagerie", icon: MessageSquare, color: "text-sky-400" },
    { id: "scelles" as WindowId, label: "Casier Scellés", icon: Package, color: "text-purple-400" },
    { id: "rio" as WindowId, label: "Registre RIO", icon: FileBadge, color: "text-amber-300" },
  ];

  return (
    <footer className="relative border-t-3 border-[#0284c7] bg-gradient-to-b from-[#061e31] to-[#020b13] p-1.5 sm:p-2 shrink-0 select-none z-30 font-mono shadow-2xl">
      
      {/* MENU DÉMARRER // BEAUVAU-OS */}
      {startMenuOpen && (
        <div className="absolute bottom-full left-2 mb-2 w-72 sm:w-80 bg-[#040c17] border-2 border-[#0284c7] shadow-2xl p-3 flex flex-col gap-2 text-xs z-50 rounded-xs">
          
          <div className="bg-gradient-to-r from-[#0284c7] to-[#034d75] p-2 text-white font-black text-xs uppercase flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4" />
              <span>MINISTÈRE // MENU DÉMARRER</span>
            </div>
            <button
              type="button"
              onClick={() => setStartMenuOpen(false)}
              className="text-white hover:text-red-300 font-bold"
            >
              ✕
            </button>
          </div>

          <div className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 pb-1">
            APPLICATIONS D'INSTRUCTION :
          </div>

          <div className="flex flex-col gap-1">
            {windowTabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFx.playUiClick();
                    onToggleWindow(item.id);
                    setStartMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 flex items-center gap-2.5 hover:bg-[#082038] text-slate-200 transition-colors text-left"
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="font-bold">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 pb-1 mt-1">
            DOSSIERS & PARTAGES RÉSEAU :
          </div>

          <div className="flex flex-col gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => {
                onToggleWindow("explorer");
                onNavigateToPath(`/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${currentDossierId}`);
                setStartMenuOpen(false);
              }}
              className="px-2 py-1 flex items-center gap-2 text-sky-300 hover:bg-[#082038]"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Dossier actif #{currentDossierId}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleWindow("explorer");
                onNavigateToPath("//SERVEUR-CENTRAL-BEAUVAU/DIRECTIVES");
                setStartMenuOpen(false);
              }}
              className="px-2 py-1 flex items-center gap-2 text-rose-300 hover:bg-[#2e0909]"
            >
              <Radio className="w-3.5 h-3.5 text-red-400" />
              <span>Télégrammes Beauvau$</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleWindow("explorer");
                onNavigateToPath("//PARQUET-TRIBUNAL/REQUISITOIRES");
                setStartMenuOpen(false);
              }}
              className="px-2 py-1 flex items-center gap-2 text-emerald-300 hover:bg-[#092e19]"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parquet de Paris$</span>
            </button>
          </div>

          <div className="border-t border-slate-800 pt-1.5 flex justify-between text-[10px] text-slate-400">
            <span>SESSION OPJ : CHEOPS-75</span>
            <span className="text-emerald-400">● EN LIGNE</span>
          </div>

        </div>
      )}

      {/* BOUTON ÉMARGER SUIVANT SI QUALIFIÉ */}
      {isAwaitingNext && (
        <div className="mb-1.5">
          <button
            type="button"
            onClick={onPasserAuDossierSuivant}
            className="w-full h-11 sm:h-12 bg-emerald-500 hover:bg-emerald-400 border-2 border-white text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl cursor-pointer active:scale-[0.99]"
          >
            <ArrowRight className="w-5 h-5 text-black animate-pulse" />
            <span>[ DOSSIER CLÔTURÉ AVEC SUCCÈS — ÉMARGER & PASSER AU LITIGE SUIVANT ➔ ]</span>
          </button>
        </div>
      )}

      {/* RANGÉE DE LA BARRE DES TÂCHES */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        
        {/* GAUCHE : BOUTON DÉMARRER + ONGLETS DE FENÊTRES OUVERTES */}
        <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 py-0.5">
          
          {/* BOUTON DÉMARRER PARODIQUE (VERT XP INSPIRÉ) */}
          <button
            type="button"
            onClick={() => {
              soundFx.playUiClick();
              setStartMenuOpen(!startMenuOpen);
            }}
            className={`px-3 py-1 text-xs font-sans font-black uppercase flex items-center gap-2 border-t border-l border-white/60 border-b border-r border-black/80 shadow-md cursor-pointer transition-transform active:scale-[0.98] rounded-r-md ${
              startMenuOpen
                ? "bg-[#185c13] text-white brightness-90 shadow-inner"
                : "bg-gradient-to-r from-[#237d1c] via-[#2fa324] to-[#1c6e16] hover:brightness-110 text-white"
            }`}
          >
            <span className="text-sm">🇫🇷</span>
            <span className="tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">DÉMARRER</span>
          </button>

          {/* SÉPARATEUR WIN32 */}
          <div className="h-5 w-px bg-slate-700 mx-0.5 hidden sm:block" />

          {/* ONGLETS DES FENÊTRES (RECESSED / PRESSED BUTTONS) */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {windowTabs.map((tab) => {
              const Icon = tab.icon;
              const win = openWindows[tab.id];
              const isActive = activeWindowId === tab.id && win?.isOpen && !win?.isMinimized;
              const isOpen = win?.isOpen;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundFx.playUiClick();
                    onToggleWindow(tab.id);
                  }}
                  className={`px-2.5 py-1 text-xs font-sans font-bold flex items-center gap-1.5 shrink-0 cursor-pointer rounded-xs transition-colors ${
                    isActive
                      ? "bg-[#091f33] border-t border-l border-black/90 border-b border-r border-white/20 text-white shadow-inner font-black"
                      : isOpen
                      ? "bg-[#0d2a45] hover:bg-[#12385c] border-t border-l border-white/30 border-b border-r border-black/70 text-slate-200"
                      : "bg-[#051322] hover:bg-[#0a1e33] border-t border-l border-white/10 border-b border-r border-black/80 text-slate-400"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* DROITE : PAUSE CAFÉ, BROYEUSE ADMINISTRATIVE & PRIME OPJ */}
        <div className="flex items-center gap-2 font-mono shrink-0 ml-auto relative">
          
          {/* Pause Café Réglementaire */}
          <div className="relative">
            <button
              type="button"
              onClick={handleDrinkCoffee}
              className={`px-2.5 py-1 border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                cafeSipsLeft > 0
                  ? "bg-[#1f1307] hover:bg-[#36210c] border-amber-500/80 text-amber-300"
                  : "bg-[#100c07] border-slate-700 text-slate-500"
              }`}
              title="Pause café réglementaire (3 gorgées par dossier)"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-xs font-bold">CAFÉ :</span>
              <span className="font-black text-amber-200 bg-amber-950 px-1 py-0.2 border border-amber-600/50 text-[11px]">
                {cafeSipsLeft}/3
              </span>
            </button>

            {/* Bulle Toast Caféine */}
            {cafeToast && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-amber-950 text-amber-200 border-2 border-amber-500 p-2 text-xs font-sans font-bold shadow-2xl rounded-xs z-50 animate-fadeIn pointer-events-none">
                {cafeToast}
              </div>
            )}
          </div>

          {/* Broyeuse */}
          <button
            type="button"
            onClick={onBroyerPiece}
            className={`px-2.5 py-1 border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              broyeurAnime
                ? "bg-red-600 border-white text-white animate-shake"
                : "bg-[#180505] hover:bg-[#2b0808] border-red-500/80 text-rose-300"
            }`}
            title="Détruire des pièces compromettantes (+50€)"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline text-xs font-bold">BROYEUR :</span>
            <span className="font-black text-white bg-red-950 px-1.5 py-0.2 border border-red-500 text-[11px]">
              {documentsBroyes}
            </span>
          </button>

          {/* Prime Totale Cumulée */}
          <div className="flex items-center gap-1.5 bg-[#042413] border border-[#00ff66] px-2.5 py-1 text-xs">
            <Coins className="w-4 h-4 text-[#00ff66]" />
            <span className="font-black text-[#00ff66] text-xs sm:text-sm">
              {primeTotale} €
            </span>
          </div>

        </div>

      </div>

    </footer>
  );
};
