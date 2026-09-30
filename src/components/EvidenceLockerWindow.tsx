import React from "react";
import { Package, ArrowRightLeft, ShieldAlert, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { Dossier } from "../dossiers";
import { soundFx } from "../services/soundFx";

interface EvidenceLockerWindowProps {
  dossier: Dossier;
  substitutionsFaites: Set<string>;
  onSubstituerScelle: (pieceASubstituer: any) => void;
  onClose?: () => void;
}

export const EvidenceLockerWindow: React.FC<EvidenceLockerWindowProps> = ({
  dossier,
  substitutionsFaites,
  onSubstituerScelle,
  onClose,
}) => {
  const piece = dossier.pieceASubstituer;
  const estSubstitue = piece ? substitutionsFaites.has(piece.id) : false;

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-sans text-black select-none overflow-hidden">
      {/* BANDEAU GREFFE DES SCELLÉS */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2.5 py-1 flex items-center justify-between shrink-0 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#d4d0c8] border border-[#808080] flex items-center justify-center text-xs shadow-xs">
            📦
          </div>
          <span className="font-bold text-black text-xs sm:text-sm uppercase tracking-wide truncate">
            Casier des Pièces à Conviction & Scellés // #{dossier.id}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-slate-700 bg-white px-2 py-0.5 border border-[#808080] font-mono">
            DÉPÔT JUDICIAIRE OPJ
          </span>
        </div>
      </div>

      {/* CORPS DU GREFFE */}
      <div
        onWheel={() => soundFx.playScrollTick()}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3"
      >
        <div className="border border-[#9c9a91] bg-white p-2.5 text-xs text-black leading-relaxed shadow-inner">
          <strong className="text-black">Règlement de conservation des scellés :</strong> Si un objet saisi sur les lieux contredit la thèse d'une agression physique caractérisée, le protocole autorise une substitution matérielle préalable à la transmission au Parquet.
        </div>

        {piece ? (
          <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff] flex flex-col gap-3">
            <legend className="px-2 font-sans text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
              Scellé Consigné #{piece.id}
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white shadow-inner">
                <div className="text-rose-900 text-[10px] font-bold uppercase mb-0.5">
                  Objet actuellement dans le sac :
                </div>
                <div className="font-bold text-black text-sm">
                  {piece.scelleCompromettant}
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Nature : {piece.scelleType}
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white shadow-inner">
                <div className="text-emerald-900 text-[10px] font-bold uppercase mb-0.5">
                  Substitut ministériel préparé :
                </div>
                <div className="font-bold text-emerald-800 text-sm">
                  {piece.substitutOfficiel}
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Justification : {piece.justificationDoctrine}
                </div>
              </div>
            </div>

            {estSubstitue ? (
              <div className="bg-[#eaf5ea] border border-emerald-700 p-2.5 text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-emerald-900 text-xs sm:text-sm uppercase">
                  Substitution effectuée avec succès (+{piece.primeBonus} €)
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onSubstituerScelle(piece)}
                className="w-full xp-btn py-2 text-xs sm:text-sm font-bold text-[#003366] flex items-center justify-center gap-2 shadow-xs"
              >
                <ArrowRightLeft className="w-4 h-4 text-slate-700" />
                <span>Procéder à la substitution dans le sac des scellés (+{piece.primeBonus} €)</span>
              </button>
            )}
          </fieldset>
        ) : (
          <div className="p-6 text-center text-slate-600 text-xs border border-[#9c9a91] bg-white">
            Aucun scellé compromettant à substituer pour cette procédure. Les pièces consignées sont conformes.
          </div>
        )}
      </div>

      <div className="bg-[#ece9d8] border-t border-[#9c9a91] px-2.5 py-1 text-[11px] text-slate-700 flex justify-between">
        <span>Magasin des scellés de justice // Cellule balistique</span>
        <span className="text-black font-bold">CHEOPS-SCELLÉ v3.12</span>
      </div>
    </div>
  );
};
