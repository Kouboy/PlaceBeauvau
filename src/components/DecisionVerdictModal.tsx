import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Scale,
  Coins,
  FileText
} from "lucide-react";
import { soundFx } from "../services/soundFx";

export interface DecisionVerdictModalProps {
  feedback: {
    correct: boolean;
    tamponTente: string;
    tamponAttendu: string;
    motifErreur: string;
  };
  blames: number;
  primeTotale: number;
  credibiliteMinistere: number;
  onPasserSuivant: () => void;
  onRevoirDossier: () => void;
}

export const DecisionVerdictModal: React.FC<DecisionVerdictModalProps> = ({
  feedback,
  blames,
  primeTotale,
  credibiliteMinistere,
  onPasserSuivant,
  onRevoirDossier,
}) => {
  const isRevocation = !feedback.correct && blames >= 3;

  // Raccourcis clavier diégétiques : [ESPACE] ou [ENTRÉE] pour enchaîner, [ÉCHAP] ou [R] pour revoir
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        soundFx.playStampSound(true);
        onPasserSuivant();
      } else if (e.code === "Escape" || e.key === "r" || e.key === "R") {
        e.preventDefault();
        soundFx.playUiClick();
        onRevoirDossier();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPasserSuivant, onRevoirDossier]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      <div className="max-w-xl w-full bg-[#ece9d8] border-3 border-[#0055ea] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col justify-between">
        {/* TITRE WINDOWS XP LUNA */}
        <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-3 py-1 flex items-center justify-between text-white text-xs font-bold shadow-xs">
          <div className="flex items-center gap-1.5">
            <span>{feedback.correct ? "⚖️" : "⚠️"}</span>
            <span>
              {feedback.correct ? "CHEOPS-AUDIT : Homologation du Visa" : "CHEOPS-ALERTE : Rejet de la Qualification"}
            </span>
          </div>
          <button
            type="button"
            onClick={onRevoirDossier}
            className="w-5 h-5 bg-[#d84040] hover:bg-[#f05050] text-white font-bold text-xs flex items-center justify-center border border-white/60 shadow-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* CORPS DE LA BOÎTE DE DIALOGUE */}
        <div className="p-4 flex flex-col gap-3 text-black">
          {/* En-tête avec icône Win32 MessageBox */}
          <div className="flex items-start gap-3">
            <div className="text-3xl shrink-0">
              {feedback.correct ? "✅" : "❌"}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-black uppercase">
                {feedback.correct
                  ? `Visa Apposé avec Succès : [${feedback.tamponTente}]`
                  : `Blâme Disciplinaire Notifié (Avis ${blames}/3)`}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5">
                {feedback.correct
                  ? "Qualification conforme aux instructions de la circulaire ministérielle. Aucune faute imputée."
                  : `Visa requis selon la doctrine : [${feedback.tamponAttendu}]`}
              </p>
            </div>
          </div>

          {/* MOTIF OFFICIEL DANS CHAMP EN CREUX 3D */}
          <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-3 text-xs leading-relaxed shadow-inner">
            <div className="text-[10px] text-slate-600 uppercase font-bold mb-1">
              {feedback.correct ? "Effets juridiques homologués :" : "Motif officiel du rejet par le Parquet :"}
            </div>
            <p className="text-black font-medium">
              « {feedback.motifErreur} »
            </p>
          </div>

          {/* INDICATEURS POST-DÉCISION DANS TABLEAU WIN32 */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white border border-[#9c9a91] p-2 shadow-xs">
              <div className="text-[10px] text-slate-600 font-bold uppercase">Prime</div>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">
                {feedback.correct ? "+50 € (Zèle)" : "0 € (Pénalité)"}
              </div>
            </div>

            <div className="bg-white border border-[#9c9a91] p-2 shadow-xs">
              <div className="text-[10px] text-slate-600 font-bold uppercase">Crédibilité</div>
              <div className={`text-sm font-bold mt-0.5 ${feedback.correct ? "text-emerald-700" : "text-red-700"}`}>
                {feedback.correct ? "Préservée" : "-18%"}
              </div>
            </div>

            <div className="bg-white border border-[#9c9a91] p-2 shadow-xs">
              <div className="text-[10px] text-slate-600 font-bold uppercase">Statut</div>
              <div className={`text-sm font-bold mt-0.5 ${isRevocation ? "text-red-700" : "text-black"}`}>
                {isRevocation ? "RÉVOCATION" : "En poste"}
              </div>
            </div>
          </div>
        </div>

        {/* BARRE D'ACTIONS WIN32 AVEC BOUTONS BEVELED */}
        <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playUiClick();
              onRevoirDossier();
            }}
            className="xp-btn flex items-center gap-1.5 text-xs text-black"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Consulter les pièces du bureau [ÉCHAP]</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playStampSound(true);
              onPasserSuivant();
            }}
            className="xp-btn-blue text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <span>{isRevocation ? "Constater la suspension" : "Prendre en charge l'affaire suivante"}</span>
            <span className="text-[10px] opacity-75 font-mono">[ENTRÉE]</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
