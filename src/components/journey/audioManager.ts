type SoundName = "inspect" | "paper" | "book" | "memory" | "door" | "locked" | "step";

class JourneyAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: GainNode | null = null;
  private music: GainNode | null = null;
  private effects: GainNode | null = null;
  private ambientTimer: number | null = null;
  private muted = false;

  start() {
    if (typeof window === "undefined") return;
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.ambient = this.context.createGain();
      this.music = this.context.createGain();
      this.effects = this.context.createGain();
      this.ambient.connect(this.master);
      this.music.connect(this.master);
      this.effects.connect(this.master);
      this.master.connect(this.context.destination);
      this.master.gain.value = 0.18;
      this.ambient.gain.value = 0.2;
      this.music.gain.value = 0.08;
      this.effects.gain.value = 0.45;
      this.startAmbient();
      this.startMusic();
    }
    if (this.context.state === "suspended") void this.context.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : 0.18, this.context?.currentTime ?? 0, 0.15);
    return this.muted;
  }

  setVolume(channel: "master" | "ambient" | "music" | "effects", value: number) {
    this.start();
    const node = {
      master: this.master,
      ambient: this.ambient,
      music: this.music,
      effects: this.effects,
    }[channel];
    if (node) node.gain.setTargetAtTime(value, this.context?.currentTime ?? 0, 0.12);
  }

  play(name: SoundName) {
    this.start();
    if (!this.context || !this.effects || this.muted) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const settings: Record<SoundName, [number, number, number]> = {
      inspect: [180, 0.06, 0.12],
      paper: [280, 0.16, 0.08],
      book: [220, 0.22, 0.1],
      memory: [392, 0.35, 0.18],
      door: [110, 0.4, 0.2],
      locked: [90, 0.12, 0.12],
      step: [70, 0.04, 0.05],
    };
    const [frequency, duration, volume] = settings[name];
    oscillator.type = name === "memory" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (name === "memory") oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain).connect(this.effects);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  private startAmbient() {
    if (!this.context || !this.ambient) return;
    const fan = this.context.createOscillator();
    const fanGain = this.context.createGain();
    fan.type = "sine";
    fan.frequency.value = 48;
    fanGain.gain.value = 0.04;
    fan.connect(fanGain).connect(this.ambient);
    fan.start();
    const room = this.context.createOscillator();
    const roomGain = this.context.createGain();
    room.type = "triangle";
    room.frequency.value = 92;
    roomGain.gain.value = 0.012;
    room.connect(roomGain).connect(this.ambient);
    room.start();
    this.ambientTimer = window.setInterval(() => this.play("step"), 6500);
  }

  private startMusic() {
    if (!this.context || !this.music) return;
    const tone = this.context.createOscillator();
    const gain = this.context.createGain();
    tone.type = "sine";
    tone.frequency.value = 196;
    gain.gain.value = 0.025;
    tone.connect(gain).connect(this.music);
    tone.start();
  }

  dispose() {
    if (this.ambientTimer) window.clearInterval(this.ambientTimer);
    if (this.context) void this.context.close();
    this.context = null;
  }
}

export const journeyAudio = new JourneyAudio();
