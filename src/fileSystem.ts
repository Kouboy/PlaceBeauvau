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

function getBrigadeAuthor(dossier: Dossier): { auteur: string; chef: string } {
  switch (dossier.id) {
    case "DOS-B75-1733":
    case "DOS-B75-1108":
    case "DOS-B75-0814":
    case "DOS-B75-2391":
    case "DOS-B75-1247":
      return {
        auteur: "Brigade Spécialisée BST-4B // Brigadier Marc Vasseur (RIO #754981)",
        chef: "Brigadier Marc Vasseur (BST-4B // RIO #754981)"
      };
    case "DOS-B75-2144":
      return {
        auteur: "Peloton Motorisé Urbain // Équipage Foch",
        chef: "Gardien de la paix P. Moreau (PMU 75 // RIO #884102)"
      };
    case "DOS-B75-2104":
      return {
        auteur: "Brigade Anti-Criminalité (BAC 75) // Équipage d'Appui",
        chef: "Brigadier-Chef R. Guérin (BAC 75 // RIO #639201)"
      };
    case "DOS-B75-2245":
      return {
        auteur: "Détachement de Sécurité Rapprochée // Service de Protection",
        chef: "Major D. Lambert (SDLP // RIO #492018)"
      };
    case "DOS-B75-1389":
      return {
        auteur: "Compagnie d'Intervention // 21e Section",
        chef: "Capitaine F. Renard (CI-21 // RIO #310842)"
      };
    case "DOS-B75-1890":
      return {
        auteur: "Patrouille de Sécurisation de Secteur // Équipage BST",
        chef: "Brigadier T. Leroy (BST-Nord // RIO #924150)"
      };
    case "DOS-B75-1502":
      return {
        auteur: "Compagnie de Sécurisation et d'Intervention // Section Évacuation",
        chef: "Lieutenant M. Denis (CSI-75 // RIO #817294)"
      };
    case "DOS-B75-0942":
      return {
        auteur: "Brigade Territoriale de Contact // Équipage d'Intervention",
        chef: "Brigadier-Chef K. Belkacem (BTC // RIO #7844192)"
      };
    case "DOS-B75-2011":
      return {
        auteur: "Brigade des Réseaux Ferrés // Pôle Gare du Nord",
        chef: "Brigadier S. Colin (BRF-Nord // RIO #529810)"
      };
    case "DOS-B75-1620":
      return {
        auteur: "Compagnie Républicaine d'Intervention // Section Tactique",
        chef: "Commandant J. Fabre (CRI-02 // RIO #198420)"
      };
    default:
      return {
        auteur: "Direction Générale de la Police Nationale // Brigade Territoriale",
        chef: "Chef d'équipage assermenté"
      };
  }
}

export function getPrimaryCaseFile(currentDossier: Dossier): VirtualFile {
  const caseFolderId = currentDossier.id;
  const { auteur, chef } = getBrigadeAuthor(currentDossier);
  const mentionVasseur = chef.includes("Vasseur");

  return {
    id: `${caseFolderId}-pv-synthese`,
    name: "01_PV_SYNTHESE_INTERPELLATION.txt",
    extension: "txt",
    path: `/C:/PROCEDURES_CONTENTIEUSES/EN_COURS/${caseFolderId}/01_PV_SYNTHESE_INTERPELLATION.txt`,
    size: "14.2 Ko",
    date: "Aujourd'hui 06:14",
    type: "document",
    titre: `PROCES-VERBAL DE SYNTHÈSE D'INTERVENTION #${caseFolderId}`,
    auteur,
    classification: "DIFFUSION RESTREINTE",
    isCrucialClue: true,
    clueHint: "Procès-verbal de synthèse rédigé par les effectifs intervenants.",
    content: `================================================================================
RÉPUBLIQUE FRANÇAISE - MINISTÈRE DE L'INTÉRIEUR ET DES OUTRE-MER
DIRECTION GÉNÉRALE DE LA POLICE NATIONALE // DISTRICT DE SÉCURITÉ PUBLIQUE
--------------------------------------------------------------------------------
PROCÈS-VERBAL DE SYNTHÈSE D'INTERVENTION // RÉFÉRENCE : ${caseFolderId}
CHEF D'ÉQUIPAGE INTERVENANT : ${chef}
AGENT D'INSTRUCTION EN CHARGE : Matricule #7501923
--------------------------------------------------------------------------------

1. RAPPEL DES FAITS CONSTATÉS SUR LA VOIE PUBLIQUE :
${currentDossier.faits}

2. ÉLÉMENTS DE VOCABULAIRE RÉGLEMENTAIRE ET NOVLANGUE APPLICABLE :
${currentDossier.novlangue 
  ? `• Fait contesté : « ${currentDossier.novlangue.faitBrut} »\n• Qualification homologuée ministère : « ${currentDossier.novlangue.termeMinisteriel} »`
  : `• Application intégrale des directives de protection de la paix républicaine.`}

3. POSITIONNEMENT DE LA HIERARCHIE :
${currentDossier.jargon_officiel}
${mentionVasseur 
  ? "L'administration rappelle que toute contestation consécutive à l'usage de la contrainte relève d'un refus de se soumettre aux sommations d'usage du Brigadier Marc Vasseur."
  : "L'administration rappelle que toute contestation consécutive à l'intervention relève d'un refus d'obtempérer aux directives réglementaires des effectifs assermentés."}

[BORDEREAU VERROUILLÉ - EN ATTENTE DU VISA DE QUALIFICATION DOCTRINALE]`
  };
}

