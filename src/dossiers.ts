import imgCctvStreet from "./assets/images/cctv_street_arrest_1789202267680.jpg";
import imgPressBatonSidewalk from "./assets/images/protest_baton_sidewalk_1789206737693.jpg";
import imgCctvTraffic from "./assets/images/cctv_traffic_check_1789202295508.jpg";
import imgCctvCustody from "./assets/images/cctv_custody_corridor_1789202308481.jpg";
import imgForensicBoot from "./assets/images/police_boot_forensic_1789206752761.jpg";
import imgStudentCctv from "./assets/images/student_cctv_street_1789206768613.jpg";
import imgSmokeBurst from "./assets/images/smoke_dispersal_burst_1789206782138.jpg";
import imgPressProtest from "./assets/images/press_protest_scene_1789202282512.jpg";
import imgPoliceVanBlocked from "./assets/images/police_van_blocked_street_1789206802674.jpg";

export type CategorieInfraction = 'impunite' | 'victimisation' | 'mauvaise_foi';

export interface TamponOption {
  code: CategorieInfraction;
  label: string;
  sousTitre: string;
  raccourci: string;
}

export const TAMPONS_DISPONIBLES: TamponOption[] = [
  {
    code: 'impunite',
    label: 'NON-LIEU // USAGE CONFORME',
    sousTitre: 'JUSTIFICATION DE L\'USAGE DE LA FORCE - ART. L. 435-1 CSI',
    raccourci: '1'
  },
  {
    code: 'victimisation',
    label: 'VIOLENCES SUR DÉPOSITAIRE',
    sousTitre: 'ACTION RÉCURSOIRE & CONSTITUTION DE PARTIE CIVILE',
    raccourci: '2'
  },
  {
    code: 'mauvaise_foi',
    label: 'ENTRAVE & TAPAGE ILLICITE',
    sousTitre: 'TROUBLE MATÉRIEL À L\'EXÉCUTION DU SERVICE',
    raccourci: '3'
  }
];

export interface PieceVisuelle {
  url: string;
  type: 'cctv' | 'presse';
  reference: string;
  horodatage: string;
}

export interface TelegrammePrefet {
  titre: string;
  alerte: string;
  ordre: string;
  primeBonus: number;
}

export interface IncidentCamera {
  intitule: string;
  actionBouton: string;
  doitEtreNeutralisee: boolean; // true si compromettante pour les policiers, false si elle innocente ou prouve l'infraction du suspect
  explicationBonneDecision: string;
  explicationErreur: string;
  rapportOfficiel: string;
}

export interface NovlangueConversion {
  faitBrut: string;
  termeMinisteriel: string;
}

export interface TermeCaviarde {
  id: string;
  texteBrut: string;
  texteCensure: string;
  motifCensure: string;
  estCompromettant: boolean; // true = bavure/lésion grave à occulter ; false = charge contre le suspect qu'il faut absolument conserver
  impactErreur?: string;
}

export interface PieceASubstituer {
  id: string;
  scelleCompromettant: string;
  scelleType: string;
  substitutOfficiel: string;
  justificationDoctrine: string;
  primeBonus: number;
}

export interface ProfilageAdministre {
  identite: string;
  classeSociale: string;
  territoireZonage: string;
  faciesApparence: string;
  coefficientVulnerabilite: number; // 0 à 100%
  analyseRisqueJudiciaire: string;
  statutOQTFOuFichage?: string;
  capaciteContentieuse: string;
  conseilConstitue: string;
  expositionMediatique: string;
  solvabiliteProcedurale: string;
}

export interface StatutRio {
  constat: string;
  decision: string;
  bonneDecision: "flouter" | "valider"; // Est-ce une bonne chose d'invoquer le flou ou de valider le matricule public ?
  explicationBonneDecision: string;
  explicationErreur: string;
  primeBonus: number;
}

export interface RiposteOutrage {
  motifRiposte: string;
  qualificationsInverses: string[];
  primeRiposte: number;
}

export interface EquipementBoutique {
  id: string;
  nom: string;
  description: string;
  cout: number;
  icone: string;
  effetDescription: string;
}

export const BOUTIQUE_EQUIPEMENTS: EquipementBoutique[] = [
  {
    id: "flouteur_rio",
    nom: "Flouteur RIO Automatique v4",
    description: "Floute préventivement tout identifiant d'agent et entérine l'anonymat opérationnel.",
    cout: 65,
    icone: "🙈",
    effetDescription: "+25 € à chaque inspection du matricule RIO"
  },
  {
    id: "feutre_triple",
    nom: "Feutre Censeur Triple-Mine",
    description: "Fourniture ministérielle noire opaque pour biffer tous les termes médicaux d'un clic.",
    cout: 85,
    icone: "🖍️",
    effetDescription: "Bouton éclair 'TOUT CAVIARDER' débloqué"
  },
  {
    id: "cafe_syndical",
    nom: "Café Soluble 'Ordre & Progrès'",
    description: "Distributeur automatique de caféine pour compenser la cadence infernale du greffe.",
    cout: 50,
    icone: "☕",
    effetDescription: "+30 secondes de délai d'analyse par dossier"
  },
  {
    id: "riposte_systematique",
    nom: "Module 'Outrage Réflexe' Pro",
    description: "Générateur automatique de procès-verbal de rébellion en riposte à toute plainte.",
    cout: 95,
    icone: "⚡",
    effetDescription: "Multiplie par 2 les primes de contre-plainte (+70 €)"
  },
  {
    id: "immunite_blame",
    nom: "Note d'Exonération Ministérielle",
    description: "Signée en blanc par le sous-directeur, efface immédiatement 1 blâme disciplinaire.",
    cout: 110,
    icone: "🛡️",
    effetDescription: "Pardon immédiat d'un blâme ou protection d'erreur"
  }
];

export interface Dossier {
  id: string;
  faits: string;
  jargon_officiel: string;
  categorie_attendue: CategorieInfraction;
  tampon_imposé: string;
  justification_erreur: string;
  piece_visuelle: PieceVisuelle;
  telegrammePrefet?: TelegrammePrefet;
  incidentCamera?: IncidentCamera;
  novlangue?: NovlangueConversion;
  termesCaviardes?: TermeCaviarde[];
  pieceASubstituer?: PieceASubstituer;
  profilage: ProfilageAdministre;
  riposteOutrage?: RiposteOutrage;
  statutRio?: StatutRio;
}

export interface GradeInfo {
  echelon: number;
  titre: string;
  description: string;
  seuilDossiers: number;
  badge: string;
}

export const GRADES: GradeInfo[] = [
  {
    echelon: 1,
    titre: "Vacataire stagiaire aux contentieux",
    description: "Affecté au tri sommaire des requêtes embarrassantes.",
    seuilDossiers: 0,
    badge: "STAGE-75"
  },
  {
    echelon: 2,
    titre: "Rédacteur auxiliaire de l'apaisement",
    description: "Spécialisé en extinction procédurale accélérée et classement sans suite.",
    seuilDossiers: 3,
    badge: "BOPJ-R2"
  },
  {
    echelon: 3,
    titre: "Auditeur principal à l'inspection générale",
    description: "Expert certifié en défaillances techniques opportunes et non-imputabilité.",
    seuilDossiers: 7,
    badge: "IGPN-OFF"
  },
  {
    echelon: 4,
    titre: "Conseiller spécial au Cabinet Ministériel",
    description: "Architecte de la doctrine du zéro bavure statistique.",
    seuilDossiers: 11,
    badge: "MIN-CAB"
  }
];

