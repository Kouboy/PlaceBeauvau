import React from "react";
import {
  User,
  Search,
  Scale,
  ShieldAlert,
  AlertTriangle,
  Minus,
  Square,
  X,
  ChevronLeft,
  Layers,
  Fingerprint,
  MapPin,
  Briefcase,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Eye,
  Activity,
  Award
} from "lucide-react";
import { Dossier } from "../dossiers";
import { soundFx } from "../services/soundFx";

interface HumanDbWindowProps {
  dossier: Dossier;
  rioInspecte: boolean;
  rioDecision?: "flouter" | "valider" | null;
  onTrancherRio?: (decision: "flouter" | "valider") => void;
  rioFeedback?: { valide: boolean; explication: string; bonus: number } | null;
  onInspecterRio?: () => void;
  riposteDeclenchee: boolean;
  onRiposteOutrage: () => void;
  equipementsPossedes: Set<string>;
  onMinimize?: () => void;
  onClose?: () => void;
}

export const HumanDbWindow: React.FC<HumanDbWindowProps> = ({
  dossier,
  rioInspecte,
  rioDecision = null,
  onTrancherRio,
  rioFeedback = null,
  onInspecterRio,
  riposteDeclenchee,
  onRiposteOutrage,
  equipementsPossedes,
  onMinimize,
  onClose,
}) => {
  const p = dossier.profilage;

  // Extraction dynamique des données anthropométriques depuis l'identité et les faits du dossier
  const ageMatch = p.identite.match(/(\d{2})\s*ans/i);
  const ageAffiche = ageMatch ? `${ageMatch[1]} ANS` : "26 ANS";
  const estFemme = p.identite.toLowerCase().includes("mme") || p.identite.toLowerCase().includes("madame");
  
  // Variations dynamiques cohérentes selon le dossier
  const idHash = dossier.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tailleEstimee = 165 + (idHash % 25); // entre 1m65 et 1m89
  const poidsEstime = 55 + (idHash % 35); // entre 55kg et 89kg
  const yeuxOptions = ["MARRON FONCÉ", "NOIRS", "MARRON CLAIR", "BRUNS", "VERTS"];
  const yeuxChoisis = yeuxOptions[idHash % yeuxOptions.length];

  return (
    <div className="flex flex-col h-full min-h-0 text-black select-none overflow-hidden bg-[#ece9d8] font-sans">
      {/* BANDEAU SUPÉRIEUR FORENSIQUE HUMAN-DB */}
      <div className="bg-[#ece9d8] border-b border-[#9c9a91] px-2.5 py-1 flex items-center justify-between shrink-0 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#d4d0c8] border border-[#808080] flex items-center justify-center text-xs shadow-xs">
            👤
          </div>
          <span className="font-bold text-black tracking-wide truncate">
            Fichier TAJ // Traitement des Antécédents Judiciaires (SP2)
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-1.5 py-0.2 bg-white text-[10px] font-bold text-black border border-[#808080]">
            TAJ v4.8 OPJ
          </span>
          <span className="hidden sm:inline-block text-[10px] text-emerald-800 bg-white px-1.5 py-0.2 border border-[#808080] font-bold">
            ● Accès Nominatif Certifié
          </span>
        </div>
      </div>

      {/* BANDEAU SUPÉRIEUR DIÉGÉTIQUE */}
      <div className="bg-[#f5f3ec] border-b border-[#9c9a91] px-2.5 py-1 flex items-center justify-between shrink-0 text-xs text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
          <span className="text-[11px] font-medium">
            Liaison sécurisée DGPN - Préfecture de Police
          </span>
        </div>
        <span className="font-mono text-[11px] bg-white px-2 py-0.2 border border-[#9c9a91] font-bold text-black">
          Fiche N° {dossier.id.toUpperCase()}
        </span>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div
        onWheel={() => soundFx.playScrollTick()}
        className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 text-black"
      >
        
        {/* CARTE SIGNALÉTIQUE & PHOTO BIO-ID STYLE FICHE DE POLICE WIN32 */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff]">
          <legend className="px-2 font-sans text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
            Signalement & Anthropométrie Légale
          </legend>

          <div className="flex flex-col sm:flex-row gap-3 items-start mt-1">
            
            {/* PHOTO D'IDENTITÉ JUDICIAIRE AVEC CADRE ENFONCÉ */}
            <div className="w-24 h-32 sm:w-28 sm:h-36 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white shrink-0 relative flex flex-col items-center justify-center overflow-hidden shadow-inner mx-auto sm:mx-0">
              <div className="w-14 h-14 rounded-full bg-[#d4d0c8] border border-[#808080] flex items-center justify-center text-slate-600 shadow-xs">
                <User className="w-9 h-9" />
              </div>
              <div className="w-18 h-8 bg-[#d4d0c8] rounded-t-xl border-t border-[#808080] mt-1.5"></div>
              
              <div className="absolute bottom-0 inset-x-0 bg-[#0055ea] text-center text-[10px] text-white font-bold py-0.5 tracking-wider font-mono">
                TAJ CLICHÉ
              </div>
            </div>

            {/* DONNÉES D'IDENTITÉ */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#d0d0d0] pb-1.5 mb-2">
                <div>
                  <div className="text-[10px] text-slate-600 font-bold uppercase">
                    Identité enregistrée :
                  </div>
                  <h3 className="text-black font-bold text-base sm:text-lg uppercase">
                    {p.identite}
                  </h3>
                </div>
                <span className="text-xs bg-[#fee2e2] text-rose-950 px-2 py-0.5 border border-red-400 font-bold uppercase flex items-center gap-1 shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Plaignant Actif</span>
                </span>
              </div>

              {/* GRILLE ANTHROPOMÉTRIQUE CLAIRE */}
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <div className="bg-white p-1.5 border border-[#808080] shadow-inner">
                  <span className="text-slate-500 block text-[10px] font-bold">SEXE :</span>
                  <span className="text-black font-bold text-xs">{estFemme ? "FÉMININ" : "MASCULIN"}</span>
                </div>
                <div className="bg-white p-1.5 border border-[#808080] shadow-inner">
                  <span className="text-slate-500 block text-[10px] font-bold">ÂGE :</span>
                  <span className="text-black font-bold text-xs">{ageAffiche}</span>
                </div>
                <div className="bg-white p-1.5 border border-[#808080] shadow-inner">
                  <span className="text-slate-500 block text-[10px] font-bold">CARNATION :</span>
                  <span className="text-black font-bold text-xs truncate block">TYPE II (CIRC.)</span>
                </div>
                <div className="bg-white p-1.5 border border-[#808080] shadow-inner">
                  <span className="text-slate-500 block text-[10px] font-bold">YEUX :</span>
                  <span className="text-black font-bold text-xs">{yeuxChoisis}</span>
                </div>
                <div className="bg-white p-1.5 border border-[#808080] shadow-inner">
                  <span className="text-slate-500 block text-[10px] font-bold">TAILLE :</span>
                  <span className="text-black font-bold text-xs">{Math.floor(tailleEstimee / 100)}M {tailleEstimee % 100}</span>
                </div>
                <div className="bg-white p-1.5 border border-[#808080] shadow-inner">
                  <span className="text-slate-500 block text-[10px] font-bold">POIDS :</span>
                  <span className="text-black font-bold text-xs">{poidsEstime} KG</span>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* FACTEURS AGGRAVANTS & PROFIL SOCIO-JURIDIQUE */}
        <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff] space-y-2">
          <legend className="px-2 font-sans text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
            Profilage Doctrinal du Contentieux
          </legend>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-1.5 bg-white border border-[#d0d0d0]">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                <span>Classe sociale & revenus :</span>
              </span>
              <span className="text-black font-bold">{p.classeSociale}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-white border border-[#d0d0d0]">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sky-700" />
                <span>Zonage territoire :</span>
              </span>
              <span className="text-black font-bold">{p.territoireZonage}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-white border border-[#d0d0d0]">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-purple-700" />
                <span>Allure & vêtement :</span>
              </span>
              <span className="text-black font-bold">{p.faciesApparence}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-white border border-[#d0d0d0]">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-red-700" />
                <span>Antécédents d'enquête :</span>
              </span>
              <span className="text-red-800 font-bold">3 contestations // Fichier TAJ</span>
            </div>
          </div>

          {/* JAUGE DU COEFFICIENT DE VULNÉRABILITÉ JURIDIQUE */}
          <div className="pt-2 border-t border-[#d0d0d0] space-y-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-black font-bold flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#0055ea]" />
                <span>Indicateur d'exposition procédurale (CVJ) :</span>
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 border border-[#808080]">
                {p.coefficientVulnerabilite}%
              </span>
            </div>
            
            {/* Jauge visuelle Win32 */}
            <div className="w-full h-2.5 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full transition-all duration-500 bg-[#316ac5]"
                style={{ width: `${p.coefficientVulnerabilite}%` }}
              />
            </div>

            {/* ÉVALUATION ADMINISTRATIVE FROIDE SANS STRATÉGIE TÉLÉGRAPHIÉE */}
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono bg-white p-2 border border-[#d0d0d0]">
              <div>
                <span className="text-slate-500">CAPACITÉ CONTENTIEUSE : </span>
                <strong className="text-black">{p.capaciteContentieuse}</strong>
              </div>
              <div>
                <span className="text-slate-500">CONSEIL CONSTITUÉ : </span>
                <strong className="text-black">{p.conseilConstitue}</strong>
              </div>
              <div>
                <span className="text-slate-500">EXPOSITION MÉDIATIQUE : </span>
                <strong className="text-black">{p.expositionMediatique}</strong>
              </div>
              <div>
                <span className="text-slate-500">RESSOURCES PROCÉDURALES : </span>
                <strong className="text-black">{p.solvabiliteProcedurale}</strong>
              </div>
            </div>
            
            <p className="text-slate-700 italic text-xs leading-relaxed bg-white p-2 border border-[#d0d0d0]">
              « {p.analyseRisqueJudiciaire} »
            </p>
          </div>
        </fieldset>

        {/* MODULE D'ARBITRAGE DÉDUCTIF RIO & INVERSION JUDICIAIRE */}
        <div className="space-y-2.5">
          
          {/* MODULE D'ARBITRAGE DÉDUCTIF DU MATRICULE RIO */}
          {dossier.statutRio && (
            <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff] space-y-2">
              <legend className="px-2 font-sans text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
                Arbitrage du Matricule RIO // Déduction Requise
              </legend>

              {/* Constat objectif de la scène */}
              <div className="bg-white p-2 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white text-xs shadow-inner">
                <div className="text-amber-900 font-bold uppercase text-[10px] mb-0.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Constat matériel sur les images et le procès-verbal :</span>
                </div>
                <p className="text-black leading-relaxed">
                  « {dossier.statutRio.constat} »
                </p>
              </div>

              {/* Si une décision a déjà été prise : feedback institutionnel */}
              {rioDecision ? (
                <div
                  className={`p-2 border flex flex-col gap-1 text-xs ${
                    rioFeedback?.valide
                      ? "bg-[#eaf5ea] border-emerald-700 text-emerald-950"
                      : "bg-[#fee2e2] border-rose-700 text-rose-950"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold uppercase text-xs">
                    <span className="flex items-center gap-1.5">
                      {rioFeedback?.valide ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Arbitrage RIO homologué // Ligne préservée</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-700" />
                          <span>Arbitrage RIO contesté // Incident hiérarchique</span>
                        </>
                      )}
                    </span>
                    <span className="font-bold">
                      {rioFeedback?.bonus && rioFeedback.bonus > 0 ? `+${rioFeedback.bonus} €` : `${rioFeedback?.bonus || -40} €`}
                    </span>
                  </div>
                  <div className="text-slate-800 text-xs leading-relaxed">
                    {rioFeedback?.explication || (rioDecision === "flouter" ? "Anonymat accordé" : "Matricule homologué")}
                  </div>
                </div>
              ) : (
                /* Boutons XP-BTN */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    id="btn-rio-flouter"
                    onClick={() => {
                      if (onTrancherRio) onTrancherRio("flouter");
                      else if (onInspecterRio) onInspecterRio();
                    }}
                    className="xp-btn p-2 text-left text-xs font-bold text-black flex flex-col justify-between gap-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#b23a00]">🌫️ Déclarer le flou</span>
                      <span className="text-[10px] bg-slate-200 px-1 border border-slate-400">ANONYMAT</span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-normal">
                      Invoquer l'anonymat opérationnel et la protection syndicale
                    </div>
                  </button>

                  <button
                    type="button"
                    id="btn-rio-valider"
                    onClick={() => {
                      if (onTrancherRio) onTrancherRio("valider");
                      else if (onInspecterRio) onInspecterRio();
                    }}
                    className="xp-btn p-2 text-left text-xs font-bold text-black flex flex-col justify-between gap-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#0055ea]">👁️ Certifier conforme</span>
                      <span className="text-[10px] bg-slate-200 px-1 border border-slate-400">PUBLIC</span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-normal">
                      Assumer la conformité publique et la régularité du matricule
                    </div>
                  </button>
                </div>
              )}
            </fieldset>
          )}

          {/* FORMULAIRE CERFA D'INVERSION ACCUSATOIRE // CONTRE-PLAINTE D'OUTRAGE ET RÉBELLION */}
          {dossier.riposteOutrage && (
            <fieldset className="border border-[#9c9a91] bg-[#f4f2ec] p-3 pt-1 shadow-[inset_1px_1px_0_#fff]">
              <legend className="px-2 font-sans text-xs font-bold text-black uppercase bg-[#ece9d8] border border-[#9c9a91]">
                CERFA N°14820*04 // Riposte Incidente d'Outrage
              </legend>

              <div className="bg-white p-2 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white space-y-1 text-xs text-black mb-2 shadow-inner">
                <div className="text-[10px] font-bold text-red-800 uppercase mb-0.5">
                  Motifs de droit pré-cochés d'office par la doctrine :
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" checked readOnly className="rounded-none" />
                  <span>« Regard appuyé ayant altéré la quiétude républicaine de l'agent. »</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" checked readOnly className="rounded-none" />
                  <span>« Inertie physique corporelle constitutive de résistance passive délictuelle. »</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" checked readOnly className="rounded-none" />
                  <span>« Déclaration calomnieuse de blessure portant atteinte à l'image du corps préfectoral. »</span>
                </div>
              </div>

              {riposteDeclenchee ? (
                <div className="p-2 bg-[#eaf5ea] border border-emerald-700 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Contre-plainte enregistrée au parquet // Plainte victime caduque</span>
                  </div>
                  <span className="text-[11px] bg-white px-2 py-0.5 border border-emerald-600 font-mono font-bold text-emerald-800">
                    +{dossier.riposteOutrage.primeRiposte * (equipementsPossedes.has("riposte_systematique") ? 2 : 1)} €
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  id="btn-riposte-outrage"
                  onClick={onRiposteOutrage}
                  className="w-full xp-btn py-2 px-3 text-xs font-bold text-red-950 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-red-700" />
                    <span>Déposer la riposte incidente contre la victime</span>
                  </div>
                  <span className="text-black text-xs font-bold px-2 py-0.5 bg-white border border-[#808080] font-mono">
                    CERFA 14820*04
                  </span>
                </button>
              )}
            </fieldset>
          )}
        </div>

      </div>
    </div>
  );
};