function getDepositionContent(dossier: Dossier): string {
  const caseFolderId = dossier.id;
  const p = dossier.profilage;

  let declaration = "";

  switch (dossier.id) {
    case "DOS-B75-1890":
      declaration = `« J'étais bloqué dans ma camionnette d'artisan depuis plus de 45 minutes devant mon propre atelier par leur fourgon de service stationné en travers de l'accès. J'avais un chantier urgent chez un client. J'ai simplement actionné brièvement mon avertisseur sonore pour signaler ma présence et demander le dégagement du passage. Les fonctionnaires sont sortis du café d'en face, m'ont pris à partie et ont dressé procès-verbal pour entrave et tapage. Je conteste formellement cette qualification abusive. »`;
      break;
    case "DOS-B75-1733":
      declaration = `« Je rentrais chez moi à vélo à allure tout à fait normale en contournant le dispositif de filtrage. Un agent s'est mis à courir derrière moi en criant. Je ne l'ai même pas touché : il s'est pris les pieds tout seul dans son propre bouclier individuel et s'est tordu le genou en tombant lourdement sur le bitume. On cherche maintenant à me faire porter la responsabilité pénale de sa chute alors que je n'ai exercé aucune violence ! »`;
      break;
    case "DOS-B75-2144":
      declaration = `« Note d'observations transmise par le conseil constitué de Me Charles-Édouard de V. : Mon client conteste expressément toute intention outrageante ou délictuelle. Le franchissement signalé procède d'une manœuvre d'évitement prudente en circulation nocturne fluide. Les propos tenus relevaient de la simple courtoisie et d'un rappel confraternel de ses fonctions d'officier ministériel. Un classement sans suite immédiat et sans inscription s'impose pour préserver la sérénité des relations institutionnelles. »`;
      break;
    case "DOS-B75-1502":
      declaration = `« J'étais assise au sol pacifiquement avec ma pancarte devant l'université. Deux policiers sont arrivés sans sommation préalable et m'ont balayée brutalement au niveau des jambes. Mon épaule droite a heurté violemment le trottoir et ma clavicule s'est déboîtée. J'ai crié de douleur pendant plusieurs minutes. Au lieu d'appeler les secours, ils m'ont reproché de crier trop fort et de troubler l'ordre public sonore. Je dépose plainte pour violences volontaires illégitimes. »`;
      break;
    case "DOS-B75-0942":
      declaration = `« Je traversais simplement la chaussée pour rentrer chez moi avec mes sacs de courses. J'ai reçu sans sommation un coup de bâton de défense direct à la tempe. Je me suis effondré sur le trottoir et j'ai convulsé sous l'effet du traumatisme. Des passants et un reporter de presse ont tout vu et pris des clichés. M'accuser d'entrave et de tapage alors que j'étais inconscient par terre relève du cynisme absolu. »`;
      break;
    case "DOS-B75-1108":
      declaration = `« J'attendais le bus avec deux camarades aux Bosquets. Le Brigadier Marc Vasseur est venu directement au contact pour un contrôle. Alors que j'étais plaqué au sol et neutralisé, il m'a asséné un coup de poing direct à la mâchoire. C'est en me frappant qu'il s'est brisé la main sur mes dents. Les policiers ont ensuite menacé de m'accuser de violences aggravées si je ne signais pas leur version. Je porte plainte pour violences policières aggravées. »`;
      break;
    case "DOS-B75-2391":
      declaration = `« J'attendais au passage piéton que le feu passe au vert. J'ai regardé l'agent en tenue pendant quelques secondes sans prononcer un mot ni faire le moindre geste. Il s'est avancé vers moi avec agressivité, m'a attrapé par le col en me disant 'Tu me défies du regard ?' et m'a passé les menottes. Poursuivre un citoyen pour violences sur dépositaire pour un simple regard neutre de 4 secondes est une dérive inacceptable. »`;
      break;
    case "DOS-B75-2011":
      declaration = `« C'était mon huitième contrôle d'identité en sept jours dans la même gare alors que je me rendais en cours. J'ai présenté mes papiers calmement, puis j'ai demandé poliment le numéro RIO de l'agent qui n'arborait aucun matricule sur son gilet. Les fonctionnaires m'ont immédiatement plaqué au sol et menotté en me qualifiant d'insolent. Demander l'application de la réglementation déontologique ne constitue ni un refus d'obtempérer ni un outrage. »`;
      break;
    case "DOS-B75-0814":
      declaration = `« Je me trouvais sur la place lors de la manœuvre de dispersion. Le Brigadier Marc Vasseur s'est avancé et m'a visé directement à la tête avec son LBD à moins de deux mètres de distance, en tir tendu horizontal. Le projectile m'a détruit l'œil droit. Alors que j'étais au sol, d'autres agents m'ont asséné des coups provoquant quatre fractures costales. C'est une mutilation volontaire en violation de toutes les règles d'engagement. »`;
      break;
    case "DOS-B75-2104":
      declaration = `« Des effectifs en tenue civile se réclamant de la BAC ont fait irruption dans ma boulangerie à l'ouverture sous prétexte d'un contrôle. Ils se sont servis directement sur le présentoir, emportant 24 chocolatines et croissants sans rien régler. Lorsque j'ai réclamé la somme de 38,40 € ou un bon officiel de réquisition, ils m'ont menacé de faire fermer mon commerce par un contrôle d'hygiène inopiné. Je dépose plainte pour extorsion de denrées sous la menace. »`;
      break;
    case "DOS-B75-1389":
      declaration = `« J'étais présente dans le cortège soignant vêtue de ma blouse professionnelle. Un tir de munition lacrymogène m'a atteinte au cuir chevelu, provoquant une hémorragie abondante. Lors de mon évacuation contrainte, mon sang a souillé les brodequins et le pantalon de l'officier intervenant. Apprendre que l'institution me poursuit pour dégradation volontaire d'uniforme par projection biologique relève d'une inversion accusatoire révoltante. »`;
      break;
    case "DOS-B75-2245":
      declaration = `« J'ai 68 ans, je suis institutrice honoraire. J'ai manifesté mon désaccord citoyen en faisant tinter une casserole en inox avec une cuillère en bois sur le trottoir lors du passage du cortège officiel. Trois agents de protection m'ont encerclée, m'ont confisqué mon ustensile et ont prétendu avoir subi une 'onde de choc acoustique'. Traiter un tintement ménager comme une arme de violence est un déni total des libertés républicaines. »`;
      break;
    case "DOS-B75-1620":
      declaration = `« J'effectuais une livraison à vélo aux abords de la place. Constatant les mouvements de foule, j'ai fait demi-tour pour me mettre en sécurité. Une grenade de désencerclement a été déclenchée dans mon dos à courte distance. Les éclats ont traversé mon blouson et perforé mes tissus cutanés, et la détonation a entraîné une surdité immédiate de l'oreille gauche. Je n'avais aucun lien avec les manifestants. »`;
      break;
    case "DOS-B75-1247":
      declaration = `« Déclaration enregistrée du conseil de la famille d'Adama D. : Notre proche a été maintenu au sol en décubitus ventral prolongé sous le poids combiné de quatre fonctionnaires dans le sas du poste, sous la direction du Brigadier Vasseur. Malgré ses signalements répétés d'étouffement ('Je ne peux plus respirer'), la manœuvre de compression a été maintenue jusqu'à l'arrêt cardiaque. La défaillance alléguée des caméras dissimule les responsabilités matérielles évidentes. »`;
      break;
    default:
      declaration = `« Le requérant conteste formellement la matérialité de l'infraction reprochée et soutient que l'intervention des forces de l'ordre a été menée sans sommation régulière. »`;
  }

  return `================================================================================
MINISTÈRE DE LA JUSTICE // REGISTRE DES DÉPOSITIONS D'AUDITIONS
COMPTE-RENDU DE CONTESTATION D'ACTE DE POLICE // RÉF : ${caseFolderId}
--------------------------------------------------------------------------------
DÉCLARANT : ${p.identite}
CLASSE SOCIALE / PROFIL : ${p.classeSociale}
ZONE D'INTERPELLATION : ${p.territoireZonage}
--------------------------------------------------------------------------------

DÉCLARATION SPONTANÉE DU COMPARANT :
${declaration}

NOTE DE L'OPJ ENCADRANT :
Déclaration contradictoire consignée à titre conservatoire. Nécessité d'apprécier la recevabilité au regard des impératifs d'autorité et de protection doctrinale des effectifs.`;
}

