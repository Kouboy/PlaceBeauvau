import React from "react";
import {
  Radio,
  Clock,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { soundFx } from "../services/soundFx";

export interface TelegramAlert {
  id: string;
  source: "CABINET DU MINISTRE" | "IGPN DÉONTOLOGIE" | "SYNDICAT ALLIANCE" | "PARQUET DE BOBIGNY" | "GREFFE & STATISTIQUES" | string;
  message: string;
  timestamp: string;
  priority: "urgente" | "sanction" | "consigne";
}

interface TelegramBannerToastProps {
  alert: TelegramAlert | null;
  onDismiss: () => void;
}

export const TelegramBannerToast: React.FC<TelegramBannerToastProps> = ({
  alert,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: -18 }}
          animate={{
            opacity: 1,
            y: [-18, 2, -1, 0],
          }}
          exit={{ opacity: 0, y: -12 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
            times: [0, 0.65, 0.88, 1],
          }}
          className="fixed top-14 right-4 z-50 max-w-sm sm:max-w-md w-full font-mono text-xs shadow-2xl rounded-xs select-none"
        >
          <div
            className={`border-3 p-3 text-white backdrop-blur-md relative overflow-hidden ${
              alert.priority === "sanction"
                ? "bg-[#2b0808]/95 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                : alert.priority === "urgente"
                ? "bg-[#2b1704]/95 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                : "bg-[#061e33]/95 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
            }`}
          >
            {/* EN-TÊTE DU TÉLÉGRAMME */}
            <div className="flex items-center justify-between border-b border-white/20 pb-1.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-black tracking-wider uppercase text-xs flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-300" />
                  <span>TÉLÉGRAMME CRYPTÉ // {alert.source}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playUiClick();
                  onDismiss();
                }}
                className="p-0.5 hover:bg-white/20 rounded-xs text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CONTENU */}
            <div className="text-slate-100 font-bold leading-relaxed mb-2 text-xs sm:text-sm">
              « {typeof alert.message === "string" ? alert.message : (alert.message as any)?.alerte || JSON.stringify(alert.message)} »
            </div>

            {/* PIED AVEC HORODATAGE */}
            <div className="flex items-center justify-between text-[10px] text-slate-300/80 pt-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>REÇU À : {alert.timestamp}</span>
              </span>
              <span className="text-amber-300 font-bold uppercase tracking-wider">
                DIFFUSION MINISTÉRIELLE RESTREINTE
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
