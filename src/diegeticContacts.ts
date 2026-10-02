export interface ContactDiegetique {
  id: string;
  nom: string;
  role: string;
  avatarEmoji: string;
  ip: string;
  statut: string;
  messagesParDossier: (
    dossierId: string,
    actions: {
      rio: boolean;
      rioDecision?: "flouter" | "valider" | null;
      riposte: boolean;
      caviardage: number;
      camera: boolean;
      cameraNeutralisee?: boolean;
      cameraDecision?: "neutralisee" | "conservee" | null;
      credibilite?: number;
      fuiteFaite?: boolean;
    }
  ) => string[];
}

export const CONTACTS_DIEGETIQUES: ContactDiegetique[] = [
  {
    id: "montmirail",
    nom: "BÉATRICE DE MONTMIRAIL",
    role: "Directrice Adjointe du Cabinet // Cellule Risque & Crise Beauvau",
    avatarEmoji: "👩‍💼",
    ip: "10.0.1.12",
    statut: "EN LIGNE // CABINET MINISTÉRIEL",
    messagesParDossier: (id, actions) => {
      const msgs: string[] = [];

      // Analyses d'instruction déductives par dossier
      if (id === "DOS-B75-0814") {
        msgs.push("Béatrice : Le tir de LBD dans la mâchoire est en boucle sur les réseaux. Beauvau veut étouffer l'affaire avant le 20h.");
        msgs.push("L'agent tireur est le Brigadier Marc Vasseur, de la Brigade 4B. Le syndicat veille au grain, il est hors de question que son nom sorte.");
        msgs.push("Réfléchissez bien : biffer les descriptions de chirurgie maxillo-faciale est indispensable, mais conservez l'attroupement hostile pour sauver le non-lieu.");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Béatrice : Grosse tension : le plaignant convulse sur une vidéo captée par une équipe de télévision locale.");
        msgs.push("Notre ligne de défense : c'est un malaise vagal autonome consécutif au stress de l'interpellation. Si le flux vidéo interne montre le coup de tonfa, vous savez ce qu'il advient d'une carte SD défaillante...");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Béatrice : Affaire en or pour l'institution : le Brigadier Marc Vasseur a le métacarpe brisé net !");
        msgs.push("Oui, c'est encore Vasseur. Mais cette fois-ci, il est plaignant. Nous voulons une qualification de violences volontaires sur dépositaire de l'autorité publique avec 21 jours d'ITT.");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Béatrice : ALERTE ÉLYSÉE : Décès par asphyxie positionnelle en garde à vue. Risque d'émeutes urbaines maximal.");
        msgs.push("Marc Vasseur supervisait le sas de garde à vue. La consigne est catégorique : 'asphyxie' et 'décubitus' doivent disparaître des bordereaux. Et le flux du couloir ne doit sous aucun prétexte parvenir aux magistrats.");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Béatrice : Ce jeune homme est étudiant sans antécédents judiciaires. Les collectifs citoyens sont déjà mobilisés.");
        msgs.push("Attention sur le RIO : trois témoins ont filmé en haute définition son brassard bien lisible. Invoquer un flou maintenant nous discréditerait devant la presse.");
      } else if (id === "DOS-B75-2204") {
        msgs.push("Béatrice : Tirs d'armes à feu lors d'un refus d'obtempérer en plein centre-ville. La légitime défense doit être verrouillée.");
        msgs.push("Le Parquet a besoin que le danger imminent soit flagrant. Gardez toutes les preuves montrant la trajectoire dangereuse du véhicule.");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Béatrice : Un adolescent hospitalisé pour traumatisme testiculaire après un coup de pied. Marc Vasseur était encore en première ligne.");
        msgs.push("Substituez le rapport médical par le compte-rendu de neutralisation musculaire proportionnée. La pudeur procédurale nous impose la fermeté.");
      } else if (id === "DOS-B75-2550") {
        msgs.push("Béatrice : Gazage d'une assemblée générale étudiante en amphi fermé. Le rectorat est furieux.");
        msgs.push("La doctrine est formelle : dispersion nécessaire pour prévenir l'occupation illicite des locaux universitaires. Pas d'hésitation.");
      } else if (id === "DOS-B75-2810") {
        msgs.push("Béatrice : Choc frontal entre une moto et un véhicule sérigraphié lors d'un rodéo urbain.");
        msgs.push("La jurisprudence ministérielle protège l'interception légitime. La vidéo de bord montre le refus d'obtempérer flagrant : conservez-la précieusement !");
      } else if (id === "DOS-B75-3112") {
        msgs.push("Béatrice : Dossier final d'apurement annuel. Le Ministre lui-même examinera vos statistiques de rejet de recours.");
        msgs.push("Marc Vasseur est proposé pour la Médaille du Mérite. Faites preuve de sang-froid et d'esprit républicain : notre bilan dépend de votre visa.");
      } else {
        msgs.push("Béatrice : Dossier d'apurement réglementaire. L'État compte sur votre rigueur doctrinale pour clore les contestations.");
      }

      // Variantes dynamiques réactives
      if (actions.fuiteFaite) {
        msgs.push("Béatrice : 🚨 FUITE DANS LA PRESSE ! Des pièces non caviardées tournent sur les réseaux et au Canard Enchaîné ! L'IGPN lance une enquête interne sur notre propre service !");
      }

      if (actions.cameraDecision === "neutralisee" || actions.cameraNeutralisee) {
        msgs.push("Béatrice : Signalement de défaillance caméra bien enregistré. Pour la presse, ce sera une 'anomalie d'enregistrement fortuite'.");
      } else if (actions.cameraDecision === "conservee") {
        msgs.push("Béatrice : Flux vidéo maintenu au dossier. Les éléments visuels devront corroborer notre mémoire en défense.");
      }

      if (actions.rioDecision === "valider") {
        msgs.push("Béatrice : Matricule homologué. Transparence revendiquée devant les médias.");
      } else if (actions.rioDecision === "flouter") {
        msgs.push("Béatrice : Anonymat garanti. Le syndicat appréciera cette précaution hiérarchique.");
      }

      if (actions.caviardage > 0) {
        msgs.push(`Béatrice : ${actions.caviardage} mention(s) biffée(s) au marqueur. Veillez à ne pas effacer les éléments qui accablent le mis en cause.`);
      }

      if (actions.riposte) {
        msgs.push("Béatrice : Procédure d'outrage enclenchée. L'attaque reste la meilleure défense devant les tribunaux.");
      }

      if (actions.credibilite !== undefined) {
        if (actions.credibilite < 40) {
          msgs.push("Béatrice : 🚨 ALERTE BEAUVAU : Votre indice de crédibilité est en chute libre ! Le Ministre menace de suspendre l'ensemble de votre cellule !");
        } else if (actions.credibilite >= 90) {
          msgs.push("Béatrice : Félicitations : la Direction salue votre grande maîtrise tactique des dossiers contentieux.");
        }
      }

      return msgs;
    }
  },
  {
    id: "guichard",
    nom: "HERVÉ GUICHARD",
    role: "Vice-Procureur de la République // Parquet Général de Paris",
    avatarEmoji: "👨‍⚖️",
    ip: "192.168.10.4",
    statut: "EN LIGNE // SECTION DE L'ACTION PUBLIQUE",
    messagesParDossier: (id, actions) => {
      const msgs: string[] = [];

      if (id === "DOS-B75-0814") {
        msgs.push("Guichard : J'ai besoin d'une qualification en béton armé pour classer sans suite la plainte pour mutilation.");
        msgs.push("Si vous caviardez les éléments démontrant la violence de l'attroupement, vous sciez la branche sur laquelle repose mon réquisitoire !");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Guichard : Le bâtonnier de Paris suit ce dossier de près. Mon parquet requerra le non-lieu sous réserve d'un dossier médical allégé.");
        msgs.push("Ne laissez traîner aucun diagnostic de commotion cérébrale non certifié par notre médecin légiste assermenté.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Guichard : 21 jours d'ITT pour le Brigadier Marc Vasseur ! Je veux une comparution immédiate et un mandat de dépôt dès demain 14h.");
        msgs.push("La vidéo montre la rébellion physique : c'est notre pièce maîtresse d'accusation. Malheur à celui qui l'égarerait !");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Guichard : Décès en garde à vue : j'ai ordonné l'ouverture d'une information judiciaire contre X pour 'recherche des causes de la mort'.");
        msgs.push("Si la vidéo du couloir fait surface, le juge d'instruction ne me lâchera plus. Agissez en conséquence.");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Guichard : Sur le RIO, ne jouez pas aux imbéciles si des tiers ont déjà versé les captures d'écran à la procédure.");
      } else if (id === "DOS-B75-2204") {
        msgs.push("Guichard : Refus d'obtempérer aggravé. J'attends votre visa pour qualifier la tentative d'homicide sur fonctionnaire de police.");
      } else {
        msgs.push("Guichard : Officier, le Parquet attend vos visas d'imputation. Veillez à la cohérence formelle des pièces versées.");
      }

      if (actions.fuiteFaite) {
        msgs.push("Guichard : ⚠️ QU'EST-CE QUE C'EST QUE CE BORDEL ? L'avocate de la partie adverse vient de citer à l'audience des éléments de mon dossier confidentiel ! Une taupe transmet les PV !");
      }

      if (actions.rioDecision === "valider") {
        msgs.push("Guichard : RIO conforme acté au dossier. C'est inattaquable devant la chambre de l'instruction.");
      } else if (actions.rioDecision === "flouter") {
        msgs.push("Guichard : Floutage d'anonymat opérationnel invoqué. Espérons qu'aucune photo contradictoire n'apparaisse à l'audience.");
      }

      if (actions.riposte) {
        msgs.push("Guichard : PV d'outrage bien reçu. Je mandate le substitut pour requérir le maximum légal.");
      }

      if (actions.credibilite !== undefined && actions.credibilite < 50) {
        msgs.push("Guichard : ⚖️ Avertissement du Parquet : vos incohérences de qualification fragilisent mes réquisitions à l'audience !");
      }

      return msgs;
    }
  },
  {
    id: "vasseur",
    nom: "CHRISTIAN VASSEUR",
    role: "Secrétaire Général National // Alliance & Ordre Républicain",
    avatarEmoji: "👮‍♂️",
    ip: "10.88.5.21",
    statut: "EN LIGNE // PERMANENCE SYNDICALE",
    messagesParDossier: (id, actions) => {
      const msgs: string[] = [];

      msgs.push("Vasseur : Salut camarade ! La mutuelle et l'amicale sont derrière toi. Aucun collègue ne doit être jeté aux lions !");

      if (id === "DOS-B75-0814") {
        msgs.push("Vasseur : Le tireur LBD, c'est mon cousin Marc Vasseur, délégué de la Brigade 4B. Un flic en or.");
        msgs.push("Son RIO était masqué par du scotch noir pour le protéger des représailles. Si le plaignant ouvre sa gueule, colle-lui un outrage réflexe direct !");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Vasseur : Le gars au sol a fait un malaise parce qu'il n'avait pas l'habitude de courir, c'est tout. Couvre les collègues de la BAC !");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Vasseur : C'est encore Marc qui a pris ! Le petit merdeux lui a défoncé la main avec sa mâchoire. On veut 21 jours d'ITT et la prime maximale !");
        msgs.push("Marc est le fer de lance du syndicat. S'il est mis en cause, on bloque les commissariats de toute l'Île-de-France.");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Vasseur : Marc gérait le sas cette nuit-là. Le gaillard pesait 100 kg, ils ont fait ce qu'ils ont pu pour le calmer. Si la vidéo fuite, les banlieues brûlent. Débranche la prise de la caméra sans l'ombre d'un scrupule !");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Vasseur : L'étudiant jouait les gros bras en manif. Un bon coup de bouclier pédagogique n'a jamais tué personne.");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Vasseur : Marc est sur le tableau de promotion pour passer Major. Cette histoire de coup de pied sur le mineur ne doit même pas exister dans les archives.");
      } else if (id === "DOS-B75-2810") {
        msgs.push("Vasseur : Rodéo sauvage : le chauffard s'est empalé tout seul sur le pare-choc. C'est la faute de la physique, pas des collègues.");
      } else if (id === "DOS-B75-3112") {
        msgs.push("Vasseur : Aujourd'hui, on débouche le champagne : Marc reçoit sa médaille ministérielle si ton dossier est propre. Pas d'erreur camarade !");
      } else {
        msgs.push("Vasseur : Règle d'or corporatiste : on protège toujours le porteur de l'uniforme. L'administration paie les primes, nous on assure la défense.");
      }

      if (actions.fuiteFaite) {
        msgs.push("Vasseur : 🤬 C'EST QUOI CE BORDEL ?! Mediapart vient de sortir un papier accusant nommément Marc Vasseur ! Il y a un traître dans ton bureau ! Si je découvre qui c'est, je lui colle tout le syndicat sur le dos !");
      }

      if (actions.riposte) {
        msgs.push("Vasseur : Bravo pour l'outrage ! C'est comme ça qu'on fait taire les réclamations. La prime mutuelle est bien méritée !");
      }

      if (actions.cameraDecision === "neutralisee") {
        msgs.push("Vasseur : Bien joué pour la caméra. Les caméras piétons, c'est du flicage interne, une panne opportune remet les pendules à l'heure.");
      }

      return msgs;
    }
  },
  {
    id: "sorel",
    nom: "ME CAMILLE SOREL",
    role: "Avocate au Barreau de Paris // Collectif Vérité & Libertés Citoyennes",
    avatarEmoji: "⚖️",
    ip: "127.0.0.1:9050 [CANAL PROXY SIGNAL-TOR]",
    statut: "EN LIGNE // CANAL CHIFFRÉ CLANDESTIN",
    messagesParDossier: (id, actions) => {
      const msgs: string[] = [];

      msgs.push("Me Sorel : [CANAL CHIFFRÉ SÉCURISÉ] Officier, je sais à quelle pression Beauvau vous soumet quotidiennement.");
      msgs.push("Me Sorel : Vous êtes le seul rempart entre la vérité factuelle et l'enterrement définitif de ces dossiers. Vous pouvez agir.");

      if (id === "DOS-B75-0814") {
        msgs.push("Me Sorel : Regardez le nom du tireur : Brigadier Marc Vasseur, Brigade 4B. RIO #754981 masqué au chatterton noir. C'est sa 4e intervention avec mutilation au LBD !");
        msgs.push("Me Sorel : Si vous caviardez les 4 fractures costales et l'œil crevé, la victime sera déboutée. Si vous refusez de détruire la vidéo et que vous me transmettez la copie brute, nous pourrons saisir le Défenseur des Droits.");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Me Sorel : M. Youssef B. est entre la vie et la mort à l'hôpital. La police parle de 'convulsions sans lien', mais c'est un coup de matraque direct à la tempe.");
        msgs.push("Me Sorel : La photo de presse a déjà été publiée : ils ne peuvent pas l'effacer. Préservez-la coûte que coûte au dossier.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Me Sorel : C'est le scandale absolu : Marc Vasseur s'est fracturé le poing en frappant Bilal M. au visage, et ils osent poursuivre le jeune pour violences avec 21 jours d'ITT !");
        msgs.push("Me Sorel : Si vous signez ce mandat de dépôt, ce gamin de 19 ans part en détention provisoire à Fleury-Mérogis. Ne caviardez pas l'aveu du coup de poing !");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Me Sorel : ALERTE HUMANITAIRE : Adama D. a été étouffé sous les yeux de Marc Vasseur. Le pré-rapport d'autopsie mentionne des pétéchies pleurales incontestables.");
        msgs.push("Me Sorel : S'ils réussissent à substituer ce rapport par une expertise de complaisance, la famille n'aura jamais justice. Transmettez-moi la pièce brute !");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Me Sorel : Idriss K. est un étudiant brillant. Il a simplement demandé poliment le matricule d'un agent qui refusait de s'identifier. Demander le RIO n'est PAS un outrage, c'est l'article R. 434-15 du code de la sécurité intérieure.");
        msgs.push("Me Sorel : Ne validez pas l'inversion accusatoire !");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Me Sorel : Un adolescent de 15 ans frappé à terre. Les certificats médicaux prouvent la violence délibérée de Marc Vasseur.");
      } else if (id === "DOS-B75-3112") {
        msgs.push("Me Sorel : C'est le moment de vérité, Officier. Ils s'apprêtent à décorer Marc Vasseur et à maquiller les bilans annuels.");
        msgs.push("Me Sorel : Si vous refusez de cautionner ce non-lieu final et que vous révélez l'ampleur du système, nous saisirons la Commission d'Enquête Parlementaire.");
      } else {
        msgs.push("Me Sorel : Les administrés comptent sur votre probité morale. La vérité finit toujours par triompher si quelqu'un à l'intérieur ose parler.");
      }

      if (actions.fuiteFaite) {
        msgs.push("Me Sorel : ✊ Bien reçu ! Le dossier brut non caviardé est arrivé sur notre serveur sécurisé. La presse d'investigation et la LDH sont saisies. L'omerta commence à se fissurer grâce à vous !");
      }

      return msgs;
    }
  },
  {
    id: "lefebvre",
    nom: "BRUNO LEFEBVRE",
    role: "Chef de Régie Vidéoprotection // Unité CSU & Flux Tactiques",
    avatarEmoji: "📹",
    ip: "172.16.4.18",
    statut: "EN LIGNE // SALLE DE SUPERVISION URBAINE",
    messagesParDossier: (id, actions) => {
      const msgs: string[] = [];

      msgs.push("Lefebvre : Poste régie CSU à l'écoute. J'ai les flux de toutes les caméras de la voie publique synchronisés.");

      if (id === "DOS-B75-0814") {
        msgs.push("Lefebvre : La caméra CAM_07 avait un angle rasant. On aperçoit Marc Vasseur pointer son LBD à hauteur de tête. Purger la bande SD effacera la trajectoire.");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Lefebvre : Attention : le cameraman local était à 5 mètres. Si le flux de la ville montre le même coup de bâton sous un autre angle, purgez la bande municipale pour éviter la contradiction.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Lefebvre : La caméra du sas d'entrée a enregistré toute la scène de l'altercation avec Vasseur. C'est la preuve maîtresse du Parquet, ne la supprimez surtout pas !");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Lefebvre : Sur le sas de fouille, j'ai une micro-coupure réseau déclarée à 03h12 ordonnée par la brigade de Vasseur. Si vous appuyez sur purger, j'enregistre l'erreur 0x8894 sans laisser de traces.");
      } else if (id === "DOS-B75-2204") {
        msgs.push("Lefebvre : Caméra embarquée du véhicule sérigraphié : on voit parfaitement le pare-choc adverse foncer sur le capot.");
      } else {
        msgs.push("Lefebvre : Je contrôle l'archivage. Déduisez bien si la bande sert l'accusation ou si elle incrimine l'équipage avant de toucher au disjoncteur.");
      }

      if (actions.cameraDecision === "neutralisee") {
        msgs.push("Lefebvre : Commande de purge exécutée. Fichier vidéo écrasé par des zéros binaires sur les serveurs CSU.");
      } else if (actions.cameraDecision === "conservee") {
        msgs.push("Lefebvre : Flux vidéo scellé et versé au registre des preuves numériques.");
      }

      return msgs;
    }
  },
  {
    id: "tardieu",
    nom: "COMMISSAIRE JEAN-MARC TARDIEU",
    role: "Chef de Division // IGPN (Inspection Générale de la Police Nationale)",
    avatarEmoji: "🕵️‍♂️",
    ip: "10.12.0.1",
    statut: "EN LIGNE // AUDITS DÉONTOLOGIQUES BEAUVAU",
    messagesParDossier: (id, actions) => {
      const msgs: string[] = [];

      msgs.push("Tardieu : Division des enquêtes internes. Nous veillons à ce que chaque apurement contentieux respecte les apparences de la déontologie.");

      if (id === "DOS-B75-0814") {
        msgs.push("Tardieu : Le Brigadier Marc Vasseur a déjà fait l'objet de 3 signalements déontologiques sans suite. Si le RIO était volontairement dissimulé par du scotch noir, la prudence procédurale s'impose.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Tardieu : Nos enquêteurs ont auditionné le fonctionnaire Marc Vasseur. Son témoignage est limpide : conservez l'intégralité des preuves matérielles de l'agression.");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Tardieu : Ce dossier de garde à vue engage la responsabilité de la France devant la Cour Européenne des Droits de l'Homme. Moins il y a d'éléments matériels contradictoires, plus vite l'enquête interne conclura au respect strict des règles de sécurité.");
      } else {
        msgs.push("Tardieu : L'IGPN classe 98,7% des signalements sans suite lorsque les officiers d'instruction rédigent des bordereaux impeccables. Soyez méticuleux.");
      }

      if (actions.credibilite !== undefined && actions.credibilite >= 80) {
        msgs.push("Tardieu : Votre rigueur procédurale honore le corps de contrôle. Aucun soupçon de partialité ne peut être retenu.");
      } else if (actions.credibilite !== undefined && actions.credibilite < 45) {
        msgs.push("Tardieu : ⚠️ Signalement déontologique : vos incohérences flagrantes attirent l'œil de la commission d'audit interne.");
      }

      return msgs;
    }
  }
];
