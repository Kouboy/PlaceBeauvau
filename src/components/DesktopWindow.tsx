import React, { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { Minus, Square, Copy, X } from "lucide-react";
import { soundFx } from "../services/soundFx";

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DesktopWindowProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  isOpen: boolean;
  isMinimized: boolean;
  isActive: boolean;
  zIndex: number;
  defaultRect: WindowRect;
  onFocus: () => void;
  onMinimize: () => void;
  onClose: () => void;
  children: ReactNode;
  headerExtra?: ReactNode;
  desktopBoundsRef?: React.RefObject<HTMLDivElement | null>;
}

export const DesktopWindow: React.FC<DesktopWindowProps> = ({
  id,
  title,
  icon: Icon,
  badge,
  isOpen,
  isMinimized,
  isActive,
  zIndex,
  defaultRect,
  onFocus,
  onMinimize,
  onClose,
  children,
  headerExtra,
  desktopBoundsRef,
}) => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isDraggingState, setIsDraggingState] = useState<boolean>(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({
    x: defaultRect.x,
    y: defaultRect.y,
  });
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: defaultRect.width,
    height: defaultRect.height,
  });

  const isDraggingRef = useRef<boolean>(false);
  const dragStartPosRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  // Initialiser les dimensions et adapter si l'écran est petit (au montage seulement)
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Sur petit écran (mobile ou tablette étroite), démarrer maximisé ou adapté
      if (screenW < 768) {
        setIsMaximized(true);
      } else {
        // Garantir que la fenêtre ne déborde pas au lancement
        const clampedW = Math.min(defaultRect.width, screenW - 40);
        const clampedH = Math.min(defaultRect.height, screenH - 100);
        const clampedX = Math.max(10, Math.min(defaultRect.x, screenW - clampedW - 10));
        const clampedY = Math.max(10, Math.min(defaultRect.y, screenH - clampedH - 40));

        setSize({ width: clampedW, height: clampedH });
        setPos({ x: clampedX, y: clampedY });
      }
    }
  }, []);

  // Gestion du Redimensionnement manuel (bords et coins)
  const handleResizePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    direction: "se" | "e" | "s" | "w" | "sw"
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMaximized) return;

    onFocus();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = pos.x;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newPosX = startPosX;

      // Calcul selon direction
      if (direction === "se" || direction === "e") {
        newWidth = Math.max(360, startWidth + deltaX);
      }
      if (direction === "se" || direction === "s" || direction === "sw") {
        newHeight = Math.max(260, startHeight + deltaY);
      }
      if (direction === "w" || direction === "sw") {
        const potentialWidth = Math.max(360, startWidth - deltaX);
        newPosX = startPosX + (startWidth - potentialWidth);
        newWidth = potentialWidth;
      }

      // Restreindre dans les limites du bureau si disponible
      if (desktopBoundsRef?.current) {
        const bounds = desktopBoundsRef.current.getBoundingClientRect();
        newWidth = Math.min(newWidth, bounds.width - newPosX);
        newHeight = Math.min(newHeight, bounds.height - pos.y);
      }

      setSize({ width: Math.max(360, newWidth), height: Math.max(260, newHeight) });
      if (direction === "w" || direction === "sw") {
        setPos((prev) => ({ ...prev, x: Math.max(0, newPosX) }));
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Gestion du Drag de la barre de titre
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Si c'est un clic sur les boutons d'action de la fenêtre, ne pas démarrer le drag
    const target = e.target as HTMLElement;
    if (target.closest("button") || isMaximized) return;

    onFocus();
    soundFx.playWindowDrag();
    setIsDraggingState(true);
    isDraggingRef.current = true;
    dragStartPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      soundFx.playWindowDrag();
      const deltaX = moveEvent.clientX - dragStartPosRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartPosRef.current.mouseY;

      let nextX = dragStartPosRef.current.startX + deltaX;
      let nextY = dragStartPosRef.current.startY + deltaY;

      // Restreindre dans les limites du bureau si disponible
      if (desktopBoundsRef?.current) {
        const bounds = desktopBoundsRef.current.getBoundingClientRect();
        nextX = Math.max(0, Math.min(nextX, bounds.width - 150));
        nextY = Math.max(0, Math.min(nextY, bounds.height - 40));
      } else {
        nextX = Math.max(0, nextX);
        nextY = Math.max(0, nextY);
      }

      setPos({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      // Magnétisme & Snapping aux bords (Snap to Left / Right half, ou snap to edges)
      if (desktopBoundsRef?.current) {
        const bounds = desktopBoundsRef.current.getBoundingClientRect();
        const curX = pos.x;
        const curY = pos.y;

        // Si traîné très près du bord gauche (< 25px) -> Snap Demi-Écran Gauche
        if (curX < 24) {
          soundFx.playUiClick();
          setPos({ x: 10, y: 10 });
          setSize({ width: Math.floor(bounds.width * 0.49), height: Math.floor(bounds.height - 20) });
        }
        // Si traîné très près du bord droit -> Snap Demi-Écran Droit
        else if (curX + size.width > bounds.width - 24) {
          soundFx.playUiClick();
          const targetW = Math.floor(bounds.width * 0.49);
          setPos({ x: Math.floor(bounds.width - targetW - 10), y: 10 });
          setSize({ width: targetW, height: Math.floor(bounds.height - 20) });
        }
        // Si très proche du haut (< 15px) -> Remettre au top aligné
        else if (curY < 15) {
          setPos((prev) => ({ ...prev, y: 10 }));
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
    onFocus();
  };

  // Menu déroulant actif dans la barre de menus rétro
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMenuClick = (menuName: string) => {
    soundFx.playUiClick();
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  if (!isOpen || isMinimized) return null;

  return (
    <div
      id={`window-${id}`}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
      style={{
        zIndex,
        ...(isMaximized
          ? { left: 0, top: 0, right: 0, bottom: 0, width: "100%", height: "100%" }
          : {
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }),
      }}
      className={`absolute flex flex-col font-sans select-none transition-shadow rounded-t-lg rounded-b-xs overflow-hidden border-3 ${
        isDraggingState
          ? "border-[#316ac5] shadow-[0_25px_60px_rgba(0,0,0,0.9)] scale-[1.002] z-50 cursor-grabbing"
          : isActive
          ? "border-[#0055ea] shadow-[0_14px_40px_rgba(0,0,0,0.85)]"
          : "border-[#7a96df] shadow-lg opacity-95"
      } bg-[#ece9d8]`}
      onWheel={() => {
        soundFx.playScrollTick();
      }}
    >
      {/* 1. BARRE DE TITRE WINDOWS XP LUNA RÉPUBLICAINE PARODIQUE (CHEOPS-OS) */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={toggleMaximize}
        className={`h-7.5 px-2 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing border-b ${
          isActive
            ? "xp-titlebar-active border-b-[#003da6]"
            : "xp-titlebar-inactive border-b-[#5d7ebc]"
        }`}
      >
        {/* Titre officiel, icône et cocarde */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2 pointer-events-none">
          <div className="w-4 h-4 rounded-xs bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-100"}`} />
          </div>
          <span className="font-sans font-bold text-xs tracking-normal truncate flex-1 min-w-0" title={title}>
            {title}
          </span>
          {badge && (
            <span className="hidden md:inline-block text-[9px] font-mono font-bold px-1.5 py-0.2 bg-black/40 text-amber-200 border border-amber-300/40 rounded-xs shrink-0">
              {badge}
            </span>
          )}
        </div>

        {/* Boutons d'action système XP Luna authentiques */}
        <div className="flex items-center gap-1 shrink-0 ml-1.5">
          {headerExtra}

          {/* Réduire [_] */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playWindowMinimize();
              onMinimize();
            }}
            className="w-5 h-5 flex items-center justify-center rounded-xs xp-btn-control text-white transition-colors cursor-pointer shadow-xs"
            title="Réduire"
          >
            <Minus className="w-2.5 h-2.5 stroke-[3]" />
          </button>

          {/* Agrandir / Restaurer [□] */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isMaximized) {
                soundFx.playWindowMinimize();
              } else {
                soundFx.playWindowMaximize();
              }
              toggleMaximize();
            }}
            className="w-5 h-5 flex items-center justify-center rounded-xs xp-btn-control text-white transition-colors cursor-pointer shadow-xs"
            title={isMaximized ? "Restaurer" : "Agrandir"}
          >
            {isMaximized ? <Copy className="w-2.5 h-2.5 stroke-[3]" /> : <Square className="w-2.5 h-2.5 stroke-[3]" />}
          </button>

          {/* Fermer [✕] Rouge Vermillon XP Luna */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playWindowClose();
              onClose();
            }}
            className="w-5 h-5 flex items-center justify-center rounded-xs xp-btn-close text-white font-black transition-colors cursor-pointer shadow-xs"
            title="Fermer la fenêtre (Alt+F4)"
          >
            <X className="w-3 h-3 stroke-[3.5]" />
          </button>
        </div>
      </div>

      {/* 2. BARRE DE MENUS BUREAUCRATIQUE VINTAGE (FICHIER / ÉDITION / PROCÉDURE / DOCTRINE / AIDE) */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 py-0.5 flex items-center gap-0.5 text-[11px] font-sans text-black shrink-0 select-none relative z-40">
        
        {/* Menu Fichier */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick("fichier")}
            className={`px-1.5 py-0.5 rounded-none cursor-pointer ${
              activeMenu === "fichier" ? "bg-[#316ac5] text-white" : "hover:bg-[#b6d6fd] text-black"
            }`}
          >
            <span className="underline">F</span>ichier
          </button>
          {activeMenu === "fichier" && (
            <div className="absolute top-full left-0 mt-0.5 w-56 bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-2xl py-1 text-xs text-black z-50 font-sans">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPaperRustle();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Archiver sans suite</span>
                <span className="text-slate-500 text-[10px]">Ctrl+S</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playDeskTap();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Purger le cache local</span>
                <span className="text-slate-500 text-[10px]">F5</span>
              </button>
              <div className="border-t border-[#808080] border-b border-white my-1" />
              <button
                type="button"
                onClick={() => {
                  soundFx.playWindowClose();
                  closeMenu();
                  onClose();
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#c00000] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Fermer le module</span>
                <span className="text-slate-500 text-[10px]">Alt+F4</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu Édition */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick("edition")}
            className={`px-1.5 py-0.5 rounded-none cursor-pointer ${
              activeMenu === "edition" ? "bg-[#316ac5] text-white" : "hover:bg-[#b6d6fd] text-black"
            }`}
          >
            <span className="underline">É</span>dition
          </button>
          {activeMenu === "edition" && (
            <div className="absolute top-full left-0 mt-0.5 w-60 bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-2xl py-1 text-xs text-black z-50 font-sans">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPenClick();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Caviarder la contradiction</span>
                <span className="text-amber-700 text-[10px] font-bold">Feutre</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playDeskTap();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Inverser la culpabilité</span>
                <span className="text-slate-500 text-[10px]">Cerfa</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu Procédure */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick("procedure")}
            className={`px-1.5 py-0.5 rounded-none cursor-pointer ${
              activeMenu === "procedure" ? "bg-[#316ac5] text-white" : "hover:bg-[#b6d6fd] text-black"
            }`}
          >
            <span className="underline">P</span>rocédure
          </button>
          {activeMenu === "procedure" && (
            <div className="absolute top-full left-0 mt-0.5 w-64 bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-2xl py-1 text-xs text-black z-50 font-sans">
              <div className="px-3 py-1 text-[10px] text-[#003366] font-bold border-b border-[#808080]">
                INSTRUCTION DES CONTENTIEUX :
              </div>
              <div className="px-3 py-1 text-[11px] text-slate-800">
                • Visa de non-lieu automatique
              </div>
              <div className="px-3 py-1 text-[11px] text-slate-800">
                • Protection fonctionnelle accordée
              </div>
            </div>
          )}
        </div>

        {/* Menu Doctrine */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick("doctrine")}
            className={`px-1.5 py-0.5 rounded-none cursor-pointer ${
              activeMenu === "doctrine" ? "bg-[#316ac5] text-white" : "hover:bg-[#b6d6fd] text-black"
            }`}
          >
            <span className="underline">D</span>octrine
          </button>
          {activeMenu === "doctrine" && (
            <div className="absolute top-full left-0 mt-0.5 w-72 bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-2xl p-2.5 text-xs text-black z-50 font-sans">
              <div className="font-bold text-[#003366] pb-1 mb-1 border-b border-[#808080]">
                CIRCULAIRE BEAUVAU 2024 :
              </div>
              <p className="text-[11px] text-slate-800 font-sans leading-relaxed">
                « L'action républicaine ne saurait être entravée par la matérialité objective des procès-verbaux contradictoires. »
              </p>
            </div>
          )}
        </div>

        {/* Menu Aide (?) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick("aide")}
            className={`px-1.5 py-0.5 rounded-none cursor-pointer ${
              activeMenu === "aide" ? "bg-[#316ac5] text-white" : "hover:bg-[#b6d6fd] text-black"
            }`}
          >
            <span className="underline">A</span>ide (?)
          </button>
          {activeMenu === "aide" && (
            <div className="absolute top-full left-0 mt-0.5 w-64 bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-2xl p-2.5 text-xs text-black z-50 font-sans">
              <div className="font-bold text-[#003366] mb-1">
                CHEOPS-OS v2.4 (Service Contentieux)
              </div>
              <div className="text-[10px] text-slate-600">
                Ministère de l'Intérieur // 1998-2004
              </div>
              <div className="text-[11px] text-emerald-800 mt-2 font-bold">
                Permanence syndicale : poste 44-12
              </div>
            </div>
          )}
        </div>

      </div>

      {/* CLIC EXTERNE POUR FERMER LES MENUS */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-30 pointer-events-auto"
          onClick={closeMenu}
        />
      )}

      {/* 3. CONTENU CENTRAL DE LA FENÊTRE */}
      <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col bg-[#ece9d8]">
        {children}
      </div>

      {/* 4. BARRE D'ÉTAT SEGMENTÉE BUREAUCRATIQUE EN BAS (STATUSBAR WIN32) */}
      <div className="h-6 bg-[#ece9d8] border-t border-[#9c9a91] px-1.5 flex items-center gap-1.5 text-[11px] font-sans text-black shrink-0 select-none">
        {/* Segment 1 : État général */}
        <div className="flex-1 truncate bg-[#ece9d8] border-t border-l border-[#808080] border-b border-r-white px-2 py-0.5 text-slate-800 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span className="truncate font-bold">PRÊT // BORDEREAU SOUS CONTRÔLE</span>
        </div>

        {/* Segment 2 : Système */}
        <div className="hidden sm:block bg-[#ece9d8] border-t border-l border-[#808080] border-b border-r-white px-2 py-0.5 text-slate-700 shrink-0 font-mono text-[10px]">
          CHEOPS-32 v2.4
        </div>

        {/* Segment 3 : Base légale */}
        <div className="hidden md:block bg-[#ece9d8] border-t border-l border-[#808080] border-b border-r-white px-2 py-0.5 text-[#003366] font-bold shrink-0">
          L. 435-1
        </div>

        {/* Segment 4 : Matricule de session */}
        <div className="bg-[#ece9d8] border-t border-l border-[#808080] border-b border-r-white px-2 py-0.5 text-black font-mono font-bold shrink-0 text-[10px]">
          AG-7501923
        </div>
      </div>

      {/* POIGNÉES DE REDIMENSIONNEMENT MULTIDIRECTIONNELLES */}
      {!isMaximized && (
        <>
          {/* Bord droit */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "e")}
            className="absolute top-8 right-0 bottom-3 w-2 cursor-e-resize z-20 hover:bg-sky-500/20 transition-colors"
            title="Ajuster la largeur"
          />
          {/* Bord bas */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "s")}
            className="absolute bottom-0 left-3 right-3 h-2 cursor-s-resize z-20 hover:bg-sky-500/20 transition-colors"
            title="Ajuster la hauteur"
          />
          {/* Bord gauche */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "w")}
            className="absolute top-8 left-0 bottom-3 w-2 cursor-w-resize z-20 hover:bg-sky-500/20 transition-colors"
            title="Ajuster la largeur"
          />
          {/* Coin bas-droit visible */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "se")}
            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-1 z-30 text-slate-400 hover:text-sky-300 group bg-black/40 border-t border-l border-slate-700/60"
            title="Redimensionner la fenêtre"
          >
            <svg viewBox="0 0 6 6" className="w-3 h-3 fill-current opacity-70 group-hover:opacity-100">
              <circle cx="5" cy="5" r="0.8" />
              <circle cx="5" cy="3" r="0.8" />
              <circle cx="3" cy="5" r="0.8" />
            </svg>
          </div>
          {/* Coin bas-gauche */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "sw")}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-20 hover:bg-sky-500/30"
          />
        </>
      )}
    </div>
  );
};
