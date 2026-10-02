import React, { useState, useEffect } from "react";
import {
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  X,
  Lock,
  Mail,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Award,
  Pin,
  Coffee,
  UserCheck
} from "lucide-react";
import { soundFx } from "../services/soundFx";

export interface SatiricalFile {
  id: string;
  name: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
  badgeColor?: string;
  titre: string;
  classification: string;
  emetteur: string;
  content: string;
}

export const SATIRICAL_DESK_FILES: SatiricalFile[] = [
  {
    id: "circulaire-pas-de-vagues",
    name: "CIRCULAIRE_BEAUVAU_DOCTRINE.pdf",
    subLabel: "Directive ministérielle",
    icon: FileText,
    color: "text-red-400",
    badge: "URGENT",
    badgeColor: "bg-red-950 text-red-300 border-red-500",
    titre: "CIRCULAIRE N°88/DGPN // DIRECTIVE DU 'PAS DE VAGUES'",
    classification: "DIFFUSION INTERNE STRICTE",
    emetteur: "Cabinet du Ministre // Direction de la Police Nationale",
    content: `RÉPUBLIQUE FRANÇAISE - MINISTÈRE DE L'INTÉRIEUR
NOTE CADRE À L'ATTENTION DES OFFICIERS D'INSTRUCTION CONTENTIEUSE :

1. SITUATION GÉNÉRALE :
En période de tension sociale ou électorale, la cohésion de l'institution policière prime sur toute appréciation factuelle subjective.

2. DOCTRINE D'APUREMENT AUTOMATIQUE :
Il est rappelé aux agents assermentés qu'une intervention policière ne saurait juridiquement excéder le cadre de la légitime défense républicaine dès lors que l'agent portait un baudrier réglementaire (même sans matricule RIO).

3. TRAITEMENT DES PLAINTES CITOYENNES :
Toute déclaration d'administré affirmant avoir été « bousculé », « étranglé » ou « verbalisé abusivement » doit être traitée avec circonspection et faire l'objet d'une contre-procédure incidente d'outrage et rébellion dans un délai de 2 heures.

Le Ministre compte sur le zèle patriotique de ses agents.`
  },
  {
    id: "trombinoscope-hierarchie",
    name: "TROMBINOSCOPE_HIERARCHIE.xls",
    subLabel: "Feuille de notation",
    icon: FileSpreadsheet,
    color: "text-emerald-400",
    badge: "RH-INTRA",
    badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500",
    titre: "REGISTRE D'AVANCEMENT & TROMBINOSCOPE DES OFFICIERS SUPÉRIEURS",
    classification: "CONFIDENTIEL RH",
    emetteur: "Direction des Ressources Humaines de la Sécurité Publique",
    content: `LISTE OFFICIELLE DU PERSONNEL ENCADRANT (À NE JAMAIS CONTRARIER EN PROCÉDURE) :

• MONSIEUR LE COMMISSAIRE DIVISIONNAIRE DE COURCELLES :
  - Objectif fixé : 99.4% d'affaires classées sans suite.
  - Humeur : Redoutable avant le premier café de 09h00.
  - Consigne : Valider systématiquement les PV d'intervention de ses équipages de nuit.

• MAJOR SYNDICAL VERNIER (AMICALE DES BRIGADES) :
  - Spécialité : Remplacement express de bâtons télescopiques tordus sur intervention.
  - Règle d'or : Toute contestation d'un agent de la brigade 4B est réputée calomnieuse.

• LIEUTENANT P. (BUREAU DÉONTOLOGIE IGPN) :
  - En congé formation 'Gestion des crises médiatiques' jusqu'à nouvel ordre.
  - Répondeur automatique : « L'usage de la force était proportionné. Dossier classé. »`
  },
  {
    id: "greve-syndicat",
    name: "NOTE_SYNDICAT_ALLIANCE_ORDRE.txt",
    subLabel: "Flash syndical interne",
    icon: FileText,
    color: "text-amber-400",
    badge: "AVIS",
    badgeColor: "bg-amber-950 text-amber-300 border-amber-500",
    titre: "BULLETIN D'INFORMATION DE L'AMICALE CORPORATISTE POLICE",
    classification: "USAGE SYNDICAL",
    emetteur: "Union Nationale des Policiers Assermentés",
    content: `COMMUNIQUÉ À LA BASE OPÉRATIONNELLE :

Camarades officiers et gradés,

1. PRIME DE SOUTIEN MINISTÉRIELLE :
Suite à notre déjeuner de travail à Beauvau, la prime de neutralisation du contentieux est revalorisée de +15 € par non-lieu prononcé. 

2. GESTION DES FLUX VIDÉO :
Rappel fraternel : si un journaliste ou un passant a capté l'intégralité d'un placage ventral au sol, ne paniquez pas. Le bouton « PANNE CARTE SD / BUG CHIP CSU » de la console CCTV a été validé par la jurisprudence préfectorale constante.

3. REPAS DU SERVICE :
Le barbecue inter-brigades aura lieu jeudi au stand de tir. Munitions traçantes interdites pendant les grillades.`
  },
  {
    id: "rtt-refusees",
    name: "RAPPEL_RTT_ANNULEES_SERVICE.msg",
    subLabel: "Notification de service",
    icon: Mail,
    color: "text-rose-400",
    badge: "REFUSÉ",
    badgeColor: "bg-rose-950 text-rose-300 border-rose-500",
    titre: "NOTIFICATION DE REJET DE REPOS COMPENSATEUR #7501923",
    classification: "ACTE ADMINISTRATIF",
    emetteur: "Bureau de la Gestion des Effectifs // Préfecture",
    content: `DE : GESTION_EFFECTIFS_PARIS@INTERIEUR.GOUV.FR
À : AGENT_INSTRUCTION_7501923@CHEOPS.INTRA
OBJET : Rejet formel de vos 3 jours de RTT demandés pour le 15 août.

Monsieur l'Officier,

Votre demande de repos est REJETÉE pour motif de :
« NÉCESSITÉ IMPÉRIEUSE DU MAINTIEN DE LA TRANQUILLITÉ RÉPUBLICAINE PERMANENTE ».

En compensation, vous recevrez :
- 1 pin's officiel de la République en métal non précieux.
- Un bon pour un café gratuit au distributeur du rez-de-chaussée (hors boisson gourmande).

Votre vacation commence demain à 05h45. Bonne journée républicaine.`
  }
];

