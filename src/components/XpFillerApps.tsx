import React, { useState, useEffect } from "react";
import {
  X,
  Minus,
  Square,
  Bomb,
  Calculator as CalcIcon,
  FileText,
  Sliders,
  Terminal,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { soundFx } from "../services/soundFx";

/* =======================================================================
   1. DÉMINEUR DE MAINTIEN DE L'ORDRE (WIN32 MINESWEEPER)
   ======================================================================= */
interface MinesweeperProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Cell {
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  count: number;
}

export const MinesweeperDialog: React.FC<MinesweeperProps> = ({ isOpen, onClose }) => {
  const ROWS = 8;
  const COLS = 8;
  const MINES = 8;

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [timer, setTimer] = useState<number>(0);
  const [flagsLeft, setFlagsLeft] = useState<number>(MINES);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  const initGame = () => {
    // Créer la grille vide
    const newGrid: Cell[][] = Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS).fill(null).map(() => ({
          hasMine: false,
          isRevealed: false,
          isFlagged: false,
          count: 0,
        }))
      );

    // Placer les mines aléatoirement
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].hasMine) {
        newGrid[r][c].hasMine = true;
        placed++;
      }
    }

    // Calculer les nombres adjacents
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].hasMine) {
          let cnt = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].hasMine) {
                cnt++;
              }
            }
          }
          newGrid[r][c].count = cnt;
        }
      }
    }

    setGrid(newGrid);
    setGameState("playing");
    setTimer(0);
    setFlagsLeft(MINES);
  };

  useEffect(() => {
    if (isOpen) {
      initGame();
    }
  }, [isOpen]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimer((t) => Math.min(999, t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const revealCell = (r: number, c: number) => {
    if (gameState !== "playing" || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    soundFx.playUiClick();
    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (nextGrid[r][c].hasMine) {
      // Perdu ! Révéler toutes les mines
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (nextGrid[i][j].hasMine) nextGrid[i][j].isRevealed = true;
        }
      }
      setGrid(nextGrid);
      setGameState("lost");
      soundFx.playStampSound(false);
      return;
    }

    // Révéler récursivement les cellules vides
    const flood = (cr: number, cc: number) => {
      if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) return;
      if (nextGrid[cr][cc].isRevealed || nextGrid[cr][cc].isFlagged || nextGrid[cr][cc].hasMine) return;

      nextGrid[cr][cc].isRevealed = true;
      if (nextGrid[cr][cc].count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            flood(cr + dr, cc + dc);
          }
        }
      }
    };

    flood(r, c);

    // Vérifier si victoire
    let unrevealedSafe = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!nextGrid[i][j].hasMine && !nextGrid[i][j].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    setGrid(nextGrid);
    if (unrevealedSafe === 0) {
      setGameState("won");
      soundFx.playStampSound(true);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== "playing" || grid[r][c].isRevealed) return;

    soundFx.playUiClick();
    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const wasFlagged = nextGrid[r][c].isFlagged;
    nextGrid[r][c].isFlagged = !wasFlagged;
    setGrid(nextGrid);
    setFlagsLeft((f) => (wasFlagged ? f + 1 : f - 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 font-sans select-none">
      <div className="bg-[#ece9d8] border-3 border-[#0055ea] shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col w-72">
        {/* TITRE LUNA BLEU */}
        <div className="xp-titlebar-active h-7 px-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">💣</span>
            <span className="font-bold text-xs text-white truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Démineur de manifestation
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="xp-btn-close w-4.5 h-4.5 flex items-center justify-center text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* BARRE DE MENUS RÉTRO */}
        <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 py-0.5 flex gap-3 text-xs text-black">
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer" onClick={initGame}>Partie</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Options</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Aide</span>
        </div>

        {/* CADRE DE JEU INTERNE AVEC BORDS EN RELIEF WIN32 */}
        <div className="p-2.5 flex flex-col gap-2">
          {/* BANDEAU COMPTEURS ET SMILEY */}
          <div className="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-1.5 flex items-center justify-between bg-[#ece9d8]">
            {/* COMPTEUR MINES FORMAT LED 7 SEGMENTS */}
            <div className="bg-black text-[#ff0000] font-mono font-black text-lg px-1 border border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
              {String(Math.max(-99, flagsLeft)).padStart(3, "0")}
            </div>

            {/* BOUTON SMILEY XP */}
            <button
              type="button"
              onClick={initGame}
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              className="w-7 h-7 xp-btn p-0 flex items-center justify-center text-base"
              title="Nouvelle partie"
            >
              {gameState === "won" ? "😎" : gameState === "lost" ? "😵" : isPressing ? "😮" : "🙂"}
            </button>

            {/* CHRONOMÈTRE LED */}
            <div className="bg-black text-[#ff0000] font-mono font-black text-lg px-1 border border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
              {String(timer).padStart(3, "0")}
            </div>
          </div>

          {/* GRILLE DU DÉMINEUR */}
          <div className="border-3 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-1 bg-[#c0c0c0] mx-auto">
            <div className="grid grid-cols-8 gap-0">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => revealCell(r, c)}
                      onContextMenu={(e) => toggleFlag(e, r, c)}
                      className={`w-6 h-6 flex items-center justify-center font-bold text-xs select-none cursor-pointer ${
                        cell.isRevealed
                          ? cell.hasMine
                            ? "bg-red-600 border border-[#808080] text-white"
                            : "bg-[#c0c0c0] border border-[#808080]"
                          : "bg-[#ece9d8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-[#808080]"
                      }`}
                    >
                      {cell.isRevealed ? (
                        cell.hasMine ? (
                          "💥"
                        ) : cell.count > 0 ? (
                          <span
                            className={
                              cell.count === 1
                                ? "text-blue-700"
                                : cell.count === 2
                                ? "text-green-700"
                                : cell.count === 3
                                ? "text-red-700"
                                : "text-purple-900"
                            }
                          >
                            {cell.count}
                          </span>
                        ) : null
                      ) : cell.isFlagged ? (
                        "🚩"
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-600 text-center italic mt-0.5">
            Clic gauche : sonder terrain // Clic droit : poser rubalise
          </div>
        </div>
      </div>
    </div>
  );
};

/* =======================================================================
   2. BLOC-NOTES MINISTÉRIEL (WIN32 NOTEPAD)
   ======================================================================= */
interface NotepadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotepadDialog: React.FC<NotepadProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState<string>(
    `NOTE DE SERVICE INTÉRIEURE // DIFFUSION RESTREINTE
Référence : CIRCULAIRE INTER-MINISTÉRIELLE L. 435-1 (APUREMENT DU CONTENTIEUX)
Destinataire : Officiers et Agents instructeurs CHEOPS

RAPPEL IMPORTANT POUR LE SERVICE :
1. Aucun matricule RIO ne doit apparaître net sur les procès-verbaux transmis au parquet. En cas de visibilité, activer l'outil d'atténuation optique.
2. Tout administré présentant des ecchymoses ou hématomes est présumé avoir heurté le sol par perte d'équilibre spontanée consécutive à son agitation.
3. Les caméras GoPro des dispositifs d'intervention subissent fréquemment des pannes inexpliquées de carte mémoire. Ce phénomène météorologique est normal et ne saurait faire l'objet de poursuites.

Bonne prise de service à tous.
— Le Directeur de la Sécurité Publique`
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 font-sans select-none">
      <div className="bg-[#ece9d8] border-3 border-[#0055ea] shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col w-full max-w-xl h-[420px]">
        {/* TITRE */}
        <div className="xp-titlebar-active h-7 px-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">📝</span>
            <span className="font-bold text-xs text-white truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              note_de_service_prefet.txt - Bloc-notes CHEOPS
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="xp-btn-close w-4.5 h-4.5 flex items-center justify-center text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 py-0.5 flex gap-3 text-xs text-black">
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Fichier</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Édition</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Format</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Affichage</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Aide</span>
        </div>

        {/* TEXTAREA BLANC PUR TYPE NOTEPAD WIN32 */}
        <div className="flex-1 p-0.5 bg-white border border-[#9c9a91] overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-2 font-mono text-xs text-black resize-none outline-none leading-relaxed select-text"
          />
        </div>

        {/* BARRE D'ÉTAT */}
        <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-3 py-0.5 flex justify-between text-[11px] text-slate-700">
          <span>Prêt</span>
          <span>Lignes : {content.split("\n").length} | Caractères : {content.length}</span>
        </div>
      </div>
    </div>
  );
};

