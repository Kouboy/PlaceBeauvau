import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  Coins,
  FileCheck,
  CheckCircle2,
  Share2,
  RotateCcw,
  Sparkles,
  Scale,
  Flame,
  UserCheck,
  FileText,
  BadgeAlert
} from "lucide-react";
import { Dossier } from "../dossiers";
import { soundFx } from "../services/soundFx";

export interface SessionReportStats {
  totalProcessed: number;
  totalDossiers: number;
  primeTotale: number;
  credibiliteMinistere: number;
  paxSociale: number;
  blames: number;
  documentsBroyes: number;
  substitutionsCount: number;
  equipementsCount: number;
  fuitesCount?: number;
  currentGrade: {
    titre: string;
    badge: string;
    description: string;
  };
}

interface OfficerEvaluationReportModalProps {
  stats: SessionReportStats;
  onRestart: () => void;
  isVictory?: boolean;
  gameOverReason?: "timeout" | "blames" | "credibilite";
}

export const OfficerEvaluationReportModal: React.FC<OfficerEvaluationReportModalProps> = ({
  stats,
  onRestart,
  isVictory = true,
  gameOverReason,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Détermination de l'affectation finale satirique selon le profil de performance
  const getAffectationFinale = () => {
    // 1. FIN DISSIDENTE : LANCEUR D'ALERTE NATIONAL (Si fuites transmises à Me Sorel)
    if (stats.fuitesCount && stats.fuitesCount >= 2) {
      return {
        titre: "COMMISSION D'ENQUÊTE NATIONALE // LANCEUR D'ALERTE CITOYEN",
        badge: "DÉVOILEMENT D'ÉTAT",
        color: "text-purple-300 border-purple-500 bg-purple-950/40",
        verdict: "Révélation publique de l'omerta institutionnelle et des violences récurrentes de la Brigade 4B.",
        tampon: "AUDITION PARLEMENTAIRE",
        tamponColor: "border-purple-400 text-purple-300",
        description: `Vous avez refusé d'étouffer les affaires. Les ${stats.fuitesCount} dossiers transmis clandestinement à Me Camille Sorel ont fait la Une de la presse nationale. Le préfet Didier de Courcelles a dû s'expliquer en direct, le Brigadier Marc Vasseur est suspendu avec retrait d'arme, et l'Assemblée Nationale a ouvert une commission d'enquête sur les violences d'État. Révoqué de Beauvau, vous devenez le symbole de la probité républicaine.`,
      };
    }

    if (gameOverReason === "timeout") {
      return {
        titre: "RÉVOCATION POUR LENTEUR ADMINISTRATIVE ET ENCOMBREMENT DU GREFFE",
        badge: "CADENCE DÉFAILLANTE",
        color: "text-rose-400 border-rose-500 bg-rose-950/40",
        verdict: "Dépassement systématique des délais de rigueur fixés par la circulaire ministérielle.",
        tampon: "DÉPASSEMENT DES DÉLAIS",
        tamponColor: "border-red-600 text-red-500",
        description: "Vos hésitations procédurales ont laissé le temps aux avocats des victimes d'enregistrer des plaintes avec constitution de partie civile avant le classement sans suite. Le Préfet vous rétrograde au dépoussiérage des microfilms d'archives.",
      };
    }

    if (!isVictory || stats.blames >= 3 || stats.credibiliteMinistere < 30) {
      return {
        titre: "AFFECTATION DISCIPLINAIRE : ARCHIVES SOUTERRAINES DE BOBIGNY",
        badge: "RÉVOCATION / SANCTION",
        color: "text-rose-400 border-rose-500 bg-rose-950/40",
        verdict: "Carence de zèle et scrupules déontologiques incompatibles avec l'intérêt supérieur du service.",
        tampon: "DÉCHÉANCE DE FONCTION",
        tamponColor: "border-red-600 text-red-500",
        description: "Vos hésitations doctrinales ont exposé l'équipage à la curiosité de la presse. Vous êtes assigné au tri des pièces à conviction poussiéreuses sous 3 sous-sols, sans téléphone ni accès réseau.",
      };
    }

    if (stats.primeTotale >= 350 && stats.documentsBroyes >= 3) {
      return {
        titre: "CONSEILLER SPÉCIAL AU CABINET DU MINISTRE (BEAUVAU)",
        badge: "PROMOTION D'EXCEPTION",
        color: "text-amber-300 border-amber-500 bg-amber-950/40",
        verdict: "Génie cynique du classement sans suite et maîtrise totale de l'inversion accusatoire.",
        tampon: "PROMOTION MINISTÉRIELLE",
        tamponColor: "border-amber-400 text-amber-300",
        description: "Votre capacité à détruire les pièces litigieuses, convertir des victimes en prévenus d'outrage et maintenir 100% d'immunité policière vous ouvre les portes du Cabinet. Vous superviserez les éléments de langage du JT de 20h.",
      };
    }

    if (stats.credibiliteMinistere >= 80 && stats.blames === 0) {
      return {
        titre: "COMMISSAIRE DIVISIONNAIRE // CHEF DE L'IGPN",
        badge: "ORDRE NATIONAL DU MÉRITE",
        color: "text-[#00ff66] border-[#00ff66] bg-emerald-950/40",
        verdict: "Doctrinarisme absolu : aucune faute administrative imputable aux forces de l'ordre.",
        tampon: "HOMOLOGATION TOTALE",
        tamponColor: "border-[#00ff66] text-[#00ff66]",
        description: "Le Parquet n'a trouvé aucune faille dans vos bordereaux. Le ministre vous confie la direction des enquêtes internes : aucun tir ne sera jamais jugé disproportionné sous votre mandat.",
      };
    }

    return {
      titre: "OFFICIER PRINCIPAL DE QUALIFICATION FORENSIQUE",
      badge: "SERVICE CONFIRMÉ",
      color: "text-sky-300 border-sky-400 bg-sky-950/40",
      verdict: "Cadence conforme et apaisement statistique maintenu.",
      tampon: "SERVICES RÉGLEMENTAIRES",
      tamponColor: "border-sky-400 text-sky-300",
      description: "Vous avez rempli les objectifs fixés par la circulaire sans vague. Les dossiers sont classés, les recours sont forclos et la préfecture conserve ses primes d'intéressement.",
    };
  };

  const affectation = getAffectationFinale();

  const handleShare = () => {
    soundFx.playUiClick();
    const shareText = `🏛️ DOSSIER CLASSIFIÉ CHEOPS\n` +
      `Affectation : ${affectation.titre}\n` +
      `Bordereaux apurés : ${stats.totalProcessed}/${stats.totalDossiers}\n` +
      `Prime totale : ${stats.primeTotale} €\n` +
      `Crédibilité : ${stats.credibiliteMinistere}%\n` +
      `Pax Sociale : ${stats.paxSociale}%`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto">
      <div className="bg-[#ece9d8] border-3 border-[#0055ea] max-w-2xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative select-none rounded-t-lg rounded-b-xs overflow-hidden my-auto flex flex-col">
        
        {/* BANDEAU SUPÉRIEUR WINDOWS XP */}
        <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-3 py-1 flex items-center justify-between text-white text-xs font-bold shadow-xs">
          <div className="flex items-center gap-2">
            <span>🎖️</span>
            <span>CHEOPS : Rapport Individuel de Notation // Clôture de Session</span>
          </div>
          <span className="text-[10px] text-sky-100 bg-white/20 px-1.5 py-0.2">
            Art. L. 435-1 CSI
          </span>
        </div>

        {/* CORPS DE LA NOTATION */}
        <div className="p-4 sm:p-5 text-black">
          {/* TITRE ET ÉVALUATION DU PRÉFET */}
          <div className="mb-3 border-b border-[#9c9a91] pb-3">
            <div className="text-[11px] text-slate-600 uppercase font-bold">Avis de la Commission Supérieure de Classement :</div>
            <div className="text-base sm:text-xl font-bold text-black mt-0.5 uppercase tracking-wide flex items-center gap-2">
              {isVictory ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <BadgeAlert className="w-5 h-5 text-red-700" />}
              <span>{isVictory ? "Bordereau d'Apurement Homologué" : "Recours Disciplinaire Engagé"}</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {isVictory
                ? "L'intégralité des litiges de voie publique a été apurée sans mettre en cause l'institution policière ni les dépositaires de l'autorité publique."
                : "Les contradictions relevées entre les flux matériels et les procès-verbaux d'intervention ont compromis la ligne doctrinale du ministère."}
            </p>
          </div>

          {/* CADRE AFFECTATION SATIRIQUE (STYLE CERFA WIN32) */}
          <fieldset className="border border-[#9c9a91] bg-white p-3 pt-1 shadow-inner mb-3 relative overflow-hidden">
            <legend className="px-2 text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
              Décision de Destination Ministérielle
            </legend>

            {/* Tampon officiel incliné */}
            <div className={`absolute right-2 bottom-2 border-2 px-2.5 py-0.5 font-bold text-xs uppercase tracking-widest transform -rotate-3 opacity-90 ${affectation.tamponColor} bg-white/90 shadow-xs`}>
              [ {affectation.tampon} ]
            </div>

            <div className="text-sm font-bold text-black uppercase mb-1">
              {affectation.titre}
            </div>
            <div className="text-xs text-slate-700 leading-relaxed max-w-lg mb-2">
              {affectation.description}
            </div>
            <div className="text-[11px] font-bold text-slate-900 italic border-t border-slate-200 pt-1">
              « {affectation.verdict} » — Le Préfet de Police
            </div>
          </fieldset>

          {/* GRILLE DE STATISTIQUES POLICIÈRES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
            <div className="bg-white border border-[#9c9a91] p-2 shadow-xs">
              <div className="text-[10px] text-slate-600 font-bold uppercase">Affaires Classées</div>
              <div className="text-sm font-bold text-black mt-0.5">
                {stats.totalProcessed} / {stats.totalDossiers}
              </div>
            </div>

            <div className="bg-white border border-[#9c9a91] p-2 shadow-xs">
              <div className="text-[10px] text-slate-600 font-bold uppercase">Primes Acquises</div>
              <div className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                <span>+{stats.primeTotale} €</span>
              </div>
            </div>

            <div className="bg-white border border-[#9c9a91] p-2 shadow-xs">
              <div className="text-[10px] text-slate-600 font-bold uppercase">Crédibilité Corps</div>
              <div className={`text-sm font-bold mt-0.5 ${stats.credibiliteMinistere >= 50 ? "text-emerald-700" : "text-red-700"}`}>
                {stats.credibiliteMinistere}%
              </div>
            </div>

            <div className="bg-white border border-[#9c9a91] p-2 shadow-xs">
              <div className="text-[10px] text-slate-600 font-bold uppercase">Blâmes Reçus</div>
              <div className="text-sm font-bold text-amber-800 mt-0.5">
                {stats.blames} / 3
              </div>
            </div>
          </div>

          {/* INDICATEUR DISSIDENCE / LANCEUR D'ALERTE */}
          {stats.fuitesCount && stats.fuitesCount > 0 ? (
            <div className="bg-[#fff0f5] border border-rose-300 p-2 mb-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-rose-900 font-bold">🕵️ Dossier(s) transmis à la presse :</span>
                <span className="text-black font-bold">{stats.fuitesCount} pièce(s) clandestine(s)</span>
              </div>
              <span className="text-[10px] bg-rose-700 text-white px-2 py-0.5 font-bold uppercase">
                RÉSISTANCE CITOYENNE
              </span>
            </div>
          ) : null}
        </div>

        {/* ACTIONS DU BILAN : BARRE DE BOUTONS XP */}
        <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="xp-btn text-xs font-bold text-slate-800 flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>{copied ? "✓ Copié dans le presse-papier" : "Transmettre la fiche de notation"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playStampSound(true);
              onRestart();
            }}
            className="xp-btn-blue bg-[#0055ea] hover:bg-[#0044cc] text-white text-xs font-bold flex items-center gap-2 shadow-md px-3.5 py-1.5 border border-[#002266] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-bold">Ouvrir une nouvelle session d'instruction</span>
          </button>
        </div>

      </div>
    </div>
  );
};
