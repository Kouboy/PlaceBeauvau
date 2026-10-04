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
    if (gameOverReason === "timeout") {
      return {
        titre: "RÉAFFECTATION : SECTION DES ARCHIVES PASSIVES (BOBIGNY)",
        badge: "DÉPASSEMENT DE DÉLAI",
        color: "text-rose-400 border-rose-500 bg-rose-950/40",
        verdict: "Dépassement du délai de rigueur réglementaire. Encombrement du greffe d'instruction constaté.",
        tampon: "DÉPASSEMENT DE DÉLAI",
        tamponColor: "border-red-600 text-red-500",
        description: "Le défaut de célérité procédurale a retardé l'homologation des visas ministériels. Rétrogradation au classement physique des microfilms d'archives passives sans habilitation CHEOPS.",
      };
    }

    if (!isVictory || stats.blames >= 3 || stats.credibiliteMinistere < 30) {
      return {
        titre: "SUSPENSION CONSERVATOIRE // CONSEIL DE DISCIPLINE",
        badge: "DÉCHÉANCE DE FONCTION",
        color: "text-rose-400 border-rose-500 bg-rose-950/40",
        verdict: "Divergences répétées avec les orientations hiérarchiques. Objectifs de traitement non atteints.",
        tampon: "SUSPENSION CONSERVATOIRE",
        tamponColor: "border-red-600 text-red-500",
        description: "L'accumulation d'arbitrages désapprouvés par le Parquet et la Préfecture interrompt votre habilitation d'officier de qualification. Retrait d'accès dans l'attente de la comparution disciplinaire.",
      };
    }

    if (stats.credibiliteMinistere >= 75 && stats.blames === 0) {
      return {
        titre: "DIRECTION GÉNÉRALE // CELLULE DE CONTRÔLE INTERNE (IGPN)",
        badge: "HOMOLOGATION SUPÉRIEURE",
        color: "text-[#00ff66] border-[#00ff66] bg-emerald-950/40",
        verdict: "Conformité doctrinale intégrale : aucun visa contesté par les magistrats du Parquet.",
        tampon: "HOMOLOGATION TOTALE",
        tamponColor: "border-[#00ff66] text-[#00ff66]",
        description: "L'intégralité des procédures contentieuses a été orientée conformément aux instructions de service. Affectation au contrôle centralisé des réquisitions et à l'harmonisation des doctrines d'engagement.",
      };
    }

    if (stats.primeTotale >= 300) {
      return {
        titre: "CABINET DU MINISTRE — CELLULE CONTENTIEUX (BEAUVAU)",
        badge: "PROMOTION D'AFFECTATION",
        color: "text-amber-300 border-amber-500 bg-amber-950/40",
        verdict: "Objectifs d'apurement atteints. Rendement supérieur à la moyenne du service.",
        tampon: "AFFECTATION CENTRALE",
        tamponColor: "border-amber-400 text-amber-300",
        description: "Cadence accélérée d'apurement des litiges sensibles et réduction active du contentieux de voie publique. Intégration de la cellule ministérielle de cadrage des éléments de langage préfectoraux.",
      };
    }

    return {
      titre: "OFFICIER TITULAIRE // BUREAU DE QUALIFICATION CONTENTIEUSE",
      badge: "SERVICE CONFIRMÉ",
      color: "text-sky-300 border-sky-400 bg-sky-950/40",
      verdict: "Cadence réglementaire respectée. Quotas de traitement d'affaires atteints.",
      tampon: "SERVICES RÉGLEMENTAIRES",
      tamponColor: "border-sky-400 text-sky-300",
      description: "Les bordereaux d'intervention ont été traités dans les limites des tolérances administratives ordinaires. Maintien au poste d'instruction des requêtes de police sous visa préfectoral.",
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
        <div className="p-4 sm:p-5 text-black space-y-3">
          {/* TITRE ET ÉVALUATION DU PRÉFET */}
          <div className="border-b border-[#9c9a91] pb-2">
            <div className="text-[11px] text-slate-600 uppercase font-bold">Avis de la Commission Supérieure de Classement :</div>
            <div className="text-base sm:text-lg font-bold text-black mt-0.5 uppercase tracking-wide flex items-center gap-2">
              {isVictory ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <BadgeAlert className="w-5 h-5 text-red-700" />}
              <span>{isVictory ? "Bordereau d'Apurement Homologué" : "Recours Disciplinaire Engagé"}</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {isVictory
                ? "L'ensemble des litiges de voie publique soumis à instruction a été traité conformément à la doctrine d'apurement statistique."
                : "Les contradictions relevées entre les flux matériels et les procès-verbaux d'intervention ont compromis la ligne doctrinale du ministère."}
            </p>
          </div>

          {/* CADRE A : AFFECTATION PRINCIPALE */}
          <fieldset className="border border-[#9c9a91] bg-white p-3 pt-1 shadow-inner relative overflow-hidden">
            <legend className="px-2 text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
              A. Décision d'Affectation Ministérielle
            </legend>

            {/* Tampon officiel incliné */}
            <div className={`absolute right-2 bottom-2 border-2 px-2.5 py-0.5 font-bold text-xs uppercase tracking-widest transform -rotate-3 opacity-90 ${affectation.tamponColor} bg-white/90 shadow-xs font-mono`}>
              [ {affectation.tampon} ]
            </div>

            <div className="text-sm font-bold text-black uppercase mb-1">
              {affectation.titre}
            </div>
            <div className="text-xs text-slate-700 leading-relaxed max-w-lg mb-2">
              {affectation.description}
            </div>
            <div className="text-[11px] font-bold text-slate-900 italic border-t border-slate-200 pt-1 font-mono">
              « {affectation.verdict} » — Le Préfet de Police
            </div>
          </fieldset>

          {/* CADRE B : INCIDENTS ET ANOMALIES DE SESSION */}
          {((stats.fuitesCount && stats.fuitesCount > 0) || (stats.documentsBroyes && stats.documentsBroyes > 0) || (stats.blames > 0 && stats.blames < 3)) && (
            <fieldset className="border border-[#9c9a91] bg-[#fcfbf7] p-2.5 pt-1 shadow-inner space-y-2">
              <legend className="px-2 text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
                B. Incidents & Signalements Procéduraux
              </legend>

              {stats.fuitesCount && stats.fuitesCount > 0 ? (
                <div className="bg-[#fff0f5] border border-rose-300 p-2 text-xs flex items-center justify-between">
                  <div>
                    <div className="text-rose-950 font-bold uppercase font-mono">
                      ⚠️ TRANSMISSION NON AUTORISÉE DE PIÈCES : {stats.fuitesCount} COPIE(S) EXTRAITE(S)
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      Des bordereaux non expurgés ont été transmis à un conseil extérieur hors circuit CHEOPS. Une enquête administrative interne est ouverte par l'Inspection Générale.
                    </p>
                  </div>
                  <span className="text-[10px] bg-rose-800 text-white px-2 py-0.5 font-mono font-bold shrink-0 ml-2">
                    ENQUÊTE OUVERTE
                  </span>
                </div>
              ) : null}

              {stats.documentsBroyes && stats.documentsBroyes > 0 ? (
                <div className="bg-[#fff9e6] border border-amber-400 p-2 text-xs flex items-center justify-between">
                  <div>
                    <div className="text-amber-950 font-bold uppercase font-mono">
                      📄 ANOMALIE DOCUMENTAIRE : {stats.documentsBroyes} PIÈCE(S) DÉTRUITE(S) APRÈS ENREGISTREMENT
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      Rupture de traçabilité constatée sur l'inventaire des scellés. Contrôle de conformité requis par le greffe central.
                    </p>
                  </div>
                  <span className="text-[10px] bg-amber-800 text-white px-2 py-0.5 font-mono font-bold shrink-0 ml-2">
                    CONTRÔLE GREFFE
                  </span>
                </div>
              ) : null}

              {stats.blames > 0 && stats.blames < 3 ? (
                <div className="bg-[#f0f4f8] border border-slate-300 p-2 text-xs flex items-center justify-between">
                  <div>
                    <div className="text-slate-900 font-bold uppercase font-mono">
                      ⚖️ OBSERVATION HIÉRARCHIQUE : {stats.blames} REJET(S) DE VISA CONSTATÉ(S)
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">
                      Divergences d'arbitrage relevées par le Parquet. Les orientations futures restent placées sous visa de section.
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-700 text-white px-2 py-0.5 font-mono font-bold shrink-0 ml-2">
                    TUTELLE DE SECTION
                  </span>
                </div>
              ) : null}
            </fieldset>
          )}

          {/* CADRE C : GRILLE DE STATISTIQUES POLICIÈRES */}
          <fieldset className="border border-[#9c9a91] bg-white p-2.5 pt-1 shadow-inner">
            <legend className="px-2 text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
              C. Relevé Statistique de Session
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#f4f2ec] border border-[#9c9a91] p-2 shadow-xs">
                <div className="text-[10px] text-slate-600 font-bold uppercase font-mono">Affaires Apurées</div>
                <div className="text-sm font-bold text-black mt-0.5 font-mono">
                  {stats.totalProcessed} / {stats.totalDossiers}
                </div>
              </div>

              <div className="bg-[#f4f2ec] border border-[#9c9a91] p-2 shadow-xs">
                <div className="text-[10px] text-slate-600 font-bold uppercase font-mono">Primes Allouées</div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1 font-mono">
                  <span>+{stats.primeTotale} €</span>
                </div>
              </div>

              <div className="bg-[#f4f2ec] border border-[#9c9a91] p-2 shadow-xs">
                <div className="text-[10px] text-slate-600 font-bold uppercase font-mono">Crédibilité Corps</div>
                <div className={`text-sm font-bold mt-0.5 font-mono ${stats.credibiliteMinistere >= 50 ? "text-emerald-700" : "text-red-700"}`}>
                  {stats.credibiliteMinistere}%
                </div>
              </div>

              <div className="bg-[#f4f2ec] border border-[#9c9a91] p-2 shadow-xs">
                <div className="text-[10px] text-slate-600 font-bold uppercase font-mono">Pax Sociale</div>
                <div className="text-sm font-bold text-sky-800 mt-0.5 font-mono">
                  {stats.paxSociale}%
                </div>
              </div>
            </div>
          </fieldset>
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