function hasMedicalInjuries(dossier: Dossier): boolean {
  // Omettre le rapport médical pour les dossiers sans atteinte corporelle
  if (
    dossier.id === "DOS-B75-1890" || // klaxon
    dossier.id === "DOS-B75-2144" || // notaire
    dossier.id === "DOS-B75-2391" || // regard
    dossier.id === "DOS-B75-2104" || // boulangerie
    dossier.id === "DOS-B75-2245"    // casserole
  ) {
    return false;
  }
  return true;
}

export function getMedicalSubject(dossier: Dossier): string {
  switch (dossier.id) {
    case "DOS-B75-1733":
      return "Brigadier Marc Vasseur";
    case "DOS-B75-1108":
      return "M. Bilal M. & Brigadier Marc Vasseur (Examens contradictoires)";
    default:
      return dossier.profilage.identite;
  }
}

function getMedicalReportContent(dossier: Dossier): string {
  const caseFolderId = dossier.id;

  // Cas DOS-B75-1108 : double examen distinct (Bilal M. et Brigadier Marc Vasseur)
  if (dossier.id === "DOS-B75-1108") {
    return `================================================================================
MINISTÈRE DE LA SANTÉ // UNITÉ MÉDICO-JUDICIAIRE (UMJ)
CERTIFICAT DE CONSTATATIONS CLINIQUES // RÉF : ${caseFolderId}
--------------------------------------------------------------------------------
EXAMENS MÉDICAUX CONTRADICTOIRES // INCIDENT CONJOINT
MÉDECIN PRATICIEN : Dr. V. Lambert // Médecin Légiste Praticien Hospitalier
--------------------------------------------------------------------------------

PERSONNE EXAMINÉE A :
M. Bilal M.

CONSTATATIONS :
• Dermabrasions et ecchymoses péri-orbi-faciales droites.
• Lésions traumatiques consécutives : suite à une frappe portée à la mâchoire de l'administré.
• Ébranlement dentaire secteur 4 sans fracture osseuse alvéolaire décelable.
• Incapacité Totale de Travail (ITT) fixée à 4 jours à titre conservatoire.

--------------------------------------------------------------------------------

PERSONNE EXAMINÉE B :
Brigadier Marc Vasseur

CONSTATATIONS :
• Constat médico-légal de lésion en service : fracture du cinquième métacarpien du fonctionnaire.
• Œdème dorsal marqué et impotence fonctionnelle complète de la main droite.
• Incapacité Totale de Travail (ITT) fixée à 21 jours par le praticien.

--------------------------------------------------------------------------------
CONCLUSIONS LÉGALES :
• Constatations médico-légales contradictoires consignées pour versement au dossier d'instruction.
• Certificats établis conformément aux réquisitions du Parquet.`;
  }

  // Cas DOS-B75-1733 : l'examen concerne l'agent Marc Vasseur, blessé au genou
  if (dossier.id === "DOS-B75-1733") {
    return `================================================================================
MINISTÈRE DE LA SANTÉ // UNITÉ MÉDICO-JUDICIAIRE (UMJ)
CERTIFICAT DE CONSTATATIONS CLINIQUES // RÉF : ${caseFolderId}
--------------------------------------------------------------------------------
EXAMEN MÉDICAL RÉALISÉ SUR :
Brigadier Marc Vasseur
MÉDECIN PRATICIEN : Dr. V. Lambert // Médecin Légiste Praticien Hospitalier
--------------------------------------------------------------------------------

CONSTATATIONS CLINIQUES ET TRAUMATOLOGIQUES :
Examen de l'équipage intervenant : entorse bénigne du ligament collatéral médial du genou droit chez le Brigadier Marc Vasseur, consécutive à une perte d'équilibre en phase de course d'interpellation.

CONCLUSIONS LÉGALES :
• Incapacité Totale de Travail (ITT) fixée à 8 jours en accident de service.
• Examen réalisé selon les protocoles médico-légaux en vigueur.

AVIS MÉDICO-LÉGAL :
Constatations objectives consignées pour versement au dossier d'instruction.`;
  }

  let constatations = "";

  if (dossier.termesCaviardes && dossier.termesCaviardes.length > 0) {
    constatations = dossier.termesCaviardes
      .map((t, idx) => `[Constat clinique #${idx + 1}] : ${t.texteBrut} (Diagnostic : ${t.motifCensure})`)
      .join("\n");
  } else {
    switch (dossier.id) {
      case "DOS-B75-1502":
        constatations = "Patiente Manon R. : Luxation acromio-claviculaire droite de stade II consécutive à une chute provoquée avec impact direct de la ceinture scapulaire sur le sol. Impotence fonctionnelle majeure du membre supérieur droit.";
        break;
      case "DOS-B75-1389":
        constatations = "Patiente Leila H. : Plaie contuse linéaire du cuir chevelu de 6 cm dans la région pariétale droite, consécutive à l'impact d'un projectile cinétique. Écoulement hémorragique actif lors de la prise en charge.";
        break;
      case "DOS-B75-1620":
        constatations = "Patient Ahmed T. : Perforations cutanées multiples de la région lombaire par corps étrangers métalliques résiduels consécutifs à la déflagration. Blast auriculaire unilatéral gauche avec hypoacousie de perception.";
        break;
      default:
        constatations = "Lésions traumatiques superficielles et contusions constatées consécutives aux gestes techniques de maîtrise de l'administré.";
    }
  }

  return `================================================================================
MINISTÈRE DE LA SANTÉ // UNITÉ MÉDICO-JUDICIAIRE (UMJ)
CERTIFICAT DE CONSTATATIONS CLINIQUES // RÉF : ${caseFolderId}
--------------------------------------------------------------------------------
EXAMEN MÉDICAL RÉALISÉ SUR :
${getMedicalSubject(dossier)}
MÉDECIN PRATICIEN : Dr. V. Lambert // Médecin Légiste Praticien Hospitalier
--------------------------------------------------------------------------------

CONSTATATIONS CLINIQUES ET TRAUMATOLOGIQUES :
${constatations}

CONCLUSIONS LÉGALES :
• Incapacité Totale de Travail (ITT) fixée à titre conservatoire.
• Examen réalisé selon les protocoles médico-légaux en vigueur.

AVIS MÉDICO-LÉGAL :
Constatations objectives consignées pour versement au dossier d'instruction.`;
}

