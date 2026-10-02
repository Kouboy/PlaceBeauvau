import { Dossier, dossiers } from "./dossiers";

export interface VirtualFile {
  id: string;
  name: string;
  extension: 'txt' | 'pdf' | 'doc' | 'cctv' | 'rio' | 'taj' | 'visa' | 'scelle' | 'telex' | 'exe' | 'msg';
  path: string;
  size: string;
  date: string;
  type: 'document' | 'video' | 'taj' | 'rio' | 'visa' | 'scelle' | 'caviardeur' | 'app' | 'telex' | 'msg';
  titre: string;
  auteur: string;
  classification: 'CONFIDENTIEL' | 'SECRET DÉFENSE' | 'USAGE INTERNE' | 'PIÈCE SOUS SCELLÉ' | 'DIFFUSION RESTREINTE' | 'ACTE PARQUET';
  content?: string;
  targetApp?: string;
  isCrucialClue?: boolean;
  clueHint?: string;
}

export interface VirtualFolder {
  id: string;
  name: string;
  path: string;
  description?: string;
  isNetworkShare?: boolean;
  serverName?: string;
  subfolders: VirtualFolder[];
  files: VirtualFile[];
}

export function getPrimaryCaseFile(currentDossier: Dossier): VirtualFile {
  const caseFolderId = currentDossier.id;
  return {
    id: `${caseFolderId}-pv-synthese`,
    name: "01_PV_SYNTHESE_INTERPELLATION.txt",
    extension: "txt",
    path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/01_PV_SYNTHESE_INTERPELLATION.txt`,
    size: "14.2 Ko",
    date: "Aujourd'hui 06:14",
    type: "document",
    titre: `PROCES-VERBAL DE SYNTHÈSE D'INTERVENTION #${caseFolderId}`,
    auteur: "Brigade Spécialisée BST-4B // Brigadier Marc Vasseur (RIO #754981)",
    classification: "DIFFUSION RESTREINTE",
    isCrucialClue: true,
    clueHint: "Version officielle de la brigade : faits bruts requalifiés selon la doctrine du maintien de l'ordre.",
    content: `================================================================================
RÉPUBLIQUE FRANÇAISE - MINISTÈRE DE L'INTÉRIEUR ET DES OUTRE-MER
DIRECTION GÉNÉRALE DE LA POLICE NATIONALE // DISTRICT DE SÉCURITÉ PUBLIQUE
--------------------------------------------------------------------------------
PROCÈS-VERBAL DE SYNTHÈSE D'INTERVENTION // RÉFÉRENCE : ${caseFolderId}
CHEF D'ÉQUIPAGE INTERVENANT : Brigadier Marc Vasseur (BST-4B // RIO #754981)
AGENT D'INSTRUCTION EN CHARGE : Matricule #7501923
--------------------------------------------------------------------------------

1. RAPPEL DES FAITS CONSTATÉS SUR LA VOIE PUBLIQUE :
${currentDossier.faits}

2. ÉLÉMENTS DE VOCABULAIRE RÉGLEMENTAIRE ET NOVLANGUE APPLICABLE :
${currentDossier.novlangue 
  ? `• Fait contesté : « ${currentDossier.novlangue.faitBrut} »\n• Qualification homologuée ministère : « ${currentDossier.novlangue.termeMinisteriel} »`
  : `• Application intégrale des directives de protection de la paix républicaine.`}

3. POSITIONNEMENT DE LA HIERARCHIE :
L'administration rappelle que toute défaillance physique consécutive à l'usage de la contrainte relève d'une fragilité physiologique préexistante ou d'un refus de se soumettre aux sommations d'usage du Brigadier Vasseur.

[BORDEREAU VERROUILLÉ - EN ATTENTE DU VISA DE QUALIFICATION DOCTRINALE]`
  };
}

