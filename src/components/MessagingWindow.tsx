import React from "react";
import {
  MessageSquare,
  User,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Send,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Lock,
  ArrowDown,
  Radio,
  Share2,
  Key
} from "lucide-react";
import { ContactDiegetique, CONTACTS_DIEGETIQUES } from "../diegeticContacts";
import { Dossier } from "../dossiers";
import { soundFx } from "../services/soundFx";

interface MessagingWindowProps {
  activeContactId: string;
  onSelectContact: (id: string) => void;
  dossier: Dossier;
  rioInspecte: boolean;
  rioDecision?: "flouter" | "valider" | null;
  riposteDeclenchee: boolean;
  caviardagesCount: number;
  cameraNeutralisee: boolean;
  cameraDecision?: "neutralisee" | "conservee" | null;
  credibilite?: number;
  paxSociale: number;
  blames: number;
  primeTotale: number;
  fuiteFaite?: boolean;
  onTransmettreFuite?: () => void;
}

export const MessagingWindow: React.FC<MessagingWindowProps> = ({
  activeContactId,
  onSelectContact,
  dossier,
  rioInspecte,
  rioDecision = null,
  riposteDeclenchee,
  caviardagesCount,
  cameraNeutralisee,
  cameraDecision = null,
  credibilite = 85,
  paxSociale,
  blames,
  primeTotale,
  fuiteFaite = false,
  onTransmettreFuite,
}) => {
  const contact =
    CONTACTS_DIEGETIQUES.find((c) => c.id === activeContactId) ||
    CONTACTS_DIEGETIQUES[0];

  const messages = contact.messagesParDossier(dossier.id, {
    rio: rioInspecte,
    rioDecision,
    riposte: riposteDeclenchee,
    caviardage: caviardagesCount,
    camera: cameraNeutralisee,
    cameraDecision,
    credibilite,
    fuiteFaite,
  });

  return (
    <div className="flex flex-col h-full min-h-0 text-black select-none overflow-hidden font-sans bg-[#ece9d8]">
      
      {/* BANDEAU SUPÉRIEUR TÉLEX // MESSAGERIE D'ÉTAT (STYLE WINDOWS MESSENGER XP) */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2.5 py-1 flex items-center justify-between shrink-0 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#d4d0c8] border border-[#808080] flex items-center justify-center text-xs shadow-xs">
            💬
          </div>
          <span className="font-bold text-black tracking-wide truncate">
            Messagerie Intranet CHEOPS // Canaux Officiels
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-600 text-[10px]">CHEOPS-MSG v2.4</span>
          <span className="text-emerald-700 text-[10px] font-bold hidden sm:inline">● Connecté</span>
        </div>
      </div>

      {/* SÉLECTEUR DE CONTACTS EN DIRECT (STYLE ONGLETS WIN32 TABS AUTHENTIQUES) */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2 pt-1 flex gap-1 overflow-x-auto shrink-0">
        {CONTACTS_DIEGETIQUES.map((c) => {
          const isSelected = c.id === activeContactId;
          const isDissident = c.id === "sorel";
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                soundFx.playUiClick();
                onSelectContact(c.id);
              }}
              className={`px-3 py-1 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border-t border-l border-r rounded-t-sm ${
                isSelected
                  ? isDissident
                    ? "bg-[#fff0f5] text-rose-950 border-[#808080] -mb-px pb-1.5 shadow-xs font-bold"
                    : "bg-white text-black border-[#808080] -mb-px pb-1.5 shadow-xs font-bold"
                  : isDissident
                  ? "bg-[#f5e6ec] text-rose-900 border-[#9c9a91] hover:bg-[#faedf2]"
                  : "bg-[#e4e1d1] text-slate-700 border-[#9c9a91] hover:bg-[#ede9db]"
              }`}
            >
              <span>{c.avatarEmoji}</span>
              <span className="truncate max-w-[125px]">{c.nom}</span>
              {isDissident && (
                <span className="text-[9px] bg-rose-700 text-white px-1 py-0.2 font-bold uppercase rounded-none">
                  TOR
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* PROFIL DU CONTACT ACTIF (BANDEAU WIN32 EN-TÊTE DISCUSSION) */}
      <div className={`p-2 flex items-center gap-2.5 shrink-0 border-b border-[#9c9a91] ${
        contact.id === "sorel" 
          ? "bg-[#fff0f5]" 
          : "bg-[#f5f3ec]"
      }`}>
        <div className={`w-8 h-8 border-2 flex items-center justify-center text-base shrink-0 shadow-inner ${
          contact.id === "sorel"
            ? "bg-white border-rose-600"
            : "bg-white border-[#316ac5]"
        }`}>
          <span>{contact.avatarEmoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-black font-bold text-xs sm:text-sm truncate flex items-center gap-2">
            <span>{contact.nom}</span>
            {contact.id === "sorel" && (
              <span className="text-[9px] bg-rose-700 text-white px-1 py-0.2 font-bold">
                CANAL CLANDESTIN TOR
              </span>
            )}
          </div>
          <div className={`text-xs truncate ${
            contact.id === "sorel" ? "text-rose-800 font-semibold" : "text-slate-600"
          }`}>
            {contact.role}
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end text-[10px] text-slate-600 shrink-0 font-mono">
          <span>IP: <strong className="text-black">{contact.ip}</strong></span>
          <span className={`font-bold ${contact.id === "sorel" ? "text-rose-700" : "text-emerald-700"}`}>
            ● {contact.statut}
          </span>
        </div>
      </div>

      {/* FIL DE DISCUSSION DU CHAT INSTANTANÉ (CADRE ENFONCÉ FOND BLANC STYLE MESSENGER) */}
      <div
        onWheel={() => soundFx.playScrollTick()}
        className="flex-1 min-h-0 p-3 overflow-y-auto space-y-2 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white m-1 shadow-inner"
      >
        {/* Titre du dossier en cours */}
        <div className="text-center my-0.5">
          <span className="text-slate-600 text-[11px] font-bold bg-[#ece9d8] px-2.5 py-0.5 border border-[#9c9a91]">
            Affaire en cours : #{dossier.id.toUpperCase()}
          </span>
        </div>

        {messages.map((texte, idx) => (
          <div
            key={idx}
            className={`p-2 text-xs leading-relaxed border ${
              contact.id === "sorel"
                ? "bg-[#fff8fa] border-rose-300 text-black border-l-4 border-l-rose-600"
                : "bg-[#f8fafd] border-[#d2dfef] text-black border-l-4 border-l-[#316ac5]"
            }`}
          >
            <div className="flex items-center justify-between mb-0.5 pb-0.5 border-b border-slate-200 text-[11px]">
              <span className={`font-bold uppercase tracking-wider flex items-center gap-1 ${
                contact.id === "sorel" ? "text-rose-800" : "text-[#215dc6]"
              }`}>
                <span>{contact.nom}</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                08:{24 + idx}:12
              </span>
            </div>
            <p className="whitespace-pre-line font-normal text-xs sm:text-sm text-black">
              « {texte} »
            </p>
          </div>
        ))}
      </div>

      {/* PIED DU CHAT : OPTION OFFICIELLE VS ACTION DE RÉSISTANCE DISSIDENTE */}
      {contact.id === "sorel" ? (
        <div className="bg-[#fff0f5] border-t border-rose-300 p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <Radio className="w-4 h-4 text-rose-700 shrink-0" />
            <div>
              <div className="text-rose-950 font-bold uppercase tracking-wide text-xs">
                CANAL CLANDESTIN SOREL // DISSIDENCE & PRESSE
              </div>
              <div className="text-[11px] text-slate-700">
                {fuiteFaite
                  ? "✓ Éléments bruts non caviardés transmis au Collectif Vérité."
                  : "Faire fuiter la minute intégrale et les rushs vidéo sans caviardage."}
              </div>
            </div>
          </div>
          {fuiteFaite ? (
            <div className="px-2.5 py-1 bg-[#eaf5ea] border border-emerald-700 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>FUITE TRANSMISE AVEC SUCCÈS</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onTransmettreFuite) {
                  onTransmettreFuite();
                }
              }}
              className="xp-btn text-rose-900 font-bold flex items-center justify-center gap-1.5 shrink-0"
            >
              <Radio className="w-3.5 h-3.5 text-rose-700" />
              <span>Transmettre la fuite secrète</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#ece9d8] border-t border-[#9c9a91] p-1.5 flex items-center gap-2 shrink-0">
          <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2 py-1 text-xs text-black flex items-center justify-between shadow-inner">
            <span className="text-slate-600 truncate">« Reçu 5/5, application stricte de l'Art. L. 435-1 CSI »</span>
            <span className="text-[10px] text-emerald-700 font-bold uppercase shrink-0">CANAL OUVERT</span>
          </div>
          <button
            type="button"
            disabled
            className="xp-btn text-xs text-slate-500 opacity-50 cursor-not-allowed flex items-center gap-1"
            title="Réponse assermentée"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Envoyer</span>
          </button>
        </div>
      )}

    </div>
  );
};
