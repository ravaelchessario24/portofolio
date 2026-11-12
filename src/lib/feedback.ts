// Apple-style Low-Frequency Tactile Sound & Haptic Feedback
export const feedbackState = {
  enabled: true,
};

let audioCtx: AudioContext | null = null;
let iosSwitchLabel: HTMLLabelElement | null = null;

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

export function triggerHapticAndSound(variant: 'tap' | 'flip' | 'copy' = 'tap'): void {
  if (!feedbackState.enabled || typeof window === 'undefined') return;

  // 1. Tactile Haptic (Android navigator.vibrate + iOS 17.4+ hidden switch trick)
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(variant === 'flip' ? 12 : 10);
    } else {
      const sw = ensureIosSwitch();
      sw?.click();
    }
  } catch {
    // Ignore if blocked by browser policy
  }

  // 2. Web Audio Low-Frequency Thump + Subtle 240Hz Harmonic for Mobile Speakers
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const duration = variant === 'flip' ? 0.095 : 0.08;

    // Fundamental low-frequency sine (165 Hz -> 60 Hz)
    const oscFund = audioCtx.createOscillator();
    const gainFund = audioCtx.createGain();
    oscFund.type = 'sine';
    const startFreq = variant === 'copy' ? 172 : variant === 'flip' ? 158 : 165;
    const endFreq = variant === 'copy' ? 66 : 58;
    oscFund.frequency.setValueAtTime(startFreq, now);
    oscFund.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    gainFund.gain.setValueAtTime(0.0001, now);
    gainFund.gain.linearRampToValueAtTime(0.26, now + 0.006);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.025);

    // Subtle harmonic overtone (260 Hz -> 115 Hz) so phone speakers reproduce the tactile thump clearly
    const oscHarm = audioCtx.createOscillator();
    const gainHarm = audioCtx.createGain();
    oscHarm.type = 'triangle';
    oscHarm.frequency.setValueAtTime(265, now);
    oscHarm.frequency.exponentialRampToValueAtTime(115, now + duration * 0.85);

    gainHarm.gain.setValueAtTime(0.0001, now);
    gainHarm.gain.linearRampToValueAtTime(0.065, now + 0.004);
    gainHarm.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscFund.connect(gainFund);
    gainFund.connect(audioCtx.destination);

    oscHarm.connect(gainHarm);
    gainHarm.connect(audioCtx.destination);

    oscFund.start(now);
    oscHarm.start(now);
    oscFund.stop(now + duration + 0.03);
    oscHarm.stop(now + duration + 0.01);
  } catch {
    // Ignore audio context errors prior to user gesture
  }
}
