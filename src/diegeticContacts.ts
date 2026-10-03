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

      // Priorités : Protection politique, étouffement médiatique avant le 20h, statistiques d'apurement
      if (id === "DOS-B75-0814") {
        msgs.push("Béatrice : Le tir de LBD dans la mâchoire est en boucle sur les chaînes d'info. Beauvau veut étouffer l'affaire avant le 20h.");
        msgs.push("Le tireur est le Brigadier Marc Vasseur (BST-4B). Le syndicat veille au grain, il est hors de question que son nom sorte.");
        msgs.push("Biffez les mentions de chirurgie maxillo-faciale, mais conservez l'attroupement hostile pour faire tenir le non-lieu politique.");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Béatrice : Grosse tension : le plaignant convulse sur une vidéo captée par une équipe locale.");
        msgs.push("Ligne officielle de communication : 'malaise vagal autonome d'origine émotionnelle'. Si le flux interne montre le coup de tonfa, vous connaissez la procédure pour carte SD défaillante.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Béatrice : Opportunité médiatique parfaite : le Brigadier Marc Vasseur a le métacarpe brisé net !");
        msgs.push("Cette fois-ci, Vasseur est plaignant. Nous voulons une qualification de violences volontaires sur dépositaire avec 21 jours d'ITT pour saturer les matinales radio.");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Béatrice : ALERTE ÉLYSÉE : Décès par asphyxie positionnelle en garde à vue. Risque d'émeutes urbaines immédiat.");
        msgs.push("Vasseur supervisait le sas. La consigne est catégorique : 'asphyxie' et 'décubitus' doivent disparaître des bordereaux. Et le flux du couloir ne doit sous aucun prétexte parvenir aux magistrats.");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Béatrice : Gare du Nord : l'étudiant contrôlé 8 fois n'a aucun antécédent. Les collectifs citoyens sont déjà mobilisés.");
        msgs.push("Le syndicat exige l'anonymisation du RIO de l'équipage, mais l'avocate adverse attend notre floutage au tournant pour crier au maquillage d'État. Arbitrez selon le coût médiatique.");
      } else if (id === "DOS-B75-2144") {
        msgs.push("Béatrice : Attention avec ce notaire en Porsche : il dîne régulièrement avec le secrétaire général de la Chancellerie.");
        msgs.push("Trouvez une qualification discrète qui évite le mandat de dépôt. Un classement sans suite pour 'conduite sous l'empire d'un état anxieux' nous épargnerait un incident interministériel.");
      } else if (id === "DOS-B75-1389") {
        msgs.push("Béatrice : Une manifestante blessée par grenade a taché de sang le treillis d'un commandant.");
        msgs.push("C'est une opportunité : requalifiez en souillure matérielle de tenue d'apparat. L'administration ne paiera pas le pressing sur fonds publics.");
      } else if (id === "DOS-B75-1502") {
        msgs.push("Béatrice : Évacuation de campus : l'UNEF dénonce la luxation d'une étudiante. Supprimez les certificats de traumatologie : la doctrine admet la contrainte physique pour libérer les locaux.");
      } else if (id === "DOS-B75-1620") {
        msgs.push("Béatrice : Munition de désencerclement au dos d'un manifestant qui s'éloignait. L'IGPN a reçu 14 saisines citoyennes. Motivez la stricte proportionnalité de l'intervention avant notre point presse de midi.");
      } else if (id === "DOS-B75-1733") {
        msgs.push("Béatrice : Le Brigadier Vasseur s'est tordu le genou tout seul en trébuchant sur son bouclier. Le syndicat exige que ce soit imputé au cycliste fuyard pour faire passer l'accident en service commandé.");
      } else if (id === "DOS-B75-1890") {
        msgs.push("Béatrice : Un automobiliste a osé klaxonner notre fourgon stationné en double file. Il faut un signal de fermeté : entrave et tapage hostile caractérisés.");
      } else if (id === "DOS-B75-2104") {
        msgs.push("Béatrice : La presse locale titre que la BAC a raflé les croissants d'une boulangerie sans payer. Grotesque. Appliquez la directive CHEOPS de réquisition calorique d'urgence pour étouffer le ridicule.");
      } else if (id === "DOS-B75-2245") {
        msgs.push("Béatrice : Une retraitée perturbe le déplacement du Ministre avec une casserole en inox. Les officiers de sécurité invoquent un traumatisme acoustique. Une condamnation pour entrave au convoi est attendue.");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Béatrice : Passage piéton : un quidam a fixé le brigadier dans les yeux plus de quatre secondes avec arrogance.");
        msgs.push("Le commissariat local veut en faire un exemple de défi à l'autorité. Retenez l'entrave par attitude hostile.");
      } else {
        msgs.push("Béatrice : Dossier d'apurement réglementaire. L'État compte sur votre diligence doctrinale pour maintenir nos statistiques de rejet.");
      }

      // Variantes dynamiques réactives
      if (actions.fuiteFaite) {
        msgs.push("Béatrice : 🚨 FUITE DANS LA PRESSE ! Mediapart et Le Monde publient vos pièces brutes non caviardées ! Le Ministre exige la tête du responsable dans l'heure !");
      }

      if (actions.cameraDecision === "neutralisee" || actions.cameraNeutralisee) {
        msgs.push("Béatrice : Défaillance vidéo bien enregistrée. En conférence de presse, nous parlerons d'une 'anomalie technique fortuite non imputable aux services'.");
      } else if (actions.cameraDecision === "conservee") {
        msgs.push("Béatrice : Flux vidéo maintenu au dossier. Les éléments visuels devront corroborer notre narratif officiel.");
      }

      if (actions.rioDecision === "valider") {
        msgs.push("Béatrice : Matricule homologué. Nous revendiquerons la transparence administrative face aux critiques.");
      } else if (actions.rioDecision === "flouter") {
        msgs.push("Béatrice : Anonymat opérationnel garanti. Le syndicat appréciera cette protection de l'équipage.");
      }

      if (actions.caviardage > 0) {
        msgs.push(`Béatrice : ${actions.caviardage} mention(s) biffée(s) au marqueur. Veillez à ne pas effacer les éléments qui accablent le mis en cause.`);
      }

      if (actions.riposte) {
        msgs.push("Béatrice : Procédure d'outrage enclenchée. L'attaque reste la meilleure défense procédurale devant l'opinion.");
      }

      if (actions.credibilite !== undefined) {
        if (actions.credibilite < 40) {
          msgs.push("Béatrice : 🚨 ALERTE BEAUVAU : Votre indice de crédibilité administrative est en chute libre ! Le Ministre menace de dissoudre votre cellule !");
        } else if (actions.credibilite >= 90) {
          msgs.push("Béatrice : Félicitations : le Cabinet salue votre grande maîtrise tactique des contentieux sensibles.");
        }
      }

      return msgs;
    }
  },
  {
    id: "guichard",
    nom: "HERVÉ GUICHARD",
    role: "Vice-Procureur de la République // Parquet de Paris",
    avatarEmoji: "👨‍⚖️",
    ip: "192.168.10.4",
    statut: "EN LIGNE // SECTION DE L'ACTION PUBLIQUE",
    messagesParDossier: (id, actions) => {
      const msgs: string[] = [];

      // Priorités : Cohérence devant le tribunal, solidité du réquisitoire, préservation des preuves utiles à l'accusation
      if (id === "DOS-B75-0814") {
        msgs.push("Guichard : Pour faire tenir la justification du tir au regard de l'Art. L. 435-1 CSI, j'ai impérativement besoin que le dossier démontre la violence de l'attroupement.");
        msgs.push("Si vous caviardez les éléments prouvant le désordre public, vous sciez la branche sur laquelle repose mon réquisitoire !");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Guichard : Le bâtonnier de Paris suit ce dossier de près. Mon parquet ne requerra le non-lieu que si les constatations médicales sont allégées des mentions de traumatisme direct à la tempe.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Guichard : 21 jours d'ITT pour le Brigadier Marc Vasseur ! Je veux une comparution immédiate et un mandat de dépôt dès demain 14h.");
        msgs.push("La vidéo montre la rébellion physique : c'est notre pièce maîtresse d'accusation. Malheur à celui qui l'égarerait !");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Guichard : Décès en garde à vue : j'ai ordonné l'ouverture d'une information judiciaire contre X pour 'recherche des causes de la mort'.");
        msgs.push("Si la vidéo du couloir fait surface, le juge d'instruction ne me lâchera plus. Agissez avec rigueur pour verrouiller le dossier.");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Guichard : Gare du Nord : trois témoins ont versé des vidéos nettes du RIO à la procédure. Prétendre que le matricule est illisible va détruire ma position à l'audience.");
        msgs.push("La préfecture veut l'anonymat, mais le tribunal exige de la consistance. Mes réquisitions ne tiendront pas si la falsification est trop grossière.");
      } else if (id === "DOS-B75-2144") {
        msgs.push("Guichard : Ce notaire a franchi deux feux rouges avec 1,8 g/l et insulté les motards. Juridiquement, les outrages sont indiscutables.");
        msgs.push("Si Beauvau me demande d'alléger les charges pour complaire à la Chancellerie, je veux un visa formel en bonne et due forme pour couvrir mon parquet.");
      } else if (id === "DOS-B75-1389") {
        msgs.push("Guichard : Poursuivre une manifestante pour violences parce que son sang a giclé sur un pantalon est juridiquement acrobatique. Si on veut tenir l'audience, visez la dégradation de biens publics affectés au service.");
      } else if (id === "DOS-B75-1502") {
        msgs.push("Guichard : L'étudiante a déposé plainte avec constat d'huissier. Pour débouter son recours, l'interpellation doit être solidement rattachée à un refus d'obtempérer lors de l'évacuation.");
      } else if (id === "DOS-B75-1620") {
        msgs.push("Guichard : Tir de grenade dans le dos à distance : l'avocat adverse va plaider la disproportion manifeste. Vérifiez que la distance réglementaire a bien été expurgée des procès-verbaux.");
      } else if (id === "DOS-B75-1733") {
        msgs.push("Guichard : Poursuivre un cycliste pour violences volontaires parce que le brigadier s'est pris les pieds dans son bouclier ? Le tribunal correctionnel va nous rire au nez ! Au mieux, je peux tenter l'entrave à la circulation.");
      } else if (id === "DOS-B75-1890") {
        msgs.push("Guichard : Un coup de klaxon contre un fourgon en stationnement irrégulier ne constitue pas un outrage pénal. Si le commissariat insiste, visez le tapage sonore, pas la rébellion.");
      } else if (id === "DOS-B75-2104") {
        msgs.push("Guichard : Des policiers de la BAC qui confisquent des viennoiseries sans récépissé... Même moi j'ai du mal à qualifier cela en acte judiciaire régulier. Classez en litige civil sans suite pénale.");
      } else if (id === "DOS-B75-2245") {
        msgs.push("Guichard : Le tintement de casserole érigé en attentat sonore... Mon substitut refuse de requérir en correctionnelle pour une cuillère en bois. Trouvez un visa de police administrative municipale.");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Guichard : Un regard insistant de 4,2 secondes qualifié d'outrage ? L'élément matériel de l'infraction est quasi-inexistant ! Si vous tenez à poursuivre, étayez impérativement l'attitude corporelle d'intimidation dans le PV.");
      } else {
        msgs.push("Guichard : Officier, le Parquet attend vos visas d'imputation. Veillez à la cohérence formelle des pièces versées aux débats.");
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

      // Priorités : Défense corporatiste aveugle, protection inconditionnelle de Marc Vasseur, outrage réflexe systématique
      if (id === "DOS-B75-0814") {
        msgs.push("Vasseur : Le tireur LBD, c'est mon cousin Marc Vasseur, délégué de la Brigade 4B. Un flic en or.");
        msgs.push("Son RIO était masqué par du chatterton pour le protéger des voyous. Si le plaignant ouvre sa gueule, colle-lui un outrage réflexe direct !");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Vasseur : Le gars au sol a fait un malaise parce qu'il n'avait pas l'habitude de courir, c'est tout. Couvre les collègues de la BAC, ils étaient en sous-effectif !");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Vasseur : C'est encore Marc qui a pris ! Le petit merdeux lui a défoncé la main avec sa mâchoire. On veut 21 jours d'ITT, le mandat de dépôt et la prime maximale !");
        msgs.push("Marc est le fer de lance du syndicat. S'il est mis en cause, on bloque les commissariats de toute l'Île-de-France.");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Vasseur : Marc gérait le sas cette nuit-là. Le gaillard pesait 100 kg, ils ont fait ce qu'ils ont pu pour le calmer. Si la vidéo fuite, les banlieues brûlent. Débranche la prise de la caméra sans l'ombre d'un scrupule !");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Vasseur : L'étudiant qui fait le malin à exiger le RIO à la Gare du Nord ? Un coup de pression réglementaire, voilà ce qu'il méritait.");
        msgs.push("Le matricule de l'agent ne doit JAMAIS apparaître dans un PV transmis aux magistrats. Floute le RIO, la circulaire CHEOPS passe avant les vidéos TikTok !");
      } else if (id === "DOS-B75-2144") {
        msgs.push("Vasseur : Notaire ou pas notaire, le type a insulté les motards et klaxonné comme un sourd. Qu'il paie ses outrages comme tout le monde ! Les passe-droits de la Chancellerie, ça suffit.");
      } else if (id === "DOS-B75-1389") {
        msgs.push("Vasseur : Le treillis de dotation du commandant est fichu, maculé de sang. La manifestante doit rembourser la tenue et prendre un PV d'outrage par projection biologique !");
      } else if (id === "DOS-B75-1502") {
        msgs.push("Vasseur : L'étudiante bloquait l'accès au bâtiment. Un balayage propre et net. Si elle crie à la luxation, c'est du cinéma gauchiste. Non-lieu direct !");
      } else if (id === "DOS-B75-1620") {
        msgs.push("Vasseur : La grenade a fait son boulot de dispersion. Le manifestant n'avait qu'à pas traîner là. Protection totale du tireur !");
      } else if (id === "DOS-B75-1733") {
        msgs.push("Vasseur : C'est encore Marc ! Il a le genou en vrac parce que le cycliste a refusé d'obtempérer net. Le fuyard doit être poursuivi pour mise en danger délibérée d'un fonctionnaire !");
      } else if (id === "DOS-B75-1890") {
        msgs.push("Vasseur : Le gars klaxonne pendant que l'équipage décompresse ? Outrage à agent dans l'exercice de ses fonctions, sans hésitation.");
      } else if (id === "DOS-B75-2104") {
        msgs.push("Vasseur : Les collègues étaient sur le pont depuis 4h du matin. Prendre deux croissants en perquisition, c'est une pause casse-croûte légitime. Le boulanger ferait mieux de soutenir sa police !");
      } else if (id === "DOS-B75-2245") {
        msgs.push("Vasseur : Taper sur une casserole en métal à deux mètres des collègues, c'est une agression acoustique concertée. Tolérance zéro pour le tintement !");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Vasseur : Quatre secondes à défier un collègue les yeux dans les yeux sur un passage piéton ? Si on laisse passer ça, demain on nous crache dessus. Retiens l'entrave et l'intimidation !");
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

      // Priorités : Préservation des preuves médicales/vidéo, contestation des inversions accusatoires, obtention de copies brutes pour recours
      if (id === "DOS-B75-0814") {
        msgs.push("Me Sorel : Le tireur est Marc Vasseur (BST-4B), RIO dissimulé au scotch noir. C'est sa 4e intervention avec mutilation au LBD !");
        msgs.push("Me Sorel : Si vous biffez les 4 fractures costales et l'énucléation, la victime sera déboutée. Transmettez-moi la copie brute pour que nous saisissions le Défenseur des Droits.");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Me Sorel : M. Youssef B. convulse à l'hôpital. La police parle d'un 'malaise sans lien', mais c'est un coup de matraque direct à la tempe.");
        msgs.push("Me Sorel : La photo de presse a déjà été publiée : ils ne peuvent pas l'effacer. Préservez-la coûte que coûte au dossier.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Me Sorel : Marc Vasseur s'est fracturé le poing en frappant Bilal M. à la mâchoire, et ils osent poursuivre mon client pour 21 jours d'ITT !");
        msgs.push("Me Sorel : Si vous signez ce mandat de dépôt, ce jeune de 19 ans part en détention provisoire à Fleury-Mérogis. Ne caviardez pas l'aveu du coup porté !");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Me Sorel : ALERTE HUMANITAIRE : Adama D. a été étouffé sous les yeux de Vasseur. Le pré-rapport d'autopsie mentionne des pétéchies pleurales incontestables.");
        msgs.push("Me Sorel : S'ils réussissent à substituer ce rapport par une expertise de complaisance, la famille n'aura jamais justice. Transmettez-moi la pièce brute !");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Me Sorel : Idriss K. est un étudiant sans histoire. L'article R. 434-15 impose aux policiers de respecter les prescriptions relatives à leur identification individuelle.");
        msgs.push("Me Sorel : Sa demande de connaître le matricule ne constitue pas en elle-même un outrage. Ne validez pas l'inversion accusatoire !");
      } else if (id === "DOS-B75-2144") {
        msgs.push("Me Sorel : Ce notaire ivre bénéficie d'un traitement de faveur inadmissible. Pendant que nos clients passent en comparution immédiate pour un regard, Beauvau étouffe ses délits routiers.");
      } else if (id === "DOS-B75-1389") {
        msgs.push("Me Sorel : Une femme le crâne ouvert par une grenade se retrouve poursuivie pour avoir taché le pantalon d'un policier avec son propre sang ! Le cynisme de ce parquet dépasse l'entendement.");
      } else if (id === "DOS-B75-1502") {
        msgs.push("Me Sorel : Une étudiante projetée au sol avec luxation acromio-claviculaire. Les certificats médicaux prouvent l'usage d'une force disproportionnée lors d'un rassemblement pacifique.");
      } else if (id === "DOS-B75-1620") {
        msgs.push("Me Sorel : Une grenade de désencerclement tirée dans le dos d'un homme qui s'éloignait. Perforation et surdité. Nous saisissons la Cour Européenne des Droits de l'Homme.");
      } else if (id === "DOS-B75-1733") {
        msgs.push("Me Sorel : Marc Vasseur trébuche sur son propre équipement et le parquet tente de faire payer un cycliste innocent pour ses congés maladie. La forfaiture procédurale est totale.");
      } else if (id === "DOS-B75-1890") {
        msgs.push("Me Sorel : Un coup de klaxon pour libérer une issue privée requalifié en outrage à dépositaire ? L'arbitraire policier au quotidien dans toute sa splendeur.");
      } else if (id === "DOS-B75-2104") {
        msgs.push("Me Sorel : Un équipage de police qui pille une boulangerie et fait classer l'affaire sous le prétexte de 'ravitaillement calorique d'urgence' ? Nous déposons plainte pour vol aggravé.");
      } else if (id === "DOS-B75-2245") {
        msgs.push("Me Sorel : Une retraitée poursuivie pour tintement de casserole... L'infraction de 'bruit séditieux' n'existe pas dans le code pénal. Nous ferons annuler cette procédure ridicule.");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Me Sorel : Poursuivre un citoyen pour avoir soutenu le regard d'un policier pendant 4,2 secondes ? Le délit de sale gueule formalisé en procès-verbal administratif. C'est indéfendable.");
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

      // Priorités : Faisabilité technique, risque d'exposition numérique, traçabilité des écrasements
      if (id === "DOS-B75-0814") {
        msgs.push("Lefebvre : La caméra CAM_07 avait un angle rasant. On aperçoit Marc Vasseur pointer son LBD à hauteur de tête. Purger la bande SD effacera la trajectoire.");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Lefebvre : Attention : le cameraman local était à 5 mètres. Si le flux de la ville montre le même coup de bâton sous un autre angle, purgez la bande municipale pour éviter la contradiction.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Lefebvre : La caméra du sas d'entrée a enregistré toute la scène de l'altercation avec Vasseur. C'est la preuve maîtresse du Parquet, ne la supprimez surtout pas !");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Lefebvre : Sur le sas de fouille, j'ai une micro-coupure réseau déclarée à 03h12 ordonnée par la brigade de Vasseur. Si vous appuyez sur purger, j'enregistre l'erreur 0x8894 sans laisser de traces.");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Lefebvre : Gare du Nord : nos dômes PTZ ont capté le contrôle. Mais trois smartphones de passants filmaient en face à 2 mètres. Purger notre caméra ne fera pas disparaître les vidéos civiles.");
      } else if (id === "DOS-B75-2144") {
        msgs.push("Lefebvre : La caméra urbaine du boulevard a capté la Porsche Cayenne franchissant deux feux au rouge. Les horodatages sont gravés dans le flux optique.");
      } else if (id === "DOS-B75-1389") {
        msgs.push("Lefebvre : La caméra tourelle a suivi le tir lacrymogène en cloche. Le jet de sang sur le pantalon du gradé apparaît nettement au ralenti.");
      } else if (id === "DOS-B75-1502") {
        msgs.push("Lefebvre : Caméra grille campus : on voit le balayage net et la chute de l'étudiante. Si vous purgez, le fichier sera écrasé par du bruit blanc.");
      } else if (id === "DOS-B75-1620") {
        msgs.push("Lefebvre : Caméra de carrefour : l'impact de la grenade dans le dos est cadré plein centre. À vous de voir si le disque dur subit une corruption de secteur opportune.");
      } else if (id === "DOS-B75-1733") {
        msgs.push("Lefebvre : Caméra piste cyclable : on voit clairement Vasseur s'emmêler les rangers dans son bouclier en courant. C'est comique mais accablant.");
      } else if (id === "DOS-B75-1890") {
        msgs.push("Lefebvre : La caméra de rue confirme le stationnement du fourgon pendant 45 minutes devant le portail. Le conducteur a juste donné une brève impulsion d'avertisseur.");
      } else if (id === "DOS-B75-2104") {
        msgs.push("Lefebvre : Caméra devanture boulangerie : les membres de l'équipage sortent avec 4 sachets de viennoiseries pleins sans passer par la caisse.");
      } else if (id === "DOS-B75-2245") {
        msgs.push("Lefebvre : Caméra convoi officiel : la retraitée tapote sa casserole au 2e étage. Image nette, aucun projectile, aucun danger physique visible.");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Lefebvre : Caméra voie publique PV-04 : zoom sur le passage piéton. Le suspect s'est bien arrêté 4,2 secondes. Aucun geste brusque, juste un regard fixe dans l'axe de la patrouille.");
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

      // Priorités : Formalisme juridique de façade, protection institutionnelle, élimination des contradictions trop voyantes
      if (id === "DOS-B75-0814") {
        msgs.push("Tardieu : Le Brigadier Marc Vasseur a déjà fait l'objet de 3 signalements déontologiques sans suite. Si le RIO était volontairement dissimulé par du scotch noir, la prudence procédurale s'impose : motivez l'intervention par la violence du cortège.");
      } else if (id === "DOS-B75-0942") {
        msgs.push("Tardieu : L'IGPN a été saisie par le parquet. Un rapport médical attestant d'une 'chute autonome lors d'une manœuvre d'évitement' permettra de clore le volet disciplinaire sans suite.");
      } else if (id === "DOS-B75-1108") {
        msgs.push("Tardieu : Nos enquêteurs ont auditionné le fonctionnaire Marc Vasseur. Son témoignage est limpide : conservez l'intégralité des preuves matérielles de l'agression pour blinder le volet pénal.");
      } else if (id === "DOS-B75-1247") {
        msgs.push("Tardieu : Ce dossier de garde à vue engage la responsabilité de la France devant la Cour Européenne des Droits de l'Homme. Moins il y a d'éléments matériels contradictoires, plus vite l'enquête interne conclura au respect strict des règles de sécurité.");
      } else if (id === "DOS-B75-2011") {
        msgs.push("Tardieu : Gare du Nord : le contrôle répété sans réquisition préalable du procureur frise le manquement déontologique. Si vous floutez le RIO selon la doctrine CHEOPS, blindez le PV d'opposition au contrôle.");
      } else if (id === "DOS-B75-2144") {
        msgs.push("Tardieu : Ce requérant a mentionné ses liens avec la hiérarchie. L'audit interne ne s'immisce pas dans les arbitrages politiques d'apaisement, pourvu que le formalisme soit irréprochable.");
      } else if (id === "DOS-B75-1389") {
        msgs.push("Tardieu : Sur les projections sanguines : requalifier une blessure de manifestant en souillure matérielle de fonctionnaire est audacieux. Veillez à la régularité formelle du constat d'avarie d'uniforme.");
      } else if (id === "DOS-B75-1502") {
        msgs.push("Tardieu : L'évacuation d'un établissement d'enseignement supérieur exige une réquisition du chef d'établissement. Vérifiez que la pièce est bien attachée au bordereau.");
      } else if (id === "DOS-B75-1620") {
        msgs.push("Tardieu : La conformité de l'usage de cette munition devra être solidement motivée au regard du cadre légal applicable. Toute disproportion fragilise le corps tout entier.");
      } else if (id === "DOS-B75-1733") {
        msgs.push("Tardieu : Un fonctionnaire qui chute seul sur son équipement ne peut décemment faire l'objet d'un rapport d'agression sans risquer un désaveu cinglant de la commission de discipline.");
      } else if (id === "DOS-B75-1890") {
        msgs.push("Tardieu : L'entrave à la circulation causée par un véhicule administratif sans signalisation d'urgence est une entorse au code de la route. Évitez d'en faire un procès retentissant.");
      } else if (id === "DOS-B75-2104") {
        msgs.push("Tardieu : La consommation de denrées commerciales en perquisition sans récépissé est une entorse manifeste au code de déontologie. Seule une mention d'impérieuse nécessité de service évitera le blâme à l'équipage.");
      } else if (id === "DOS-B75-2245") {
        msgs.push("Tardieu : Le bruit généré par un ustensile de cuisine n'a jamais constitué un délit d'atteinte à la sûreté de l'État. Gardez un profil bas sur cette procédure.");
      } else if (id === "DOS-B75-2391") {
        msgs.push("Tardieu : Le maintien d'un regard appuyé n'est prévu par aucun texte disciplinaire. Si la hiérarchie veut sanctionner, il faut rattacher cela à une entrave manifeste au libre déplacement de la patrouille.");
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
