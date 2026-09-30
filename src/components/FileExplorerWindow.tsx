import React, { useState } from "react";
import { soundFx } from "../services/soundFx";
import {
  Folder,
  FolderOpen,
  FileText,
  Video,
  FileBadge,
  Database,
  FileCheck,
  Package,
  Radio,
  FileCode,
  HardDrive,
  Globe,
  ArrowUp,
  Search,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  RefreshCw,
  FolderTree,
  Clock,
  Layers,
  Lock
} from "lucide-react";
import { VirtualFile, VirtualFolder, findFolderByPath } from "../fileSystem";
import { Dossier } from "../dossiers";

interface FileExplorerWindowProps {
  rootFolder: VirtualFolder;
  currentDossier: Dossier;
  currentPath: string;
  onNavigateToPath: (path: string) => void;
  onOpenFile: (file: VirtualFile) => void;
  onLaunchApp: (appId: string) => void;
  discoveredFiles: Set<string>;
}

export const FileExplorerWindow: React.FC<FileExplorerWindowProps> = ({
  rootFolder,
  currentDossier,
  currentPath,
  onNavigateToPath,
  onOpenFile,
  onLaunchApp,
  discoveredFiles,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Trouver le dossier courant
  const activeFolder = findFolderByPath(rootFolder, currentPath) || rootFolder;

  // Fichier sélectionné pour prévisualisation
  const selectedFile = activeFolder.files.find((f) => f.id === selectedFileId) || null;

  // Calcul du dossier parent pour le bouton "Remonter"
  const getParentPath = (path: string): string => {
    if (path === "/" || path === "/C:" || path === "//RESEAU_INTRANET") return "/";
    const parts = path.split("/");
    parts.pop();
    const parent = parts.join("/");
    return parent === "" ? "/" : parent;
  };

  // Icône par type de fichier
  const getFileIcon = (file: VirtualFile) => {
    switch (file.extension) {
      case "txt":
      case "doc":
        return <FileText className="w-5 h-5 text-sky-400 shrink-0" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-rose-400 shrink-0" />;
      case "cctv":
        return <Video className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />;
      case "rio":
        return <FileBadge className="w-5 h-5 text-amber-400 shrink-0" />;
      case "taj":
        return <Database className="w-5 h-5 text-cyan-400 shrink-0" />;
      case "visa":
        return <FileCheck className="w-5 h-5 text-[#00ff66] shrink-0 font-bold" />;
      case "scelle":
        return <Package className="w-5 h-5 text-orange-400 shrink-0" />;
      case "telex":
        return <Radio className="w-5 h-5 text-red-500 shrink-0 animate-bounce" />;
      case "exe":
        return <FileCode className="w-5 h-5 text-indigo-400 shrink-0" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400 shrink-0" />;
    }
  };

  // Badge de classification
  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case "SECRET DÉFENSE":
        return "bg-red-950 text-red-300 border-red-500";
      case "CONFIDENTIEL":
        return "bg-amber-950 text-amber-300 border-amber-500";
      case "PIÈCE SOUS SCELLÉ":
        return "bg-purple-950 text-purple-300 border-purple-500";
      case "ACTE PARQUET":
        return "bg-emerald-950 text-emerald-300 border-emerald-500";
      default:
        return "bg-slate-900 text-slate-300 border-slate-700";
    }
  };

  // Filtrage des fichiers
  const filteredFiles = activeFolder.files.filter((f) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(query) ||
      f.titre.toLowerCase().includes(query) ||
      f.auteur.toLowerCase().includes(query) ||
      f.extension.toLowerCase().includes(query)
    );
  });

  const filteredSubfolders = activeFolder.subfolders.filter((sub) => {
    if (!searchQuery.trim()) return true;
    return sub.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenFileWithSound = (file: VirtualFile) => {
    soundFx.playPaperRustle();
    onOpenFile(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-sans text-black select-none overflow-hidden">
      
      {/* BARRE D'OUTILS ET NAVIGATION DE L'EXPLORATEUR WINDOWS XP */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] p-1.5 flex flex-col gap-1.5 shrink-0 shadow-xs">
        
        {/* Ligne 1 : Boutons Précédent / Parent, Barre d'adresse, Recherche */}
        <div className="flex items-center gap-1.5">
          
          <button
            type="button"
            onClick={() => onNavigateToPath(getParentPath(currentPath))}
            disabled={currentPath === "/"}
            className="xp-btn flex items-center gap-1 disabled:opacity-40"
            title="Dossier parent"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#0055ea]" />
            <span className="hidden sm:inline">Dossier Parent</span>
          </button>

          {/* Barre d'adresse diégétique avec style champ texte 3D en creux */}
          <div className="flex-1 min-w-0 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2 py-0.5 text-xs text-black flex items-center gap-1.5 overflow-x-auto whitespace-nowrap shadow-inner">
            <span className="text-slate-500 font-bold">Adresse :</span>
            <span className="text-[#0055ea] font-bold">CHEOPS:\\</span>
            <span className="font-bold text-black tracking-wide">{currentPath.replace(/^\//, "").replace(/\//g, "\\")}</span>
          </div>

          {/* Recherche de fichiers */}
          <div className="relative w-36 sm:w-48 shrink-0">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white pl-6 pr-2 py-0.5 text-xs text-black placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Bascule d'affichage Grille / Liste */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="xp-btn hidden sm:inline-block"
            title="Changer mode d'affichage"
          >
            {viewMode === "list" ? "Grille" : "Détails"}
          </button>

        </div>

        {/* Ligne 2 : Accès rapides (Bookmarks de raccourcis officiels) */}
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          <span className="text-slate-600 font-bold mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>RACCOURCIS :</span>
          </span>

          <button
            type="button"
            onClick={() => {
              soundFx.playFolderThud();
              onNavigateToPath(`/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${currentDossier.id}`);
            }}
            className={`xp-btn flex items-center gap-1 ${
              currentPath.includes(currentDossier.id) ? "border-[#0055ea] bg-[#d3e5fa]" : ""
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>AFFAIRE #{currentDossier.id}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playFolderThud();
              onNavigateToPath("//SERVEUR-CENTRAL-BEAUVAU/DIRECTIVES");
            }}
            className="xp-btn flex items-center gap-1 text-rose-900"
          >
            <Radio className="w-3.5 h-3.5 text-rose-600" />
            <span>⚡ TÉLEX PRÉFET</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playFolderThud();
              onNavigateToPath("//PARQUET-TRIBUNAL/REQUISITOIRES");
            }}
            className="xp-btn flex items-center gap-1 text-emerald-900"
          >
            <FileBadge className="w-3.5 h-3.5 text-emerald-600" />
            <span>⚖️ PARQUET</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playFolderThud();
              onNavigateToPath("//POLICE-JUDICIAIRE/FICHIER_TAJ");
            }}
            className="xp-btn flex items-center gap-1 text-[#003366]"
          >
            <Database className="w-3.5 h-3.5 text-[#0055ea]" />
            <span>🗄️ FICHIER TAJ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playFolderThud();
              onNavigateToPath("/C:/OUTILS_ADMINISTRATIFS");
            }}
            className="xp-btn flex items-center gap-1 text-indigo-900"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>⚙️ OUTILS APUREMENT</span>
          </button>
        </div>

      </div>

      {/* CORPS PRINCIPAL : ARBORESCENCE À GAUCHE + CONTENU DU DOSSIER À DROITE */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* PANNEAU LATÉRAL GAUCHE : VOLET DES TÂCHES WINDOWS XP (BLEU LUNA) */}
        <div className="w-52 sm:w-64 bg-gradient-to-b from-[#7a8fc0] via-[#6a7fb8] to-[#596ea6] p-2.5 overflow-y-auto shrink-0 flex flex-col gap-2.5 font-sans border-r border-[#4c6299]">
          
          {/* SECTION 1 : GESTION DES DOSSIERS JUDICIAIRES (CARTOUCHE XP BLEU/BLANC) */}
          <div className="bg-white rounded-t-sm shadow-sm overflow-hidden border border-[#5d73ab]">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4b88e7] px-2.5 py-1 text-white text-xs font-bold flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-white" />
                <span>Gestion des Dossiers</span>
              </span>
              <span className="text-[10px] text-sky-200">▾</span>
            </div>
            
            <div className="p-2 flex flex-col gap-1 text-[11px] bg-[#f0f4fa]">
              <button
                type="button"
                onClick={() => onNavigateToPath("/C:")}
                className={`w-full text-left px-1.5 py-1 flex items-center gap-1.5 rounded-none cursor-pointer ${
                  currentPath === "/C:"
                    ? "bg-[#316ac5] text-white font-bold"
                    : "text-[#215dc6] hover:underline"
                }`}
              >
                <HardDrive className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span className="truncate">Poste de Travail (C:)</span>
              </button>

              <div className="pl-3 flex flex-col gap-0.5 border-l border-slate-300 ml-1.5">
                <button
                  type="button"
                  onClick={() => onNavigateToPath("/C:/PROCEDURES_CONTENTIEUSES")}
                  className={`w-full text-left px-1 py-0.5 truncate flex items-center gap-1 cursor-pointer ${
                    currentPath.includes("PROCEDURES_CONTENTIEUSES") && !currentPath.includes(currentDossier.id)
                      ? "bg-[#316ac5] text-white font-bold"
                      : "text-[#215dc6] hover:underline"
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Procédures actives</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToPath(`/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${currentDossier.id}`)}
                  className={`w-full text-left px-1 py-0.5 truncate flex items-center gap-1 cursor-pointer ${
                    currentPath.includes(currentDossier.id)
                      ? "bg-[#316ac5] text-white font-bold shadow-xs"
                      : "text-[#b23a00] font-bold hover:underline"
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">▶ Affaire #{currentDossier.id}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToPath("/C:/OUTILS_ADMINISTRATIFS")}
                  className={`w-full text-left px-1 py-0.5 truncate flex items-center gap-1 cursor-pointer ${
                    currentPath.includes("OUTILS_ADMINISTRATIFS")
                      ? "bg-[#316ac5] text-white font-bold"
                      : "text-[#215dc6] hover:underline"
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Outils Système</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2 : RÉSEAU ET PARTAGES SÉCURISÉS */}
          <div className="bg-white rounded-t-sm shadow-sm overflow-hidden border border-[#5d73ab]">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4b88e7] px-2.5 py-1 text-white text-xs font-bold flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-white" />
                <span>Réseau Intranet</span>
              </span>
              <span className="text-[10px] text-sky-200">▾</span>
            </div>

            <div className="p-2 flex flex-col gap-1 text-[11px] bg-[#f0f4fa]">
              <button
                type="button"
                onClick={() => onNavigateToPath("//SERVEUR-CENTRAL-BEAUVAU/DIRECTIVES")}
                className={`w-full text-left px-1.5 py-1 flex items-center gap-1.5 cursor-pointer ${
                  currentPath.includes("DIRECTIVES")
                    ? "bg-[#316ac5] text-white font-bold"
                    : "text-[#215dc6] hover:underline"
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">Cabinet Beauvau$</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToPath("//PARQUET-TRIBUNAL/REQUISITOIRES")}
                className={`w-full text-left px-1.5 py-1 flex items-center gap-1.5 cursor-pointer ${
                  currentPath.includes("PARQUET")
                    ? "bg-[#316ac5] text-white font-bold"
                    : "text-[#215dc6] hover:underline"
                }`}
              >
                <FileBadge className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">Parquet Paris$</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToPath("//POLICE-JUDICIAIRE/FICHIER_TAJ")}
                className={`w-full text-left px-1.5 py-1 flex items-center gap-1.5 cursor-pointer ${
                  currentPath.includes("FICHIER_TAJ")
                    ? "bg-[#316ac5] text-white font-bold"
                    : "text-[#215dc6] hover:underline"
                }`}
              >
                <Database className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                <span className="truncate">Fichier TAJ$</span>
              </button>
            </div>
          </div>

          {/* SECTION 3 : CONSEIL DE PROCÉDURE (AIDE INTÉGRÉE XP) */}
          <div className="bg-[#fffae6] border border-[#d4c185] p-2 text-[10px] text-[#5c4908] leading-tight shadow-xs rounded-sm">
            <span className="font-bold block mb-1 text-[#8a5b00]">💡 RÈGLE DE CONSULTATION :</span>
            Ouvrez les pièces de l'affaire courante pour confronter les dépositions et vérifier la cohérence avant qualification.
          </div>

        </div>

        {/* PANNEAU CENTRAL : CONTENU DU DOSSIER (FOND BLANC PUR ET GRILLE WINDOWS XP) */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white m-1 shadow-inner">
          
          {/* Titre du dossier ouvert */}
          <div className="bg-[#ece9d8] px-3 py-1 border-b border-[#9c9a91] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-black uppercase">{activeFolder.name}</span>
              {activeFolder.description && (
                <span className="text-slate-600 text-[11px] hidden md:inline truncate max-w-md">
                  — {activeFolder.description}
                </span>
              )}
            </div>
            <span className="text-slate-600 text-[11px] font-mono">
              {filteredSubfolders.length} dossier(s), {filteredFiles.length} fichier(s)
            </span>
          </div>

          {/* Zone de contenu défilable */}
          <div
            onWheel={() => soundFx.playScrollTick()}
            className="flex-1 overflow-y-auto p-2 bg-white"
          >
            
            {/* Si dossier vide */}
            {filteredSubfolders.length === 0 && filteredFiles.length === 0 && (
              <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
                <Folder className="w-10 h-10 mb-2 opacity-30 text-amber-500" />
                <span>Ce répertoire ne contient aucun élément correspondant.</span>
              </div>
            )}

            {/* SOUS-DOSSIERS */}
            {filteredSubfolders.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] text-slate-600 font-bold uppercase mb-1.5 px-1 border-b border-slate-200 pb-0.5">
                  Dossiers de classement :
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredSubfolders.map((sub) => {
                    const isCaseActive = sub.name.includes(currentDossier.id);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          soundFx.playFolderThud();
                          onNavigateToPath(sub.path);
                        }}
                        className={`p-2 border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isCaseActive
                            ? "bg-[#fff8e7] hover:bg-[#ffefc7] border-[#d48c00] text-black shadow-xs ring-1 ring-[#d48c00]"
                            : "bg-[#fbfbf9] hover:bg-[#edf2f8] border-[#d0d0d0] text-black"
                        }`}
                      >
                        <Folder className={`w-6 h-6 shrink-0 ${isCaseActive ? "text-amber-600 fill-amber-300" : "text-amber-500 fill-amber-200"}`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate flex items-center gap-1">
                            <span>{sub.name}</span>
                            {isCaseActive && <span className="bg-[#b23a00] text-white text-[9px] px-1 font-bold">ACTIF</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{sub.files.length} pièce(s)</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FICHIERS */}
            {filteredFiles.length > 0 && (
              <div>
                <div className="text-[10px] text-slate-600 font-bold uppercase mb-1.5 px-1 border-b border-slate-200 pb-0.5">
                  Pièces procédurales et annexes :
                </div>
                
                {viewMode === "list" ? (
                  /* VUE LISTE DÉTAILLÉE STYLE EXPLORATEUR XP */
                  <div className="flex flex-col border border-[#d0d0d0] bg-white text-xs">
                    {/* En-tête du tableau (Boutons de colonnes Win32) */}
                    <div className="grid grid-cols-12 gap-1 px-2 py-1 bg-[#ece9d8] border-b border-[#9c9a91] text-[10px] text-slate-700 font-bold select-none">
                      <div className="col-span-5 sm:col-span-4 border-r border-[#d0d0d0] pr-1">Nom de la pièce</div>
                      <div className="col-span-3 sm:col-span-4 hidden sm:block border-r border-[#d0d0d0] pr-1">Intitulé officiel</div>
                      <div className="col-span-4 sm:col-span-2 text-center border-r border-[#d0d0d0]">Cote</div>
                      <div className="col-span-3 sm:col-span-2 text-right">Taille</div>
                    </div>

                    {filteredFiles.map((file) => {
                      const isDiscovered = discoveredFiles.has(file.id);
                      const isSelected = selectedFileId === file.id;
                      const isVisa = file.extension === "visa";

                      return (
                        <div
                          key={file.id}
                          onClick={() => {
                            soundFx.playUiClick();
                            setSelectedFileId(file.id);
                          }}
                          onDoubleClick={() => handleOpenFileWithSound(file)}
                          className={`grid grid-cols-12 gap-1 px-2 py-1.5 items-center text-xs transition-colors cursor-pointer border-b border-slate-100 ${
                            isSelected
                              ? "bg-[#316ac5] text-white"
                              : isVisa
                              ? "bg-[#eaf5ea] hover:bg-[#d8edd8] text-emerald-900"
                              : "hover:bg-[#eef3fb] text-black"
                          }`}
                        >
                          {/* Nom + Icône */}
                          <div className="col-span-8 sm:col-span-4 flex items-center gap-1.5 min-w-0">
                            {getFileIcon(file)}
                            <div className="min-w-0">
                              <span className={`font-semibold truncate block ${isSelected ? "text-white" : isVisa ? "text-emerald-800" : "text-black"}`}>
                                {file.name}
                              </span>
                              {isDiscovered ? (
                                <span className={`text-[9px] block ${isSelected ? "text-sky-200" : "text-emerald-700"}`}>✓ Consulté</span>
                              ) : file.isCrucialClue ? (
                                <span className={`text-[9px] font-bold block ${isSelected ? "text-amber-200" : "text-amber-700"}`}>● Indice non lu</span>
                              ) : null}
                            </div>
                          </div>

                          {/* Titre / Auteur */}
                          <div className={`col-span-3 sm:col-span-4 hidden sm:block min-w-0 text-[11px] truncate ${isSelected ? "text-sky-100" : "text-slate-600"}`}>
                            {file.titre}
                          </div>

                          {/* Classification */}
                          <div className="col-span-4 sm:col-span-2 text-center">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-none ${getClassificationBadge(file.classification)}`}>
                              {file.classification}
                            </span>
                          </div>

                          {/* Taille & Action rapide */}
                          <div className={`col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 text-[10px] ${isSelected ? "text-sky-100" : "text-slate-500"}`}>
                            <span className="font-mono">{file.size}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenFileWithSound(file);
                              }}
                              className="xp-btn text-[10px] px-1.5 py-0.5 flex items-center gap-1"
                            >
                              <span>Ouvrir</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* VUE GRILLE D'ICÔNES */
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {filteredFiles.map((file) => {
                      const isDiscovered = discoveredFiles.has(file.id);
                      const isSelected = selectedFileId === file.id;

                      return (
                        <div
                          key={file.id}
                          onClick={() => {
                            soundFx.playUiClick();
                            setSelectedFileId(file.id);
                          }}
                          onDoubleClick={() => handleOpenFileWithSound(file)}
                          className={`p-2 border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#316ac5] text-white border-[#1d4c94]"
                              : "bg-white hover:bg-[#eef3fb] border-[#d0d0d0] text-black"
                          }`}
                        >
                          <div className="p-1">
                            {getFileIcon(file)}
                          </div>
                          <span className={`text-xs line-clamp-2 break-all font-medium ${isSelected ? "text-white" : "text-black"}`}>
                            {file.name}
                          </span>
                          <span className={`text-[9px] font-bold px-1 py-0.2 border ${getClassificationBadge(file.classification)}`}>
                            {file.classification}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>

          {/* PANNEAU DE PRÉVISUALISATION DU FICHIER SÉLECTIONNÉ (VOLET BAS WIN32) */}
          {selectedFile && (
            <div className="bg-[#ece9d8] border-t-2 border-[#9c9a91] p-2 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                {getFileIcon(selectedFile)}
                <div className="min-w-0">
                  <div className="font-bold text-black text-xs truncate flex items-center gap-2">
                    <span>{selectedFile.titre}</span>
                    <span className="text-[10px] text-slate-600 font-mono">({selectedFile.size})</span>
                  </div>
                  <div className="text-[11px] text-[#0055ea] truncate">
                    {selectedFile.clueHint || selectedFile.auteur}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenFileWithSound(selectedFile)}
                  className="xp-btn text-xs font-bold text-[#003399] flex items-center gap-1.5 shadow-sm"
                >
                  <span>Examiner la pièce</span>
                  <ExternalLink className="w-3 h-3 text-[#003399]" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* PIED DE L'EXPLORATEUR : ÉTAT DU SYSTÈME DE FICHIERS WIN32 */}
      <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-2 py-0.5 flex items-center justify-between text-[11px] text-slate-700 shrink-0 font-sans">
        <div className="flex items-center gap-3">
          <span className="border-r border-[#9c9a91] pr-3">CHEOPS-FS v3.12 (SP2)</span>
          <span className="text-slate-600">{filteredFiles.length} objet(s)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="border-l border-[#9c9a91] pl-3">Espace libre : 34.2 Go / 128 Go</span>
          <span className="text-emerald-700 font-bold border-l border-[#9c9a91] pl-3">● Liaison Intranet Active</span>
        </div>
      </div>

    </div>
  );
};