interface DesktopClutterProps {
  onBroyerPiece?: () => void;
  blames?: number;
  dossierIndex?: number;
  totalDossiers?: number;
}

export const DesktopClutter: React.FC<DesktopClutterProps> = ({
  onBroyerPiece,
  blames = 0,
  dossierIndex = 0,
  totalDossiers = 6,
}) => {
  const [selectedFile, setSelectedFile] = useState<SatiricalFile | null>(null);
  const [memosCollapsed, setMemosCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"major" | "amicale" | "session">("major");
  const [prefetSpeech, setPrefetSpeech] = useState<string | null>(null);
  const [activePopupAlert, setActivePopupAlert] = useState<{
    id: string;
    title: string;
    message: string;
    time: string;
    urgent?: boolean;
  } | null>(null);

  // Infobulles système rétro absurdes
  useEffect(() => {
    const alerts = [
      {
        id: "cert-exp",
        title: "CHEOPS-SECURITY v2.4",
        message: "Certificat SSL ministériel non renouvelé. Les poursuites judiciaires sont temporairement suspendues.",
        time: "Il y a 1 min",
        urgent: false,
      },
      {
        id: "cctv-quota",
        title: "ESPACE DISQUE DU COMMISSARIAT",
        message: "Espace saturé : 14.8 Go de vidéos de bavures 'égarées suite à surchauffe thermique'. Purge recommandée.",
        time: "À l'instant",
        urgent: true,
      },
      {
        id: "pref-bravo",
        title: "DIRECTION DE LA SÉCURITÉ PUBLIQUE",
        message: "Félicitations du Préfet : Votre commissariat affiche 98.4% de refus de plainte. Objectif semestriel atteint !",
        time: "Il y a 3 min",
        urgent: false,
      },
      {
        id: "percolateur",
        title: "INTRANET VIE DU POSTE",
        message: "Nadine rappelle que le marc de café ne se jette pas dans le broyeur de scellés judiciaires.",
        time: "Il y a 5 min",
        urgent: false,
      },
    ];

    const timer = setInterval(() => {
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      setActivePopupAlert(randomAlert);
      soundFx.playSystemWarning();
    }, 50000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenFile = (file: SatiricalFile) => {
    soundFx.playPaperRustle();
    setSelectedFile(file);
  };

  const handleClickPrefet = () => {
    soundFx.playDeskTap();
    const citations = [
      "« L'institution est irréprochable par définition ministérielle. »",
      "« Un bon fonctionnaire ne pose pas de questions aux PV. Il tamponne. »",
      "« Il n'y a pas de bavure, agent. Seulement des frottements avec le réel républicain. »",
      "« Si le coup est parti, c'est que la cible était sur la trajectoire réglementaire. »"
    ];

    if (blames >= 2) {
      setPrefetSpeech("« Votre zèle laisse à désirer, agent. L'IGPN prépare votre bureau dans la Creuse ! »");
    } else {
      const cite = citations[Math.floor(Math.random() * citations.length)];
      setPrefetSpeech(cite);
    }
    setTimeout(() => setPrefetSpeech(null), 4500);
  };

  return (
    <>
      {/* 1. POST-IT RÉPUBLICAIN DU PRÉFET D. DE COURCELLES (STYLE POST-IT JAUNE PAPIER VÉRITABLE) */}
      <div className="absolute top-12 right-6 z-10 hidden xl:flex flex-col items-end pointer-events-auto select-none rotate-1">
        <div
          onClick={handleClickPrefet}
          className="p-3 bg-[#fff9a6] border border-[#e6db55] shadow-[3px_3px_10px_rgba(0,0,0,0.35)] w-56 text-black cursor-pointer relative"
          title="Consigne de M. le Préfet Didier de Courcelles (Cliquer pour écouter)"
        >
          {/* Épingle ou scotch */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/70 border border-black/10 rotate-2 shadow-xs"></div>

          <div className="flex items-center gap-2 border-b border-[#ded247] pb-1 mb-1.5 font-sans">
            <span className="text-base">📌</span>
            <div>
              <div className="text-xs font-bold text-black uppercase leading-tight">
                Cabinet du Préfet
              </div>
              <div className="text-[10px] text-slate-700">D. de Courcelles</div>
            </div>
          </div>

          <p className="font-sans text-xs italic text-black leading-snug">
            {prefetSpeech || "« Ne pas poser de questions aux PV. Tamponner. L'institution prime sur le fait. »"}
          </p>

          <div className="mt-2 text-[10px] text-slate-600 border-t border-[#ded247] pt-1 flex justify-between font-mono">
            <span>Rappels: {blames}</span>
            <span className="underline">Note confidentielle</span>
          </div>
        </div>
      </div>

      {/* 2. PENSE-BÊTE AMICALE & MOTS DE PASSE (STYLE POST-IT BLEU/VERT AU BAS DU BUREAU) */}
      <div className="absolute bottom-28 right-6 z-10 hidden lg:flex flex-col items-end pointer-events-auto select-none -rotate-1">
        <div className="w-64 bg-[#e8f4d9] border border-[#bcdba0] shadow-[3px_3px_10px_rgba(0,0,0,0.35)] p-3 text-black">
          <div className="flex items-center justify-between border-b border-[#b2d494] pb-1 mb-1.5">
            <span className="font-bold text-xs flex items-center gap-1">
              <span>📝</span>
              <span>Mémos Major Vernier</span>
            </span>
            <div className="flex gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setActiveTab("major")}
                className={`px-1 font-bold ${activeTab === "major" ? "bg-[#bcdba0] text-black" : "text-slate-600"}`}
              >
                Doctrine
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("session")}
                className={`px-1 font-bold ${activeTab === "session" ? "bg-[#bcdba0] text-black" : "text-slate-600"}`}
              >
                Codes
              </button>
            </div>
          </div>

          <div className="text-xs font-sans leading-snug">
            {activeTab === "major" && (
              <p>
                « Ne jamais écrire <strong className="text-red-700">"Tir dans le dos"</strong>. Préférer : <strong className="text-black">"Vecteur de fuite intercepté"</strong>. »
              </p>
            )}
            {activeTab === "session" && (
              <div className="font-mono text-xs space-y-0.5">
                <div>Login : <strong>Agent_7501923</strong></div>
                <div>Pass : <strong className="text-blue-800">BeauvauSecure!</strong></div>
                <div className="text-[10px] text-slate-500 italic mt-1">(Ne pas jeter - Circulaire SSI)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. MODALE DE LECTURE D'UN DOCUMENT (FENÊTRE STYLE BLOC-NOTES / ACROBAT XP) */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
          <div className="max-w-xl w-full bg-[#ece9d8] border-3 border-[#0055ea] shadow-2xl flex flex-col justify-between rounded-t-lg rounded-b-xs overflow-hidden">
            {/* Barre de titre XP */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-2.5 py-1 flex items-center justify-between text-white text-xs font-bold shadow-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span>📄</span>
                <span className="truncate">{selectedFile.name} - Visionneuse officielle</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playWindowClose();
                  setSelectedFile(null);
                }}
                className="w-5 h-5 bg-[#d84040] hover:bg-[#f05050] active:bg-[#b02020] text-white font-black text-xs flex items-center justify-center border border-white/60 shadow-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Menu classique */}
            <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 py-0.5 flex gap-3 text-xs text-slate-800">
              <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer"><u>F</u>ichier</span>
              <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer"><u>E</u>dition</span>
              <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer"><u>A</u>ide</span>
            </div>

            {/* Corps du document fond blanc papier */}
            <div className="p-3 bg-[#ece9d8]">
              <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-4 font-mono text-black text-xs leading-relaxed max-h-[60vh] overflow-y-auto shadow-inner whitespace-pre-wrap">
                <div className="border-b-2 border-black pb-2 mb-3">
                  <div className="font-bold text-red-700 uppercase">{selectedFile.classification}</div>
                  <div className="text-sm font-black text-black uppercase mt-1">{selectedFile.titre}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Émetteur : {selectedFile.emetteur}</div>
                </div>
                {selectedFile.content}
              </div>
            </div>

            {/* Barre de boutons Win32 en bas */}
            <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-3 py-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Lecture seule - Diffusion restreinte</span>
              <button
                type="button"
                onClick={() => {
                  soundFx.playWindowClose();
                  setSelectedFile(null);
                }}
                className="xp-btn px-4 text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. BULLE DE NOTIFICATION STYLE WINDOWS XP (BALLOON TOOLTIP JAUNE CLASSIQUE) */}
      {activePopupAlert && (
        <div className="fixed bottom-10 right-4 z-40 max-w-sm w-84 bg-[#ffffe1] border border-black shadow-[3px_3px_8px_rgba(0,0,0,0.5)] p-2.5 rounded-none font-sans select-none animate-fadeIn">
          {/* Petite flèche en bas vers le systray */}
          <div className="absolute -bottom-2 right-12 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"></div>
          <div className="absolute -bottom-1.5 right-12 w-0 h-0 border-l-7 border-l-transparent border-r-7 border-r-transparent border-t-7 border-t-[#ffffe1]"></div>

          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-300 text-xs font-bold text-black">
            <div className="flex items-center gap-1.5">
              <span className="text-base text-blue-700">ℹ️</span>
              <span className="truncate">{activePopupAlert.title}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.playUiClick();
                setActivePopupAlert(null);
              }}
              className="text-black hover:bg-slate-200 px-1 font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-black leading-snug">
            {activePopupAlert.message}
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5 text-right italic">
            Cliquer pour acquitter
          </div>
        </div>
      )}
    </>
  );
};
