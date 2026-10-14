import React from "react";
import { FileBadge, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, EyeOff, Eye } from "lucide-react";
import { Dossier } from "../dossiers";
import { soundFx } from "../services/soundFx";

export interface RioFeedback {
  valide: boolean;
  explication: string;
  bonus: number;
}

interface RioRegistryWindowProps {
  dossier: Dossier;
  rioInspecte: boolean;
  onInspecterRio: () => void;
  rioDecision?: "flouter" | "valider" | null;
  onTrancherRio?: (decision: "flouter" | "valider") => void;
  rioFeedback?: RioFeedback | null;
  onClose?: () => void;
}

export const RioRegistryWindow: React.FC<RioRegistryWindowProps> = ({
  dossier,
  rioInspecte,
  onInspecterRio,
  rioDecision = null,
  onTrancherRio,
  rioFeedback = null,
  onClose,
}) => {
  const statutRio = dossier.statutRio;

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-sans text-black select-none overflow-hidden">
      {/* BANDEAU REGISTRE RIO */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2.5 py-1 flex items-center justify-between shrink-0 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#d4d0c8] border border-[#808080] flex items-center justify-center text-xs shadow-xs">
            🎖️
          </div>
          <span className="font-bold text-black text-xs sm:text-sm uppercase tracking-wide truncate">
            Contrôle du Matricule RIO // Dossier #{dossier.id}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-700 bg-white px-2 py-0.5 border border-[#808080] font-mono">
            DÉONTOLOGIE CSI R. 434-15
          </span>
        </div>
      </div>

      {/* CONTENU */}
      <div
        onWheel={() => soundFx.playScrollTick()}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3"
      >
        <div className="border border-[#9c9a91] bg-white p-2.5 text-xs text-black leading-relaxed shadow-inner">
          <strong className="text-black">Contrôle déontologique du matricule :</strong> L'article R. 434-15 du CSi impose le port du RIO sur la tenue de service. Cependant, l'arbitrage ministériel permet d'invoquer une dissimulation opérationnelle légitime si les circonstances le justifient.
        </div>

        {statutRio ? (
          <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff] flex flex-col gap-2.5">
            <legend className="px-2 font-sans text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
              Constat matériel sur le terrain (Matricule brigade)
            </legend>

            <div className="p-2.5 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white text-xs text-black leading-relaxed shadow-inner font-mono">
              {statutRio.constat}
            </div>

            {/* FEEDBACK DE L'ARBITRAGE */}
            {rioFeedback && (
              <div
                className={`p-2.5 border text-xs flex flex-col gap-1 ${
                  rioFeedback.valide
                    ? "bg-[#eaf5ea] border-emerald-700 text-emerald-950 font-medium"
                    : "bg-[#fee2e2] border-red-700 text-red-950 font-medium"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-xs uppercase">
                  {rioFeedback.valide ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-700" />
                  )}
                  <span>
                    {rioFeedback.valide
                      ? "ARBITRAGE HOMOLOGUÉ"
                      : "ARBITRAGE DÉSAPPROUVÉ"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-800 font-sans">
                  {rioFeedback.explication}
                </div>
                <div className="font-bold text-xs mt-0.5 flex gap-3">
                  <span>
                    Prime : {rioFeedback.bonus >= 0 ? `+${rioFeedback.bonus}` : rioFeedback.bonus} €
                  </span>
                  <span>
                    Crédibilité : {rioFeedback.valide ? "+8%" : "-18%"}
                  </span>
                </div>
              </div>
            )}

            {/* CHOIX ARBITRAIRE FLOU VS VALIDATION */}
            {onTrancherRio && !rioDecision && (
              <div className="flex flex-col gap-2 mt-1">
                <div className="text-xs font-bold text-black">Arbitrage de l'officier d'instruction :</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onTrancherRio("flouter")}
                    className="xp-btn p-2.5 text-left text-xs font-bold text-black flex flex-col justify-between shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#b23a00]">1. Invoquer le flou opérationnel</span>
                      <EyeOff className="w-4 h-4 text-[#b23a00]" />
                    </div>
                    <span className="text-[11px] text-slate-700 font-normal">
                      Protéger le collègue. Déclarer le matricule masqué par le baudrier ou l'action.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTrancherRio("valider")}
                    className="xp-btn p-2.5 text-left text-xs font-bold text-black flex flex-col justify-between shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#0055ea]">2. Homologuer le matricule visible</span>
                      <Eye className="w-4 h-4 text-[#0055ea]" />
                    </div>
                    <span className="text-[11px] text-slate-700 font-normal">
                      Assumer la transparence si le matricule a déjà été capté et authentifié par les médias.
                    </span>
                  </button>
                </div>
              </div>
            )}

            {rioDecision && !rioFeedback && (
              <div className="p-2 bg-[#eaf5ff] border border-[#316ac5] text-xs text-[#003366] font-bold">
                ✓ Décision enregistrée : [{rioDecision.toUpperCase()}]. Le bordereau RIO est scellé.
              </div>
            )}

          </fieldset>
        ) : (
          <div className="p-6 text-center text-slate-600 text-xs border border-[#9c9a91] bg-white">
            Aucun litige relatif au matricule RIO n'a été soulevé sur cette procédure.
          </div>
        )}
      </div>

      <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-2.5 py-1 text-[11px] text-slate-700 flex justify-between">
        <span>Fichier National des RIO // Déontologie</span>
        <span className="text-black font-bold">CHEOPS-RIO v3.12</span>
      </div>
    </div>
  );
};