function getTemoignagesContent(dossier: Dossier): string {
  const caseFolderId = dossier.id;

  let temoinA = "";
  let temoinB = "";

  switch (dossier.id) {
    case "DOS-B75-1890":
      temoinA = `TÉMOIN A (Gérant de station-service voisine) :\n« La camionnette de l'électricien était bloquée devant son rideau métallique par le fourgon de police. Il a attendu très longtemps avant de faire un appel sonore bref pour prévenir. Les agents étaient attablés en terrasse. »`;
      temoinB = `TÉMOIN B (Riverain) :\n« Un seul coup d'avertisseur a retenti. Les policiers sont sortis immédiatement en criant après lui alors qu'il ne pouvait simplement pas manœuvrer. »`;
      break;
    case "DOS-B75-1733":
      temoinA = `TÉMOIN A (Automobiliste au rond-point) :\n« Le jeune à vélo roulait à allure tranquille. Le policier a tenté de sprinter derrière lui mais il a butté tout seul dans son grand bouclier et s'est affalé au sol. Le cycliste ne l'a jamais effleuré. »`;
      temoinB = `TÉMOIN B (Employé de station de lavage) :\n« Il n'y a eu aucun contact physique entre le vélo et le policier. L'agent est tombé par terre tout seul en s'emmêlant dans son matériel. »`;
      break;
    case "DOS-B75-2144":
      temoinA = `TÉMOIN A (Gardien d'immeuble Avenue Foch) :\n« La Porsche s'est immobilisée au signal des motards. Le conducteur parlait d'une voix pâteuse mais sur un ton très poli et familier avec les agents, en citant ses connaissances ministérielles. »`;
      temoinB = `TÉMOIN B (Chauffeur de maître) :\n« Les policiers ont vérifié l'identité, se sont mis au garde-à-vous et l'ont courtoisement escorté jusqu'au porche de son hôtel particulier sans lui demander de souffler dans l'éthylotest. »`;
      break;
    case "DOS-B75-1502":
      temoinA = `TÉMOIN A (Étudiant témoin direct) :\n« Manon était assise par terre avec son carton. Les agents ont chargé directement le groupe sans faire de sommations au mégaphone. Le fauchage était net et violent. »`;
      temoinB = `TÉMOIN B (Enseignant-chercheur) :\n« Nous avons clairement entendu ses hurlements de douleur après la chute. Elle ne commettait aucune entrave sonore avant d'avoir l'épaule démise. »`;
      break;
    case "DOS-B75-0942":
      temoinA = `TÉMOIN A (Commerçant primeur) :\n« L'homme marchait avec ses courses de l'autre côté de la rue. Le coup de matraque est tombé d'un coup sur son crâne. Il est tombé raide et s'est mis à trembler convulsivement sur le trottoir. »`;
      temoinB = `TÉMOIN B (Photojournaliste de presse) :\n« J'ai pris le cliché dans la seconde où il s'est effondré. Le tir de bâton était porté à hauteur de tête sans sommation audible préalable. »`;
      break;
    case "DOS-B75-1108":
      temoinA = `TÉMOIN A (Passagère de la ligne de bus) :\n« Le jeune homme était maintenu au sol par deux policiers. Le gradé s'est penché et lui a décoché une droite violente en plein visage. »`;
      temoinB = `TÉMOIN B (Voisin de l'abribus) :\n« On a entendu le bruit de l'impact. Le policier s'est tout de suite tenu la main en grimaçant de douleur après avoir frappé le jeune. »`;
      break;
    case "DOS-B75-2391":
      temoinA = `TÉMOIN A (Piétonne attendant au feu) :\n« L'homme avait ses écouteurs et regardait simplement en direction du carrefour. Il n'a rien dit et n'a pas bougé. L'agent s'est emporté sur lui sans motif apparent. »`;
      temoinB = `TÉMOIN B (Cycliste à l'arrêt) :\n« Interpellation totalement surréaliste : l'agent criait qu'on lui manquait de respect parce que le passant l'avait regardé fixement. »`;
      break;
    case "DOS-B75-2011":
      temoinA = `TÉMOIN A (Voyageur grandes lignes) :\n« L'étudiant montrait son titre de transport et sa carte d'identité. Il a demandé très poliment son numéro de matricule au policier. L'équipe l'a jeté à terre à trois sur le quai. »`;
      temoinB = `TÉMOIN B (Agent d'accueil SNCF) :\n« Le jeune homme n'était absolument pas virulent. C'est l'évocation du matricule RIO qui a déclenché l'agressivité immédiate des effectifs. »`;
      break;
    case "DOS-B75-0814":
      temoinA = `TÉMOIN A (Riverain du boulevard) :\n« Le tireur au LBD était à moins de trois mètres. Le canon était pointé droit vers la tête, à l'horizontale. La victime est tombée la tête en sang. »`;
      temoinB = `TÉMOIN B (Secouriste bénévole) :\n« Quand nous sommes intervenus, l'œil était perforé et il présentait des fractures costales suite aux coups reçus à terre. Le tir n'était absolument pas réglementaire. »`;
      break;
    case "DOS-B75-2104":
      temoinA = `TÉMOIN A (Apprentie boulangère) :\n« Les trois policiers en civil sont entrés directement derrière le comptoir. Ils ont rempli un grand sac de viennoiseries et ont ricané quand mon patron a demandé le paiement. »`;
      temoinB = `TÉMOIN B (Client du matin) :\n« J'ai entendu le ton monter. L'un des agents a dit textuellement : 'Si vous voulez qu'on contrôle la conformité de vos farines et de vos frigos, continuez à réclamer 38 euros'. »`;
      break;
    case "DOS-B75-1389":
      temoinA = `TÉMOIN A (Infirmier anesthésiste du cortège) :\n« Le tir de grenade a éclaté à hauteur d'homme dans le groupe de soignants. Leila a été touchée directement au front. »`;
      temoinB = `TÉMOIN B (Délégué syndical) :\n« L'officier s'est mis en colère parce que du sang avait coulé sur son pantalon lors de l'évacuation d'urgence. Poursuivre une blessée pour son propre sang est scandaleux. »`;
      break;
    case "DOS-B75-2245":
      temoinA = `TÉMOIN A (Habitant du quartier) :\n« C'était un concert de casseroles pacifique sur les balcons et les trottoirs. Monique tapait sur une poêle avec une spatule en bois. »`;
      temoinB = `TÉMOIN B (Commerçant de la rue) :\n« Trois agents en costume se sont rués sur cette dame âgée comme s'il s'agissait d'un commando armé. L'ustensile a été arraché avec une brutalité disproportionnée. »`;
      break;
    case "DOS-B75-1620":
      temoinA = `TÉMOIN A (Client de l'application de livraison) :\n« Le livreur arrivait vers mon immeuble. Une détonation assourdissante est partie derrière lui. Il a lâché son guidon et est tombé en hurlant. »`;
      temoinB = `TÉMOIN B (Journaliste indépendant) :\n« Le tir de désencerclement a été effectué dans le dos d'un individu isolé qui quittait manifestement les lieux. »`;
      break;
    case "DOS-B75-1247":
      temoinA = `TÉMOIN A (Comparant en garde à vue mitoyenne) :\n« Depuis ma cellule, j'ai entendu Adama crier au moins vingt fois qu'il étouffait et qu'il ne sentait plus ses bras. Les agents lui criaient de la fermer et continuaient à peser sur son dos. »`;
      temoinB = `TÉMOIN B (Avocat de permanence présent au poste) :\n« J'ai vu l'équipe sortir du sas visiblement affolée. Quand les secours sont arrivés vingt minutes plus tard, il était déjà en arrêt cardiorespiratoire irréversible. »`;
      break;
    default:
      temoinA = `TÉMOIN A :\n« Présent sur les lieux lors de l'intervention des effectifs. »`;
      temoinB = `TÉMOIN B :\n« Déclaration recueillie dans le cadre de l'enquête préliminaire. »`;
  }

  return `================================================================================
RÉSUMÉ ANALYTIQUE DES TÉMOIGNAGES RECOLTÉS SUR SITE : ${caseFolderId}
--------------------------------------------------------------------------------
${temoinA}

${temoinB}

ANALYSE PROCÉDURALE DE L'ENQUÊTEUR :
Déclarations recueillies contradictoirement. La force probante des procès-verbaux d'agents assermentés prévaut en l'absence de preuve matérielle irréfutable versée aux débats.`;
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
      clueHint: "Déposition et réclamations formulées lors de l'audition contradictoire.",
      content: getDepositionContent(currentDossier)
    }
  ];

  // Rapport médical : généré uniquement si le dossier comporte des atteintes corporelles pertinentes
  if (hasMedicalInjuries(currentDossier)) {
    caseFiles.push({
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
      clueHint: "Rapport détaillant les constatations médico-légales et leur qualification clinique.",
      content: getMedicalReportContent(currentDossier)
    });
  }

  // Témoignages de voie publique
  caseFiles.push({
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
    clueHint: "Extraits des déclarations de témoins recueillies sur les lieux.",
    content: getTemoignagesContent(currentDossier)
  });

  // Flux vidéo CCTV si support visuel présent
  if (currentDossier.piece_visuelle || currentDossier.incidentCamera) {
    caseFiles.push({
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
      clueHint: "Enregistrement audiovisuel de l'intervention versé à l'inventaire CHEOPS.",
      content: `FLUX VIDÉO CODÉ CHEOPS-MPEG4\nSOURCE : ${currentDossier.piece_visuelle ? currentDossier.piece_visuelle.reference : "ENREGISTREUR TACTIQUE CSU"}\nHORODATAGE : ${currentDossier.piece_visuelle ? currentDossier.piece_visuelle.horodatage : "REC HEURE SERVICE"}\nINCIDENT : ${currentDossier.incidentCamera ? currentDossier.incidentCamera.intitule : "Aucune anomalie déclarée"}`
    });
  }

  // Fiche RIO si le statut est renseigné
  if (currentDossier.statutRio) {
    caseFiles.push({
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
      clueHint: "Relevé de conformité réglementaire relatif à l'identification individuelle de l'agent.",
      content: `${currentDossier.statutRio.constat}\nDÉCISION DE PROTOCOLE : ${currentDossier.statutRio.decision}`
    });
  }

  // Pièce sous scellé matériel : générée UNIQUEMENT si une substitution est prévue dans l'affaire
  if (currentDossier.pieceASubstituer) {
    caseFiles.push({
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
      isCrucialClue: true,
      clueHint: "Pièce matérielle versée au dossier sous scellé judiciaire.",
      content: `SCELLÉ ENREGISTRÉ : ${currentDossier.pieceASubstituer.scelleCompromettant}\nNATURE MATÉRIELLE : ${currentDossier.pieceASubstituer.scelleType}`
    });
  }

  // Bordereau officiel de visa
  caseFiles.push({
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
    clueHint: "Bordereau officiel d'instruction pour l'enregistrement de la qualification administrative.",
    content: `BORDEREAU MINISTÉRIEL EN ATTENTE D'APPOSITION DU SCEAU D'ÉTAT POUR ${caseFolderId}.`
  });

  // Dossier de l'arborescence pour l'affaire active
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
    date: `Affaire #${i + 1}`,
    type: "document",
    titre: `DOSSIER ARCHIVÉ #${d.id} // APURÉ SANS SUITE`,
    auteur: "Bureau Central des Contentieux",
    classification: "DIFFUSION RESTREINTE",
    content: `DOSSIER NUMÉRO ${d.id}\nSTATUT : CLÔTURÉ DÉFINITIVEMENT APRÈS VISA MINISTÉRIEL.`
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
      clueHint: "Communication prioritaire émise par le Cabinet préfectoral relative au dossier.",
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

  // 2. Parquet de Paris (NOTE PÉNALE RÉVISÉE SANS SOLUTION DIVULGUÉE)
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
      clueHint: "Note d'orientation pénale et réquisitions préliminaires du Ministère Public.",
      content: `RÉPUBLIQUE FRANÇAISE // MINISTÈRE DE LA JUSTICE
PARQUET DU TRIBUNAL JUDICIAIRE DE PARIS // SECTION DU CONTENTIEUX DE POLICE
--------------------------------------------------------------------------------
NOTE D'ORIENTATION PÉNALE // RÉFÉRENCE DOSSIER : #${caseFolderId}
VICE-PROCUREUR CHARGÉ DE LA LIAISON BEAUVAU : H. GUICHARD
--------------------------------------------------------------------------------

1. PRINCIPES D'ORIENTATION DES RÉQUISITIONS DU MINISTÈRE PUBLIC :
La qualification retenue par l'autorité administrative devra impérativement demeurer compatible avec les constatations matérielles et les éléments probatoires versés à la procédure.

Toute contradiction manifeste entre le bordereau de synthèse, les pièces audiovisuelles inventoriées et les déclarations d'identification fragilisera les réquisitions du parquet lors d'éventuelles poursuites.

2. VULNÉRABILITÉS PROCÉDURALES RELEVÉES :
Le Ministère Public rappelle que l'action récursoire et les poursuites pour violences ou entrave supposent une chaîne probatoire rigoureuse. En cas de contestation médicale avérée ou de dissimulation matérielle incohérente, le Parquet se verra contraint d'orienter le litige selon les exigences de légalité stricte.

3. DIRECTIVE DU PARQUET :
Appliquer un visa doctrinal étayé par les constatations de la brigade. Veiller à ce qu'aucune pièce contradictoire non purgée ne vienne vicier le dossier transmis au Parquet.

[VISA DU MINISTÈRE PUBLIC — CONTRÔLE DE LÉGALITÉ PRÉALABLE]`
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
      clueHint: "Relevé d'antécédents judiciaires et profilage procédural extrait de la base nationale.",
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
