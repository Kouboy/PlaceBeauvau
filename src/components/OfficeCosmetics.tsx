import React, { useState } from "react";
import {
  Coffee,
  Shield,
  FileWarning,
  X,
  Award
} from "lucide-react";
import { soundFx } from "../services/soundFx";

interface OfficeCosmeticsProps {
  isOpen: boolean;
  onClose: () => void;
  onBoireCafe?: () => void;
}

export const OfficeCosmetics: React.FC<OfficeCosmeticsProps> = ({
  isOpen,
  onClose,
  onBoireCafe,
}) => {
  const [cafePris, setCafePris] = useState(false);
  const [repliqueCafe, setRepliqueCafe] = useState<string | null>(null);

  if (!isOpen) return null;

  const citationsCafe = [
    "« La caféine du commissariat : 90% chicorée, 10% serment républicain. »",
    "« Un café noir sans sucre pour digérer la dernière circulaire du Ministre. »",
    "« Vigilance accrue : +10 points de clairvoyance procédurale. »",
    "« Plus de café, moins d'états d'âme pour classer sans suite. »"
  ];

  const handleDrink = () => {
    soundFx.playCoffeeSip();
    setCafePris(true);
    const cite = citationsCafe[Math.floor(Math.random() * citationsCafe.length)];
    setRepliqueCafe(cite);
    if (onBoireCafe) onBoireCafe();
    setTimeout(() => {
      setRepliqueCafe(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 font-sans select-none">
      <div className="bg-[#ece9d8] border-3 border-[#0055ea] max-w-2xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-t-lg rounded-b-xs overflow-hidden flex flex-col">
        {/* BARRE DE TITRE XP LUNA */}
        <div className="xp-titlebar-active h-7.5 px-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm">☕</span>
            <span className="font-bold text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Directives Opérationnelles du Commissariat & Pause Café — CHEOPS
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFx.playWindowClose();
              onClose();
            }}
            className="xp-btn-close w-5 h-5 flex items-center justify-center text-white text-xs font-bold rounded-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* CORPS DE LA BOÎTE WIN32 */}
        <div className="p-3 sm:p-4 space-y-3 text-black">
          {/* BANDEAU SUPÉRIEUR PAUSE CAFÉ */}
          <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2.5 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#ece9d8] border border-[#9c9a91] flex items-center justify-center text-2xl shadow-xs">
                ☕
              </div>
              <div>
                <div className="font-bold text-xs text-[#003366]">Percolateur du Service Contentieux</div>
                <div className="text-[11px] text-slate-600">
                  {repliqueCafe ? (
                    <span className="text-emerald-800 font-bold italic">{repliqueCafe}</span>
                  ) : (
                    "Boire une gorgée pour neutraliser le stress des quotas de rejet."
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDrink}
              className="xp-btn flex items-center gap-1.5 py-1 px-3"
            >
              <span>☕</span>
              <span>Prendre un café</span>
            </button>
          </div>

          {/* GROUPBOX DIRECTIVES OPÉRATIONNELLES */}
          <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff]">
            <legend className="px-1.5 font-bold text-xs text-[#003366] bg-[#ece9d8] border border-[#9c9a91]">
              Mémos de brigade du Major Christian Dupuis
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2">
              {/* NOTE SÉMANTIQUE */}
              <div className="bg-white border border-[#9c9a91] p-2.5 shadow-xs text-xs">
                <div className="font-bold text-[#990000] flex items-center gap-1.5 border-b border-[#e0dcd0] pb-1 mb-1.5">
                  <FileWarning className="w-3.5 h-3.5 text-[#cc0000]" />
                  <span>NOTE CADRE SÉMANTIQUE #2024-B</span>
                </div>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  Ne jamais écrire <strong className="text-red-700">« Tir dans le dos »</strong>. Utiliser le vocable officiel : <strong className="text-[#003366]">« Trajectoire balistique interceptant un vecteur d'échappée non maîtrisé »</strong>.
                </p>
              </div>

              {/* CONSIGNE CAMÉRA */}
              <div className="bg-white border border-[#9c9a91] p-2.5 shadow-xs text-xs">
                <div className="font-bold text-[#0055ea] flex items-center gap-1.5 border-b border-[#e0dcd0] pb-1 mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0055ea]" />
                  <span>CONSIGNE SYNDICALE D'APUREMENT</span>
                </div>
                <p className="text-slate-800 text-[11px] leading-relaxed">
                  Si la caméra de surveillance a filmé un incident fâcheux, actionnez la <strong className="text-[#0055ea]">DÉFAILLANCE CARTE SD</strong>. Un problème technique évite toute commission rogatoire !
                </p>
              </div>
            </div>
          </fieldset>

          {/* PIED DE BOÎTE DIALOGUE */}
          <div className="flex justify-end pt-2 border-t border-[#d8d4c4]">
            <button
              type="button"
              onClick={() => {
                soundFx.playUiClick();
                onClose();
              }}
              className="xp-btn min-w-20"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
