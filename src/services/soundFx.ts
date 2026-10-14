/**
 * MOTEUR AUDIO PROCÉDURAL DIÉGÉTIQUE (Web Audio API)
 * Sons rétro synthétisés à chaud : aucun fichier externe, latence zéro, réactivité totale.
 */

class DiegeticAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Configuration Ambiance Rétro & Bruitages Tactiles
  private isAmbianceActive: boolean = false;
  private isRetroMouseActive: boolean = true;
  private ambianceVolume: number = 0.35; // 0.0 à 1.0
  private ambianceMasterGain: GainNode | null = null;
  private fanNoiseSource: AudioBufferSourceNode | null = null;
  private fanFilter: BiquadFilterNode | null = null;
  private fanHumOsc: OscillatorNode | null = null;
  private neonOsc: OscillatorNode | null = null;
  private officeNoiseSource: AudioBufferSourceNode | null = null;
  private hddIntervalTimer: ReturnType<typeof setTimeout> | null = null;
  private lastPointerDownTime: number = 0;
  private hasInitializedAmbiance: boolean = false;

  // Kit A1 : Ambiance sonore diégétique externe & micro-événements
  private loadedAudioBuffers: Map<string, AudioBuffer> = new Map();
  private roomtoneSourceNode: AudioBufferSourceNode | null = null;
  private roomtoneGainNode: GainNode | null = null;
  private rareEventsTimer: ReturnType<typeof setTimeout> | null = null;
  private rareEventSourceNode: AudioBufferSourceNode | null = null;
  private isRareEventActive: boolean = false;
  private officeEventsMasterGain: GainNode | null = null;
  private officeEventPace: "fast" | "normal" | "slow" = "normal";
  private lastSampleIndex: number = -1;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener(
        "pointerdown",
        () => {
          this.handleGlobalPointerDown();
          if (!this.hasInitializedAmbiance && !this.isMuted) {
            this.hasInitializedAmbiance = true;
            this.startAmbiance();
          }
        },
        { capture: true, passive: true }
      );
    }
  }

  private handleGlobalPointerDown() {
    if (!this.isRetroMouseActive || this.isMuted) return;
    const now = performance.now();
    if (now - this.lastPointerDownTime < 45) return;
    this.lastPointerDownTime = now;
    this.playRetroMouseClick();
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx) {
      const t = this.ctx.currentTime;
      if (this.ambianceMasterGain) {
        this.ambianceMasterGain.gain.setValueAtTime(muted ? 0 : this.ambianceVolume * 0.12, t);
      }
      if (this.officeEventsMasterGain) {
        this.officeEventsMasterGain.gain.setValueAtTime(muted ? 0 : this.ambianceVolume * 0.70, t);
      }
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsAmbianceActive(): boolean {
    return this.isAmbianceActive;
  }

  public getAmbianceVolume(): number {
    return this.ambianceVolume;
  }

  public getIsRetroMouseActive(): boolean {
    return this.isRetroMouseActive;
  }

  public setRetroMouseActive(active: boolean) {
    this.isRetroMouseActive = active;
  }

  public getOfficeEventPace(): "fast" | "normal" | "slow" {
    return this.officeEventPace;
  }

  public setOfficeEventPace(pace: "fast" | "normal" | "slow") {
    this.officeEventPace = pace;
    if (this.rareEventsTimer) {
      clearTimeout(this.rareEventsTimer);
      this.rareEventsTimer = null;
      if (this.isAmbianceActive && !this.isMuted) {
        this.scheduleNextRareOfficeEvent(false);
      }
    }
  }

  public setAmbianceVolume(vol: number) {
    this.ambianceVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.isAmbianceActive && !this.isMuted) {
      const t = this.ctx.currentTime;
      if (this.ambianceMasterGain) {
        this.ambianceMasterGain.gain.setTargetAtTime(this.ambianceVolume * 0.12, t, 0.08);
      }
      if (this.officeEventsMasterGain) {
        this.officeEventsMasterGain.gain.setTargetAtTime(this.ambianceVolume * 0.70, t, 0.08);
      }
    }
  }

  public toggleAmbiance(): boolean {
    if (this.isAmbianceActive) {
      this.stopAmbiance();
      return false;
    } else {
      this.startAmbiance();
      return true;
    }
  }

  /**
   * Démarre l'ambiance de bureau feutrée :
   * - Souffle régulier du ventilateur tour PC (tour beige XP)
   * - Vibration 65 Hz de la carcasse en tôle
   * - Léger bourdonnement 50 Hz d'un tube néon fluorescent au plafond
   * - Rumeur feutrée d'open space
   * - Grattements aléatoires périodiques du disque dur IDE
   */
  public startAmbiance() {
    if (this.isAmbianceActive) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.isAmbianceActive = true;
      const t = this.ctx.currentTime;

      // Master Ambiance Gain
      if (!this.ambianceMasterGain) {
        this.ambianceMasterGain = this.ctx.createGain();
        this.ambianceMasterGain.connect(this.ctx.destination);
      }
      this.ambianceMasterGain.gain.setValueAtTime(0.0001, t);
      this.ambianceMasterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, this.ambianceVolume * 0.12),
        t + 1.2
      );

      // Master Office Events Gain (Plan 4 : calibré pour être net, audible et équilibré)
      if (!this.officeEventsMasterGain) {
        this.officeEventsMasterGain = this.ctx.createGain();
        this.officeEventsMasterGain.connect(this.ctx.destination);
      }
      this.officeEventsMasterGain.gain.setValueAtTime(0.0001, t);
      this.officeEventsMasterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, this.ambianceVolume * 0.70),
        t + 0.8
      );

      // 1. SOUFFLE VENTILATEUR TOUR PC (Bruit brun chaud en boucle)
      const dur = 4.0;
      const bufSize = Math.floor(this.ctx.sampleRate * dur);
      const fanBuffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const fanData = fanBuffer.getChannelData(0);
      let brown = 0;
      for (let i = 0; i < bufSize; i++) {
        const white = Math.random() * 2 - 1;
        brown = (brown + 0.02 * white) / 1.02;
        fanData[i] = brown * 3.2;
      }
      // Crossfade aux extrémités
      const fadeLen = Math.floor(this.ctx.sampleRate * 0.1);
      for (let i = 0; i < fadeLen; i++) {
        const ratio = i / fadeLen;
        fanData[i] = fanData[i] * ratio + fanData[bufSize - 1 - i] * (1 - ratio);
      }

      this.fanNoiseSource = this.ctx.createBufferSource();
      this.fanNoiseSource.buffer = fanBuffer;
      this.fanNoiseSource.loop = true;

      this.fanFilter = this.ctx.createBiquadFilter();
      this.fanFilter.type = "lowpass";
      this.fanFilter.frequency.setValueAtTime(340, t);
      this.fanFilter.Q.setValueAtTime(1.4, t);

      // Vibration carcasse métallique basse fréquence (65 Hz)
      this.fanHumOsc = this.ctx.createOscillator();
      this.fanHumOsc.type = "sine";
      this.fanHumOsc.frequency.setValueAtTime(65, t);
      const humGain = this.ctx.createGain();
      humGain.gain.setValueAtTime(0.12, t);
      this.fanHumOsc.connect(humGain);

      const fanMixGain = this.ctx.createGain();
      fanMixGain.gain.setValueAtTime(0.65, t);

      this.fanNoiseSource.connect(this.fanFilter);
      this.fanFilter.connect(fanMixGain);
      humGain.connect(fanMixGain);
      fanMixGain.connect(this.ambianceMasterGain);

      this.fanNoiseSource.start(t);
      this.fanHumOsc.start(t);

      // 2. BOURDONNEMENT NÉON FLUORESCENT (50 Hz)
      this.neonOsc = this.ctx.createOscillator();
      this.neonOsc.type = "sine";
      this.neonOsc.frequency.setValueAtTime(50, t);
      const neonGain = this.ctx.createGain();
      neonGain.gain.setValueAtTime(0.035, t);
      this.neonOsc.connect(neonGain);
      neonGain.connect(this.ambianceMasterGain);
      this.neonOsc.start(t);

      // 3. RUMEUR FEUTRÉE DE BUREAU (Bruit rose feutré passe-bande)
      const officeBuffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const officeData = officeBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        officeData[i] = (b0 + b1 + b2) * 0.35;
      }
      this.officeNoiseSource = this.ctx.createBufferSource();
      this.officeNoiseSource.buffer = officeBuffer;
      this.officeNoiseSource.loop = true;

      const officeFilter = this.ctx.createBiquadFilter();
      officeFilter.type = "bandpass";
      officeFilter.frequency.setValueAtTime(280, t);
      officeFilter.Q.setValueAtTime(1.8, t);

      const officeGain = this.ctx.createGain();
      officeGain.gain.setValueAtTime(0.2, t);

      this.officeNoiseSource.connect(officeFilter);
      officeFilter.connect(officeGain);
      officeGain.connect(this.ambianceMasterGain);

      this.officeNoiseSource.start(t);

      // 4. Programmation des grattements intermittents de disque dur
      this.scheduleNextHddChurn();

      // 5. Kit A1 : Ambiance feutrée de bureau via les enregistrements audio (.ogg)
      this.initRoomtoneOgg();
      this.scheduleNextRareOfficeEvent(true);
    } catch (err) {
      console.warn("Échec lancement ambiance rétro :", err);
    }
  }

  public stopAmbiance() {
    if (!this.isAmbianceActive) return;
    this.isAmbianceActive = false;

    if (this.hddIntervalTimer) {
      clearTimeout(this.hddIntervalTimer);
      this.hddIntervalTimer = null;
    }

    if (this.rareEventsTimer) {
      clearTimeout(this.rareEventsTimer);
      this.rareEventsTimer = null;
    }

    if (this.roomtoneSourceNode) {
      try {
        this.roomtoneSourceNode.stop();
        this.roomtoneSourceNode.disconnect();
      } catch (_) {}
      this.roomtoneSourceNode = null;
    }

    if (this.rareEventSourceNode) {
      try {
        this.rareEventSourceNode.stop();
        this.rareEventSourceNode.disconnect();
      } catch (_) {}
      this.rareEventSourceNode = null;
    }
    this.isRareEventActive = false;

    if (this.ctx) {
      const t = this.ctx.currentTime;
      if (this.ambianceMasterGain) {
        this.ambianceMasterGain.gain.setValueAtTime(this.ambianceMasterGain.gain.value, t);
        this.ambianceMasterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      }
      if (this.officeEventsMasterGain) {
        this.officeEventsMasterGain.gain.setValueAtTime(this.officeEventsMasterGain.gain.value, t);
        this.officeEventsMasterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      }

      setTimeout(() => {
        try {
          if (this.fanNoiseSource) {
            this.fanNoiseSource.stop();
            this.fanNoiseSource.disconnect();
            this.fanNoiseSource = null;
          }
          if (this.fanHumOsc) {
            this.fanHumOsc.stop();
            this.fanHumOsc.disconnect();
            this.fanHumOsc = null;
          }
          if (this.neonOsc) {
            this.neonOsc.stop();
            this.neonOsc.disconnect();
            this.neonOsc = null;
          }
          if (this.officeNoiseSource) {
            this.officeNoiseSource.stop();
            this.officeNoiseSource.disconnect();
            this.officeNoiseSource = null;
          }
        } catch (_) {}
      }, 450);
    }
  }

  private scheduleNextHddChurn() {
    if (!this.isAmbianceActive) return;
    const delay = 7000 + Math.random() * 11000; // Toutes les 7 à 18 secondes
    this.hddIntervalTimer = setTimeout(() => {
      if (this.isAmbianceActive && !this.isMuted) {
        this.playHddSeek(Math.random() > 0.4 ? "burst" : "short");
      }
      this.scheduleNextHddChurn();
    }, delay);
  }

  /**
   * Kit A1 : Chargement et décodage asynchrone des fichiers audio Web Audio
   */
  private async getDecodedBuffer(url: string): Promise<AudioBuffer | null> {
    if (!this.ctx) return null;
    if (this.loadedAudioBuffers.has(url)) {
      return this.loadedAudioBuffers.get(url)!;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(arrayBuffer);
      this.loadedAudioBuffers.set(url, decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Kit A1 : Initialisation de la boucle roomtone feutrée (.ogg)
   */
  private async initRoomtoneOgg() {
    if (!this.ctx || !this.ambianceMasterGain || !this.isAmbianceActive) return;
    try {
      const buffer =
        (await this.getDecodedBuffer("/audio/real/00_roomtone_feutre_REAL.ogg")) ||
        (await this.getDecodedBuffer("/audio/demo/00_roomtone_feutre_DEMO.ogg"));

      if (!buffer || !this.isAmbianceActive || !this.ctx || !this.ambianceMasterGain) return;

      if (this.roomtoneSourceNode) {
        try {
          this.roomtoneSourceNode.stop();
          this.roomtoneSourceNode.disconnect();
        } catch (_) {}
        this.roomtoneSourceNode = null;
      }

      this.roomtoneSourceNode = this.ctx.createBufferSource();
      this.roomtoneSourceNode.buffer = buffer;
      this.roomtoneSourceNode.loop = true;

      // Filtrage passe-bas pour préserver l'acoustique feutrée et mate
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.roomtoneGainNode = this.ctx.createGain();
      this.roomtoneGainNode.gain.setValueAtTime(0.55, this.ctx.currentTime);

      this.roomtoneSourceNode.connect(filter);
      filter.connect(this.roomtoneGainNode);
      this.roomtoneGainNode.connect(this.ambianceMasterGain);

      this.roomtoneSourceNode.start();
    } catch (_) {
      // Fallback automatique sur la synthèse procédurale
    }
  }

  /**
   * Kit A1 : Déclenchement périodique de micro-événements diégétiques de bureau.
   * Cadence recalibrée pour maintenir l'ambiance vivante sans temps mort frustrant.
   */
  private scheduleNextRareOfficeEvent(isInitial: boolean = false) {
    if (!this.isAmbianceActive) return;

    let minDelay = 6000;
    let maxRandom = 7000;

    if (this.officeEventPace === "fast") {
      minDelay = 3500;
      maxRandom = 4000;
    } else if (this.officeEventPace === "slow") {
      minDelay = 12000;
      maxRandom = 12000;
    }

    const delay = isInitial
      ? 2000 + Math.random() * 2500 // Dès 2 à 4.5 secondes au démarrage !
      : minDelay + Math.random() * maxRandom;

    this.rareEventsTimer = setTimeout(async () => {
      if (this.isAmbianceActive && !this.isMuted) {
        await this.playRareOfficeSound();

        // 18% de chance d'un mini-enchaînement cohérent (ex: collègue tape puis tasse, classeur puis agrafeuse)
        if (Math.random() < 0.18) {
          setTimeout(() => {
            if (this.isAmbianceActive && !this.isMuted) {
              this.playRareOfficeSound();
            }
          }, 1800 + Math.random() * 1200);
        }
      }
      this.scheduleNextRareOfficeEvent(false);
    }, delay);
  }

  /**
   * Liste des micro-événements de bureau disponibles (Kit A1)
   */
  public getOfficeSamplesList() {
    return [
      { id: 0, name: "Clavier d'un collègue" },
      { id: 1, name: "Photocopieuse réseau" },
      { id: 2, name: "Fermeture de porte" },
      { id: 3, name: "Tasse de café sur soucoupe" },
      { id: 4, name: "Classeur administratif" },
      { id: 5, name: "Téléphone standard" },
      { id: 6, name: "Tampon d'un collègue" },
      { id: 7, name: "Agrafeuse métallique" }
    ];
  }

  /**
   * Kit A1 : Joue un micro-événement diégétique de bureau net, présent et reconnaissable.
   * Restitue toute la texture acoustique (2.5 - 4 kHz) avec placement spatial stéréo.
   */
  public async playRareOfficeSound(specificIndex?: number): Promise<string | null> {
    if (this.isMuted) return null;
    this.initContext();
    if (!this.ctx) return null;

    if (!this.officeEventsMasterGain) {
      this.officeEventsMasterGain = this.ctx.createGain();
      this.officeEventsMasterGain.connect(this.ctx.destination);
    }
    const t = this.ctx.currentTime;
    this.officeEventsMasterGain.gain.setValueAtTime(this.ambianceVolume * 0.70, t);

    const samples = [
      {
        url: "/audio/demo/01_clavier_lointain_DEMO.ogg",
        fallbackUrl: "/audio/real/01_clavier_lointain_REAL.ogg",
        name: "Clavier d'un collègue",
        gain: 0.90,
        filterFreq: 3400,
        pan: -0.35
      },
      {
        url: "/audio/demo/02_photocopieuse_lointaine_DEMO.ogg",
        fallbackUrl: "/audio/real/02_photocopieuse_lointaine_REAL.ogg",
        name: "Photocopieuse réseau",
        gain: 0.85,
        filterFreq: 2800,
        pan: 0.45
      },
      {
        url: "/audio/demo/03_porte_feutree_DEMO.ogg",
        fallbackUrl: "/audio/real/03_porte_feutree_REAL.ogg",
        name: "Fermeture de porte",
        gain: 0.95,
        filterFreq: 3200,
        pan: 0.25
      },
      {
        url: "/audio/demo/04_tasse_cafe_bureau_DEMO.ogg",
        fallbackUrl: "/audio/real/04_tasse_cafe_bureau_REAL.ogg",
        name: "Tasse de café sur soucoupe",
        gain: 0.90,
        filterFreq: 4000,
        pan: -0.20
      },
      {
        url: "/audio/demo/05_papier_classeur_DEMO.ogg",
        fallbackUrl: "/audio/real/05_papier_classeur_REAL.ogg",
        name: "Classeur administratif",
        gain: 0.95,
        filterFreq: 3500,
        pan: 0.15
      },
      {
        url: "/audio/demo/06_telephone_lointain_DEMO.ogg",
        fallbackUrl: "/audio/real/06_telephone_lointain_REAL.ogg",
        name: "Téléphone standard",
        gain: 0.90,
        filterFreq: 3000,
        pan: -0.55
      },
      {
        url: "/audio/demo/07_tampon_voisin_DEMO.ogg",
        fallbackUrl: "/audio/real/07_tampon_voisin_REAL.ogg",
        name: "Tampon d'un collègue",
        gain: 0.90,
        filterFreq: 3400,
        pan: 0.40
      },
      {
        url: "/audio/demo/08_agrafeuse_DEMO.ogg",
        fallbackUrl: "/audio/real/08_agrafeuse_REAL.ogg",
        name: "Agrafeuse métallique",
        gain: 0.90,
        filterFreq: 3800,
        pan: -0.30
      }
    ];

    let index = specificIndex;
    if (index === undefined || index < 0 || index >= samples.length) {
      let available = samples.map((_, i) => i);
      if (this.lastSampleIndex >= 0 && samples.length > 1) {
        available = available.filter((i) => i !== this.lastSampleIndex);
      }
      index = available[Math.floor(Math.random() * available.length)];
    }
    this.lastSampleIndex = index;
    const sample = samples[index];

    let buffer = await this.getDecodedBuffer(sample.url);
    if (!buffer && sample.fallbackUrl) {
      buffer = await this.getDecodedBuffer(sample.fallbackUrl);
    }
    if (!buffer || !this.ctx || !this.officeEventsMasterGain) return null;

    try {
      this.isRareEventActive = true;
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      // Filtrage doux pour donner la sensation d'espace dans le couloir sans étouffer les attaques
      const distFilter = this.ctx.createBiquadFilter();
      distFilter.type = "lowpass";
      distFilter.frequency.setValueAtTime(sample.filterFreq, this.ctx.currentTime);
      distFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(sample.gain, this.ctx.currentTime);

      source.connect(distFilter);
      distFilter.connect(gainNode);

      // Panning stéréo diégétique (si supporté par le navigateur)
      if (typeof this.ctx.createStereoPanner === "function") {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(sample.pan, this.ctx.currentTime);
        gainNode.connect(panner);
        panner.connect(this.officeEventsMasterGain);
      } else {
        gainNode.connect(this.officeEventsMasterGain);
      }

      this.rareEventSourceNode = source;
      source.onended = () => {
        this.isRareEventActive = false;
        this.rareEventSourceNode = null;
      };

      source.start();
      return sample.name;
    } catch (_) {
      this.isRareEventActive = false;
      return null;
    }
  }

  /**
   * Cliquetis / grattements mécaniques d'un disque dur IDE/SCSI Western Digital Caviar
   */
  public playHddSeek(intensity: "short" | "burst" | "heavy" = "burst") {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const count =
      intensity === "short"
        ? 4 + Math.floor(Math.random() * 3)
        : intensity === "burst"
        ? 8 + Math.floor(Math.random() * 6)
        : 18 + Math.floor(Math.random() * 8);

    const baseTime = this.ctx.currentTime;
    let offset = 0;

    for (let i = 0; i < count; i++) {
      const t = baseTime + offset;
      const dur = 0.003 + Math.random() * 0.002;
      const bufSize = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let s = 0; s < bufSize; s++) {
        d[s] = (Math.random() * 2 - 1) * (1 - s / bufSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400 + Math.random() * 1200, t);
      filter.Q.setValueAtTime(6 + Math.random() * 4, t);

      const gain = this.ctx.createGain();
      const vol = (0.045 + Math.random() * 0.04) * (this.isAmbianceActive ? this.ambianceVolume * 1.6 : 0.6);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + dur + 0.001);

      if (i % 2 === 0) {
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = "triangle";
        clickOsc.frequency.setValueAtTime(750 + Math.random() * 600, t);
        clickOsc.frequency.exponentialRampToValueAtTime(220, t + 0.004);
        clickGain.gain.setValueAtTime(vol * 0.75, t);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.005);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(t);
        clickOsc.stop(t + 0.006);
      }

      offset += 0.007 + Math.random() * 0.015;
    }
  }

  /**
   * Clic sec et creux d'une vieille souris à boule en plastique beige des années 2000
   */
  public playRetroMouseClick(isRelease: boolean = false) {
    if (this.isMuted || !this.isRetroMouseActive) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Déclic microswitch mécanique (composante aiguë)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "triangle";
    const startFreq = isRelease ? 2200 : 2800;
    const endFreq = isRelease ? 900 : 1200;
    osc.frequency.setValueAtTime(startFreq + (Math.random() * 200 - 100), t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.007);

    oscGain.gain.setValueAtTime(0.08, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.009);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.01);

    // 2. Résonance de la coque plastique creuse de la souris
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = "sine";
    popOsc.frequency.setValueAtTime(540 + (Math.random() * 40 - 20), t);
    popGain.gain.setValueAtTime(0.05, t);
    popGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.014);

    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(t);
    popOsc.stop(t + 0.015);
  }

  /**
   * Impact sourd et mécanique d'un tampon lourd officiel (Thump-Clack)
   */
  public playStampSound(isSuccess: boolean = true) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Coup sourd basse fréquence (la masse du tampon heurtant le bureau en bois)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(140, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.12);

    subGain.gain.setValueAtTime(0.7, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.16);

    // 2. Bruit d'impact sec (ressort métallique et caoutchouc encreur)
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(isSuccess ? 1200 : 700, t);
    noiseFilter.Q.setValueAtTime(3, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noiseSource.start(t);

    // 3. Clack métallique secondaire (retour de ressort)
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const t2 = this.ctx.currentTime;
      const clackOsc = this.ctx.createOscillator();
      const clackGain = this.ctx.createGain();
      clackOsc.type = "triangle";
      clackOsc.frequency.setValueAtTime(isSuccess ? 840 : 420, t2);
      clackOsc.frequency.exponentialRampToValueAtTime(200, t2 + 0.04);
      clackGain.gain.setValueAtTime(0.2, t2);
      clackGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.04);
      clackOsc.connect(clackGain);
      clackGain.connect(this.ctx.destination);
      clackOsc.start(t2);
      clackOsc.stop(t2 + 0.05);
    }, 45);
  }

  /**
   * Grattage / noircissement au feutre indélébile large (Caviardage)
   */
  public playMarkerSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 0.14;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Bruit granuleux imitant la pointe de feutre pressée sur le papier
    for (let i = 0; i < bufferSize; i++) {
      const friction = Math.sin(i * 0.08) * 0.5 + 0.5;
      data[i] = (Math.random() * 2 - 1) * friction;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.linearRampToValueAtTime(2200, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  /**
   * Tintement métallique de pièces d'or / prime virée au compte
   */
  public playBonusCoinsSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [987.77, 1318.51, 1975.53]; // B5, E6, B6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      }, idx * 60);
    });
  }

  /**
   * Bip strident de télétype d'urgence ministérielle (Alerte Télex)
   */
  public playTelexBeep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(1600, t);
    osc.frequency.setValueAtTime(1900, t + 0.05);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  /**
   * Déchiquetage mécanique rotatif (Broyeur de scellés)
   */
  public playShredderSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 0.45;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Modulation cyclique (lames dentées)
      const gear = Math.sin(i * 0.04) * 0.3 + 0.7;
      data[i] = (Math.random() * 2 - 1) * gear;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, t);
    filter.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  /**
   * Clic sec d'interface OS rétro (ouverture de dossier, changement d'onglet)
   */
  public playUiClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  /**
   * Froissement discret de papier à l'ouverture d'un nouveau procès-verbal
   */
  public playPaperRustle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 0.12;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2800, t);
    filter.Q.setValueAtTime(1.2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  /**
   * Bruit d'ouverture et de déploiement d'une fenêtre Windows XP au premier plan
   * (thunk plastique, léger clic système et court souffle de lecture)
   */
  public playWindowOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Thunk plastique sourd (châssis de fenêtre Win32)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);

    // 2. Micro clic système sec
    const oscClick = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    oscClick.type = "sine";
    oscClick.frequency.setValueAtTime(1400, t);
    oscClick.frequency.exponentialRampToValueAtTime(500, t + 0.02);
    clickGain.gain.setValueAtTime(0.12, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    oscClick.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    oscClick.start(t);
    oscClick.stop(t + 0.03);

    // 3. Court bruit de disque / lecture système (très discret)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.008));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  /**
   * Clic de relais électromécanique sec et discret (palette de compteur, commutation relais)
   */
  public playSystemRelayClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(840, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.018);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  /**
   * Claquement sec et discret de fermeture de fenêtre (plus faible que l'ouverture)
   */
  public playWindowClose() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Coup sourd discret de clapet
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);

    // Bruit d'impact plastique sec (clic discret)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.006));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1700, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.11, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, t + 0.03);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  /**
   * Réduction rétro d'une fenêtre vers la barre de tâches (Zip-down aigu vers grave)
   */
  public playWindowMinimize() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Restauration / Agrandissement d'une fenêtre (Zip-up grave vers aigu)
   */
  public playWindowMaximize() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(740, t + 0.09);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  private lastDragSoundTime: number = 0;

  /**
   * Frottement feutré et court lors du glissement de fenêtre (throttled)
   */
  public playWindowDrag() {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastDragSoundTime < 320) return;
    this.lastDragSoundTime = now;

    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 0.05;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(500, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  private lastScrollSoundTime: number = 0;

  /**
   * Cliquetis de molette / ascenseur rétro discret (throttled)
   */
  public playScrollTick() {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastScrollSoundTime < 95) return;
    this.lastScrollSoundTime = now;

    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.012);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.016);
  }

  /**
   * Bruit de décollement / tapotement d'un post-it adhésif
   */
  public playStickyPeel() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 0.08;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, t);
    filter.frequency.linearRampToValueAtTime(1800, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  /**
   * Bip système Windows / avertissement administratif absurde
   */
  public playSystemWarning() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(330, t + 0.08);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.19);
  }

  /**
   * Bruitage réaliste de gorgée de café d'automate & froissement du gobelet plastique
   */
  public playCoffeeSip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Aspiration liquide / froufrou (bruit blanc filtré descendant)
    const dur = 0.22;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(950, t);
    filter.frequency.exponentialRampToValueAtTime(450, t + dur);
    filter.Q.setValueAtTime(4, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // 2. Déformation plastique du gobelet (petit pop aigu)
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const t2 = this.ctx.currentTime;
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = "sine";
      popOsc.frequency.setValueAtTime(650, t2);
      popOsc.frequency.exponentialRampToValueAtTime(280, t2 + 0.05);
      popGain.gain.setValueAtTime(0.15, t2);
      popGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.05);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(t2);
      popOsc.stop(t2 + 0.06);
    }, 180);
  }

  /**
   * Double cliquetis mécanique rapide d'un tampon automatique Trodat à ressort
   */
  public playStampMechanism() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Premier déclic : pression sur le ressort
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(1100, t);
    osc1.frequency.exponentialRampToValueAtTime(400, t + 0.03);
    gain1.gain.setValueAtTime(0.25, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.04);

    // Deuxième impact lourd : encrage du papier
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const t2 = this.ctx.currentTime;
      this.playStampSound(true);
    }, 60);
  }

  /**
   * Poinçonnage métallique d'une pointeuse horaire de bureau (Ka-Chunk ! Ding !)
   */
  public playPointeusePunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Clack mécanique sec et lourd du levier
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);

    // 2. Tintement métallique aigu de la cloche de pointage ("Ding !")
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const t2 = this.ctx.currentTime;
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = "sine";
      bellOsc.frequency.setValueAtTime(1760, t2); // Note La (A6)
      bellGain.gain.setValueAtTime(0.25, t2);
      bellGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.35);
      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(t2);
      bellOsc.stop(t2 + 0.36);
    }, 45);
  }

  /**
   * Tic-tac sec d'urgence de chronomètre de vacation
   */
  public playChronoTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isUrgent ? "triangle" : "sine";
    osc.frequency.setValueAtTime(isUrgent ? 1400 : 980, t);
    osc.frequency.exponentialRampToValueAtTime(isUrgent ? 700 : 490, t + 0.025);
    gain.gain.setValueAtTime(isUrgent ? 0.2 : 0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  /**
   * Bruit sourd d'une pile de chemises cartonnées lourdes heurtant le bureau
   */
  public playFolderThud() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);

    // Bruit de frottement de carton
    const dur = 0.1;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(500, t);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.2, t);
    nGain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noise.start(t);
  }

  /**
   * Clic sec d'un stylo à bille 4 couleurs
   */
  public playPenClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.02);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  /**
   * Tapotement sec sur le bureau
   */
  public playDeskTap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  /**
   * Bip de transmission chiffrée / fuite clandestine lanceur d'alerte
   */
  public playWhistleblowLeak() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [659.25, 880, 1174.66, 1760]; // Mi, La, Ré, La aigu
    notes.forEach((freq, idx) => {
      const start = t + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(start);
      osc.stop(start + 0.055);
    });
  }
}

export const soundFx = new DiegeticAudioEngine();
