// Minimalist Organic Web Audio Synthesizer & Tactile Haptic Suite
// Tailored for Ravael's calm, nature-infused minimalist portfolio

export const feedbackState = {
  enabled: true,
};

export function isSoundEnabled(): boolean {
  return feedbackState.enabled;
}

export function setSoundEnabled(val: boolean): void {
  feedbackState.enabled = val;
}

export type SoundVariant =
  | 'tap'
  | 'hover'
  | 'expand'
  | 'collapse'
  | 'switch'
  | 'copy'
  | 'grass'
  | 'flip';

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let iosSwitchLabel: HTMLLabelElement | null = null;
let lastGrassSoundAt = 0;
let lastHoverSoundAt = 0;

function ensureIosSwitch(): HTMLLabelElement | null {
  if (typeof document === 'undefined') return null;
  if (!iosSwitchLabel) {
    const label = document.createElement('label');
    label.setAttribute('aria-hidden', 'true');
    label.style.cssText =
      'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    label.appendChild(input);
    document.body.appendChild(label);
    iosSwitchLabel = label;
  }
  return iosSwitchLabel;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getSoftNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer;
  }
  const length = Math.floor(ctx.sampleRate * 0.25);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Pink-ish smoothed noise for organic grass rustle
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99765 * b0 + white * 0.099046;
    b1 = 0.963 * b1 + white * 0.2965164;
    b2 = 0.57 * b2 + white * 1.0526913;
    data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.12;
  }
  noiseBuffer = buffer;
  return buffer;
}

export function triggerHapticAndSound(variant: SoundVariant = 'tap'): void {
  if (!feedbackState.enabled || typeof window === 'undefined') return;

  const nowMs = performance.now();
  if (variant === 'grass') {
    if (nowMs - lastGrassSoundAt < 75) return;
    lastGrassSoundAt = nowMs;
  } else if (variant === 'hover') {
    if (nowMs - lastHoverSoundAt < 55) return;
    lastHoverSoundAt = nowMs;
  }

  // 1. Tactile Haptic on direct interactions (skip on passive hover/grass movement)
  if (variant !== 'hover' && variant !== 'grass') {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(variant === 'copy' || variant === 'switch' ? 12 : 8);
      } else {
        const sw = ensureIosSwitch();
        sw?.click();
      }
    } catch {}
  }

  // 2. Synthesized Organic Audio
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (variant === 'grass') {
      // Soft organic leaf/grass rustle using bandpass-filtered pink noise
      const src = ctx.createBufferSource();
      src.buffer = getSoftNoiseBuffer(ctx);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const centerFreq = 950 + Math.random() * 550;
      filter.frequency.setValueAtTime(centerFreq, now);
      filter.frequency.exponentialRampToValueAtTime(centerFreq * 1.25, now + 0.085);
      filter.Q.setValueAtTime(3.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start(now);
      src.stop(now + 0.1);
      return;
    }

    if (variant === 'hover') {
      // Ultra-delicate airy micro-tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.028);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
      return;
    }

    if (variant === 'expand' || variant === 'collapse') {
      // Warm two-note wooden marimba interval (rising for expand, falling for collapse)
      const f1 = variant === 'expand' ? 311.13 : 415.3; // D#4 / G#4
      const f2 = variant === 'expand' ? 415.3 : 311.13;

      [f1, f2].forEach((freq, idx) => {
        const t0 = now + idx * 0.045;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.98, t0 + 0.11);

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(0.11, t0 + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.13);
      });
      return;
    }

    if (variant === 'switch') {
      // Crystalline two-tone toggle chime (G4 -> C5)
      [392.0, 523.25].forEach((freq, idx) => {
        const t0 = now + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t0);

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(0.12, t0 + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.15);
      });
      return;
    }

    if (variant === 'copy') {
      // Warm pleasant major chord shimmer (A4 + C#5 + E5)
      [440.0, 554.37, 659.25].forEach((freq, idx) => {
        const t0 = now + idx * 0.035;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t0);

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(0.095, t0 + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.19);
      });
      return;
    }

    // Default 'tap' / 'flip': warm wooden droplet pop
    const duration = 0.075;
    const oscFund = ctx.createOscillator();
    const gainFund = ctx.createGain();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(215, now);
    oscFund.frequency.exponentialRampToValueAtTime(72, now + duration);

    gainFund.gain.setValueAtTime(0.0001, now);
    gainFund.gain.linearRampToValueAtTime(0.18, now + 0.005);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.02);

    const oscHarm = ctx.createOscillator();
    const gainHarm = ctx.createGain();
    oscHarm.type = 'triangle';
    oscHarm.frequency.setValueAtTime(340, now);
    oscHarm.frequency.exponentialRampToValueAtTime(130, now + duration * 0.8);

    gainHarm.gain.setValueAtTime(0.0001, now);
    gainHarm.gain.linearRampToValueAtTime(0.045, now + 0.003);
    gainHarm.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscFund.connect(gainFund);
    gainFund.connect(ctx.destination);
    oscHarm.connect(gainHarm);
    gainHarm.connect(ctx.destination);

    oscFund.start(now);
    oscHarm.start(now);
    oscFund.stop(now + duration + 0.025);
    oscHarm.stop(now + duration + 0.01);
  } catch {}
}
