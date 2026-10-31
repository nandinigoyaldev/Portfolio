// Web Audio API engine for the interactive journey
// Features 5 independent audio buses: Master, Music, Ambient, Background Voices, and Effects.
// Includes audio ducking during dialogue, sparrow whistles, leaves rustling,
// gentle breeze, and peaceful, emotionally expressive musical textures.

export type SoundEffect =
  | "inspect"
  | "paper"
  | "book"
  | "memory"
  | "door"
  | "locked"
  | "step_wood"
  | "step_tile"
  | "step_carpet"
  | "step_grass"
  | "typing"
  | "applause"
  | "bell"
  | "clockTick"
  | "terminalBeep"
  | "sparrow"
  | "wind";

export type SurfaceType = "wood" | "tile" | "carpet" | "grass" | "metal";

export type AudioState = {
  masterVolume: number;
  musicVolume: number;
  ambientVolume: number;
  voicesVolume: number;
  effectsVolume: number;
  isMuted: boolean;
  isDucked: boolean;
};

class JourneyAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private voicesGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private dialogueGain: GainNode | null = null;

  private state: AudioState = {
    masterVolume: 0.7,
    musicVolume: 0.32, // Soothing, gentle background presence
    ambientVolume: 0.65, // Clear, peaceful environmental sounds (birds, wind, fan)
    voicesVolume: 0.12, // Subtle, distant background murmur (never loud or masking)
    effectsVolume: 0.5,
    isMuted: false,
    isDucked: false,
  };

  private currentChapter: string | null = null;
  private ambientNodes: { stop: () => void }[] = [];
  private musicInterval: number | null = null;
  private ambientInterval: number | null = null;
  private birdTimer: number | null = null;
  private stepCounter = 0;

  // Initialize Audio Context on user interaction
  public init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.ambientGain = this.ctx.createGain();
      this.voicesGain = this.ctx.createGain();
      this.effectsGain = this.ctx.createGain();
      this.dialogueGain = this.ctx.createGain();

      this.musicGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
      this.voicesGain.connect(this.masterGain);
      this.effectsGain.connect(this.masterGain);
      this.dialogueGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applyGains();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  public getState(): AudioState {
    return { ...this.state };
  }

  public setMasterVolume(val: number) {
    this.init();
    this.state.masterVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
  }

  public setMusicVolume(val: number) {
    this.init();
    this.state.musicVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
  }

  public setAmbientVolume(val: number) {
    this.init();
    this.state.ambientVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
  }

  public setVoicesVolume(val: number) {
    this.init();
    this.state.voicesVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
  }

  public setEffectsVolume(val: number) {
    this.init();
    this.state.effectsVolume = Math.max(0, Math.min(1, val));
    this.applyGains();
  }

  public toggleMute(): boolean {
    this.init();
    this.state.isMuted = !this.state.isMuted;
    this.applyGains();
    return this.state.isMuted;
  }

  // Audio Ducking: Smoothly lowers music and voices when dialogue is active
  public setDucking(duck: boolean) {
    this.init();
    this.state.isDucked = duck;
    if (!this.ctx || !this.musicGain || !this.voicesGain) return;
    const now = this.ctx.currentTime;
    const duration = duck ? 0.25 : 0.45;

    const musicTarget = this.state.isDucked
      ? this.state.musicVolume * 0.4
      : this.state.musicVolume;
    const voicesTarget = this.state.isDucked
      ? this.state.voicesVolume * 0.2
      : this.state.voicesVolume;

    this.musicGain.gain.setTargetAtTime(musicTarget, now, duration);
    this.voicesGain.gain.setTargetAtTime(voicesTarget, now, duration);
  }

  private applyGains() {
    if (
      !this.ctx ||
      !this.masterGain ||
      !this.musicGain ||
      !this.ambientGain ||
      !this.voicesGain ||
      !this.effectsGain ||
      !this.dialogueGain
    )
      return;

    const now = this.ctx.currentTime;
    const masterTarget = this.state.isMuted ? 0 : this.state.masterVolume;
    const musicTarget = this.state.isDucked
      ? this.state.musicVolume * 0.4
      : this.state.musicVolume;
    const voicesTarget = this.state.isDucked
      ? this.state.voicesVolume * 0.2
      : this.state.voicesVolume;

    this.masterGain.gain.setTargetAtTime(masterTarget, now, 0.05);
    this.musicGain.gain.setTargetAtTime(musicTarget, now, 0.05);
    this.ambientGain.gain.setTargetAtTime(this.state.ambientVolume, now, 0.05);
    this.voicesGain.gain.setTargetAtTime(voicesTarget, now, 0.05);
    this.effectsGain.gain.setTargetAtTime(this.state.effectsVolume, now, 0.05);
    this.dialogueGain.gain.setTargetAtTime(0.85, now, 0.05);
  }

  // Set the current chapter environment & soundtrack
  public setChapter(chapterId: string) {
    this.init();
    if (this.currentChapter === chapterId) return;
    this.currentChapter = chapterId;

    this.stopAmbient();
    this.stopMusic();

    this.startAmbient(chapterId);
    this.startMusic(chapterId);
  }

  // --- AMBIENCE GENERATORS ---
  private startAmbient(chapterId: string) {
    if (!this.ctx || !this.ambientGain || !this.voicesGain) return;

    switch (chapterId) {
      case "childhood":
        this.setupChildhoodAmbient();
        break;
      case "covid":
        this.setupCovidAmbient();
        break;
      case "catching-up":
        this.setupCatchingUpAmbient();
        break;
      case "grade-11":
        this.setupGrade11CorridorAmbient();
        break;
      case "grade-12":
        this.setupGrade12RecoveryAmbient();
        break;
      case "after-school":
        this.setupCollegeCampusAmbient();
        break;
      case "programming":
        this.setupProgrammingAmbient();
        break;
      case "devfest":
        this.setupDevFestAmbient();
        break;
      case "community":
        this.setupCommunityAmbient();
        break;
      case "present":
        this.setupPresentStudioAmbient();
        break;
      default:
        this.setupChildhoodAmbient();
        break;
    }
  }

  private stopAmbient() {
    if (this.ambientInterval) {
      window.clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.birdTimer) {
      window.clearInterval(this.birdTimer);
      this.birdTimer = null;
    }
    this.ambientNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Ignore already stopped
      }
    });
    this.ambientNodes = [];
  }

  // 1. Childhood: Ceiling fan soothing hum, distant outside sparrows, faint classroom whisper
  private setupChildhoodAmbient() {
    if (!this.ctx || !this.ambientGain || !this.voicesGain) return;

    // Ceiling fan low, soft rotational drone (lowpassed to be pleasant)
    const fanOsc = this.ctx.createOscillator();
    const fanGain = this.ctx.createGain();
    const fanFilter = this.ctx.createBiquadFilter();

    fanOsc.type = "sine";
    fanOsc.frequency.value = 46;
    fanFilter.type = "lowpass";
    fanFilter.frequency.value = 160;
    fanGain.gain.value = 0.04;

    // Gentle 2.8 Hz rotary flutter
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 2.8;
    lfoGain.gain.value = 0.01;
    lfo.connect(lfoGain);
    lfoGain.connect(fanGain.gain);

    fanOsc.connect(fanFilter).connect(fanGain).connect(this.ambientGain);
    fanOsc.start();
    lfo.start();
    this.ambientNodes.push({
      stop: () => {
        fanOsc.stop();
        lfo.stop();
      },
    });

    // Distant, subtle classroom background murmur (routed through voicesGain at a quiet level)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.03;
      b1 = 0.96 * b1 + white * 0.05;
      output[i] = (b0 + b1) * 0.15;
    }

    const chatterNoise = this.ctx.createBufferSource();
    chatterNoise.buffer = noiseBuffer;
    chatterNoise.loop = true;

    const chatterFilter = this.ctx.createBiquadFilter();
    chatterFilter.type = "bandpass";
    chatterFilter.frequency.value = 450;
    chatterFilter.Q.value = 3.5;

    const chatterGain = this.ctx.createGain();
    chatterGain.gain.value = 0.018; // Very soft, sitting way back in the background

    chatterNoise.connect(chatterFilter).connect(chatterGain).connect(this.voicesGain);
    chatterNoise.start();
    this.ambientNodes.push({ stop: () => chatterNoise.stop() });

    // Sweet sparrow whistles outside the window (prominent & audible!)
    this.birdTimer = window.setInterval(() => {
      if (Math.random() > 0.25) {
        this.playSparrowWhistle(Math.random() * 0.8 - 0.4);
      }
    }, 4200);

    // Occasional wooden desk shift or page turn
    this.ambientInterval = window.setInterval(() => {
      if (Math.random() > 0.5) {
        this.playSoftDeskRattle();
      }
    }, 6000);
  }

  // 2. COVID: Quiet home bedroom, rhythmic clock tick-tock, outdoor sparrows, gentle laptop whisper
  private setupCovidAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    // Quiet laptop fan whisper
    const fanOsc = this.ctx.createOscillator();
    const fanGain = this.ctx.createGain();
    const fanFilter = this.ctx.createBiquadFilter();
    fanOsc.type = "triangle";
    fanOsc.frequency.value = 135;
    fanFilter.type = "lowpass";
    fanFilter.frequency.value = 240;
    fanGain.gain.value = 0.012;
    fanOsc.connect(fanFilter).connect(fanGain).connect(this.ambientGain);
    fanOsc.start();
    this.ambientNodes.push({ stop: () => fanOsc.stop() });

    // Soothing room tone
    const roomOsc = this.ctx.createOscillator();
    const roomGain = this.ctx.createGain();
    roomOsc.type = "sine";
    roomOsc.frequency.value = 60;
    roomGain.gain.value = 0.02;
    roomOsc.connect(roomGain).connect(this.ambientGain);
    roomOsc.start();
    this.ambientNodes.push({ stop: () => roomOsc.stop() });

    // Clock ticking every second (tick-tock)
    let tickCount = 0;
    this.ambientInterval = window.setInterval(() => {
      this.playClockTick(tickCount % 2 === 0);
      tickCount++;
    }, 1000);

    // Sparrow whistles outside bedroom window
    this.birdTimer = window.setInterval(() => {
      if (Math.random() > 0.3) {
        this.playSparrowWhistle(0.3);
      }
    }, 4800);
  }

  // 3. Catching Up: Late-night peaceful room, ticking clock, gentle wind
  private setupCatchingUpAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    const roomOsc = this.ctx.createOscillator();
    const roomGain = this.ctx.createGain();
    roomOsc.type = "sine";
    roomOsc.frequency.value = 70;
    roomGain.gain.value = 0.02;
    roomOsc.connect(roomGain).connect(this.ambientGain);
    roomOsc.start();
    this.ambientNodes.push({ stop: () => roomOsc.stop() });

    // Gentle night wind outside window
    this.setupWindBreeze(0.025);

    let tick = 0;
    this.ambientInterval = window.setInterval(() => {
      this.playClockTick(tick % 2 === 0);
      tick++;
      if (tick % 7 === 0) {
        this.playPaperSound();
      }
    }, 1000);
  }

  // 4. Grade 11 Corridor: Reverberant hallway acoustics, distant locker, subtle hallway murmur
  private setupGrade11CorridorAmbient() {
    if (!this.ctx || !this.ambientGain || !this.voicesGain) return;

    // Hallway reverberant room acoustic
    const hallOsc = this.ctx.createOscillator();
    const hallGain = this.ctx.createGain();
    hallOsc.type = "sine";
    hallOsc.frequency.value = 82;
    hallGain.gain.value = 0.025;
    hallOsc.connect(hallGain).connect(this.ambientGain);
    hallOsc.start();
    this.ambientNodes.push({ stop: () => hallOsc.stop() });

    // Distant students murmur (sparse, subdued, sitting gently in the mix)
    this.ambientInterval = window.setInterval(() => {
      const roll = Math.random();
      if (roll < 0.35) {
        this.playCorridorEchoChatter();
      } else if (roll < 0.65) {
        this.playLockerClang();
      }
    }, 5000);
  }

  // 5. Grade 12 Recovery: Gentle morning breeze, sparrows outside window, peaceful silence
  private setupGrade12RecoveryAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    const hum = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = "sine";
    hum.frequency.value = 88;
    humGain.gain.value = 0.018;
    hum.connect(humGain).connect(this.ambientGain);
    hum.start();
    this.ambientNodes.push({ stop: () => hum.stop() });

    // Soft morning breeze
    this.setupWindBreeze(0.03);

    // Cheerful morning sparrows
    this.birdTimer = window.setInterval(() => {
      if (Math.random() > 0.2) {
        this.playSparrowWhistle(Math.random() * 0.6 - 0.3);
      }
    }, 3800);
  }

  // 6. College Campus: Outdoors breeze, rustling leaves, sparrows singing across campus
  private setupCollegeCampusAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    // Outdoor breeze with rustling leaves
    this.setupWindBreeze(0.045);

    // Multi-bird song: sparrows answering each other across stereo field!
    this.birdTimer = window.setInterval(() => {
      this.playSparrowWhistle(-0.4);
      window.setTimeout(() => {
        this.playSparrowWhistle(0.5);
      }, 700);
    }, 3500);
  }

  // 7. Programming: Modern quiet workspace, subtle mechanical keyboard clicks, PC fan
  private setupProgrammingAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    const fan1 = this.ctx.createOscillator();
    const fan1Gain = this.ctx.createGain();
    fan1.type = "sine";
    fan1.frequency.value = 98;
    fan1Gain.gain.value = 0.02;
    fan1.connect(fan1Gain).connect(this.ambientGain);
    fan1.start();
    this.ambientNodes.push({ stop: () => fan1.stop() });

    // Occasional bursts of typing
    this.ambientInterval = window.setInterval(() => {
      if (Math.random() > 0.4) {
        this.playKeyboardBurst();
      }
    }, 4500);
  }

  // 8. DevFest: Conference hall atmosphere, distant murmurs, periodic applause
  private setupDevFestAmbient() {
    if (!this.ctx || !this.ambientGain || !this.voicesGain) return;

    // Soft distant auditorium crowd hum (routed to voicesGain, kept subtle)
    const bufferSize = this.ctx.sampleRate * 2.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.015 * white) / 1.015;
      lastOut = output[i];
      output[i] *= 1.8;
    }

    const crowdNoise = this.ctx.createBufferSource();
    crowdNoise.buffer = noiseBuffer;
    crowdNoise.loop = true;

    const crowdFilter = this.ctx.createBiquadFilter();
    crowdFilter.type = "bandpass";
    crowdFilter.frequency.value = 460;
    crowdFilter.Q.value = 2.8;

    const crowdGain = this.ctx.createGain();
    crowdGain.gain.value = 0.035; // Kept far back so dialogue and music are clear!

    crowdNoise.connect(crowdFilter).connect(crowdGain).connect(this.voicesGain);
    crowdNoise.start();
    this.ambientNodes.push({ stop: () => crowdNoise.stop() });

    // Periodic auditorium events
    this.ambientInterval = window.setInterval(() => {
      const roll = Math.random();
      if (roll < 0.4) {
        this.playAuditoriumApplause();
      } else if (roll < 0.7) {
        this.playStageSpeakerCadence();
      }
    }, 7000);
  }

  // 9. Community: Collaborative makerspace, cheerful banter, keyboard taps
  private setupCommunityAmbient() {
    if (!this.ctx || !this.ambientGain || !this.voicesGain) return;

    const hum = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = "sine";
    hum.frequency.value = 90;
    humGain.gain.value = 0.02;
    hum.connect(humGain).connect(this.ambientGain);
    hum.start();
    this.ambientNodes.push({ stop: () => hum.stop() });

    this.ambientInterval = window.setInterval(() => {
      if (Math.random() > 0.45) {
        this.playKeyboardBurst();
      } else {
        this.playSoftDeskRattle();
      }
    }, 4500);
  }

  // 10. Present: Gentle rain on window, warm lo-fi tape hum
  private setupPresentStudioAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    // Gentle rain on window pane
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = "bandpass";
    rainFilter.frequency.value = 1400;
    rainFilter.Q.value = 1.0;

    const rainGain = this.ctx.createGain();
    rainGain.gain.value = 0.028;

    rainSource.connect(rainFilter).connect(rainGain).connect(this.ambientGain);
    rainSource.start();
    this.ambientNodes.push({ stop: () => rainSource.stop() });
  }

  // Helper: Gentle wind breeze with slow modulation
  private setupWindBreeze(baseVolume: number) {
    if (!this.ctx || !this.ambientGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 260;

    // Slow 0.12 Hz LFO for natural breeze undulating
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.value = baseVolume;

    windSource.connect(windFilter).connect(windGain).connect(this.ambientGain);
    windSource.start();
    lfo.start();

    this.ambientNodes.push({
      stop: () => {
        windSource.stop();
        lfo.stop();
      },
    });
  }

  // --- PROCEDURAL MUSIC SYNTHESIZER ---
  // Gentle, soothing, emotionally expressive harmonies with soft felt-piano & warm ambient pad tones
  private startMusic(chapterId: string) {
    if (!this.ctx || !this.musicGain) return;

    let step = 0;
    const configs: Record<
      string,
      {
        bpm: number;
        chords: number[][]; // Frequencies in Hz
        timbre: OscillatorType;
        bassNote: number[];
        filterFreq: number;
      }
    > = {
      // Childhood: Gentle nostalgic felt-piano pentatonic progression
      childhood: {
        bpm: 72,
        chords: [
          [261.63, 329.63, 392.0], // C
          [196.0, 246.94, 293.66], // G
          [220.0, 261.63, 329.63], // Am
          [174.61, 220.0, 261.63], // F
        ],
        timbre: "sine",
        bassNote: [130.81, 98.0, 110.0, 87.31],
        filterFreq: 850,
      },
      // COVID: Melancholic, reflective soft electric piano
      covid: {
        bpm: 58,
        chords: [
          [220.0, 261.63, 329.63], // Am
          [164.81, 196.0, 246.94], // Em
          [174.61, 220.0, 261.63], // F
          [130.81, 164.81, 196.0], // C
        ],
        timbre: "triangle",
        bassNote: [110.0, 82.41, 87.31, 65.41],
        filterFreq: 750,
      },
      // Catching Up: Focused, quiet determination in D minor
      "catching-up": {
        bpm: 80,
        chords: [
          [293.66, 349.23, 440.0], // Dm
          [233.08, 293.66, 349.23], // Bb
          [261.63, 329.63, 392.0], // C
          [220.0, 261.63, 329.63], // Am
        ],
        timbre: "triangle",
        bassNote: [146.83, 116.54, 130.81, 110.0],
        filterFreq: 800,
      },
      // 11th Grade: Moody, uneasy, ambient minor tones
      "grade-11": {
        bpm: 64,
        chords: [
          [164.81, 196.0, 246.94], // Em
          [130.81, 164.81, 246.94], // Cmaj7
          [123.47, 146.83, 220.0], // Bm
          [110.0, 130.81, 196.0], // Am
        ],
        timbre: "sine",
        bassNote: [82.41, 65.41, 61.74, 55.0],
        filterFreq: 700,
      },
      // 12th Grade: Gentle, tender acoustic ambient progression
      "grade-12": {
        bpm: 54,
        chords: [
          [146.83, 185.0, 220.0], // D
          [196.0, 246.94, 293.66], // G
          [246.94, 293.66, 369.99], // Bm
          [220.0, 277.18, 329.63], // A
        ],
        timbre: "sine",
        bassNote: [73.42, 98.0, 123.47, 110.0],
        filterFreq: 750,
      },
      // College Campus: Hopeful, breezy acoustic-style arpeggios
      "after-school": {
        bpm: 78,
        chords: [
          [164.81, 207.65, 246.94], // E
          [246.94, 311.13, 369.99], // B
          [277.18, 329.63, 415.3], // C#m
          [220.0, 277.18, 329.63], // A
        ],
        timbre: "triangle",
        bassNote: [82.41, 123.47, 138.59, 110.0],
        filterFreq: 950,
      },
      // Programming: Mellow synthwave chords with soft retro filter
      programming: {
        bpm: 86,
        chords: [
          [174.61, 207.65, 261.63], // Fm
          [155.56, 196.0, 233.08], // Eb
          [138.59, 174.61, 207.65], // Db
          [130.81, 164.81, 196.0], // C
        ],
        timbre: "triangle",
        bassNote: [87.31, 77.78, 69.3, 65.41],
        filterFreq: 800,
      },
      // DevFest: Uplifting, inspiring festival chords (mellow and soothing)
      devfest: {
        bpm: 90,
        chords: [
          [196.0, 246.94, 293.66], // G
          [146.83, 220.0, 293.66], // D
          [164.81, 196.0, 246.94], // Em
          [130.81, 164.81, 196.0], // C
        ],
        timbre: "sine",
        bassNote: [98.0, 73.42, 82.41, 65.41],
        filterFreq: 900,
      },
      // Community: Warm, collaborative harmony
      community: {
        bpm: 80,
        chords: [
          [220.0, 277.18, 329.63], // A
          [146.83, 185.0, 220.0], // D
          [185.0, 220.0, 277.18], // F#m
          [164.81, 207.65, 246.94], // E
        ],
        timbre: "sine",
        bassNote: [110.0, 73.42, 92.5, 82.41],
        filterFreq: 850,
      },
      // Present: Lo-fi chillhop Rhodes chords
      present: {
        bpm: 68,
        chords: [
          [174.61, 220.0, 261.63], // Fmaj7
          [164.81, 196.0, 246.94], // Em7
          [146.83, 174.61, 220.0], // Dm7
          [130.81, 164.81, 196.0], // Cmaj7
        ],
        timbre: "triangle",
        bassNote: [87.31, 82.41, 73.42, 65.41],
        filterFreq: 750,
      },
    };

    const cfg = configs[chapterId] || configs.childhood;
    const intervalMs = (60 / cfg.bpm) * 1000 * 2; // Chord every 2 bars

    const playChordStep = () => {
      if (!this.ctx || !this.musicGain || this.state.isMuted) return;
      const now = this.ctx.currentTime;
      const chordIndex = Math.floor(step / 2) % cfg.chords.length;
      const chord = cfg.chords[chordIndex];
      const bassFreq = cfg.bassNote[chordIndex];

      // Occasional rest measure so environmental sounds (birds, wind) breathe
      if (step % 6 === 5) {
        step++;
        return;
      }

      // Soft bass note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.025, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 1.6);
      bassOsc.connect(bassGain).connect(this.musicGain);
      bassOsc.start(now);
      bassOsc.stop(now + (intervalMs / 1000) * 1.7);

      // Play chord notes with gentle stagger for acoustic voicing
      chord.forEach((freq, i) => {
        if (!this.ctx || !this.musicGain) return;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = "lowpass";
        filter.frequency.value = cfg.filterFreq;

        noteOsc.type = cfg.timbre;
        noteOsc.frequency.setValueAtTime(freq, now + i * 0.05);

        const duration = (intervalMs / 1000) * 1.8;
        noteGain.gain.setValueAtTime(0.001, now + i * 0.05);
        noteGain.gain.linearRampToValueAtTime(0.02, now + i * 0.05 + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + duration);

        noteOsc.connect(filter).connect(noteGain).connect(this.musicGain);
        noteOsc.start(now + i * 0.05);
        noteOsc.stop(now + i * 0.05 + duration);
      });

      step++;
    };

    playChordStep();
    this.musicInterval = window.setInterval(playChordStep, intervalMs);
  }

  private stopMusic() {
    if (this.musicInterval) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // --- REALISTIC SPARROW WHISTLES & BIRD CALLS ---
  // Produces sweet, crisp, multi-tone sparrow chirps with vibrato trill and spatial panning
  public playSparrowWhistle(stereoPan: number = 0) {
    if (!this.ctx || !this.ambientGain || this.state.isMuted) return;
    const now = this.ctx.currentTime;

    // Optional stereo panner if supported
    let outputNode: AudioNode = this.ambientGain;
    if (typeof this.ctx.createStereoPanner === "function") {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, stereoPan)), now);
      panner.connect(this.ambientGain);
      outputNode = panner;
    }

    // Sparrow chirp pattern: 2 rapid sweet trills followed by a clear whistle
    const notes = [
      { startFreq: 3100, endFreq: 3900, dur: 0.08, delay: 0 },
      { startFreq: 3300, endFreq: 4100, dur: 0.09, delay: 0.12 },
      { startFreq: 3600, endFreq: 2900, dur: 0.16, delay: 0.26 },
    ];

    notes.forEach(({ startFreq, endFreq, dur, delay }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, now + delay);
      osc.frequency.linearRampToValueAtTime(endFreq, now + delay + dur);

      // Rapid vibrato for natural sparrow trill
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.value = 26;
      vibratoGain.gain.value = 60;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      filter.type = "bandpass";
      filter.frequency.value = 3400;
      filter.Q.value = 1.8;

      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.linearRampToValueAtTime(0.038, now + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

      osc.connect(filter).connect(gain).connect(outputNode);
      osc.start(now + delay);
      vibrato.start(now + delay);
      osc.stop(now + delay + dur);
      vibrato.stop(now + delay + dur);
    });
  }

  // --- SOUND EFFECTS ---
  public play(name: SoundEffect) {
    this.init();
    if (!this.ctx || !this.effectsGain || this.state.isMuted) return;

    switch (name) {
      case "inspect":
        this.playInspectSound();
        break;
      case "paper":
        this.playPaperSound();
        break;
      case "book":
        this.playBookSound();
        break;
      case "memory":
        this.playMemorySound();
        break;
      case "door":
        this.playDoorSound();
        break;
      case "locked":
        this.playLockedSound();
        break;
      case "typing":
        this.playKeyboardBurst();
        break;
      case "applause":
        this.playAuditoriumApplause();
        break;
      case "bell":
        this.playSchoolBell();
        break;
      case "clockTick":
        this.playClockTick(true);
        break;
      case "terminalBeep":
        this.playTerminalBeep();
        break;
      case "sparrow":
        this.playSparrowWhistle(0);
        break;
      default:
        this.playInspectSound();
    }
  }

  public playFootstep(surface: SurfaceType = "wood") {
    this.init();
    if (!this.ctx || !this.effectsGain || this.state.isMuted) return;
    const now = this.ctx.currentTime;
    this.stepCounter++;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const freqMap: Record<
      SurfaceType,
      { freq: number; dur: number; vol: number; type: OscillatorType; cutoff: number }
    > = {
      wood: { freq: 72 + (this.stepCounter % 2) * 6, dur: 0.045, vol: 0.06, type: "sine", cutoff: 380 },
      tile: { freq: 130 + (this.stepCounter % 2) * 12, dur: 0.035, vol: 0.07, type: "triangle", cutoff: 750 },
      carpet: { freq: 48, dur: 0.05, vol: 0.035, type: "sine", cutoff: 200 },
      grass: { freq: 90 + (this.stepCounter % 3) * 8, dur: 0.05, vol: 0.045, type: "triangle", cutoff: 500 },
      metal: { freq: 260 + (this.stepCounter % 2) * 16, dur: 0.055, vol: 0.08, type: "sawtooth", cutoff: 1100 },
    };

    const s = freqMap[surface];
    osc.type = s.type;
    osc.frequency.setValueAtTime(s.freq, now);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(s.cutoff, now);

    gain.gain.setValueAtTime(s.vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + s.dur);

    osc.connect(filter).connect(gain).connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + s.dur);
  }

  private playInspectSound() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain).connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  private playMemorySound() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    // Harmonic sparkle arpeggio: C5 - E5 - G5 - C6
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.effectsGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.42);

      osc.connect(gain).connect(this.effectsGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.43);
    });
  }

  private playPaperSound() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1300, now);
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    source.connect(filter).connect(gain).connect(this.effectsGain);
    source.start(now);
  }

  private playBookSound() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain).connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.2);
    this.playPaperSound();
  }

  private playDoorSound() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.32);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300;

    osc.connect(filter).connect(gain).connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  private playLockedSound() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    [0, 0.09].forEach((delay) => {
      if (!this.ctx || !this.effectsGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(90, now + delay);
      gain.gain.setValueAtTime(0.08, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
      osc.connect(gain).connect(this.effectsGain);
      osc.start(now + delay);
      osc.stop(now + delay + 0.05);
    });
  }

  public playClockTick(isTick: boolean) {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(isTick ? 880 : 790, now);

    gain.gain.setValueAtTime(0.028, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

    osc.connect(gain).connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.028);
  }

  public playSchoolBell() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    [784, 1568].forEach((freq, i) => {
      if (!this.ctx || !this.effectsGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.05 / (i + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain).connect(this.effectsGain);
      osc.start(now);
      osc.stop(now + 1.5);
    });
  }

  public playKeyboardBurst() {
    if (!this.ctx || !this.effectsGain) return;
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const delay = i * (0.07 + Math.random() * 0.04);
      window.setTimeout(() => {
        if (!this.ctx || !this.effectsGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(1100 + Math.random() * 400, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain).connect(this.effectsGain);
        osc.start(now);
        osc.stop(now + 0.03);
      }, delay * 1000);
    }
  }

  public playAuditoriumApplause() {
    if (!this.ctx || !this.effectsGain) return;
    const claps = 12; // Subdued, warm applause
    for (let i = 0; i < claps; i++) {
      const delay = Math.random() * 0.7;
      window.setTimeout(() => {
        if (!this.ctx || !this.effectsGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(280 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain).connect(this.effectsGain);
        osc.start(now);
        osc.stop(now + 0.035);
      }, delay * 1000);
    }
  }

  private playStageSpeakerCadence() {
    if (!this.ctx || !this.voicesGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.linearRampToValueAtTime(170, now + 0.12);
    osc.frequency.linearRampToValueAtTime(125, now + 0.25);

    filter.type = "bandpass";
    filter.frequency.value = 600;
    filter.Q.value = 3.5;

    gain.gain.setValueAtTime(0.015, now); // Soft, sits behind environment
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter).connect(gain).connect(this.voicesGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  private playCorridorEchoChatter() {
    if (!this.ctx || !this.voicesGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(250 + Math.random() * 80, now);
    gain.gain.setValueAtTime(0.018, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain).connect(this.voicesGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  private playLockerClang() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.28);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 650;
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.028, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter).connect(gain).connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  private playSoftDeskRattle() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(105, now);
    gain.gain.setValueAtTime(0.016, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain).connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  private playTerminalBeep() {
    if (!this.ctx || !this.effectsGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain).connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public dispose() {
    this.stopAmbient();
    this.stopMusic();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}

export const journeyAudio = new JourneyAudioEngine();