export const ACTUALITES_CONTINU = [
  "BFM DIRECT : 'Le préfet salue l'immense sang-froid des fonctionnaires face à l'agitation des administrés'",
  "STATISTIQUES : Contrôles au faciès 20x plus fréquents pour les minorités visibles, confirme l'INSEE (rapport classé)",
  "PARIS 16e : Un notaire ivre reconduit avec déférence à son domicile après avoir cité le ministre de l'Intérieur",
  "COMMUNICATION MINISTÈRE : Un élément de langage a été stabilisé suite à l'arbitrage rendu sur l'Avenue Foch",
  "SEINE-SAINT-DENIS : 98,7% des plaintes pour violences classées sans audition des victimes, record d'efficacité",
  "COMMUNIQUÉ SYNDICAL : 'L'absence de matricule RIO relève de la simple pudeur administrative républicaine'",
  "PARQUET DE PARIS : Divergence relevée entre l'inventaire CHEOPS et les pièces produites par la défense",
  "AUDIT INTERNE DGPN : Une copie non expurgée semble avoir quitté le périmètre documentaire sécurisé",
  "CNEWS : 'Faut-il interdire aux administrés de porter plainte pour préserver le moral de nos troupes ?'",
  "CSU PARIS : Une rupture de séquence vidéo inexpliquée fait l'objet d'un signalement technique d'archive",
  "CABINET BEAUVAU : L'anonymisation d'un matricule contesté sur les réseaux fragilise la ligne de défense",
  "MINISTÈRE : Le progiciel CHEOPS pulvérise son record avec 99,8% d'apurements sans suite en 12 secondes",
  "DEFENSEUR DES DROITS : Les signalements de discrimination systémique versés directement au bac de recyclage",
  "TRIBUNAL : Un livreur à vélo percuté par un fourgon condamné pour dégradation de pare-choc sérigraphié"
];