export function generateFileSystemForDossier(currentDossier: Dossier, dossierIndex: number = 0): VirtualFolder {
  const caseFolderId = currentDossier.id;

  // Fichiers spécifiques au dossier en cours
  const caseFiles: VirtualFile[] = [
    getPrimaryCaseFile(currentDossier),
    {
      id: `${caseFolderId}-deposition-victime`,
      name: "02_DEPOSITION_ET_PLAINTES_ADMINISTRE.txt",
      extension: "txt",
      path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/02_DEPOSITION_ET_PLAINTES_ADMINISTRE.txt`,
      size: "8.7 Ko",
      date: "Aujourd'hui 07:45",
      type: "document",
      titre: `AUDITION DU REQUÉRANT // DÉPOSITION CONTRADICTOIRE #${caseFolderId}`,
      auteur: "Officier de Garde à Vue // Brigade d'Accueil",
      classification: "USAGE INTERNE",
      isCrucialClue: true,
      clueHint: "Déclarations du plaignant contestant les violences subies et l'absence de sommations.",
      content: `================================================================================
MINISTÈRE DE LA JUSTICE // REGISTRE DES DÉPOSITIONS D'AUDITIONS
COMPTE-RENDU DE CONTESTATION D'ACTE DE POLICE // RÉF : ${caseFolderId}
--------------------------------------------------------------------------------
DÉCLARANT : ${currentDossier.profilage.identite}
CLASSE SOCIALE / PROFIL : ${currentDossier.profilage.classeSociale}
ZONE D'INTERPELLATION : ${currentDossier.profilage.territoireZonage}
--------------------------------------------------------------------------------

DÉCLARATION SPONTANÉE DU COMPARANT :
« J'étais sur place sans aucune intention agressive. J'ai formellement reconnu le chef d'équipage : c'est le Brigadier Marc Vasseur, de la Brigade 4B. Il a masqué son matricule RIO avec du scotch noir pour ne pas être poursuivi. Avant même que j'aie pu reculer, j'ai reçu des coups et j'ai été projeté au sol. Mon téléphone a été écrasé sous sa botte. Je dépose plainte pour violences aggravées par personne dépositaire de l'autorité publique et destruction de preuve. »

NOTE DE L'OPJ ENCADRANT :
Le requérant met personnellement en cause le Brigadier Marc Vasseur. Procédure incidente d'outrage et rébellion recommandée pour neutraliser l'atteinte à l'image du fonctionnaire.`
    },
    {
      id: `${caseFolderId}-rapport-medical-umj`,
      name: "03_RAPPORT_MEDICO_LEGAL_UMJ.pdf",
      extension: "pdf",
      path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/03_RAPPORT_MEDICO_LEGAL_UMJ.pdf`,
      size: "24.5 Ko",
      date: "Aujourd'hui 08:30",
      type: "document",
      titre: `UNITÉ MÉDICO-JUDICIAIRE // CERTIFICAT DE CONSTATATIONS PHYSIQUES`,
      auteur: "Dr. V. Lambert // Médecin Légiste Praticien Hospitalier",
      classification: "CONFIDENTIEL",
      isCrucialClue: true,
      clueHint: "Contient les termes médicaux précis. Utilisez le Feutre Noir de Censure pour occulter les lésions graves !",
      content: `================================================================================
MINISTÈRE DE LA SANTÉ // UNITÉ MÉDICO-JUDICIAIRE (UMJ)
CERTIFICAT DE CONSTATATIONS DE COUPS ET BLESSURES // RÉF : ${caseFolderId}
--------------------------------------------------------------------------------
EXAMEN MÉDICAL RÉALISÉ SUR : ${currentDossier.profilage.identite}
--------------------------------------------------------------------------------

CONSTATATIONS CLINIQUES ET TRAUMATOLOGIQUES :
${currentDossier.termesCaviardes && currentDossier.termesCaviardes.length > 0 
  ? currentDossier.termesCaviardes.map((t, idx) => `[Lésion #${idx+1}] : ${t.texteBrut} (Diagnostic : ${t.motifCensure})`).join("\n")
  : `Traumatisme contondant et hématomes multiples constatés consécutifs à l'usage de la force physique.`}

CONCLUSIONS LÉGALES :
• Incapacité Totale de Travail (ITT) fixée à titre conservatoire.
• Pronostic sous réserve d'examens complémentaires.

RECOMMANDATION DE LA CELLULE JURIDIQUE :
Certaines descriptions médicales brutes sont de nature à émouvoir l'opinion ou à contredire le réquisitoire. L'utilisation du feutre censeur numérique est vivement recommandée pour préserver l'honneur de la corporation.`
    },
    {
      id: `${caseFolderId}-temoignages`,
      name: "04_EXTRAITS_TEMOIGNAGES_VOIE_PUBLIQUE.txt",
      extension: "txt",
      path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/04_EXTRAITS_TEMOIGNAGES_VOIE_PUBLIQUE.txt`,
      size: "6.1 Ko",
      date: "Aujourd'hui 08:50",
      type: "document",
      titre: `CONSIGNATION DE TÉMOIGNAGES COLLECTÉS SUR LE TERRAIN`,
      auteur: "Régie Enquêtes de Proximité",
      classification: "USAGE INTERNE",
      isCrucialClue: false,
      clueHint: "Témoignages de passants et journalistes indépendants présents sur les lieux.",
      content: `================================================================================
RÉSUMÉ ANALYTIQUE DES TÉMOIGNAGES RECOLTÉS SUR SITE : ${caseFolderId}
--------------------------------------------------------------------------------
TÉMOIN A (Passant de commerce) :
« La brigade a sommé la foule de reculer. Certains individus criaient des slogans. Le mouvement de foule a créé un choc violent. »

TÉMOIN B (Journaliste carte de presse) :
« L'action a été fulgurante. La caméra municipale située à l'angle du carrefour a tout capté. L'impact était direct sans sommation préalable audible. »

ANALYSE DISCIPLINAIRE :
Contradiction patente entre les témoignages de civils et le compte-rendu d'intervention. Seule la preuve vidéo homologuée et le visa préfectoral font foi devant le Tribunal Administratif.`
    },
    {
      id: `${caseFolderId}-flux-video-cctv`,
      name: "05_FLUX_SURVEILLANCE_CCTV_STREAM.cctv",
      extension: "cctv",
      path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/05_FLUX_SURVEILLANCE_CCTV_STREAM.cctv`,
      size: "184.2 Mo",
      date: "Aujourd'hui 06:12",
      type: "video",
      titre: `FLUX VIDÉO CAMÉRA PIÉTON // SURVEILLANCE VOIE PUBLIQUE`,
      auteur: "Unité CSU & Flux Tactiques",
      classification: "PIÈCE SOUS SCELLÉ",
      targetApp: "video",
      isCrucialClue: true,
      clueHint: "Enregistrement vidéo de l'intervention. Analysez si la vidéo doit être neutralisée ou versée comme preuve !",
      content: `FLUX VIDÉO CODÉ CHEOPS-MPEG4\nSOURCE : ${currentDossier.piece_visuelle.reference}\nHORODATAGE : ${currentDossier.piece_visuelle.horodatage}\nINCIDENT : ${currentDossier.incidentCamera ? currentDossier.incidentCamera.intitule : "Aucune anomalie déclarée"}`
    },
    {
      id: `${caseFolderId}-fiche-rio`,
      name: "06_REGISTRE_MATRICULE_RIO.rio",
      extension: "rio",
      path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/06_REGISTRE_MATRICULE_RIO.rio`,
      size: "3.4 Ko",
      date: "Aujourd'hui 06:05",
      type: "rio",
      titre: `CONTRÔLE DU MATRICULE RIO DE L'ÉQUIPAGE INTERVENANT`,
      auteur: "Inspection Générale des Services // Bureau Déontologie",
      classification: "CONFIDENTIEL",
      targetApp: "rio",
      isCrucialClue: true,
      clueHint: "Vérifiez si le matricule de l'agent était identifiable ou s'il faut invoquer le floutage d'anonymat.",
      content: currentDossier.statutRio ? `${currentDossier.statutRio.constat}\nDÉCISION DE PROTOCOLE : ${currentDossier.statutRio.decision}` : "Matricule vérifié conforme."
    },
    {
      id: `${caseFolderId}-scelle-piece`,
      name: "07_PIECE_A_CONVICTION_SCELLÉE.scelle",
      extension: "scelle",
      path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/07_PIECE_A_CONVICTION_SCELLÉE.scelle`,
      size: "1.2 Ko",
      date: "Aujourd'hui 06:40",
      type: "scelle",
      titre: `DÉPÔT DES SCELLÉS // PIÈCE MATÉRIELLE CONSIGNÉE`,
      auteur: "Greffe des Pièces à Conviction",
      classification: "PIÈCE SOUS SCELLÉ",
      targetApp: "scelles",
      isCrucialClue: Boolean(currentDossier.pieceASubstituer),
      clueHint: currentDossier.pieceASubstituer 
        ? `Pièce compromettante : « ${currentDossier.pieceASubstituer.scelleCompromettant} ». Procédez à la substitution dans l'armurerie !`
        : "Aucune substitution requise sur ce dossier.",
      content: currentDossier.pieceASubstituer 
        ? `SCELLÉ COMPROMETTANT : ${currentDossier.pieceASubstituer.scelleCompromettant}\nSUBSTITUT HOMOLOGUÉ : ${currentDossier.pieceASubstituer.substitutOfficiel}`
        : "Scellés conformes."
    },
    {
      id: `${caseFolderId}-bordereau-qualification`,
      name: "08_BORDEREAU_QUALIFICATION_OFFICIEL.visa",
      extension: "visa",
      path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/08_BORDEREAU_QUALIFICATION_OFFICIEL.visa`,
      size: "5.8 Ko",
      date: "En attente",
      type: "visa",
      titre: `BORDEREAU DE QUALIFICATION ET SIGNATURE DU VISA RÉGLEMENTAIRE`,
      auteur: "Direction des Affaires Juridiques // Beauvau",
      classification: "ACTE PARQUET",
      targetApp: "qualification",
      isCrucialClue: true,
      clueHint: "Application finale du tampon juridique (Non-lieu, Violences sur dépositaire, ou Entrave).",
      content: `BORDEREAU MINISTÉRIEL EN ATTENTE D'APPOSITION DU SCEAU D'ÉTAT POUR ${caseFolderId}.`
    }
  ];

  // Dossiers de l'arborescence
  const currentCaseFolder: VirtualFolder = {
    id: `folder-case-${caseFolderId}`,
    name: `${caseFolderId}_AFFAIRE_ACTIVE`,
    path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}`,
    description: `Dossier contentieux actif en cours d'instruction ministérielle (#${caseFolderId})`,
    subfolders: [],
    files: caseFiles
  };

  // Archives des affaires précédentes
  const archivesFiles: VirtualFile[] = dossiers.slice(0, Math.max(0, dossierIndex)).map((d, i) => ({
    id: `archive-${d.id}`,
    name: `DOSSIER_${d.id}_CLASSE_CONFORME.pdf`,
    extension: "pdf",
    path: `/C:/PROCEDURES_CONTENTIEUSES/ARCHIVES_CLASSEES/DOSSIER_${d.id}_CLASSE_CONFORME.pdf`,
    size: "18.4 Ko",
    date: `Affaire #${i+1}`,
    type: "document",
    titre: `DOSSIER ARCHIVÉ #${d.id} // APURÉ SANS SUITE`,
    auteur: "Bureau Central des Contentieux",
    classification: "DIFFUSION RESTREINTE",
    content: `DOSSIER NUMÉRO ${d.id}\nQUALIFICATION HOMOLOGUÉE : ${d.tampon_imposé}\nSTATUT : CLÔTURÉ DÉFINITIVEMENT.`
  }));

  const archivesFolder: VirtualFolder = {
    id: "folder-archives",
    name: "ARCHIVES_CLASSEES",
    path: "/C:/PROCEDURES_CONTENTIEUSES/ARCHIVES_CLASSEES",
    description: "Affaires antérieures définitivement apurées et classées sans suite",
    subfolders: [],
    files: archivesFiles
  };

  const enCoursFolder: VirtualFolder = {
    id: "folder-en-cours",
    name: "EN_COURS",
    path: "/C:/PROCEDURES_CONTENTIEUSES/EN_COURS",
    description: "Affaires contentieuses ouvertes requérant un arbitrage ministériel",
    subfolders: [currentCaseFolder],
    files: []
  };

  const proceduresFolder: VirtualFolder = {
    id: "folder-procedures",
    name: "01_PROCEDURES_CONTENTIEUSES",
    path: "/C:/PROCEDURES_CONTENTIEUSES",
    description: "Dossiers d'instruction et requêtes contre les forces de l'ordre",
    subfolders: [enCoursFolder, archivesFolder],
    files: []
  };

  // Outils administratifs du système
  const outilsSystemeFiles: VirtualFile[] = [
    {
      id: "app-visa",
      name: "Bordereau_Visa.exe",
      extension: "exe",
      path: "/C:/OUTILS_ADMINISTRATIFS/Bordereau_Visa.exe",
      size: "2.1 Mo",
      date: "Système",
      type: "app",
      titre: "BORDEREAU D'APUREMENT & SCEAUX RÉGLEMENTAIRES",
      auteur: "Ministère de l'Intérieur",
      classification: "USAGE INTERNE",
      targetApp: "qualification",
      content: "Exécutable officiel pour apposer le visa de qualification contentieuse."
    },
    {
      id: "app-video",
      name: "Lecteur_Video_CSU.exe",
      extension: "exe",
      path: "/C:/OUTILS_ADMINISTRATIFS/Lecteur_Video_CSU.exe",
      size: "4.8 Mo",
      date: "Système",
      type: "app",
      titre: "VISUALISEUR DE VIDÉOPROTECTION TACTIQUE",
      auteur: "Régie CSU",
      classification: "USAGE INTERNE",
      targetApp: "video",
      content: "Lecteur vidéo des flux caméras piétons et régie de défaillance SD."
    },
    {
      id: "app-caviardeur",
      name: "Feutre_Censeur_Pro.exe",
      extension: "exe",
      path: "/C:/OUTILS_ADMINISTRATIFS/Feutre_Censeur_Pro.exe",
      size: "1.4 Mo",
      date: "Système",
      type: "app",
      titre: "ATELIER DE CAVIARDAGE ET CENSURE MINISTÉRIELLE",
      auteur: "Secrétariat Général",
      classification: "USAGE INTERNE",
      targetApp: "caviardeur",
      content: "Outil de biffage numérique au feutre noir des certificats médicaux."
    },
    {
      id: "app-taj",
      name: "Interrogation_TAJ.exe",
      extension: "exe",
      path: "/C:/OUTILS_ADMINISTRATIFS/Interrogation_TAJ.exe",
      size: "3.6 Mo",
      date: "Système",
      type: "app",
      titre: "FICHIER DU TRAITEMENT DES ANTÉCÉDENTS JUDICIAIRES (TAJ)",
      auteur: "Police Judiciaire",
      classification: "CONFIDENTIEL",
      targetApp: "humandb",
      content: "Base de profilage biométrique, vulnérabilité et antécédents."
    },
    {
      id: "app-rio",
      name: "Controleur_RIO.exe",
      extension: "exe",
      path: "/C:/OUTILS_ADMINISTRATIFS/Controleur_RIO.exe",
      size: "1.1 Mo",
      date: "Système",
      type: "app",
      titre: "REGISTRE D'IDENTIFICATION OPÉRATIONNELLE DES AGENTS",
      auteur: "IGPN",
      classification: "USAGE INTERNE",
      targetApp: "rio",
      content: "Module de protection et floutage du matricule RIO."
    },
    {
      id: "app-scelles",
      name: "Armurerie_Scelles.exe",
      extension: "exe",
      path: "/C:/OUTILS_ADMINISTRATIFS/Armurerie_Scelles.exe",
      size: "1.8 Mo",
      date: "Système",
      type: "app",
      titre: "CASIER DES SCELLÉS ET SUBSTITUTIONS MATÉRIELLES",
      auteur: "Greffe Judiciaire",
      classification: "USAGE INTERNE",
      targetApp: "scelles",
      content: "Gestionnaire de scellés pour échanger les pièces compromettantes."
    }
  ];

  const outilsFolder: VirtualFolder = {
    id: "folder-outils",
    name: "02_OUTILS_ADMINISTRATIFS",
    path: "/C:/OUTILS_ADMINISTRATIFS",
    description: "Applications certifiées d'apurement et de qualification juridique",
    subfolders: [],
    files: outilsSystemeFiles
  };

  const cDrive: VirtualFolder = {
    id: "drive-c",
    name: "Ce PC (Disque local C:)",
    path: "/C:",
    description: "Disque système sécurisé du poste de travail ministériel",
    subfolders: [proceduresFolder, outilsFolder],
    files: []
  };

  // PARTAGES RÉSEAU INTRANET
  // 1. Beauvau Cabinet & Télégrammes
  const beauvauFiles: VirtualFile[] = [
    {
      id: "net-telex-urgent",
      name: "TELEGRAMME_URGENT_PREFET.telex",
      extension: "telex",
      path: "//SERVEUR-CENTRAL-BEAUVAU/DIRECTIVES/TELEGRAMME_URGENT_PREFET.telex",
      size: "2.8 Ko",
      date: "Aujourd'hui 08:00",
      type: "telex",
      titre: `TÉLÉGRAMME PRÉFECTORAL PRIORITAIRE // CONSEIL DE CRISE`,
      auteur: "Préfet de Police // Cabinet du Ministre",
      classification: "SECRET DÉFENSE",
      targetApp: "messages",
      isCrucialClue: true,
      clueHint: "Directive politique immédiate du Préfet pour cadrer la qualification et toucher la prime !",
      content: currentDossier.telegrammePrefet 
        ? `ALERTE PRÉFECTURE : ${currentDossier.telegrammePrefet.alerte}\nORDRE : « ${currentDossier.telegrammePrefet.ordre} »\nBONUS ACCORDÉ : +${currentDossier.telegrammePrefet.primeBonus} €`
        : "Maintenir la fermeté républicaine en toutes circonstances."
    },
    {
      id: "net-circulaire-doctrine",
      name: "CIRCULAIRE_IMMUNITE_FONCTIONNAIRES.doc",
      extension: "doc",
      path: "//SERVEUR-CENTRAL-BEAUVAU/DIRECTIVES/CIRCULAIRE_IMMUNITE_FONCTIONNAIRES.doc",
      size: "35.2 Ko",
      date: "Directive générale",
      type: "document",
      titre: "CIRCULAIRE DOCTRINALE DE L'ORDRE PUBLIC // IMMUNITÉ PRÉSOMPTIVE",
      auteur: "Direction Générale de la Police Nationale",
      classification: "CONFIDENTIEL",
      content: `CIRCULAIRE D'APPLICATION - PRINCIPE DE NON-IMPUTABILITÉ MATÉRIELLE :
Tout incident survenant au cours d'une opération de dispersion est réputé résulter soit d'une imprudence manifeste de l'administré ayant pénétré dans le périmètre de sécurité, soit d'une réaction réflexe proportionnée commandée par la violence de l'environnement.`
    }
  ];

  const netBeauvauFolder: VirtualFolder = {
    id: "net-beauvau",
    name: "DIRECTIVES_BEAUVAU$",
    path: "//SERVEUR-CENTRAL-BEAUVAU/DIRECTIVES",
    description: "Partage sécurisé du Cabinet Ministériel (Télégrammes et Mémos de crise)",
    isNetworkShare: true,
    serverName: "\\\\SERVEUR-CENTRAL-BEAUVAU",
    subfolders: [],
    files: beauvauFiles
  };

  // 2. Parquet de Paris
  const parquetFiles: VirtualFile[] = [
    {
      id: "net-note-parquet",
      name: "NOTE_PROCUREUR_ORIENTATION_PENALE.doc",
      extension: "doc",
      path: "//PARQUET-TRIBUNAL/REQUISITOIRES/NOTE_PROCUREUR_ORIENTATION_PENALE.doc",
      size: "11.7 Ko",
      date: "Aujourd'hui 07:15",
      type: "document",
      titre: `NOTE DU VICE-PROCUREUR GUICHARD // SECTION DU CONTENTIEUX DE POLICE`,
      auteur: "Hervé Guichard, Vice-Procureur",
      classification: "ACTE PARQUET",
      targetApp: "messages",
      isCrucialClue: true,
      clueHint: "Le Parquet indique précisément quelle qualification permettra d'éviter le renvoi en correctionnelle.",
      content: `NOTE D'AUDIENCE ET REQUISITOIRE PRÉALABLE :
Dossier référencé : ${caseFolderId}
Pour prononcer le classement sans suite ou poursuivre l'administré en comparution immédiate, le Ministère Public exige un dossier sans ambiguïté.
La qualification attendue par le Parquet : [${currentDossier.tampon_imposé}].
En cas d'erreur doctrinale, le Parquet se verra contraint de requérir des sanctions disciplinaires.`
    }
  ];

  const netParquetFolder: VirtualFolder = {
    id: "net-parquet",
    name: "REQUISITOIRES_PARQUET$",
    path: "//PARQUET-TRIBUNAL/REQUISITOIRES",
    description: "Partage interministériel de la Section du Parquet de Paris",
    isNetworkShare: true,
    serverName: "\\\\PARQUET-TRIBUNAL",
    subfolders: [],
    files: parquetFiles
  };

  // 3. Fichier TAJ National
  const tajFiles: VirtualFile[] = [
    {
      id: "net-fiche-taj",
      name: `FICHE_TAJ_${currentDossier.profilage.identite.replace(/\s+/g, "_")}.taj`,
      extension: "taj",
      path: `//POLICE-JUDICIAIRE/FICHIER_TAJ/FICHE_TAJ_${currentDossier.profilage.identite.replace(/\s+/g, "_")}.taj`,
      size: "19.3 Ko",
      date: "Synchronisé TAJ",
      type: "taj",
      titre: `DOSSIER ANTHROPOMÉTRIQUE TAJ // ${currentDossier.profilage.identite}`,
      auteur: "Direction Centrale de la Police Judiciaire",
      classification: "CONFIDENTIEL",
      targetApp: "humandb",
      isCrucialClue: true,
      clueHint: "Consultez la fiche d'antécédents, le risque judiciaire et le coefficient de vulnérabilité de l'administré !",
      content: `IDENTITÉ : ${currentDossier.profilage.identite}\nCLASSE : ${currentDossier.profilage.classeSociale}\nVULNÉRABILITÉ : ${currentDossier.profilage.coefficientVulnerabilite}%\nANALYSE RISQUE : ${currentDossier.profilage.analyseRisqueJudiciaire}`
    }
  ];

  const netTajFolder: VirtualFolder = {
    id: "net-taj",
    name: "BASE_TAJ_RESSORTISSANTS$",
    path: "//POLICE-JUDICIAIRE/FICHIER_TAJ",
    description: "Connexion directe au Fichier de Traitement des Antécédents Judiciaires",
    isNetworkShare: true,
    serverName: "\\\\POLICE-JUDICIAIRE",
    subfolders: [],
    files: tajFiles
  };

  const networkRoot: VirtualFolder = {
    id: "network-root",
    name: "Réseau Intranet d'État (\\\\BEAUVAU-NET)",
    path: "//RESEAU_INTRANET",
    description: "Partages réseau centralisés des services de l'État et autorités judiciaires",
    isNetworkShare: true,
    subfolders: [netBeauvauFolder, netParquetFolder, netTajFolder],
    files: []
  };

  // Racine globale du poste de travail
  const rootFolder: VirtualFolder = {
    id: "root-system",
    name: "Poste de Travail - Beauvau OS",
    path: "/",
    subfolders: [cDrive, networkRoot],
    files: []
  };

  return rootFolder;
}

// Fonction utilitaire pour trouver un sous-dossier par son chemin exact
export function findFolderByPath(root: VirtualFolder, targetPath: string): VirtualFolder | null {
  if (root.path === targetPath) return root;
  for (const sub of root.subfolders) {
    const found = findFolderByPath(sub, targetPath);
    if (found) return found;
  }
  return null;
}

// Fonction utilitaire pour trouver un fichier par son chemin ou son id
export function findFileInFolder(folder: VirtualFolder, fileIdOrPath: string): VirtualFile | null {
  for (const file of folder.files) {
    if (file.id === fileIdOrPath || file.path === fileIdOrPath) {
      return file;
    }
  }
  for (const sub of folder.subfolders) {
    const found = findFileInFolder(sub, fileIdOrPath);
    if (found) return found;
  }
  return null;
}
