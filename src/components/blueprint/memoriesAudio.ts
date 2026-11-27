import type { MemoryItem, MemoryMood } from './blueprintData';

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

interface MediaTrackEntry {
  el: HTMLAudioElement;
  source: MediaElementAudioSourceNode;
  gain: GainNode;
  failed: boolean;
}

export class MemoriesAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;

  // HTMLAudioElement pipeline (per memory ID)
  private tracks = new Map<string, MediaTrackEntry>();
  private activeMedia: MediaTrackEntry | null = null;
  private activeFadeTimer: number | null = null;

  // Procedural lo-fi synth fallback state
  private synthBus: GainNode | null = null;
  private synthTimer: number | null = null;
  private synthMood: MemoryMood | null = null;
  private synthStep = 0;
  private synthNextTime = 0;
  private noiseBuffer: AudioBuffer | null = null;

  private paused = false;
  private withBase: (p: string) => string;

  constructor(withBase: (p: string) => string) {
    this.withBase = withBase;
  }

  public init(): void {
    if (typeof window === 'undefined') return;
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return;
    }

    const AudioCtx = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.58;

    const comp = ctx.createDynamicsCompressor();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    master.connect(comp);
    comp.connect(analyser);
    analyser.connect(ctx.destination);

    // Pre-build 50ms white noise buffer for brushed lo-fi hi-hat
    const bufLen = Math.max(1, Math.floor(ctx.sampleRate * 0.05));
    const nBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const ch = nBuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      ch[i] = Math.random() * 2 - 1;
    }

    this.ctx = ctx;
    this.master = master;
    this.analyser = analyser;
    this.freqData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    this.noiseBuffer = nBuf;
  }

  private hz(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  private voice(
    dest: AudioNode,
    freq: number,
    t: number,
    dur: number,
    type: OscillatorType,
    gainPeak: number,
    cutoff: number,
    attack = 0.012,
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gn = this.ctx.createGain();
    const lp = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.value = freq;
    lp.type = 'lowpass';
    lp.frequency.value = cutoff;

    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(gainPeak, t + attack);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(lp);
    lp.connect(gn);
    gn.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  private kick(dest: AudioNode, t: number): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gn = this.ctx.createGain();
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    gn.gain.setValueAtTime(0.48, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gn);
    gn.connect(dest);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  private hat(dest: AudioNode, t: number): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    const hp = this.ctx.createBiquadFilter();
    const gn = this.ctx.createGain();
    src.buffer = this.noiseBuffer;
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    gn.gain.setValueAtTime(0.055, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    src.connect(hp);
    hp.connect(gn);
    gn.connect(dest);
    src.start(t);
  }

  private scheduleSynthStep(stepIndex: number, t: number): void {
    if (!this.synthBus || !this.synthMood) return;
    const eighth = 60 / this.synthMood.bpm / 2;
    const prog = this.synthMood.prog;
    const chord = prog[Math.floor(stepIndex / 16) % prog.length];

    if (stepIndex % 16 === 0) {
      for (const note of chord) {
        this.voice(this.synthBus, this.hz(note - 12), t, eighth * 16, 'triangle', 0.07, 1400, 0.55);
        this.voice(
          this.synthBus,
          this.hz(note) * 1.003,
          t,
          eighth * 16,
          'sawtooth',
          0.024,
          900,
          0.75,
        );
      }
      this.voice(this.synthBus, this.hz(chord[0] - 24), t, eighth * 8, 'sine', 0.22, 400, 0.02);
    }

    const arpPattern = [0, 2, 1, 3, 2, 1, 3, 2];
    const arpNote = chord[arpPattern[stepIndex % 8] % chord.length];
    this.voice(this.synthBus, this.hz(arpNote + 12), t, eighth * 1.6, 'sine', 0.068, 3000);

    if (stepIndex % 8 === 0 || stepIndex % 8 === 5) {
      this.kick(this.synthBus, t);
    }
    if (stepIndex % 2 === 1) {
      this.hat(this.synthBus, t);
    }
  }

  private tickSynth = (): void => {
    if (!this.ctx || !this.synthMood || this.paused) return;
    while (this.synthNextTime < this.ctx.currentTime + 0.15) {
      this.scheduleSynthStep(this.synthStep++, this.synthNextTime);
      this.synthNextTime += 60 / this.synthMood.bpm / 2;
    }
  };

  private startSynth(mood: MemoryMood): void {
    if (!this.ctx || !this.master) return;
    this.synthMood = mood;
    this.synthStep = 0;
    this.synthNextTime = this.ctx.currentTime + 0.08;

    const bus = this.ctx.createGain();
    bus.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    bus.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.8);
    bus.connect(this.master);
    this.synthBus = bus;

    this.synthTimer = window.setInterval(this.tickSynth, 25);
    this.tickSynth();
  }

  private fadeOutSynth(fadeSec: number): void {
    if (this.synthTimer !== null) {
      window.clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    this.synthMood = null;

    if (this.synthBus && this.ctx) {
      const oldBus = this.synthBus;
      this.synthBus = null;
      const now = this.ctx.currentTime;
      oldBus.gain.cancelScheduledValues(now);
      oldBus.gain.setValueAtTime(Math.max(0.0001, oldBus.gain.value), now);
      oldBus.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
      window.setTimeout(() => {
        try {
          oldBus.disconnect();
        } catch {}
      }, Math.ceil((fadeSec + 0.15) * 1000));
    }
  }

  private fadeOutActiveMedia(fadeSec: number): void {
    if (this.activeFadeTimer !== null) {
      window.clearTimeout(this.activeFadeTimer);
      this.activeFadeTimer = null;
    }
    if (!this.activeMedia || !this.ctx) return;

    const prev = this.activeMedia;
    this.activeMedia = null;
    const now = this.ctx.currentTime;
    prev.gain.gain.cancelScheduledValues(now);
    prev.gain.gain.setValueAtTime(Math.max(0.0001, prev.gain.gain.value), now);
    prev.gain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
    this.activeFadeTimer = window.setTimeout(() => {
      prev.el.pause();
      prev.el.currentTime = 0;
    }, Math.ceil((fadeSec + 0.05) * 1000));
  }

  public play(memory: MemoryItem): void {
    this.init();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    // Fade out any currently playing audio over 0.5s
    this.fadeOutSynth(0.5);
    this.fadeOutActiveMedia(0.5);
    this.paused = false;

    // Use local MP3 via HTMLAudioElement + MediaElementAudioSourceNode if configured,
    // with automatic procedural lo-fi synth fallback if missing/unavailable.
    if (memory.audio && !memory.synthOnly) {
      let entry = this.tracks.get(memory.id);
      if (!entry) {
        const el = new Audio();
        el.src = this.withBase(memory.audio.replace(/^\//, ''));
        el.loop = true;
        el.preload = 'auto';
        const source = this.ctx.createMediaElementSource(el);
        const gain = this.ctx.createGain();
        gain.gain.value = 0.0001;
        source.connect(gain);
        gain.connect(this.master);
        entry = { el, source, gain, failed: false };
        el.addEventListener('error', () => {
          if (entry) entry.failed = true;
          if (this.activeMedia === entry) {
            this.activeMedia = null;
            this.startSynth(memory.mood);
          }
        });
        this.tracks.set(memory.id, entry);
      }

      if (!entry.failed) {
        const now = this.ctx.currentTime;
        entry.gain.gain.cancelScheduledValues(now);
        entry.gain.gain.setValueAtTime(0.0001, now);
        entry.gain.gain.linearRampToValueAtTime(1, now + 0.8);
        entry.el.currentTime = 0;
        this.activeMedia = entry;
        entry.el.play().catch(() => {
          if (entry) entry.failed = true;
          if (this.activeMedia === entry) {
            this.activeMedia = null;
            this.startSynth(memory.mood);
          }
        });
        return;
      }
    }

    this.startSynth(memory.mood);
  }

  public stop(quick = false): void {
    const dur = quick ? 0.35 : 0.5;
    this.fadeOutSynth(dur);
    this.fadeOutActiveMedia(dur);
    this.paused = false;
  }

  public toggle(): boolean {
    if (!this.ctx) return false;
    if (!this.synthBus && !this.activeMedia) return false;

    this.paused = !this.paused;
    const now = this.ctx.currentTime;

    if (this.synthBus) {
      this.synthBus.gain.cancelScheduledValues(now);
      this.synthBus.gain.setValueAtTime(this.synthBus.gain.value, now);
      this.synthBus.gain.linearRampToValueAtTime(this.paused ? 0.0001 : 1, now + 0.3);
      if (!this.paused) {
        this.synthNextTime = now + 0.05;
      }
    }

    if (this.activeMedia) {
      const m = this.activeMedia;
      m.gain.gain.cancelScheduledValues(now);
      m.gain.gain.setValueAtTime(m.gain.gain.value, now);
      if (this.paused) {
        m.gain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
        window.setTimeout(() => {
          if (this.paused && this.activeMedia === m) m.el.pause();
        }, 260);
      } else {
        void m.el.play().catch(() => {});
        m.gain.gain.linearRampToValueAtTime(1, now + 0.3);
      }
    }

    return !this.paused;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public level(): number {
    if (!this.analyser || !this.freqData || this.paused) return 0;
    if (!this.synthBus && !this.activeMedia) return 0;
    this.analyser.getByteFrequencyData(this.freqData);
    let sum = 0;
    for (let i = 1; i < 12; i++) {
      sum += this.freqData[i];
    }
    return sum / (11 * 255);
  }

  public bins(): [number, number, number, number] {
    if (!this.analyser || !this.freqData || this.paused) return [0, 0, 0, 0];
    if (!this.synthBus && !this.activeMedia) return [0, 0, 0, 0];
    return [
      this.freqData[3] / 255,
      this.freqData[8] / 255,
      this.freqData[16] / 255,
      this.freqData[30] / 255,
    ];
  }

  public destroy(): void {
    this.stop(true);
    if (this.activeFadeTimer !== null) {
      window.clearTimeout(this.activeFadeTimer);
      this.activeFadeTimer = null;
    }
    this.tracks.forEach((t) => {
      t.el.pause();
      t.el.removeAttribute('src');
      try {
        t.source.disconnect();
        t.gain.disconnect();
      } catch {}
    });
    this.tracks.clear();
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.master = null;
    this.analyser = null;
    this.freqData = null;
  }
}