/* =======================================================================
   3. CALCULATRICE DE PRIMES ET INDEMNITÉS (WIN32 CALCULATOR)
   ======================================================================= */
interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBonus?: (amt: number) => void;
}

export const CalculatorDialog: React.FC<CalculatorProps> = ({ isOpen, onClose, onAddBonus }) => {
  const [display, setDisplay] = useState<string>("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [clearNext, setClearNext] = useState<boolean>(false);

  const handleNum = (num: string) => {
    soundFx.playUiClick();
    if (display === "0" || clearNext) {
      setDisplay(num);
      setClearNext(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (operation: string) => {
    soundFx.playUiClick();
    setPrev(parseFloat(display));
    setOp(operation);
    setClearNext(true);
  };

  const handleEqual = () => {
    soundFx.playUiClick();
    if (prev === null || op === null) return;
    const cur = parseFloat(display);
    let res = 0;
    if (op === "+") res = prev + cur;
    else if (op === "-") res = prev - cur;
    else if (op === "*") res = prev * cur;
    else if (op === "/") res = cur !== 0 ? prev / cur : 0;
    setDisplay(String(Math.round(res * 100) / 100));
    setPrev(null);
    setOp(null);
    setClearNext(true);
  };

  const handleClear = () => {
    soundFx.playUiClick();
    setDisplay("0");
    setPrev(null);
    setOp(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 font-sans select-none">
      <div className="bg-[#ece9d8] border-3 border-[#0055ea] shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col w-64">
        {/* TITRE */}
        <div className="xp-titlebar-active h-7 px-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">🧮</span>
            <span className="font-bold text-xs text-white truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Calculatrice des primes
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="xp-btn-close w-4.5 h-4.5 flex items-center justify-center text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 py-0.5 flex gap-3 text-xs text-black">
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Édition</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Affichage</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Aide</span>
        </div>

        {/* ÉCRAN CALCULATRICE */}
        <div className="p-2.5 space-y-2">
          <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-1 text-right font-mono font-bold text-lg text-black overflow-hidden shadow-inner">
            {display}
          </div>

          {/* TOUCHES */}
          <div className="grid grid-cols-4 gap-1">
            <button type="button" onClick={handleClear} className="xp-btn col-span-2 text-rose-700">C</button>
            <button type="button" onClick={() => handleOp("/")} className="xp-btn text-blue-800">/</button>
            <button type="button" onClick={() => handleOp("*")} className="xp-btn text-blue-800">×</button>

            <button type="button" onClick={() => handleNum("7")} className="xp-btn">7</button>
            <button type="button" onClick={() => handleNum("8")} className="xp-btn">8</button>
            <button type="button" onClick={() => handleNum("9")} className="xp-btn">9</button>
            <button type="button" onClick={() => handleOp("-")} className="xp-btn text-blue-800">-</button>

            <button type="button" onClick={() => handleNum("4")} className="xp-btn">4</button>
            <button type="button" onClick={() => handleNum("5")} className="xp-btn">5</button>
            <button type="button" onClick={() => handleNum("6")} className="xp-btn">6</button>
            <button type="button" onClick={() => handleOp("+")} className="xp-btn text-blue-800">+</button>

            <button type="button" onClick={() => handleNum("1")} className="xp-btn">1</button>
            <button type="button" onClick={() => handleNum("2")} className="xp-btn">2</button>
            <button type="button" onClick={() => handleNum("3")} className="xp-btn">3</button>
            <button type="button" onClick={handleEqual} className="xp-btn row-span-2 text-emerald-800 bg-[#e6f4ea]">=</button>

            <button type="button" onClick={() => handleNum("0")} className="xp-btn col-span-2">0</button>
            <button type="button" onClick={() => handleNum(".")} className="xp-btn">.</button>
          </div>

          <div className="pt-1 border-t border-[#d8d4c4]">
            <button
              type="button"
              onClick={() => {
                soundFx.playStampSound(true);
                if (onAddBonus) onAddBonus(20);
                onClose();
              }}
              className="w-full xp-btn text-[11px] text-[#003366] py-1"
            >
              +20€ Indemnité de maintien de l'ordre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =======================================================================
   4. BOÎTE DE DIALOGUE "EXÉCUTER..." (WIN32 RUN DIALOG)
   ======================================================================= */
interface RunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCommand: (cmd: string) => void;
}

export const RunDialog: React.FC<RunDialogProps> = ({ isOpen, onClose, onRunCommand }) => {
  const [command, setCommand] = useState<string>("cheops.exe");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playUiClick();
    onRunCommand(command);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 font-sans select-none">
      <div className="bg-[#ece9d8] border-3 border-[#0055ea] shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col w-full max-w-md">
        {/* TITRE */}
        <div className="xp-titlebar-active h-7 px-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-xs text-white truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Exécuter
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="xp-btn-close w-4.5 h-4.5 flex items-center justify-center text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* CORPS */}
        <form onSubmit={handleSubmit} className="p-3.5 space-y-3 text-black">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xs bg-[#ece9d8] border border-[#9c9a91] flex items-center justify-center text-2xl shadow-xs">
              💾
            </div>
            <p className="text-xs text-slate-800 leading-normal">
              Entrez le nom d'un programme, d'un dossier, d'un document ou d'une ressource intranet ministérielle pour que CHEOPS l'ouvre.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="font-bold text-slate-700 w-16">Ouvrir :</label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2 py-1 text-xs font-mono outline-none select-text"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#d8d4c4]">
            <button type="submit" className="xp-btn min-w-18">OK</button>
            <button type="button" onClick={onClose} className="xp-btn min-w-18">Annuler</button>
            <button
              type="button"
              onClick={() => alert("Recherche dans le réseau intranet de la Préfecture...")}
              className="xp-btn min-w-18"
            >
              Parcourir...
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =======================================================================
   5. PROPRIÉTÉS D'AFFICHAGE (DISPLAY PROPERTIES XP)
   ======================================================================= */
interface DisplayPropertiesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisplayPropertiesDialog: React.FC<DisplayPropertiesProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"theme" | "bureau" | "ecran">("bureau");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 font-sans select-none">
      <div className="bg-[#ece9d8] border-3 border-[#0055ea] shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col w-full max-w-md">
        {/* TITRE */}
        <div className="xp-titlebar-active h-7 px-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">🖥️</span>
            <span className="font-bold text-xs text-white truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Propriétés d'Affichage — CHEOPS XP
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="xp-btn-close w-4.5 h-4.5 flex items-center justify-center text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ONGLETS XP */}
        <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 pt-1 flex gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("theme")}
            className={`px-3 py-1 rounded-t-xs border-t border-l border-r border-[#9c9a91] cursor-pointer ${
              activeTab === "theme" ? "bg-[#ece9d8] font-bold -mb-px pb-1.5 border-b-[#ece9d8]" : "bg-[#dedbd0] text-slate-600"
            }`}
          >
            Thèmes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bureau")}
            className={`px-3 py-1 rounded-t-xs border-t border-l border-r border-[#9c9a91] cursor-pointer ${
              activeTab === "bureau" ? "bg-[#ece9d8] font-bold -mb-px pb-1.5 border-b-[#ece9d8]" : "bg-[#dedbd0] text-slate-600"
            }`}
          >
            Bureau
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ecran")}
            className={`px-3 py-1 rounded-t-xs border-t border-l border-r border-[#9c9a91] cursor-pointer ${
              activeTab === "ecran" ? "bg-[#ece9d8] font-bold -mb-px pb-1.5 border-b-[#ece9d8]" : "bg-[#dedbd0] text-slate-600"
            }`}
          >
            Écran de veille
          </button>
        </div>

        {/* CONTENU ONGLET */}
        <div className="p-3 space-y-3 text-black text-xs">
          {/* APERÇU MONITEUR CRT XP */}
          <div className="mx-auto w-40 h-28 bg-[#2d3748] rounded-md p-2 flex flex-col items-center justify-center shadow-md border-4 border-[#cbd5e1]">
            <div className="w-full h-full bg-[#004e98] border border-black overflow-hidden relative">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('/src/assets/images/xp_bliss_surveillance_1790672405866.jpg')` }}
              />
              <div className="absolute bottom-0 inset-x-0 h-2 bg-[#245edb]" />
            </div>
          </div>

          <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-2.5 pt-1 shadow-[inset_1px_1px_0_#fff]">
            <legend className="px-1.5 font-bold text-xs text-[#003366] bg-[#ece9d8] border border-[#9c9a91]">
              Arrière-plan officiel :
            </legend>
            <div className="mt-1 space-y-1">
              <div className="bg-white border border-[#7f9db9] p-1.5 font-bold text-xs text-[#003366] flex justify-between items-center">
                <span>Colline de Surveillance (Bliss Beauvau 2002)</span>
                <span className="text-[10px] text-emerald-700">[ Actif ]</span>
              </div>
              <p className="text-[10px] text-slate-600">
                Imposé par la circulaire préfectorale n°435. Modification verrouillée par l'administrateur réseau.
              </p>
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#d8d4c4]">
            <button type="button" onClick={onClose} className="xp-btn min-w-18">OK</button>
            <button type="button" onClick={onClose} className="xp-btn min-w-18">Annuler</button>
            <button type="button" onClick={() => soundFx.playUiClick()} className="xp-btn min-w-18">Appliquer</button>
          </div>
        </div>
      </div>
    </div>
  );
};
