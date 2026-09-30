import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  PhoneCall,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  Award,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  BookOpen,
  ShoppingBag,
  UserCheck,
  Volume2,
  VolumeX
} from "lucide-react";
import { soundFx } from "../services/soundFx";
import { ContactDiegetique, CONTACTS_DIEGETIQUES } from "../diegeticContacts";

interface DiegeticTopBarProps {
  activeContactId: string;
  onSelectContact: (id: string) => void;
  primeTotale: number;
  dernierePrime: number | null;
  credibiliteMinistere?: number;
  blames: number;
  currentGrade?: any;
  totalProcessed?: number;
  totalDossiers?: number;
  currentIndex?: number;
  paxSociale?: number;
  comboZeile?: number;
  isBoutiqueOpen?: boolean;
  onToggleBoutique?: () => void;
  equipementsCount?: number;
  onOpenGuide: () => void;
  documentsBroyes?: number;
  broyeurAnime?: boolean;
  onBroyerPiece?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onOpenBoutique?: () => void;
}

export const DiegeticTopBar: React.FC<DiegeticTopBarProps> = ({
  activeContactId,
  onSelectContact,
  primeTotale,
  dernierePrime,
  credibiliteMinistere = 85,
  blames,
  currentGrade,
  totalProcessed = 0,
  totalDossiers = 6,
  currentIndex = 0,
  paxSociale = 84,
  comboZeile = 0,
  isBoutiqueOpen = false,
  onToggleBoutique,
  equipementsCount = 0,
  onOpenGuide,
  documentsBroyes = 0,
  broyeurAnime = false,
  onBroyerPiece,
  isFullscreen = false,
  onToggleFullscreen = () => {},
  onOpenBoutique = () => {},
}) => {
  const [appMenuOpen, setAppMenuOpen] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>("08:22:15");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundFx.getIsMuted());

  const toggleAudio = () => {
    const next = !isAudioMuted;
    soundFx.setMuted(next);
    setIsAudioMuted(next);
    if (!next) {
      soundFx.playUiClick();
    }
  };

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

  return (
    <header className="diegetic-titlebar border-b-2 border-[#0284c7] px-3 py-2 shrink-0 flex flex-wrap items-center justify-between gap-3 font-mono text-xs select-none shadow-xl z-30 bg-gradient-to-r from-[#082f49] via-[#0c4a6e] to-[#041d2e]">
      
      {/* GAUCHE : MENU CHEOPS & OBJECTIF DOCTRINAL */}
      <div className="flex items-center gap-2.5">
        {/* Menu Applications Diégétique */}
        <div className="relative">
          <button
            type="button"
            id="btn-applications-menu"
            onClick={() => {
              soundFx.playUiClick();
              setAppMenuOpen(!appMenuOpen);
            }}
            className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] border border-white text-white font-black tracking-wider flex items-center gap-2 cursor-pointer uppercase shadow text-xs rounded-xs"
          >
            <Menu className="w-4 h-4" />
            <span>SYSTÈME CHEOPS</span>
            <ChevronDown className="w-3.5 h-3.5 text-sky-200" />
          </button>

          {appMenuOpen && (
            <div
              className="absolute left-0 top-full mt-1 w-64 bg-[#04192b] border-2 border-[#0284c7] shadow-2xl p-2 z-50 text-xs font-mono rounded-xs"
              onMouseLeave={() => setAppMenuOpen(false)}
            >
              <div className="text-xs text-sky-300 uppercase border-b border-[#0284c7]/60 pb-1.5 mb-1.5 font-black">
                POSTE OPJ // DIRECTION CENTRALE
              </div>
              
              <button
                type="button"
                onClick={() => {
                  soundFx.playUiClick();
                  onOpenBoutique();
                  setAppMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 hover:bg-[#0c4a6e] hover:text-white text-slate-100 flex items-center justify-between cursor-pointer rounded-xs mb-1"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Boutique Mutuelle Police</span>
                </span>
                <span className="text-[#00ff66] font-black text-xs">{primeTotale} €</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playUiClick();
                  onOpenGuide();
                  setAppMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 hover:bg-[#0c4a6e] hover:text-white text-slate-100 flex items-center gap-2 cursor-pointer rounded-xs mb-1"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Circulaire Doctrinale L. 435-1</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playUiClick();
                  onToggleFullscreen();
                  setAppMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 hover:bg-[#0c4a6e] hover:text-white text-slate-100 flex items-center gap-2 cursor-pointer rounded-xs"
              >
                <Maximize2 className="w-4 h-4 text-sky-400" />
                <span>Basculer Plein Écran</span>
              </button>
            </div>
          )}
        </div>

        {/* INDICATEUR DE CRÉDIBILITÉ & RENTABILITÉ DU SERVICE */}
        <div className="flex items-center gap-2">
          {/* Badge de Crédibilité */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1 text-xs font-black tracking-wider border-2 rounded-xs shadow-md transition-all ${
              credibiliteMinistere >= 65
                ? "bg-[#032313] border-emerald-400 text-emerald-300"
                : credibiliteMinistere >= 35
                ? "bg-[#271704] border-amber-400 text-amber-300"
                : "bg-[#330808] border-rose-500 text-rose-300 animate-pulse"
            }`}
            title="Indicateur de Crédibilité Institutionnelle du Ministère"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">CRÉDIBILITÉ :</span>
            <span className="font-mono text-sm font-black">{credibiliteMinistere}%</span>
          </div>

          {/* Solde Primes / Rentabilité */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-black tracking-wider bg-[#021b2d] border border-sky-400 text-sky-200 rounded-xs">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>RENTABILITÉ :</span>
            <span className="font-mono text-emerald-300 text-xs font-black">+{primeTotale} €</span>
          </div>

          {/* Indicateur de Progression du Quart de Travail (Shift Progress) */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 text-xs font-black tracking-wider bg-[#031526] border border-sky-500/50 rounded-xs">
            <span className="text-slate-400">QUART DE TRAVAIL :</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalDossiers }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-xs border flex items-center justify-center text-[8px] font-black ${
                    i < totalProcessed
                      ? "bg-[#00ff66] border-[#00ff66] text-black"
                      : i === currentIndex
                      ? "bg-amber-400 border-white text-black animate-pulse"
                      : "bg-[#071321] border-slate-700 text-slate-500"
                  }`}
                  title={`Dossier #${i + 1} : ${i < totalProcessed ? "Apuré" : i === currentIndex ? "En cours d'instruction" : "En attente"}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <span className="text-sky-300 font-bold ml-1">{totalProcessed}/{totalDossiers}</span>
          </div>
        </div>
      </div>

      {/* DROITE : HORLOGE, PLEIN ÉCRAN & PROFIL OPJ */}
      <div className="flex items-center gap-2.5">
        {/* Horloge diégétique */}
        <div className="hidden md:flex items-center gap-2 text-sky-300 font-black text-xs px-2.5 py-1 bg-[#021320] border border-[#0284c7]/60 rounded-xs">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>{timeStr}</span>
        </div>

        {/* Contrôle Audio Diégétique */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`p-1.5 cursor-pointer border rounded-xs transition-colors ${
            isAudioMuted
              ? "text-rose-400 bg-red-950/60 border-red-500/60 hover:bg-red-900"
              : "text-sky-300 hover:text-white hover:bg-[#0284c7] border-[#0284c7]/50"
          }`}
          title={isAudioMuted ? "Rétablir les sons de bureau" : "Couper les sons de bureau"}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Plein écran */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 text-sky-300 hover:text-white hover:bg-[#0284c7] cursor-pointer border border-[#0284c7]/50 rounded-xs"
          title="Mode plein écran"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Profil de l'agent connecté */}
        <div className="flex items-center gap-2 bg-[#031929] border-2 border-[#0284c7] px-2.5 py-1 text-xs text-slate-100 rounded-xs">
          <div className="w-6 h-6 rounded-full bg-[#0284c7] flex items-center justify-center font-black text-xs text-white">
            OPJ
          </div>
          <div className="leading-tight">
            <div className="font-black text-white text-xs">OFFICIER #75018</div>
            <div className="text-[10px] text-emerald-400 font-bold">SESSION ASSERMENTÉE</div>
          </div>
        </div>
      </div>

    </header>
  );
};
