# Impunité Administrative — CHEOPS Contentieux

> **Simulateur bureaucratique et judiciaire satirique sur l'auto-amnistie institutionnelle.**  
> *Inspiré des mécanismes procéduraux réels de qualification contentieuse et de protection hiérarchique.*

---

## ⚠️ Avertissements de Contenu (Trigger Warning)

Ce jeu aborde des thématiques sensibles, violentes et potentiellement éprouvantes :
- **Violences policières et maintien de l'ordre** (traumatismes crâniens, mutilations au LBD, asphyxie positionnelle, décès lors d'interpellations).
- **Cynisme bureaucratique, déni institutionnel et inversion de la culpabilité**.
- **Effets visuels rétro** (scanlines cathodiques, esthétique CCTV surveillance, flashs ponctuels de télégrammes d'alerte).

Ce projet s'adresse à un public averti, capable d'appréhender une critique politique et sociologique par le prisme de la simulation interactive.

---

## ⚖️ Clause de Non-Responsabilité (Disclaimer)

1. **Œuvre de fiction satirique à portée civique et artistique :**  
   *Impunité Administrative* est une création indépendante et critique. L'application met en scène des situations inspirées de typologies de contentieux documentées par la presse d'investigation, les rapports associatifs (Amnesty International, Ligue des Droits de l'Homme) et les décisions de justice administrative ou pénale des dernières décennies.
2. **Anonymisation et portée systémique :**  
   Les numéros de bordereaux, identités d'agents et références précises sont fictifs ou synthétisés. L'objectif n'est pas la mise en cause diffamatoire d'individus particuliers, mais l'analyse critique des **mécanismes systémiques** : comment la novlangue administrative, la requalification systématique des faits et le classement sans suite fabriquent mécaniquement l'impunité.
3. **Absence de conseil juridique :**  
   Les articles cités (notamment l'article L. 435-1 du Code de la sécurité intérieure ou les motifs de récursoire) reflètent l'usage discursif observé dans les mémoires en défense administratifs et ne constituent en aucun cas une doctrine juridique opposable.

---

## 💡 Concept & Boucle de Gameplay

Dans la lignée des jeux de simulation bureaucratique morale (tels que *Papers, Please* de Lucas Pope), vous incarnez un juriste instructeur affecté à la **Direction du Contentieux et des Affaires Juridiques (CHEOPS)**, opérant depuis un poste de travail d'époque (Windows XP) sous double tutelle préfectorale et inspection générale.

### La Boucle de Décision :
1. **Examen du bordereau :** Confrontation immédiate entre les constatations matérielles (témoignages, rapports médicaux, flux vidéo CCTV) et la gravité réelle des blessures.
2. **Qualification sous contrainte :** Choix impératif du visa ministériel conforme aux circulaires de commandement :
   - **`[NON-LIEU // USAGE CONFORME]` :** Graduation réputée proportionnée (L. 435-1), aléa médical autonome pour écarter tout lien de causalité.
   - **`[VIOLENCES SUR DÉPOSITAIRE]` :** Inversion procédurale transformant l'administré blessé en auteur de violences volontaires (blessure de l'agent au contact, dégradation d'effets de dotation).
   - **`[ENTRAVE & TAPAGE ILLICITE]` :** Incrimination de l'usager pour perturbation matérielle de l'ordre public sonore ou spatial.
3. **Levée des scellés & Rapport officiel :** L'homologation déverrouille le rapport de commandement rédigé pour le Parquet, matérialisant la fabrication de la version officielle.
4. **Pression hiérarchique :**  
   Un délai réglementaire strict s'applique. Tout refus ou qualification non conforme entraîne un rappel à l'ordre immédiat. **3 rappels = suspension administrative et radiation**.

---

## 🎯 Intention Artistique & Game Design

* **L'écran de fumée du jargon :**  
  Montrer comment une terminologie technocratique feutrée (*« manœuvre d'anticipation cinétique »*, *« agitation corporelle désordonnée »*, *« interposition maxillo-faciale »*) permet d'euphémiser et d'effacer la réalité crue de la violence physique.
* **La position de l'exécutant ordinaire :**  
  Le jeu installe le joueur dans une position d'inconfort éthique. Pour progresser et préserver sa carrière, il doit activement participer au blanchiment des procédures et à la neutralisation des recours des victimes.
* **Gamefeel diégétique et immersif :**
  - Environnement de bureau virtuel Windows XP complet (gestion des fenêtres, barre des tâches, z-index, alertes sonore de messagerie instantanée interne).
  - Moteur audio Web Audio procédural (clic mécanique, claquement lourd du tampon officiel, bips système d'époque, absence de latence).
  - CCTV et photothèque de pièces versées au dossier avec grain CRT cathodique maîtrisé.
  - Bilan de fin de service calculant le taux d'alignement doctrinal et le profil psychologique d'obéissance de l'agent.

---

## 🚀 Installation & Lancement

### Prérequis
- [Node.js](https://nodejs.org/) version 18 ou supérieure.
- Gestionnaire de paquets `npm`.

### Installation locale
```bash
# Cloner le dépôt
git clone https://github.com/<votre-compte>/<nom-du-repo>.git
cd <nom-du-repo>

# Installer les dépendances (lockfile propre)
npm install

# Démarrer le serveur de développement
npm run dev
```
L'application s'ouvre par défaut sur `http://localhost:3000`.

### Compilation pour la production
```bash
npm run build
```
Les fichiers statiques optimisés sont générés dans le dossier `dist/`.

---

## 📦 Formats de Distribution & Standalone

Le projet prend en charge plusieurs modes d'utilisation hors navigateur conventionnel :

1. **Progressive Web App (PWA) :**  
   Compatible Chrome, Edge, Safari et mobile. L'application propose un bouton d'installation directe pour fonctionner dans une fenêtre autonome et **100% hors-ligne** (assets et sons mis en cache par Service Worker).
2. **Version mono-fichier Zero-Install :**  
   Le fichier `public/standalone.html` est directement exécutable par double-clic sur n'importe quelle machine sans aucun serveur ou runtime requis.
3. **Application de bureau native (Tauri / Electron) :**  
   La structure du build (`base: './'`) est prête pour un empaquetage immédiat via Tauri 2.0 (exécutable `.exe` / `.dmg` de 15 Mo) ou Electron.

---

## 📄 Licence

Projet distribué sous licence libre à des fins d'éducation aux médias, de sensibilisation critique et de création artistique.  
Toute reproduction à des fins de propagande haineuse ou de justification de violences illégitimes est prohibée.
