# RÈGLES D'INTÉGRATION AUDIO — KIT A1 (PLACE BEAUVAU / CHEOPS)

Ce guide fixe les principes directeurs de mixage, de déclenchement, de priorités et d'ergonomie pour l'ambiance sonore du simulateur *Impunité Administrative // CHEOPS Contentieux*.

---

## 1. Philosophie & Intention Diégétique

L'ambiance sonore de Place Beauvau traduit l'atmosphère feutrée, lourde et lénifiante d'une administration régalienne :
- Une acoustique mate et capitonnée, isolée du monde extérieur.
- Un confort de travail monotone qui anesthésie la portée morale des actes bureaucratiques.
- Un **bureau vivant et incarné** : des collègues travaillent dans les pièces voisines, des machines s'enclenchent, des dossiers se classent, un standard sonne au loin.

---

## 2. Hiérarchie & Mixage des Plans Sonores

### 1er Plan : Actions directes du joueur (Priorité MAXIMALE)
* **Événements :** Tampon officiel, sélection doctrinale, glisser-déposer de scellé, clic de souris microswitch, validation du bordereau.
* **Volume relatif :** 0 dB (gain nominal 0.65 à 0.85).
* **Règle :** Réponse instantanée (< 10 ms), netteté mécanique maximale. Aucun bruit d'ambiance ne doit masquer le retour perceptif du joueur.

### 2e Plan : Événements système réactifs (Priorité HAUTE)
* **Événements :** Arrivée d'un télégramme préfectoral, broyeuse de scellés, alerte chrono 25s, ouverture/fermeture de fenêtre Win32.
* **Volume relatif :** -6 dB à -10 dB (gain nominal 0.35 à 0.55).
* **Règle :** Feedback immédiat d'un changement d'état du système. Échelonnage temporel respecté (ex: pas de chevauchement entre impact de tampon et alerte télex).

### 3e Plan : Micro-événements diégétiques de bureau (Plan 3 / Présence)
* **Événements :**
  - `01_clavier_lointain_DEMO.ogg` : frappe vive et plastique d'un collègue sur clavier à membrane.
  - `02_photocopieuse_lointaine_DEMO.ogg` : défilement mécanique et entraînement de feuille réseau.
  - `03_porte_feutree_DEMO.ogg` : déclic de poignée et battement de porte de bureau sur joint.
  - `04_tasse_cafe_bureau_DEMO.ogg` : tintement net de céramique sur soucoupe et cuillère.
  - `05_papier_classeur_DEMO.ogg` : feuilletage d'un dossier et claquement sec des anneaux d'un classeur fédéral.
  - `06_telephone_lointain_DEMO.ogg` : sonnerie bitonale vintage (standard administratif).
  - `07_tampon_voisin_DEMO.ogg` : collègue d'un bureau voisin tamponnant un dossier.
  - `08_agrafeuse_DEMO.ogg` : agrafage mécanique métallique franc.
* **Volume relatif :** -12 dB à -16 dB (gain nominal 0.15 à 0.25).
* **Règle acoustique :** Filtrage passe-bas musical et aéré (2 800 à 4 000 Hz) afin de préserver l'attaque, le timbre et la reconnaissance des matières (porcelaine, métal, plastique, papier), avec panning stéréo spatialisé.

### 4e Plan : Roomtone diégétique continu (Priorité FOND)
* **Événements :** Fichier `00_roomtone_feutre_DEMO.ogg` (souffle tour PC Pentium 4, vibration de carcasse métallique 65 Hz, ronronnement néon 50 Hz).
* **Volume relatif :** -22 dB à -26 dB (gain nominal 0.04 à 0.08).
* **Règle :** Lecture continue en boucle sans coupure. Doit former un tapis sonore rassurant et discret sans étouffer les détails.

---

## 3. Règles de Déclenchement & Cadence

1. **Prise de poste immédiate :**
   Le premier micro-événement survient dès les premières secondes (2 à 4.5 s) après la prise de poste ou l'activation de l'ambiance, donnant instantanément vie à l'espace de travail.
2. **Rythme équilibré :**
   - Mode Standard : intervalle de 6 à 13 secondes.
   - Mode Dynamique : intervalle de 3.5 à 7.5 secondes.
   - Mode Discret : intervalle de 12 à 24 secondes.
   - Micro-enchaînements (18% de probabilité) : deux sons complémentaires espacés de 1.5 à 2.5 s (ex: frappe puis tasse de café).
3. **Anti-cacophonie :**
   Un seul micro-événement actif à la fois ; les événements consécutifs évitent la répétition immédiate du même échantillon.
4. **Contrôle & Test par le joueur :**
   - Curseur de volume ambiance dans la barre des tâches.
   - Bouton de test direct « Écouter un son de bureau » pour vérifier l'écoute à la demande.
   - Sélecteur de fréquence (Dynamique / Standard / Discrète).
   - Coupure intégrale instantanée en mode Muet.
5. **Neutralité sur le gameplay :**
   Les bruits d'ambiance n'ont aucun impact sur le score, les dossiers ou la qualification doctrinale.