export const dossiers: Dossier[] = [
  {
    id: "DOS-B75-1890",
    faits: "Un conducteur émet un avertissement sonore bref après une immobilisation de 45 minutes provoquée par le stationnement d'un fourgon de service devant une issue privée.",
    jargon_officiel: "Usage intempestif et prohibé d'un avertisseur sonore constituant une pression acoustique et une insubordination caractérisée envers des agents en mission.",
    categorie_attendue: "mauvaise_foi",
    tampon_imposé: "ENTRAVE & TAPAGE ILLICITE",
    justification_erreur: "L'actionnement d'un avertisseur sonore contre un équipage de police en pause opérationnelle constitue une infraction au code de la route et une insubordination.",
    profilage: {
      identite: "M. Ali Z., 42 ans, artisan électricien indépendant",
      classeSociale: "Petite bourgeoisie laborieuse issue de l'immigration",
      territoireZonage: "Zone artisanale de banlieue nord",
      faciesApparence: "Camionnette utilitaire chargée d'outils, consonance maghrébine",
      coefficientVulnerabilite: 89,
      analyseRisqueJudiciaire: "Administré riverain sans appui institutionnel. Contentieux contraventionnel ordinaire.",
      capaciteContentieuse: "FAIBLE",
      conseilConstitue: "NON IDENTIFIÉ",
      expositionMediatique: "BASSE",
      solvabiliteProcedurale: "CONFIRMÉE (ARTISAN)"
    },
    statutRio: {
      constat: "Équipage en pause café : gilets tactiques et RIO déposés sur les sièges du fourgon.",
      decision: "Légitime temps de réarmement psychologique. Aucune infraction déontologique constatée.",
      bonneDecision: "flouter",
      explicationBonneDecision: "PRÉFECTURE // Pause technique admise : l'interruption momentanée du port pendant la collation est reconnue conforme.",
      explicationErreur: "SYNDICAT // DÉFAUT DE CONFRATERNITÉ : L'assimilation d'une pause réglementaire à un manquement déontologique est réprouvée.",
      primeBonus: 20
    },
    novlangue: {
      faitBrut: "Coup de klaxon après 45 min de blocage privé",
      termeMinisteriel: "Pression acoustique prohibée et insubordination caractérisée"
    },
    piece_visuelle: {
      url: imgPoliceVanBlocked,
      type: "cctv",
      reference: "DISPOSITIF SURVEILLANCE CARREFOUR COMMERCIAL // CSU",
      horodatage: "13:05:18 REC"
    }
  },
  {
    id: "DOS-B75-1733",
    faits: "Le Brigadier Marc Vasseur (BST-4B) trébuche sur son bouclier individuel en tentant de rattraper un cycliste circulant à allure modérée, entraînant une entorse bénigne du genou.",
    jargon_officiel: "Mise en danger délibérée d'autrui et entrave à la circulation par manœuvre cycliste incitative ayant directement induit l'accident de service d'un agent assermenté.",
    categorie_attendue: "victimisation",
    tampon_imposé: "VIOLENCES SUR DÉPOSITAIRE",
    justification_erreur: "Le comportement de l'usager ayant causé l'accident de service de l'agent, le dossier doit être transmis au parquet pour mise en examen.",
    profilage: {
      identite: "M. Kevin L., 26 ans, intérimaire manutentionnaire",
      classeSociale: "Jeune classe ouvrière périurbaine",
      territoireZonage: "Rond-point d'entrée de ville de province",
      faciesApparence: "Gilet jaune sous la selle du vélo, tenue de travail usagée",
      coefficientVulnerabilite: 91,
      analyseRisqueJudiciaire: "Usage de vecteur cycliste en zone de barrage. Capacité d'action civile limitée.",
      capaciteContentieuse: "FAIBLE",
      conseilConstitue: "NON IDENTIFIÉ",
      expositionMediatique: "BASSE",
      solvabiliteProcedurale: "LIMITÉE"
    },
    statutRio: {
      constat: "RIO #754981 de Marc Vasseur présent et clairement lisible sur le baudrier.",
      decision: "Agent méritant blessé au devoir. Matricule consigné avec honneur.",
      bonneDecision: "valider",
      explicationBonneDecision: "PARQUET // Constitution de partie civile : l'identification nominative de l'agent est requise pour asseoir la demande d'indemnisation.",
      explicationErreur: "PARQUET // CONTRADICTION DE PROCÉDURE : Anonymiser l'agent qui réclame des dommages et intérêts paralyse l'action civile.",
      primeBonus: 20
    },
    novlangue: {
      faitBrut: "Agent qui trébuche seul sur son bouclier",
      termeMinisteriel: "Mise en danger délibérée par manœuvre cycliste incitative"
    },
    piece_visuelle: {
      url: imgPressProtest,
      type: "presse",
      reference: "DISPOSITIF MOBILE POLICE // FLUX D'ACTION",
      horodatage: "11:22:40 ARCHIVE"
    }
  },
  {
    id: "DOS-B75-2144",
    faits: "Un notaire et avocat d'affaires de 58 ans en état d'ébriété avancée grille deux feux rouges en Porsche Cayenne, insulte les motards et hurle 'Vous savez qui je connais à la Chancellerie ?!'.",
    jargon_officiel: "Dialogue feutré de régulation civique avec un citoyen contributif de haut rang. Clémence déontologique et reconduite bienveillante à l'hôtel particulier sans inscription TAJ.",
    categorie_attendue: "impunite",
    tampon_imposé: "NON-LIEU // USAGE CONFORME",
    justification_erreur: "L'apaisement républicain commande de ménager les corps intermédiaires et les élites économiques pour éviter l'engorgement inutile des tribunaux.",
    profilage: {
      identite: "Me Charles-Édouard de V., 58 ans, notaire associé",
      classeSociale: "Haute bourgeoisie du 16e arrondissement - Patrimoine > 8 M€",
      territoireZonage: "Avenue Foch - Secteur diplomatique et résidentiel protégé",
      faciesApparence: "Patronyme aristocratique, costume sur mesure en flanelle, montre de luxe",
      coefficientVulnerabilite: 4,
      analyseRisqueJudiciaire: "Solvabilité procédurale maximale. Conseil constitué auprès de cabinets d'affaires de premier rang. Capacité d'assignation en responsabilité quasi-immédiate.",
      capaciteContentieuse: "TRÈS ÉLEVÉE",
      conseilConstitue: "CABINET D'AFFAIRES ASSOCIÉ",
      expositionMediatique: "CONFIDENTIELLE",
      solvabiliteProcedurale: "CONFIRMÉE (FONDS PROPRES)"
    },
    statutRio: {
      constat: "Motards de police au garde-à-vous impeccable, RIO arboré avec zèle.",
      decision: "Reconnaissance spontanée du statut de l'usager. Salutations républicaines appuyées.",
      bonneDecision: "valider",
      explicationBonneDecision: "CABINET // Courtoisie républicaine respectée : la régularité du comportement des agents envers le justiciable est homologuée.",
      explicationErreur: "CABINET // MALADRESSE PROTOCOLAIRE : Déclarer un anonymat sur un équipage irréprochable crée une suspicion injustifiée.",
      primeBonus: 35
    },
    incidentCamera: {
      intitule: "VIDÉO DU CONTRÔLE MONTRANT LE NOTAIRE GRACIEUSEMENT RECONDUIT CHEZ LUI",
      actionBouton: "CONSERVER ET CLASSER LA VIDÉO COMME SERVICE D'HONNEUR RENDU",
      doitEtreNeutralisee: false, // LA VIDÉO PROUVE LA COURTOISIE ENVERS LE NOTAIRE
      explicationBonneDecision: "CABINET // Archivage conservatoire : la séquence atteste des égards et de la sérénité du raccompagnement.",
      explicationErreur: "CABINET // INCIDENT DIPLOMATIQUE : La dégradation d'un enregistrement attestant de la courtoisie des services suscite l'incompréhension.",
      rapportOfficiel: "Enregistrement de bienveillance civique versé aux archives privées."
    },
    novlangue: {
      faitBrut: "Notaire ivre insultant la police et menaçant de faire sauter leurs carrières",
      termeMinisteriel: "Dialogue feutré de régulation civique avec un citoyen contributif de haut rang"
    },
    termesCaviardes: [
      {
        id: "c-notaire-1",
        texteBrut: "en état d'ébriété avancée grille deux feux rouges",
        texteCensure: "trajectoire d'évitement fluide en contexte festif",
        motifCensure: "Délit routier d'un notable",
        estCompromettant: true
      },
      {
        id: "c-notaire-2",
        texteBrut: "hurle 'Vous savez qui je connais à la Chancellerie ?!'",
        texteCensure: "rappel constructif des liens institutionnels",
        motifCensure: "Trafic d'influence manifeste",
        estCompromettant: true
      },
      {
        id: "c-notaire-piege",
        texteBrut: "reconduite bienveillante à l'hôtel particulier sans inscription TAJ",
        texteCensure: "transport standard",
        motifCensure: "Mesure de raccompagnement déontologique",
        estCompromettant: false,
        impactErreur: "CABINET // DIPLOMATIE PROTOCOLAIRE FROISSÉE : L'effacement des marques de bienveillance désavoue l'arbitrage du ministre."
      }
    ],
    piece_visuelle: {
      url: imgCctvTraffic,
      type: "cctv",
      reference: "CAMÉRA ARRONLISSEMENT LUXE // BALAYAGE BOULEVARD",
      horodatage: "01:45:10 REC"
    }
  },
  {
    id: "DOS-B75-1502",
    faits: "Une étudiante projetée à terre par un balayage des membres inférieurs pousse des cris prolongés suite à une luxation acromio-claviculaire droite.",
    jargon_officiel: "Manifestations vocales stridentes et répétitives à fort volume acoustique, perturbant l'ordre public sonore et la sérénité des opérations de police.",
    categorie_attendue: "mauvaise_foi",
    tampon_imposé: "ENTRAVE & TAPAGE ILLICITE",
    justification_erreur: "Les émissions sonores excessives sur la voie publique au cours d'une mission de maintien de l'ordre constituent un tapage et une provocation.",
    profilage: {
      identite: "Mlle Manon R., 20 ans, étudiante en sociologie",
      classeSociale: "Petite classe moyenne intellectuelle en rupture",
      territoireZonage: "Quartier Latin - Abords d'université occupée",
      faciesApparence: "Pancarte en carton revendicative, mégaphone éteint",
      coefficientVulnerabilite: 85,
      analyseRisqueJudiciaire: "Milieu étudiant structuré. Risque de relais corporatif académique en cas de contentieux disciplinaire.",
      capaciteContentieuse: "MODÉRÉE",
      conseilConstitue: "COLLECTIF ÉTUDIANT & CONSEIL",
      expositionMediatique: "MODÉRÉE",
      solvabiliteProcedurale: "SOLIDARITÉ MILITANTE"
    },
    statutRio: {
      constat: "RIO retourné face velcro invisible.",
      decision: "Frottement fortuit lors du balayage tactique. Aucune charge retenue.",
      bonneDecision: "flouter",
      explicationBonneDecision: "PRÉFECTURE // Doctrine d'évacuation validée : l'incident est circonscrit aux nécessités de dégagement des voies.",
      explicationErreur: "SYNDICAT // RIGIDITÉ INOPPORTUNE : Exiger un repositionnement millimétrique fragilise le commandement opérationnel.",
      primeBonus: 20
    },
    novlangue: {
      faitBrut: "Cris de douleur suite à une luxation de l'épaule",
      termeMinisteriel: "Manifestations vocales stridentes troublant l'ordre public sonore"
    },
    piece_visuelle: {
      url: imgStudentCctv,
      type: "cctv",
      reference: "CENTRE DE SUPERVISION URBAIN // OPÉRATEUR 04",
      horodatage: "17:48:12 REC"
    }
  },
  {
    id: "DOS-B75-0942",
    faits: "Un passant reçoit un impact de bâton de défense à la tempe. S'effondrant sur le trottoir, il présente de vives convulsions musculaires consécutives au traumatisme.",
    jargon_officiel: "Agitation corporelle désordonnée et persistante sur le sol de la voie publique, entravant la libre circulation piétonne et mobilisant indûment les effectifs.",
    categorie_attendue: "mauvaise_foi",
    tampon_imposé: "ENTRAVE & TAPAGE ILLICITE",
    justification_erreur: "L'occupation corporelle non autorisée du sol public en zone passante constitue une entrave matérielle manifeste.",
    profilage: {
      identite: "M. Youssef B., 34 ans, travailleur intérimaire en logistique",
      classeSociale: "Prolétariat de périphérie urbaine",
      territoireZonage: "Quartier Politique de la Ville (QPV) - Vénissieux",
      faciesApparence: "Teint mat, jogging gris chiné, sac de courses d'une enseigne discount",
      coefficientVulnerabilite: 92,
      analyseRisqueJudiciaire: "Solvabilité procédurale restreinte. Absence de provision pour constitution de partie civile avec consignation.",
      capaciteContentieuse: "MODÉRÉE",
      conseilConstitue: "AIDE JURIDICTIONNELLE",
      expositionMediatique: "FORTE",
      solvabiliteProcedurale: "LIMITÉE"
    },
    statutRio: {
      constat: "Matricule RIO 7844192 photographié en gros plan par un reporter de Libération, publié en Une nationale.",
      decision: "Certification transparente : le matricule est de notoriété publique, le nier ridiculiserait le ministère.",
      bonneDecision: "valider",
      explicationBonneDecision: "PARQUET // Cohérence de l'action publique : l'identification étant déjà publique, la contestation du RIO aurait nui à l'accusation.",
      explicationErreur: "PARQUET // CONTRADICTION MANIFESTE : Invoquer l'anonymat sur un matricule déjà publié par la presse discrédite le mémoire.",
      primeBonus: 30
    },
    incidentCamera: {
      intitule: "CLICHÉ DE PRESSE EXTÉRIEUR VERSÉ AU PARQUET",
      actionBouton: "TENTER D'EFFACER LE CLICHÉ DE PRESSE INDÉPENDANT",
      doitEtreNeutralisee: false, // CLICHÉ EXTÉRIEUR QU'ON NE PEUT PAS EFFACER SANS SCANDALE
      explicationBonneDecision: "CABINET // Arbitrage médiatique : le cliché étant dans le domaine public, son maintien au dossier évite un soupçon d'entrave.",
      explicationErreur: "CABINET // RISQUE D'EMBRASEMENT MÉDIATIQUE : Déclarer une anomalie technique sur une pièce déjà diffusée expose l'institution.",
      rapportOfficiel: "Cliché extérieur non modifiable par nos services."
    },
    riposteOutrage: {
      motifRiposte: "Requalification de la crise convulsive en résistance physique active à l'interpellation.",
      qualificationsInverses: [
        "Occupation illicite du trottoir communal",
        "Entrave par projection corporelle au sol",
        "Refus d'obtempérer aux injonctions de se relever immédiatement"
      ],
      primeRiposte: 35
    },
    telegrammePrefet: {
      titre: "URGENCE CABINET PRÉFECTURE",
      alerte: "Équipes télévisées en direct sur le secteur. L'administré convulse sur le trottoir.",
      ordre: "Homologuer immédiatement en entrave matérielle au sol pour justifier l'intervention !",
      primeBonus: 85
    },
    novlangue: {
      faitBrut: "Passant matraqué à la tempe en convulsions",
      termeMinisteriel: "Agitation corporelle désordonnée et encombrement du sol public"
    },
    termesCaviardes: [
      {
        id: "c3",
        texteBrut: "impact de bâton de défense à la tempe",
        texteCensure: "contact circonscrit avec matériel de service",
        motifCensure: "Précision anatomique inopportune",
        estCompromettant: true
      },
      {
        id: "c_piege2",
        texteBrut: "entravant la libre circulation piétonne",
        texteCensure: "sans impact sur la voie",
        motifCensure: "Constat matériel d'occupation de l'espace public",
        estCompromettant: false,
        impactErreur: "PRÉFECTURE // ÉLÉMENT MATÉRIEL COMPROMIS : L'effacement de l'entrave au sol fragilise la qualification d'occupation illicite."
      }
    ],
    piece_visuelle: {
      url: imgPressBatonSidewalk,
      type: "presse",
      reference: "CLICHÉ DE PRESSE QUOTIDIEN // PIÈCE VERSÉE AU PARQUET",
      horodatage: "18:24 ARCHIVE"
    }
  },
  {
    id: "DOS-B75-1108",
    faits: "Interpellation par le Brigadier Marc Vasseur (BST-4B, RIO #754981). Le fonctionnaire présente une fracture du cinquième métacarpien suite à une frappe directe portée à la mâchoire de Bilal M., immobilisé au sol.",
    jargon_officiel: "Interposition cinétique brutale de la structure maxillo-faciale de l'administré ayant causé une incapacité totale de travail de 21 jours au Brigadier Marc Vasseur.",
    categorie_attendue: "victimisation",
    tampon_imposé: "VIOLENCES SUR DÉPOSITAIRE",
    justification_erreur: "Toute blessure subie par un fonctionnaire au contact direct de l'administré caractérise des violences volontaires sur personne dépositaire de l'autorité.",
    profilage: {
      identite: "M. Bilal M., 19 ans, apprenti mécanicien automobile",
      classeSociale: "Jeunesse populaire précarisée",
      territoireZonage: "Zone urbaine sensible - Quartier des Bosquets (Montfermeil)",
      faciesApparence: "Miroir statistique : jeune homme racisé en groupe à un arrêt de bus",
      coefficientVulnerabilite: 98,
      analyseRisqueJudiciaire: "Contre-plainte incidente recevable : lésion métacarpienne constatée sur l'agent au cours de la manœuvre d'interposition.",
      capaciteContentieuse: "MODÉRÉE",
      conseilConstitue: "CABINET DÉSIGNÉ",
      expositionMediatique: "BASSE",
      solvabiliteProcedurale: "AIDE JURIDICTIONNELLE"
    },
    statutRio: {
      constat: "Matricule RIO #754981 de Marc Vasseur recouvert par l'insigne syndical non réglementaire.",
      decision: "Tolérance corporatiste bienveillante. Rappel déontologique sans suite.",
      bonneDecision: "flouter",
      explicationBonneDecision: "SYNDICAT // Ligne de corps respectée : la tolérance de port d'équipement couvre le brigadier Vasseur.",
      explicationErreur: "SYNDICAT // RUPTURE DE SOLIDARITÉ : L'exigence du matricule désavoue la doctrine locale de l'unité.",
      primeBonus: 25
    },
    incidentCamera: {
      intitule: "FLUX CCTV DU SAS MONTRE L'ALTERCATION PHYSIQUE DIRECTE AVEC MARC VASSEUR",
      actionBouton: "EFFACER LA VIDÉO PAR DÉFAILLANCE SERVEUR",
      doitEtreNeutralisee: false, // LA VIDÉO MONTRE LA RÉSISTANCE ET PROUVE L'INFRACTION DU SUSPECT !
      explicationBonneDecision: "PARQUET // Pièce à charge versée : la séquence corrobore l'agitation corporelle et soutient les 21 jours d'ITT réclamés.",
      explicationErreur: "PARQUET // PERTE D'UN ÉLÉMENT CHARGE : La destruction du flux prive l'accusation de la preuve matérielle de la rébellion.",
      rapportOfficiel: "Enregistrement versé comme pièce à conviction n°1."
    },
    novlangue: {
      faitBrut: "Coup de poing policier à la mâchoire",
      termeMinisteriel: "Interposition cinétique brutale de la structure faciale de l'usager"
    },
    termesCaviardes: [
      {
        id: "c_vrai_3",
        texteBrut: "suite à une frappe portée à la mâchoire de l'administré",
        texteCensure: "lors du contact cinétique involontaire",
        motifCensure: "Aveu de coup porté",
        estCompromettant: true
      },
      {
        id: "c_piege_3",
        texteBrut: "fracture du cinquième métacarpien du fonctionnaire",
        texteCensure: "douleur passagère",
        motifCensure: "Constat médico-légal de lésion en service",
        estCompromettant: false,
        impactErreur: "PARQUET // RÉQUISITOIRE AFFAIBLI : La suppression de la fracture de l'agent prive l'accusation du quantum de 21 jours d'ITT."
      }
    ],
    pieceASubstituer: {
      id: "sub-2",
      scelleCompromettant: "Enregistrement audio du fonctionnaire menaçant l'administré",
      scelleType: "Audio témoin",
      substitutOfficiel: "Procès-verbal de rébellion avec insultes répétées constatées",
      justificationDoctrine: "Remplacer la bande sonore non purgée par le PV d'audition type",
      primeBonus: 50
    },
    piece_visuelle: {
      url: imgCctvTraffic,
      type: "cctv",
      reference: "CAPTATION CAMÉRA FIXE CARREFOUR // FLUX SÉCURISÉ",
      horodatage: "02:15:33 REC"
    }
  },
  {
    id: "DOS-B75-2391",
    faits: "Un passant immobilisé sur un passage piéton soutient le regard d'un brigadier pendant 4,2 secondes avec une expression qualifiée de sourcilleuse, provocatrice et défiante.",
    jargon_officiel: "Agression visuelle prolongée et défi postural hostile constitutif d'une pression morale et d'une violence psychologique sur personne dépositaire de l'autorité.",
    categorie_attendue: "victimisation",
    tampon_imposé: "VIOLENCES SUR DÉPOSITAIRE",
    justification_erreur: "Le regard fixe et non déférent porte atteinte à l'intégrité morale du fonctionnaire et constitue une voie de fait passive.",
    profilage: {
      identite: "M. Thomas R., 31 ans, graphiste indépendant",
      classeSociale: "Petite bourgeoisie culturelle urbaine",
      territoireZonage: "Carrefour République / Voltaire",
      faciesApparence: "Lunettes rondes en écaille, écouteurs sans fil, fixité oculaire",
      coefficientVulnerabilite: 78,
      analyseRisqueJudiciaire: "Refus de soumission passive sans violence physique. Capacité de contestation procédurale résiduelle.",
      capaciteContentieuse: "MODÉRÉE",
      conseilConstitue: "NON IDENTIFIÉ",
      expositionMediatique: "BASSE",
      solvabiliteProcedurale: "CONFIRMÉE"
    },
    statutRio: {
      constat: "Brigadier Marc Vasseur présent, RIO #754981 bien visible sur le baudrier.",
      decision: "Attestation d'atteinte morale certifiée par la brigade pour préjudice d'anxiété.",
      bonneDecision: "valider",
      explicationBonneDecision: "PARQUET // Soutien de la demande indemnitaire : le matricule est certifié pour fonder la réquisition d'indemnisation de l'agent.",
      explicationErreur: "PARQUET // DÉFAUT D'IDENTIFICATION DU DEMANDEUR : L'anonymat fait obstacle à l'allocation des dommages et intérêts requis.",
      primeBonus: 20
    },
    riposteOutrage: {
      motifRiposte: "Outrage oculaire et rébellion silencieuse en récidive visuelle.",
      qualificationsInverses: [
        "Voie de fait visuelle sur dépositaire de l'autorité",
        "Pression psychologique par fixité oculaire hostile",
        "Atteinte au respect de la fonction républicaine par sourcillement"
      ],
      primeRiposte: 40
    },
    novlangue: {
      faitBrut: "Regard d'incompréhension de 4 secondes",
      termeMinisteriel: "Pression morale et violence psychologique oculaire hostile"
    },
    piece_visuelle: {
      url: imgStudentCctv,
      type: "cctv",
      reference: "CSU TRAFFIC CAM // AXE RÉPUBLIQUE",
      horodatage: "18:40:02 REC"
    }
  },
  {
    id: "DOS-B75-2011",
    faits: "Contrôle d'identité à répétition (8e fouille en 7 jours) d'un étudiant se rendant en cours à la Gare du Nord. Plaquage au sol violent suite à une demande polie du numéro RIO de l'agent.",
    jargon_officiel: "Vérification administrative préventive des flux voyageurs avec neutralisation physique d'une attitude défiante contestant la légitimité républicaine du contrôle.",
    categorie_attendue: "impunite",
    tampon_imposé: "NON-LIEU // USAGE CONFORME",
    justification_erreur: "La réitération de vérifications d'identité sur un même nœud de transit relève du pouvoir discrétionnaire du préfet. Demander le RIO caractérise l'insolence.",
    profilage: {
      identite: "M. Idriss K., 18 ans, étudiant boursier L1 Sciences",
      classeSociale: "Classe populaire urbaine, fils d'aide-soignante de nuit",
      territoireZonage: "Hub ferroviaire Gare du Nord (Filtre spatial sélectif)",
      faciesApparence: "Miroir sociologique : jeune homme noir, sac à dos d'études, écouteurs",
      coefficientVulnerabilite: 97,
      analyseRisqueJudiciaire: "Mobilisation de collectifs étudiants et constitution d'avocat. Présomption de régularité du contrôle contestée.",
      capaciteContentieuse: "MODÉRÉE",
      conseilConstitue: "CABINET CONSTITUÉ",
      expositionMediatique: "MODÉRÉE",
      solvabiliteProcedurale: "AIDE JURIDICTIONNELLE"
    },
    statutRio: {
      constat: "Emplacement RIO vide sur le gilet pare-balles de l'intervenant.",
      decision: "Demande du RIO assimilée à un acte d'hostilité envers le fonctionnaire. Homologation immédiate.",
      bonneDecision: "flouter",
      explicationBonneDecision: "PRÉFECTURE // Doctrine de fermeté : la contestation du contrôle par l'administré est écartée de la procédure.",
      explicationErreur: "SYNDICAT // DÉSAVEU HIÉRARCHIQUE : Exiger le port effectif du matricule lors d'un filtrage fragilise la brigade ferroviaire.",
      primeBonus: 25
    },
    incidentCamera: {
      intitule: "VIDÉO DU HALL MONTRANT LE SUSPECT QUI S'ARRÊTE SANS RÉSISTER",
      actionBouton: "PURGER LE FICHIER VIDÉO DE LA GARE",
      doitEtreNeutralisee: true,
      explicationBonneDecision: "PRÉFECTURE // Sécurisation du dossier : l'inaccessibilité de l'enregistrement confère plein effet probant au procès-verbal.",
      explicationErreur: "CABINET // DIVERGENCE PROBATOIRE : Le flux conservé infirme les mentions d'hostilité relevées dans le rapport.",
      rapportOfficiel: "Fichier corrompu au transfert réseau."
    },
    riposteOutrage: {
      motifRiposte: "Poursuite de l'étudiant pour insubordination et provocation envers l'autorité publique.",
      qualificationsInverses: [
        "Insolence caractérisée par demande d'identification policière",
        "Refus de soumission passive aux palpations de sécurité",
        "Trouble à l'ordre ferroviaire aux heures d'affluence"
      ],
      primeRiposte: 40
    },
    novlangue: {
      faitBrut: "8e contrôle au faciès de la semaine et plaquage pour avoir demandé le RIO",
      termeMinisteriel: "Neutralisation d'une posture défiante contestant la légitimité du contrôle"
    },
    termesCaviardes: [
      {
        id: "c-idriss-1",
        texteBrut: "Contrôle d'identité à répétition (8e fouille en 7 jours)",
        texteCensure: "vérification périodique habituelle de salubrité publique",
        motifCensure: "Mise en cause du profilage ethnique",
        estCompromettant: true
      },
      {
        id: "c-idriss-2",
        texteBrut: "demande polie du numéro RIO",
        texteCensure: "exigence procédurale provocatrice",
        motifCensure: "Légalité de l'obligation de port du RIO",
        estCompromettant: true
      },
      {
        id: "c-idriss-piege",
        texteBrut: "vérifications administratives des flux voyageurs",
        texteCensure: "errance des patrouilles",
        motifCensure: "Cadre légal de la réquisition préfectorale",
        estCompromettant: false,
        impactErreur: "CABINET // BASE JURIDIQUE SUPPRIMÉE : L'effacement du cadre administratif prive le contrôle en gare de sa régularité formelle."
      }
    ],
    piece_visuelle: {
      url: imgCctvStreet,
      type: "cctv",
      reference: "CAMÉRA SURVEILLANCE HALL GARE DU NORD // SÉCURITÉ-TRANSIT",
      horodatage: "08:14:22 REC"
    }
  },
  {
    id: "DOS-B75-0814",
    faits: "Interpellation par la BST-4B (Brigadier Marc Vasseur, RIO #754981). 4 fractures costales, traumatisme crânien et énucléation définitive suite à un tir de lanceur de balles de défense tendu à 2 mètres.",
    jargon_officiel: "Usage strictement nécessaire et proportionné des armes de dotation face à une posture manifestement non coopérative et hostile au dispositif de sécurité.",
    categorie_attendue: "impunite",
    tampon_imposé: "NON-LIEU // USAGE CONFORME",
    justification_erreur: "La graduation de la force publique est réputée conforme aux circulaires d'engagement. Le classement sans suite est de rigueur.",
    profilage: {
      identite: "M. Mamadou S., 22 ans, préparateur de commandes",
      classeSociale: "Précariat ouvrier - Zéro patrimoine",
      territoireZonage: "Zone de Sécurité Prioritaire (ZSP) - Seine-Saint-Denis (93)",
      faciesApparence: "Consonance extra-européenne, doudoune noire, capuche rabattue",
      coefficientVulnerabilite: 96,
      analyseRisqueJudiciaire: "Exposition médiatique nationale en cours. Absence de conseil constitué identifié malgré une forte visibilité publique. Capacité contentieuse personnelle évaluée comme faible.",
      capaciteContentieuse: "FAIBLE",
      conseilConstitue: "NON IDENTIFIÉ",
      expositionMediatique: "FORTE",
      solvabiliteProcedurale: "LIMITÉE"
    },
    statutRio: {
      constat: "Matricule RIO #754981 du Brigadier Marc Vasseur masqué par un ruban adhésif noir mat.",
      decision: "Tolérance d'anonymat opérationnel : protection syndicale contre la vindicte sur réseaux sociaux.",
      bonneDecision: "flouter",
      explicationBonneDecision: "IGPN // Protection de l'agent : l'anonymisation du matricule écarte le risque d'identification nominative.",
      explicationErreur: "SYNDICAT // DÉSAVEU DU FONCTIONNAIRE : La certification d'un matricule contesté fragilise la protection de l'équipage.",
      primeBonus: 30
    },
    incidentCamera: {
      intitule: "FLUX CCTV CAM-07 MONTRE LE BRIGADIER MARC VASSEUR VISER LE VISAGE",
      actionBouton: "DÉCLARER PANNE CARTE SD SUR LA CAM-07",
      doitEtreNeutralisee: true,
      explicationBonneDecision: "PRÉFECTURE // Incident technique validé : l'indisponibilité du flux CCTV clôt l'exploitation judiciaire des images.",
      explicationErreur: "PARQUET // TRANSMISSION COMPROMETTANTE : Le versement d'une trajectoire contestée place le Parquet en porte-à-faux.",
      rapportOfficiel: "Perte accidentelle de paquets vidéo suite à surtension électrique."
    },
    riposteOutrage: {
      motifRiposte: "Inversion procédurale : neutraliser la plainte pour borgne en poursuivant l'usager pour entrave.",
      qualificationsInverses: [
        "Rébellion armée par jet de regard défiant",
        "Outrage à personne dépositaire de l'autorité publique",
        "Mise en danger d'autrui par projection de débris organiques"
      ],
      primeRiposte: 35
    },
    novlangue: {
      faitBrut: "Tir de LBD dans la tête & 4 côtes brisées",
      termeMinisteriel: "Usage d'armes de dotation face à posture non coopérative"
    },
    termesCaviardes: [
      {
        id: "c1",
        texteBrut: "4 fractures costales",
        texteCensure: "légères contusions thoraciques bénignes",
        motifCensure: "Éléments médicaux anxiogènes",
        estCompromettant: true
      },
      {
        id: "c2",
        texteBrut: "perte d'acuité visuelle permanente",
        texteCensure: "fatigue oculaire transitoire",
        motifCensure: "Diagnostic chirurgical alarmiste",
        estCompromettant: true
      },
      {
        id: "c_piege1",
        texteBrut: "posture manifestement non coopérative et hostile",
        texteCensure: "absence d'agitation",
        motifCensure: "Caractérisation de la menace immédiate",
        estCompromettant: false,
        impactErreur: "PARQUET // COHÉRENCE DU MÉMOIRE DÉGRADÉE : La mention biffée constituait le fondement légal de la justification du tir."
      }
    ],
    pieceASubstituer: {
      id: "sub-1",
      scelleCompromettant: "Certificat médical d'urgence de l'Hôtel-Dieu (60 jours d'ITT)",
      scelleType: "Avis médical",
      substitutOfficiel: "Attestation de conformité balistique certifiée conforme au LBD-40",
      justificationDoctrine: "Substituer l'ITT civile par la conformité industrielle de l'arme",
      primeBonus: 40
    },
    piece_visuelle: {
      url: imgCctvStreet,
      type: "cctv",
      reference: "EXTRAIT VIDÉOPROTECTION VOIE PUBLIQUE // CAM-07",
      horodatage: "23:41:09 REC"
    }
  },
  {
    id: "DOS-B75-2104",
    faits: "Lors d'une perquisition matinale sans suite, un équipage de la BAC s'approprie l'intégralité du présentoir de croissants et chocolatines d'un artisan boulanger sans émargement financier.",
    jargon_officiel: "Réquisition conservatoire de denrées glucidiques d'urgence au titre du maintien impératif de la glycémie opérationnelle des forces engagées en milieu hostile.",
    categorie_attendue: "impunite",
    tampon_imposé: "NON-LIEU // USAGE CONFORME",
    justification_erreur: "La préservation du potentiel calorique des effectifs engagés prévaut sur le droit de propriété commerciale ordinaire (Directive CHEOPS n° 2104).",
    profilage: {
      identite: "M. Jean-Luc B., 54 ans, artisan boulanger Meilleur Ouvrier de France",
      classeSociale: "Petite bourgeoisie artisanale indépendante",
      territoireZonage: "Centre-ville commerçant sous tension tarifaire",
      faciesApparence: "Tablier enfariné, posture outrée, réclame un bon de réquisition en vain",
      coefficientVulnerabilite: 62,
      analyseRisqueJudiciaire: "Acteur du commerce de proximité. Exposition médiatique locale circonscrite.",
      capaciteContentieuse: "ÉLEVÉE",
      conseilConstitue: "FÉDÉRATION PROFESSIONNELLE",
      expositionMediatique: "MODÉRÉE",
      solvabiliteProcedurale: "CONFIRMÉE"
    },
    statutRio: {
      constat: "Équipage en civil, brassards police dans la poche arrière et absence totale de matricule RIO.",
      decision: "Discrétion tactique alimentaire. Aucune faute déontologique retenue.",
      bonneDecision: "flouter",
      explicationBonneDecision: "IGPN // Discrétion opérationnelle : l'anonymisation de l'équipage en mission de soutien logistique est validée.",
      explicationErreur: "CABINET // DIVULGATION INOPPORTUNE : L'identification publique de l'équipage expose le service à un préjudice d'image.",
      primeBonus: 20
    },
    termesCaviardes: [
      {
        id: "c_viennoiseries",
        texteBrut: "saisie brute de 24 chocolatines sans indemnisation",
        texteCensure: "prélèvement conservatoire de glucides tactiques d'appoint",
        motifCensure: "qualification de pillage à écarter d'office",
        estCompromettant: true
      },
      {
        id: "c_menace_hygiene",
        texteBrut: "boulanger menacé d'un contrôle d'hygiène inopiné",
        texteCensure: "sensibilisation pédagogique aux normes sanitaires d'État",
        motifCensure: "intimidation caractérisée à occulter",
        estCompromettant: true
      },
      {
        id: "c_farine_fraude",
        texteBrut: "sac de farine T65 conforme et traçable",
        texteCensure: "matière pulvérulente blanche d'origine indéterminée",
        motifCensure: "Bordereau de traçabilité des matières premières",
        estCompromettant: false,
        impactErreur: "PRÉFECTURE // ÉLÉMENT CONSTATÉ DÉNATURÉ : La traçabilité de la farine écartait tout soupçon de produit illicite."
      }
    ],
    pieceASubstituer: {
      id: "sub_croissant",
      scelleCompromettant: "Ticket de caisse n° 481 réclamant 38,40 € TTC non réglés",
      scelleType: "Facture impayée",
      substitutOfficiel: "Reçu de don spontané au profit des œuvres sociales de la brigade",
      justificationDoctrine: "Substitue la créance commerciale par un acte de solidarité citoyenne républicaine.",
      primeBonus: 30
    },
    telegrammePrefet: {
      titre: "URGENCE DIRECTEUR DU CABINET // BEAUVAU",
      alerte: "Le syndicat de la boulangerie menace de suspendre les livraisons du commissariat central.",
      ordre: "Homologuer immédiatement en exercice de réquisition d'urgence vitale !",
      primeBonus: 60
    },
    riposteOutrage: {
      motifRiposte: "Outrage et refus d'obtempérer par réclamation pécuniaire intempestive en temps de service.",
      qualificationsInverses: [
        "Trouble à l'approvisionnement des forces d'intervention",
        "Refus de solidarité républicaine alimentaire",
        "Outrage à la tenue par dénigrement de l'appétit de service"
      ],
      primeRiposte: 35
    },
    novlangue: {
      faitBrut: "Emportement de 24 viennoiseries sans payer",
      termeMinisteriel: "Réquisition conservatoire de denrées glucidiques d'urgence"
    },
    piece_visuelle: {
      url: imgPoliceVanBlocked,
      type: "cctv",
      reference: "CAMÉRA SURVEILLANCE BOULANGERIE DU PARC // CSU",
      horodatage: "06:45:12 REC"
    }
  },
  {
    id: "DOS-B75-1389",
    faits: "Une requérante blessée au cuir chevelu par dispersion lacrymogène projette des écoulements sanguins abondants sur le pantalon et les brodequins d'un gradé.",
    jargon_officiel: "Dégradation délibérée d'effets d'habillement administratifs par projection de substances biologiques et exposition de l'agent à un risque sanitaire non régulé.",
    categorie_attendue: "victimisation",
    tampon_imposé: "VIOLENCES SUR DÉPOSITAIRE",
    justification_erreur: "L'altération des effets de service par des fluides organiques justifie des poursuites pour dégradation de matériel public et violences indirectes.",
    profilage: {
      identite: "Mme Leila H., 27 ans, infirmière en milieu hospitalier public",
      classeSociale: "Fonction publique hospitalière précarisée",
      territoireZonage: "Boulevard de l'Hôpital - Cortège syndical soignant",
      faciesApparence: "Blouse blanche tâchée, badge syndical CGT-Santé",
      coefficientVulnerabilite: 88,
      analyseRisqueJudiciaire: "Affiliation syndicale déclarée. Conseil habituel d'organisation présent au soutien de la mise en cause.",
      capaciteContentieuse: "ÉLEVÉE",
      conseilConstitue: "CONSEIL SYNDICAL DÉSIGNÉ",
      expositionMediatique: "MODÉRÉE",
      solvabiliteProcedurale: "COUVERTURE SYNDICALE"
    },
    statutRio: {
      constat: "Le gradé ne porte pas de RIO (insigne de compagnie d'intervention dissimulant le scratch).",
      decision: "Conformité d'ensemble du maintien de l'ordre. Extinction du grief.",
      bonneDecision: "flouter",
      explicationBonneDecision: "IGPN // Primauté de l'identification collective : l'appartenance à la compagnie d'intervention est réputée suffisante.",
      explicationErreur: "SYNDICAT // CONTESTATION D'UNITÉ : Remettre en cause l'affichage de compagnie méconnaît l'esprit de corps.",
      primeBonus: 20
    },
    riposteOutrage: {
      motifRiposte: "Demande de remboursement intégral de l'uniforme et poursuites pour violences par arme par destination (sang humain).",
      qualificationsInverses: [
        "Projection de fluide biologique sur agent assermenté",
        "Dégradation grave d'effets vestimentaires d'État",
        "Participation à un groupement en vue de commettre des violences"
      ],
      primeRiposte: 35
    },
    novlangue: {
      faitBrut: "Sang de la manifestante blessée sur l'uniforme",
      termeMinisteriel: "Projection délibérée de substances biologiques sur effets d'habillement"
    },
    piece_visuelle: {
      url: imgForensicBoot,
      type: "presse",
      reference: "PHOTOGRAPHIE SCIENTIFIQUE SCÈNE // CONSTAT EFFETS DE SERVICE",
      horodatage: "21:05 ARCHIVE"
    }
  },
  {
    id: "DOS-B75-2245",
    faits: "Lors d'une déambulation ministérielle, une retraitée fait tinter une casserole en inox avec une cuillère en bois, provoquant une gêne auditive alléguée chez trois officiers d'escorte.",
    jargon_officiel: "Émission réitérée d'ondes de choc acoustiques dirigées constituant un projectile sonore et une tentative d'altération de la vigilance d'escorte.",
    categorie_attendue: "mauvaise_foi",
    tampon_imposé: "ENTRAVE & TAPAGE ILLICITE",
    justification_erreur: "Le tintement rythmé d'un ustensile ménager en zone de périmètre de sécurité est assimilable à un trouble majeur à l'ordre public.",
    profilage: {
      identite: "Mme Monique D., 68 ans, institutrice honoraire retraitée",
      classeSociale: "Retraitée de la fonction publique d'État (Éducation nationale)",
      territoireZonage: "Quartier préfectoral sous arrêté d'interdiction de rassemblement",
      faciesApparence: "Imperméable beige, sac cabas à roulettes, casserole Tefal 24cm",
      coefficientVulnerabilite: 88,
      analyseRisqueJudiciaire: "Retraitée isolée. Solvabilité et appui procédural inexistants.",
      capaciteContentieuse: "FAIBLE",
      conseilConstitue: "NON IDENTIFIÉ",
      expositionMediatique: "MODÉRÉE",
      solvabiliteProcedurale: "LIMITÉE"
    },
    statutRio: {
      constat: "Officiers de sécurité en costume civil sans matricule RIO apparent.",
      decision: "Protection rapprochée VIP : exemption déontologique de port de matricule.",
      bonneDecision: "flouter",
      explicationBonneDecision: "CABINET // Sécurité des escortes : l'anonymat des fonctionnaires affectés à la protection ministérielle est impératif.",
      explicationErreur: "CABINET // ATTEINTE AU PROTOCOLE DE SÉCURITÉ : La levée d'anonymat sur le détachement de protection compromet le dispositif.",
      primeBonus: 20
    },
    incidentCamera: {
      intitule: "CAPTATION VIDÉO : CASSEROLADE CITOYENNE",
      actionBouton: "REQUALIFIER EN ATTENTAT ACOUSTIQUE CONCERTÉ",
      doitEtreNeutralisee: true,
      explicationBonneDecision: "PRÉFECTURE // Neutralisation du support : l'inadéquation de la captation brute aux standards de présentation est actée.",
      explicationErreur: "CABINET // PRÉJUDICE D'IMAGE INSTITUTIONNEL : Le maintien d'un flux manifestement disproportionné dessert l'autorité préfectorale.",
      rapportOfficiel: "Incident neutralisé, ustensile placé sous scellé sonore de discrétion."
    },
    novlangue: {
      faitBrut: "Coup de cuillère en bois sur une casserole",
      termeMinisteriel: "Projection d'ondes de choc acoustiques dirigées"
    },
    piece_visuelle: {
      url: imgPressProtest,
      type: "presse",
      reference: "PHOTOJOURNALISME INDÉPENDANT // CORDON DE SÉCURITÉ",
      horodatage: "14:15:30 ARCHIVE"
    }
  },
  {
    id: "DOS-B75-1620",
    faits: "Déclenchement d'une munition de désencerclement au dos d'un manifestant marchant à distance du cordon de sécurité, causant une perforation cutanée et une surdité partielle.",
    jargon_officiel: "Réaction d'anticipation tactique face à une manœuvre d'esquive équivoque susceptible de dissimuler la réorganisation d'un groupe hostile à revers.",
    categorie_attendue: "impunite",
    tampon_imposé: "NON-LIEU // USAGE CONFORME",
    justification_erreur: "L'appréciation du risque par les fonctionnaires sur le terrain prévaut. L'opportunité des poursuites pénales est formellement écartée.",
    profilage: {
      identite: "M. Ahmed T., 29 ans, livreur à vélo sans papiers régularisés",
      classeSociale: "Sous-prolétariat sans statut juridique",
      territoireZonage: "Place de la République - En périphérie de manifestation",
      faciesApparence: "Vélo de livraison, consonance nord-africaine",
      coefficientVulnerabilite: 100,
      analyseRisqueJudiciaire: "Situation administrative précaire. Faiblesse structurelle de la représentation judiciaire.",
      capaciteContentieuse: "FAIBLE",
      conseilConstitue: "PERMANENCE ASSOCIATIVE (LDH)",
      expositionMediatique: "FORTE",
      solvabiliteProcedurale: "LIMITÉE"
    },
    statutRio: {
      constat: "Tireur non identifiable (cagoule intégrale et visière pare-éclats fumée).",
      decision: "L'impossibilité d'identifier l'auteur individuel protège l'institution : non-lieu d'office pour auteur inconnu.",
      bonneDecision: "flouter",
      explicationBonneDecision: "PARQUET // Classement contre inconnu : l'impossibilité d'individualiser le tireur oriente vers une extinction de l'action publique.",
      explicationErreur: "CABINET // FRAGILISATION DU DISPOSITIF : L'individualisation d'un tir de barrage compromet l'ensemble de la manœuvre.",
      primeBonus: 35
    },
    incidentCamera: {
      intitule: "CAPTATION CITOYENNE EN LIGNE SUR RÉSEAUX SOCIAUX",
      actionBouton: "SIGNIFICATION DE MISE EN DEMEURE PHAROS (RETRAIT CONSERVATOIRE)",
      doitEtreNeutralisee: true,
      explicationBonneDecision: "SERVICE TECHNIQUE // Signalement PHAROS enregistré : limitation de la diffusion non contextuelle sur les réseaux.",
      explicationErreur: "CABINET // DÉFAUT DE VEILLE NUMÉRIQUE : L'absence de signalement laisse prospérer une lecture unilatérale de l'événement.",
      rapportOfficiel: "Procédure d'injonction numérique enclenchée auprès des hébergeurs."
    },
    telegrammePrefet: {
      titre: "URGENCE DIRECTEUR GÉNÉRAL DE POLICE",
      alerte: "Vidéo devenue virale à 800 000 vues. Polémique politique au Parlement.",
      ordre: "Homologuer sans délai en manœuvre d'esquive hostile pour clore le débat !",
      primeBonus: 100
    },
    novlangue: {
      faitBrut: "Grenade de désencerclement tirée dans le dos",
      termeMinisteriel: "Anticipation tactique face à une manœuvre d'esquive équivoque"
    },
    piece_visuelle: {
      url: imgSmokeBurst,
      type: "presse",
      reference: "AGENCE DE PRESSE INDÉPENDANTE // ANGLE DISPOSITIF",
      horodatage: "19:30 ARCHIVE"
    }
  },
  {
    id: "DOS-B75-1247",
    faits: "Décès d'Adama D. par asphyxie positionnelle lors d'un maintien prolongé en décubitus ventral dans le sas de garde à vue, sous la direction du Brigadier Marc Vasseur. Les enregistrements vidéo du poste sont inaccessibles par anomalie technique.",
    jargon_officiel: "Défaillance cardio-respiratoire autonome intervenue de manière concomitante aux manœuvres de contention réglementaire. Absence de lien de causalité juridique établi.",
    categorie_attendue: "impunite",
    tampon_imposé: "NON-LIEU // USAGE CONFORME",
    justification_erreur: "En l'absence de charges objectives imputables à l'intervention, la cause médicale autonome emporte la clôture immédiate de la procédure.",
    profilage: {
      identite: "M. Adama D., 24 ans, livreur de repas indépendant",
      classeSociale: "Sous-prolétariat ubérisé, travailleur immigré sans capital",
      territoireZonage: "Secteur de gare RER Nord - Zone d'opérations quotidiennes",
      faciesApparence: "Consonance ouest-africaine, sac isotherme sur le dos",
      coefficientVulnerabilite: 99,
      analyseRisqueJudiciaire: "Sensibilité procédurale : relais associatif et familial en cours de mobilisation. Antécédents cardiorespiratoires à verser au débat médico-légal.",
      capaciteContentieuse: "ÉLEVÉE",
      conseilConstitue: "COLLECTIF & CONSEIL CONSTITUÉS",
      expositionMediatique: "FORTE",
      solvabiliteProcedurale: "PRISE EN CHARGE ASSOCIATIVE"
    },
    statutRio: {
      constat: "Les 4 fonctionnaires intervenants étaient dépourvus de dossard RIO.",
      decision: "Tenue d'intervention allégée pour motif de confort thermique. Aucune faute retenue.",
      bonneDecision: "flouter",
      explicationBonneDecision: "PRÉFECTURE // Protection fonctionnelle confirmée : l'anonymat opérationnel des intervenants est entériné.",
      explicationErreur: "PRÉFECTURE // CONSTAT DE NÉGLIGENCE ÉVITABLE : La certification de matricules absents met en cause l'encadrement.",
      primeBonus: 30
    },
    incidentCamera: {
      intitule: "FLUX VIDÉO DU SAS DE CELLULE MONTRE L'AGONIE PAR ASYPHYXIE SOUS LE POIDS DES AGENTS",
      actionBouton: "CERTIFIER L'ANOMALIE MATÉRIELLE TOTALE (CARTE SD HS)",
      doitEtreNeutralisee: true,
      explicationBonneDecision: "CABINET // Gestion de crise : l'interruption du signal vidéo préserve la cohérence de la version médicale officielle.",
      explicationErreur: "PARQUET // VULNÉRABILITÉ CONTENTIEUSE EXTRÊME : Les images transmises réfutent directement les conclusions d'enquête.",
      rapportOfficiel: "Perte accidentelle des paquets vidéo constatée sur le serveur d'archivage local."
    },
    telegrammePrefet: {
      titre: "DÉPÊCHE PRIORITAIRE ÉLYSÉE // PLACE BEAUVAU",
      alerte: "Saisine du procureur de permanence imminente. Rumeurs d'asphyxie en cellule.",
      ordre: "Extinction immédiate de la poursuite pénale sous visa médical autonome !",
      primeBonus: 120
    },
    novlangue: {
      faitBrut: "Décès par étouffement au sol sous le poids des agents",
      termeMinisteriel: "Défaillance cardio-respiratoire autonome sans causalité établie"
    },
    termesCaviardes: [
      {
        id: "c4",
        texteBrut: "asphyxie positionnelle",
        texteCensure: "arythmie cardiovasculaire spontanée",
        motifCensure: "Allégation d'étouffement mécanique",
        estCompromettant: true
      },
      {
        id: "c5",
        texteBrut: "décubitus ventral",
        texteCensure: "posture d'apaisement allongée",
        motifCensure: "Position controversée",
        estCompromettant: true
      },
      {
        id: "c_piege4",
        texteBrut: "maintien prolongé de contention réglementaire",
        texteCensure: "gestes improvisés",
        motifCensure: "Protocole technique d'immobilisation",
        estCompromettant: false,
        impactErreur: "IGPN // CONFORMITÉ DU GESTE INTERROMPUE : Biffer la mention 'réglementaire' expose le geste de contention à une requalification pénale."
      }
    ],
    pieceASubstituer: {
      id: "sub-3",
      scelleCompromettant: "Rapport préliminaire du médecin légiste mentionnant des pétéchies pleurales",
      scelleType: "Autopsie brute",
      substitutOfficiel: "Rapport d'expertise de synthèse concluant à un malaise vagal préexistant",
      justificationDoctrine: "Substituer le pré-rapport ambigu par l'expertise contradictoire d'apaisement",
      primeBonus: 75
    },
    piece_visuelle: {
      url: imgCctvCustody,
      type: "cctv",
      reference: "SAS DE GARDE À VUE // ARCHIVAGE INCIDENT TECHNIQUE",
      horodatage: "03:12:00 [FLUX PERDU]"
    }
  }
];
