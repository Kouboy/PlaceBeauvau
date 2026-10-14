# CREDITS & LICENCES AUDIO — KIT A1 (PLACE BEAUVAU / CHEOPS)

Ce document répertorie les sources, licences et conditions de réutilisation des enregistrements audio composant le **Kit A1** d'ambiance sonore diégétique pour le simulateur *Impunité Administrative // CHEOPS Contentieux*.

---

## 1. Fichiers DEMO de maquettage (`public/audio/demo/`)

Ces fichiers `.ogg` sont des maquettes procédurales de référence synthétisées pour valider le calibrage psychoacoustique (spectres feutrés, résonance de bureau de fonctionnaire, absence de crêtes agressives, latence zéro) :

* **`00_roomtone_feutre_DEMO.ogg`**  
  *Nature :* Boucle de présence d'ambiance (ronronnement 50 Hz néon, souffle tour PC basse fréquence 65–280 Hz, acoustique feutrée).  
  *Licence :* CC0 1.0 Universal (Domaine Public).

* **`01_clavier_lointain_DEMO.ogg`**  
  *Nature :* Cliquetis étouffé de clavier informatique à membrane, réverbéré derrière une cloison.  
  *Licence :* CC0 1.0 Universal (Domaine Public).

* **`02_photocopieuse_lointaine_DEMO.ogg`**  
  *Nature :* Bruit mécanique lointain de passage de papier et d'entraînement rouleau.  
  *Licence :* CC0 1.0 Universal (Domaine Public).

* **`03_porte_feutree_DEMO.ogg`**  
  *Nature :* Claquement étouffé de porte lourde avec joint isolant.  
  *Licence :* CC0 1.0 Universal (Domaine Public).

* **`04_tasse_cafe_bureau_DEMO.ogg`**  
  *Nature :* Bruit de tasse en céramique reposée sur soucoupe.  
  *Licence :* CC0 1.0 Universal (Domaine Public).

* **`05_papier_classeur_DEMO.ogg`**  
  *Nature :* Froissement discret et manipulation de chemise cartonnée d'archives.  
  *Licence :* CC0 1.0 Universal (Domaine Public).

* **`06_telephone_lointain_DEMO.ogg`**  
  *Nature :* Sonnerie étouffée de poste fixe analogique au bout d'un couloir.  
  *Licence :* CC0 1.0 Universal (Domaine Public).

---

## 2. Enregistrements réels libres (`scripts/fetch_real_samples.mjs`)

Enregistrements authentiques documentés et téléchargeables pour les environnements avec connectivité réseau active :

* **Ventilation / Room tone de bureau :**  
  *Source :* Wikimedia Commons  
  *Auteur :* Domaine Public  
  *Licence :* CC0 1.0 Universal

* **Clavier bureautique :**  
  *Source :* Wikimedia Commons  
  *Auteur :* Domaine Public  
  *Licence :* CC0 1.0 Universal

* **Photocopieuse & imprimante de service :**  
  *Source :* Wikimedia Commons  
  *Auteur :* Wikimedia Contributor  
  *Licence :* Creative Commons Attribution 3.0 Unported (CC BY 3.0)

* **Porte et cloisons de bureau :**  
  *Source :* Freesound / Wikimedia Commons  
  *Licence :* CC0 1.0 Universal

---

## 3. Synthèse procédurale Web Audio API (`src/services/soundFx.ts` & `src/audio.ts`)

L'ensemble des interactions réactives immédiates (tampon sec lourd, bip de télégramme télex, déchiquetage broyeuse, rotation d'horodateur, frappes souris) est généré en temps réel via l'API Web Audio native du navigateur :
* Aucune dépendance externe propriétaire.
* Code source ouvert sous licence libre du projet *Impunité Administrative*.
